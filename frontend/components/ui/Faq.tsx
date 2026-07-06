'use client';

import { useState } from 'react';
import './Faq.css';

export interface FaqItem {
  question: string;
  answer: string;
}

interface FaqProps {
  items: FaqItem[];
  dataAudit?: string;
}

export default function Faq({ items, dataAudit }: FaqProps) {
  const [openIndex, setOpenIndex] = useState<number>(0);

  const toggle = (i: number) => {
    setOpenIndex((cur) => (cur === i ? -1 : i));
  };

  return (
    <div className="faq-accordion" data-audit={dataAudit}>
      {items.map((item, i) => {
        const open = openIndex === i;
        return (
          <div
            key={item.question}
            className={`faq-item${open ? ' faq-item--open' : ''}`}
            onClick={() => toggle(i)}
            role="button"
            tabIndex={0}
            aria-expanded={open}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggle(i);
              }
            }}
          >
            <div className="faq-item-row">
              <h3 className="faq-item-q">{item.question}</h3>
              <span className="faq-item-chevron" aria-hidden="true">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </span>
            </div>
            {open && <p className="faq-item-a">{item.answer}</p>}
          </div>
        );
      })}
    </div>
  );
}
