import styles from './StepsTimeline.module.css';

export interface Step {
  title: string;
  description: string;
}

interface StepsTimelineProps {
  steps: Step[];
  dataAudit?: string;
}

export default function StepsTimeline({ steps, dataAudit }: StepsTimelineProps) {
  return (
    <div className={styles.stepsTimeline} data-audit={dataAudit}>
      <div className={styles.stepsTimelineLine} aria-hidden="true" />
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1;
        return (
          <div className={styles.stepsTimelineItem} key={step.title}>
            <div className={`${styles.stepsTimelineCircle}${isLast ? ` ${styles.stepsTimelineCircleDone}` : ''}`}>
              {i + 1}
            </div>
            <h3 className={styles.stepsTimelineTitle}>{step.title}</h3>
            <p className={styles.stepsTimelineDesc}>{step.description}</p>
          </div>
        );
      })}
    </div>
  );
}
