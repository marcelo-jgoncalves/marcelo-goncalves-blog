/* frontend/components/ui/NewsletterWidget.tsx */

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import Eyebrow from './Eyebrow';
import './NewsletterWidget.css';

export default function NewsletterWidget() {
  return (
    <div className="widget-newsletter">
      <Eyebrow text="Newsletter" color="white" />
      <div className="card-icon-wrapper">
        <FontAwesomeIcon icon={faEnvelope} />
      </div>
      <span className="card-title">Newsletter VIP</span>
      <p className="card-desc">Receba análises exclusivas de IA e AWS direto no seu e-mail.</p>
      <Link href="/newsletter" className="btn-full btn-primary">
        Inscrever-se
      </Link>
    </div>
  );
}