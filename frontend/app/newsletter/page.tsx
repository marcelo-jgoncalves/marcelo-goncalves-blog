import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/ui/PageHero';
import { SITE_URL } from '@/lib/config';
import './newsletter.css';

export const metadata: Metadata = {
  title: 'Newsletter | Em Breve',
  description: 'Inscreva-se para receber análises exclusivas sobre IA, AWS e DevOps diretamente no seu e-mail.',
  alternates: { canonical: `${SITE_URL}/newsletter` },
  robots: 'noindex, follow',
};

export default function NewsletterPage() {
  return (
    <>
      <PageHero
        singleColumn
        title="Newsletter — Em breve"
        subtitle="Estamos preparando algo especial. Em breve você poderá se inscrever para receber análises exclusivas sobre IA, AWS e DevOps."
      />
      <div className="container newsletter-cta-wrap">
        <Link href="/artigos" className="btn">
          Explorar artigos enquanto isso →
        </Link>
      </div>
    </>
  );
}
