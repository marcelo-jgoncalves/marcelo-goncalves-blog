import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/ui/PageHero';
import { SITE_URL } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Newsletter | Em Breve',
  description: 'Inscreva-se para receber análises exclusivas sobre IA, AWS e DevOps diretamente no seu e-mail.',
  alternates: { canonical: `${SITE_URL}/newsletter` },
  robots: 'noindex, follow',
};

export default function NewsletterPage() {
  return (
    <>
      <PageHero>
        <h1 className="hero-title">Newsletter — Em Breve</h1>
        <p className="hero-subtitle">
          Estamos preparando algo especial. Em breve você poderá se inscrever para receber análises exclusivas sobre IA, AWS e DevOps.
        </p>
      </PageHero>
      <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <Link href="/artigos" className="btn btn-primary">
          Explorar artigos enquanto isso →
        </Link>
      </div>
    </>
  );
}
