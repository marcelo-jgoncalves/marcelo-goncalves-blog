#!/usr/bin/env node
/**
 * scripts/mttr-report.mjs
 *
 * Computes MTTR (Mean Time To Recovery) from the CloudWatch Alarm
 * History: no new infra needed, every alarm state transition is already
 * natively retained for 14 months. MTTR of an incident = timestamp of the
 * OK minus timestamp of the ALARM that triggered it.
 *
 * Requires @aws-sdk/client-cloudwatch (scripts/package.json, its own
 * node_modules, isolated from the app's workspaces) and valid AWS credentials.
 *
 * Usage (from scripts/, after running `npm install` once):
 *   AWS_PROFILE=claude-dev node mttr-report.mjs [--env dev|prod] [--days 30]
 *
 * --env   environment, filters alarms by name prefix. Default: dev.
 * --days  lookback window in days. Default: 30.
 */

import {
  CloudWatchClient,
  DescribeAlarmsCommand,
  DescribeAlarmHistoryCommand,
} from "@aws-sdk/client-cloudwatch";

const AWS_REGION   = "us-east-1";
const PROJECT_NAME = "marcelo-goncalves-blog";

function argValue(flag, fallback) {
  const idx = process.argv.indexOf(flag);
  return idx !== -1 ? process.argv[idx + 1] : fallback;
}

const ENVIRONMENT  = argValue("--env", "dev");
const DAYS         = Number(argValue("--days", "30"));
const ALARM_PREFIX = `${PROJECT_NAME}-${ENVIRONMENT}-`;

const cw = new CloudWatchClient({ region: AWS_REGION });

async function listAlarmNames(prefix) {
  const names = [];
  let token;
  do {
    const result = await cw.send(new DescribeAlarmsCommand({
      AlarmNamePrefix: prefix,
      NextToken: token,
    }));
    for (const a of result.MetricAlarms ?? []) names.push(a.AlarmName);
    for (const a of result.CompositeAlarms ?? []) names.push(a.AlarmName);
    token = result.NextToken;
  } while (token);
  return names;
}

async function fetchStateHistory(alarmName, startDate) {
  const items = [];
  let token;
  do {
    const result = await cw.send(new DescribeAlarmHistoryCommand({
      AlarmName: alarmName,
      HistoryItemType: "StateUpdate",
      StartDate: startDate,
      EndDate: new Date(),
      NextToken: token,
      MaxRecords: 100,
    }));
    items.push(...(result.AlarmHistoryItems ?? []));
    token = result.NextToken;
  } while (token);
  // The API returns most recent first, reverse for chronological order.
  return items.reverse();
}

function stateOf(item) {
  try {
    return JSON.parse(item.HistoryData).newState.stateValue;
  } catch {
    return null;
  }
}

/** Pairs ALARM -> OK transitions into closed incidents. An ALARM still open at the end of the window is reported separately. */
function computeIncidents(history) {
  const incidents = [];
  let openAlarmAt = null;

  for (const item of history) {
    const state = stateOf(item);
    if (state === "ALARM" && !openAlarmAt) {
      openAlarmAt = item.Timestamp;
    } else if (state === "OK" && openAlarmAt) {
      incidents.push({
        start: openAlarmAt,
        end: item.Timestamp,
        durationMin: (item.Timestamp - openAlarmAt) / 60000,
      });
      openAlarmAt = null;
    }
  }

  return { incidents, stillOpen: openAlarmAt };
}

function fmtMin(min) {
  return min < 60 ? `${min.toFixed(1)}min` : `${(min / 60).toFixed(1)}h`;
}

async function main() {
  console.log(`\n📊 MTTR Report — ${PROJECT_NAME} (${ENVIRONMENT}) — últimos ${DAYS} dias\n`);

  const alarmNames = await listAlarmNames(ALARM_PREFIX);
  if (alarmNames.length === 0) {
    console.log(`   Nenhum alarme encontrado com prefixo "${ALARM_PREFIX}".`);
    console.log(`   (esperado em dev enquanto enable_cloudwatch_alarms = false)\n`);
    return;
  }

  const startDate = new Date(Date.now() - DAYS * 24 * 60 * 60 * 1000);

  let totalIncidents    = 0;
  let totalDurationMin  = 0;
  let silentAlarms      = 0;

  for (const alarmName of alarmNames) {
    const history = await fetchStateHistory(alarmName, startDate);
    const { incidents, stillOpen } = computeIncidents(history);

    if (incidents.length === 0 && !stillOpen) {
      silentAlarms++;
      continue;
    }

    console.log(`   🔔 ${alarmName}`);
    for (const inc of incidents) {
      console.log(`      ${inc.start.toISOString()} -> ${inc.end.toISOString()}  (${fmtMin(inc.durationMin)})`);
      totalIncidents++;
      totalDurationMin += inc.durationMin;
    }
    if (stillOpen) {
      const openMin = (Date.now() - stillOpen) / 60000;
      console.log(`      ⚠️  ainda em ALARM desde ${stillOpen.toISOString()} (${fmtMin(openMin)} e contando)`);
    }
    console.log("");
  }

  console.log("📈 Resumo:");
  console.log(`   Alarmes monitorados: ${alarmNames.length} (${silentAlarms} sem incidentes na janela)`);
  console.log(`   Incidentes resolvidos: ${totalIncidents}`);
  console.log(`   MTTR médio: ${totalIncidents > 0 ? fmtMin(totalDurationMin / totalIncidents) : "n/a (nenhum incidente)"}\n`);
}

main().catch((err) => {
  console.error("\n❌ Erro fatal:", err.message);
  process.exit(1);
});
