# postScheduler DLQ — async invocation (EventBridge Scheduler -> Lambda):
# without a failure destination, AWS retries twice and discards the event —
# a scheduled post silently misses its publish time and no actionable trace
# remains (the Errors alarm says something failed, not what).
# on_failure destination (not the classic dead_letter_config): the message
# carries the payload AND the error context.

resource "aws_sqs_queue" "post_scheduler_dlq" {
  name = "${var.project_name}-${var.environment}-postScheduler-dlq"

  # Max SQS retention — reprocessing is manual; 14 days of slack.
  message_retention_seconds = 1209600
}

resource "aws_lambda_function_event_invoke_config" "post_scheduler" {
  function_name = aws_lambda_function.post_scheduler.function_name

  maximum_retry_attempts = 2

  destination_config {
    on_failure {
      destination = aws_sqs_queue.post_scheduler_dlq.arn
    }
  }
}

# Destinations publish to the queue using the function's own execution role.
resource "aws_iam_policy" "post_scheduler_dlq_policy" {
  name = "${var.project_name}-${var.environment}-postScheduler-dlq-policy"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action   = ["sqs:SendMessage"]
      Effect   = "Allow"
      Resource = aws_sqs_queue.post_scheduler_dlq.arn
    }]
  })
}

resource "aws_iam_role_policy_attachment" "post_scheduler_dlq_attach" {
  role       = aws_iam_role.function_role["postScheduler"].name
  policy_arn = aws_iam_policy.post_scheduler_dlq_policy.arn
}

# Dedicated topic and alarm, ALWAYS on — outside the enable_cloudwatch_alarms
# toggle (off in dev for cost): any message here is a genuinely lost event,
# and the cost is ~zero.
resource "aws_sns_topic" "post_scheduler_dlq_alerts" {
  name = "${var.project_name}-${var.environment}-postScheduler-dlq-alerts"
}

resource "aws_sns_topic_subscription" "post_scheduler_dlq_email" {
  count     = var.dlq_alert_email != "" ? 1 : 0
  topic_arn = aws_sns_topic.post_scheduler_dlq_alerts.arn
  protocol  = "email"
  endpoint  = var.dlq_alert_email
}

resource "aws_cloudwatch_metric_alarm" "post_scheduler_dlq_depth" {
  alarm_name          = "${var.project_name}-${var.environment}-postScheduler-dlq-depth"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = 1
  metric_name         = "ApproximateNumberOfMessagesVisible"
  namespace           = "AWS/SQS"
  period              = 300
  statistic           = "Maximum"
  threshold           = 1
  alarm_description   = "Event lost by postScheduler after retries — inspect the DLQ and reprocess (scheduled post not published)"
  treat_missing_data  = "notBreaching"

  dimensions = {
    QueueName = aws_sqs_queue.post_scheduler_dlq.name
  }

  alarm_actions = [aws_sns_topic.post_scheduler_dlq_alerts.arn]
  ok_actions    = [aws_sns_topic.post_scheduler_dlq_alerts.arn]
}
