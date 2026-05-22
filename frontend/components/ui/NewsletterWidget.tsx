/* frontend/components/ui/NewsletterWidget.tsx */

import Link from 'next/link';
import Eyebrow from './Eyebrow';
import './NewsletterWidget.css';

export default function NewsletterWidget() {
  return (
    <div className="widget-newsletter">
      <Eyebrow text="Newsletter" color="white" />
      <div className="card-icon-wrapper">
        <i className="far fa-envelope"></i>
      </div>
      <span className="card-title">Newsletter VIP</span>
      <p className="card-desc">Receba análises exclusivas de IA e AWS direto no seu e-mail.</p>
      <Link href="/newsletter" className="btn-full btn-primary">
        Inscrever-se
      </Link>
    </div>
  );
}