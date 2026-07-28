import styles from './StepsList.module.css';

export interface Step {
  title: string;
  description: string;
}

interface StepsListProps {
  steps: Step[];
  dataAudit?: string;
}

export default function StepsList({ steps, dataAudit }: StepsListProps) {
  return (
    <div className={styles.list} aria-label="Etapas do trabalho" data-audit={dataAudit}>
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1;
        const indexClassName = isLast ? `${styles.index} ${styles.indexDone}` : styles.index;
        return (
          <article className={styles.step} key={step.title}>
            <div className={indexClassName} aria-hidden="true">
              <span>{String(i + 1).padStart(2, '0')}</span>
            </div>
            <h3 className={styles.title}>{step.title}</h3>
            <p className={styles.desc}>{step.description}</p>
          </article>
        );
      })}
    </div>
  );
}
