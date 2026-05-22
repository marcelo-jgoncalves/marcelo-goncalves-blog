import { useState } from 'react';

export default function ModernPostPage() {
  const [acceptedNewsletter, setAcceptedNewsletter] = useState(false);

  return (
    <main className="min-h-screen bg-[#f7f1e8] text-[#1a3141]">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12">
        <article>
          <div className="mb-10">
            <div className="text-sm uppercase tracking-[0.25em] font-black text-[#315b92] mb-4">
              AWS · DEVOPS · IA
            </div>

            <h1 className="text-6xl leading-[1.05] tracking-[-0.06em] font-black max-w-4xl">
              Como construir plataformas modernas com arquitetura serverless
            </h1>

            <p className="mt-8 text-2xl leading-10 text-[#1a3141]/70 max-w-3xl">
              Uma abordagem moderna para aplicações escaláveis usando AWS, automação e infraestrutura como código.
            </p>
          </div>

          <img
            src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1400&auto=format&fit=crop"
            alt="Hero"
            className="w-full h-[520px] object-cover rounded-[40px]"
          />

          <div className="mt-16 space-y-10 text-[1.15rem] leading-9 text-[#1a3141]/78">
            <p>
              Plataformas modernas precisam equilibrar escalabilidade, experiência de desenvolvimento e eficiência operacional.
            </p>

            <div className="rounded-[34px] overflow-hidden border border-[#1a3141]/10 bg-[#1a3141] shadow-[0_25px_70px_rgba(26,49,65,0.2)]">
              <div className="flex items-center justify-between px-8 py-5 border-b border-white/10">
                <div className="text-[#8cb5ea] text-sm font-black uppercase tracking-[0.25em]">
                  Exemplo Terraform
                </div>

                <div className="text-white/40 text-sm font-medium">
                  main.tf
                </div>
              </div>

              <pre className="overflow-x-auto p-8 text-[15px] leading-8 text-white/80 font-mono">
                {`resource "aws_s3_bucket" "blog" {
  bucket = "meu-blog-serverless"

  tags = {
    Environment = "production"
    ManagedBy  = "terraform"
  }
}`}
              </pre>
            </div>

            <div className="overflow-hidden rounded-[34px] border border-[#1a3141]/10 bg-white/80 backdrop-blur-xl shadow-[0_20px_60px_rgba(26,49,65,0.05)]">
              <div className="px-8 py-5 border-b border-[#1a3141]/8">
                <div className="text-xs uppercase tracking-[0.24em] font-black text-[#315b92] mb-2">
                  Comparativo
                </div>

                <h3 className="text-2xl font-black tracking-[-0.04em] text-[#1a3141]">
                  EC2 vs Lambda
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[620px]">
                  <thead>
                    <tr className="border-b border-[#1a3141]/8 bg-[#315b92]/[0.04]">
                      <th className="px-8 py-5 text-left text-sm uppercase tracking-[0.18em] font-black text-[#315b92]">Serviço</th>
                      <th className="px-8 py-5 text-left text-sm uppercase tracking-[0.18em] font-black text-[#315b92]">Escalabilidade</th>
                      <th className="px-8 py-5 text-left text-sm uppercase tracking-[0.18em] font-black text-[#315b92]">Operação</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr className="border-b border-[#1a3141]/6">
                      <td className="px-8 py-6 text-lg font-bold">EC2</td>
                      <td className="px-8 py-6">Manual / Auto Scaling</td>
                      <td className="px-8 py-6">Maior overhead</td>
                    </tr>

                    <tr>
                      <td className="px-8 py-6 text-lg font-bold">Lambda</td>
                      <td className="px-8 py-6">Automática</td>
                      <td className="px-8 py-6">Baixíssima operação</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-[30px] border border-[#da7b26]/20 bg-[#ec9a2e]/10 p-7">
              <div className="text-sm uppercase tracking-[0.22em] font-black text-[#da7b26] mb-3">
                Atenção
              </div>

              <p>
                Ambientes serverless exigem atenção especial a observabilidade e limites de execução.
              </p>
            </div>

            <div className="rounded-[30px] border border-[#315b92]/15 bg-[#315b92]/[0.06] p-7">
              <div className="text-sm uppercase tracking-[0.22em] font-black text-[#315b92] mb-3">
                Dica profissional
              </div>

              <p>
                Combine snippets, tabelas e alertas para melhorar escaneabilidade em conteúdos técnicos longos.
              </p>
            </div>
          </div>
        </article>

        <aside className="space-y-8">
          <section className="rounded-[34px] border border-[#1a3141]/10 bg-white/60 backdrop-blur-xl p-7 shadow-[0_20px_60px_rgba(26,49,65,0.05)]">
            <div className="text-xs font-black uppercase tracking-[0.24em] text-[#315b92] mb-3">
              Mais lidos
            </div>

            <h3 className="text-3xl leading-tight tracking-[-0.05em] font-black text-[#1a3141] mb-8">
              Artigos populares
            </h3>

            <div className="space-y-4">
              {[
                ['AWS', 'Como arquitetar aplicações resilientes na AWS'],
                ['DevOps', 'CI/CD moderno com GitHub Actions'],
                ['Kubernetes', 'Problemas reais ao migrar nodegroups'],
                ['Serverless', 'Vale a pena usar Lambda?'],
                ['IA', 'Como usar IA para acelerar engenharia'],
              ].map(([category, title], index) => (
                <article
                  key={index}
                  className="group flex items-center gap-4 h-[118px] rounded-[28px] border border-[#1a3141]/8 bg-white/70 p-4 hover:-translate-y-1 transition-all duration-300"
                >
                  <img
                    src={`https://picsum.photos/200/200?random=${index + 1}`}
                    alt={title}
                    className="w-24 h-24 rounded-[22px] object-cover shrink-0"
                  />

                  <div>
                    <div className="text-[11px] uppercase tracking-[0.22em] font-black text-[#315b92] mb-2">
                      {category}
                    </div>

                    <h4 className="line-clamp-2 text-lg leading-7 tracking-[-0.03em] font-black text-[#1a3141] group-hover:text-[#315b92] transition-colors duration-300">
                      {title}
                    </h4>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-[34px] border border-[#1a3141]/10 bg-white/60 backdrop-blur-xl p-8 shadow-[0_20px_60px_rgba(26,49,65,0.05)]">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#ec9a2e]/10 text-[#da7b26] text-sm font-bold mb-6">
              Newsletter
            </div>

            <h3 className="text-4xl leading-tight tracking-[-0.05em] font-black text-[#1a3141]">
              Aprofunde-se em IA, AWS e DevOps.
            </h3>

            <p className="mt-6 text-lg leading-8 text-[#1a3141]/70">
              Receba análises exclusivas e bastidores reais de engenharia.
            </p>

            <div className="mt-8 space-y-4">
              <input
                placeholder="Seu melhor e-mail"
                className="w-full h-16 rounded-2xl border border-[#1a3141]/10 bg-white/80 px-5 text-lg outline-none"
              />

              <label className="flex items-start gap-4 text-sm leading-6 text-[#1a3141]/65 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptedNewsletter}
                  onChange={(e) => setAcceptedNewsletter(e.target.checked)}
                  className="mt-1"
                />

                <span>
                  Concordo em receber comunicações por e-mail e autorizo o tratamento dos meus dados pessoais conforme a Política de Privacidade.
                </span>
              </label>

              <button
                disabled={!acceptedNewsletter}
                className={`w-full h-16 rounded-2xl text-white font-bold text-lg transition-all duration-300 ${acceptedNewsletter ? 'bg-[#1a3141]' : 'bg-[#1a3141]/40 cursor-not-allowed'}`}
              >
                Inscrever-se agora
              </button>
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}
