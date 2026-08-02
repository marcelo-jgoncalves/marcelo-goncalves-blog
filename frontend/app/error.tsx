'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import PageHero from '@/components/ui/PageHero';
import './not-found.css';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <PageHero
      singleColumn
      className="error-hero"
      dataAudit="error-boundary-hero"
      eyebrow="Erro inesperado"
      title="Algo deu errado ao carregar esta página"
      subtitle="Já registramos o problema. Tente novamente ou volte para a Home."
    >
      <div className="error-actions">
        <button type="button" className="btn" onClick={() => reset()}>
          Tentar novamente
        </button>
        <Link href="/" className="btn btn-petrol">
          Voltar para a Home
        </Link>
      </div>
    </PageHero>
  );
}
