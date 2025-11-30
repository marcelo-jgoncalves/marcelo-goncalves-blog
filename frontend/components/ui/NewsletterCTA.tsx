import Link from 'next/link';

export default function NewsletterCTA() {
  return (
    <section className="cta">
      <div className="container">
        <h2>Quer se aprofundar em IA, DevOps e muito mais?</h2>
        <p>
          Inscreva-se na nossa newsletter e receba análises exclusivas e os melhores artigos da semana.
        </p>
        <Link href="/newsletter" className="btn-outline">
          Inscrever-se agora
        </Link>
      </div>
    </section>
  );
}