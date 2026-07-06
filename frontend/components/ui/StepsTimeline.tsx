import './StepsTimeline.css';

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
    <div className="steps-timeline" data-audit={dataAudit}>
      <div className="steps-timeline-line" aria-hidden="true" />
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1;
        return (
          <div className="steps-timeline-item" key={step.title}>
            <div className={`steps-timeline-circle${isLast ? ' steps-timeline-circle--done' : ''}`}>
              {i + 1}
            </div>
            <h3 className="steps-timeline-title">{step.title}</h3>
            <p className="steps-timeline-desc">{step.description}</p>
          </div>
        );
      })}
    </div>
  );
}
