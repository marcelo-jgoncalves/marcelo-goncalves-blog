export default function PremiumPersonalPage() {
  const certifications = [
    {
      title: 'Solutions Architect',
      level: 'Associate',
      provider: 'AWS Certified',
      badge:
        'https://d1.awsstatic.com/training-and-certification/certification-badges/AWS-Certified-Solutions-Architect-Associate_badge.1b4f5c0f3fcbfca0b56fdf75f1a4bb7a9d8b2c6f.png',
    },
    {
      title: 'SysOps Administrator',
      level: 'Associate',
      provider: 'AWS Certified',
      badge:
        'https://d1.awsstatic.com/training-and-certification/certification-badges/AWS-Certified-SysOps-Administrator-Associate_badge.c3586b02787dcb5c7d07212e08a3b04fcdeec95d.png',
    },
    {
      title: 'Terraform Associate',
      level: 'Certified Associate',
      provider: 'HashiCorp',
      badge:
        'https://images.credly.com/size/340x340/images/ed4be915-68f8-428a-b332-40ded9084ee5/blob',
    },
  ];

  const expertise = [
    {
      title: 'Arquitetura AWS',
      description:
        'Soluções resilientes, seguras e escaláveis seguindo boas práticas modernas de cloud.',
    },
    {
      title: 'DevOps & Automação',
      description:
        'Pipelines CI/CD, infraestrutura como código e plataformas orientadas à eficiência operacional.',
    },
    {
      title: 'Serverless',
      description:
        'Arquiteturas orientadas a eventos com Lambda, API Gateway, DynamoDB e observabilidade.',
    },
    {
      title: 'FinOps',
      description:
        'Governança financeira, otimização de custos e eficiência operacional em nuvem.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#fceac2] text-[#1a3141] overflow-hidden">
      <div className="fixed inset-0 opacity-[0.04] pointer-events-none bg-[radial-gradient(circle_at_top_left,_#1a3141_0,_transparent_35%),radial-gradient(circle_at_bottom_right,_#da7b26_0,_transparent_30%)]" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-8 lg:py-10">
        {/* HERO */}

        <section className="relative overflow-hidden rounded-[40px] border border-[#1a3141]/10 bg-white/60 backdrop-blur-xl shadow-[0_20px_80px_rgba(26,49,65,0.08)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(218,123,38,0.14),_transparent_25%),radial-gradient(circle_at_bottom_left,_rgba(26,49,65,0.08),_transparent_35%)]" />

          <div className="relative grid lg:grid-cols-[420px_1fr] items-center gap-6 px-8 lg:px-14 py-12 lg:py-16">
            <div className="relative flex justify-center lg:justify-start">
              <div className="absolute bottom-0 w-[320px] h-[320px] rounded-full bg-[#da7b26]/10 blur-3xl" />

              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1200&auto=format&fit=crop"
                alt="Marcelo Goncalves"
                className="relative z-10 h-[420px] object-contain drop-shadow-[0_20px_50px_rgba(26,49,65,0.18)]"
              />
            </div>

            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-[#1a3141]/10 bg-white/70 mb-8 text-sm font-semibold tracking-wide">
                <div className="w-2 h-2 rounded-full bg-[#da7b26] animate-pulse" />
                Engenharia Cloud • AWS • DevOps • Educação
              </div>

              <h1 className="text-5xl lg:text-7xl leading-[0.95] font-black tracking-[-0.06em] text-[#1a3141]">
                Marcelo <span className="text-[#315b92]">Gonçalves</span>
              </h1>

              <p className="mt-6 text-2xl lg:text-3xl leading-tight font-semibold text-[#1a3141]/90 max-w-2xl">
                Engenheiro Cloud especialista em AWS, automação e arquiteturas resilientes.
              </p>

              <p className="mt-6 text-lg leading-8 text-[#1a3141]/70 max-w-2xl">
                Transformando experiência prática em conteúdo técnico profundo sobre cloud,
                DevOps, serverless, IA e engenharia de plataformas modernas.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <button className="px-7 py-4 rounded-2xl bg-[#1a3141] text-white font-semibold shadow-[0_12px_30px_rgba(26,49,65,0.25)] hover:-translate-y-1 transition-all duration-300">
                  Conheça Meu Trabalho
                </button>

                <button className="px-7 py-4 rounded-2xl border border-[#1a3141]/10 bg-white/70 backdrop-blur-md font-semibold text-[#1a3141] hover:bg-white transition-all duration-300">
                  Ver Artigos Técnicos
                </button>
              </div>

              <div className="mt-10 flex items-center gap-4">
                {['in', 'ig', 'gh'].map((item) => (
                  <div
                    key={item}
                    className="w-14 h-14 rounded-2xl border border-[#1a3141]/10 bg-white/70 backdrop-blur-md flex items-center justify-center font-bold text-[#315b92] hover:-translate-y-1 hover:shadow-lg transition-all duration-300 cursor-pointer"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CONTENT */}

        <div className="grid lg:grid-cols-[1fr_360px] gap-8 mt-10">
          {/* LEFT */}

          <div className="space-y-8">
            {/* ABOUT */}

            <section className="rounded-[36px] border border-[#1a3141]/10 bg-white/60 backdrop-blur-xl p-8 lg:p-10 shadow-[0_20px_60px_rgba(26,49,65,0.05)]">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-1 h-10 rounded-full bg-[#315b92]" />

                <h2 className="text-4xl font-black tracking-[-0.05em] text-[#1a3141]">
                  Trajetória Profissional
                </h2>
              </div>

              <div className="space-y-7 text-xl leading-10 text-[#1a3141]/80">
                <p>
                  Especialista em alta disponibilidade, automação e arquitetura cloud,
                  atuando há mais de 8 anos na construção de plataformas resilientes e
                  escaláveis.
                </p>

                <p>
                  Experiência em ambientes corporativos no Brasil e exterior, colaborando
                  com empresas como <span className="font-bold text-[#1a3141]">Accenture</span>,{' '}
                  <span className="font-bold text-[#1a3141]">Deutsche Bahn</span>,{' '}
                  <span className="font-bold text-[#1a3141]">Anynines</span> e{' '}
                  <span className="font-bold text-[#1a3141]">Credisis</span>.
                </p>

                <p>
                  Minha abordagem une engenharia, linguagem e educação para transformar
                  arquitetura complexa em conhecimento claro e aplicável.
                </p>
              </div>
            </section>

            {/* EXPERTISE */}

            <section>
              <div className="flex items-center gap-4 mb-8 px-2">
                <div className="w-1 h-10 rounded-full bg-[#315b92]" />

                <h2 className="text-4xl font-black tracking-[-0.05em] text-[#1a3141]">
                  Áreas de atuação
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {expertise.map((item, index) => (
                  <article
                    key={item.title}
                    className={`group rounded-[32px] border p-8 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(26,49,65,0.08)] ${
                      index === 2
                        ? 'bg-[#1a3141] text-white border-[#315b92]/30'
                        : 'bg-white/60 border-[#1a3141]/10'
                    }`}
                  >
                    <div
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 text-2xl font-bold ${
                        index === 2
                          ? 'bg-white/10 text-[#ec9a2e]'
                          : 'bg-[#315b92]/10 text-[#315b92]'
                      }`}
                    >
                      0{index + 1}
                    </div>

                    <h3 className="text-3xl font-black tracking-[-0.04em] mb-5">
                      {item.title}
                    </h3>

                    <p
                      className={`text-lg leading-8 ${
                        index === 2 ? 'text-white/70' : 'text-[#1a3141]/70'
                      }`}
                    >
                      {item.description}
                    </p>
                  </article>
                ))}
              </div>
            </section>

            {/* DIFFERENTIAL */}

            <section className="relative overflow-hidden rounded-[40px] bg-[#1a3141] p-10 lg:p-14 text-white shadow-[0_30px_80px_rgba(26,49,65,0.25)]">
              <div className="absolute top-0 right-0 w-72 h-72 bg-[#315b92]/20 blur-3xl" />

              <div className="relative max-w-4xl">
                <div className="inline-flex items-center gap-4 text-[#8cb5ea] font-bold tracking-[0.25em] uppercase text-sm mb-8">
                  <div className="w-12 h-px bg-[#8cb5ea]/40" />
                  O Diferencial
                  <div className="w-12 h-px bg-[#8cb5ea]/40" />
                </div>

                <h2 className="text-5xl leading-tight font-black tracking-[-0.05em] max-w-3xl">
                  Engenharia encontra linguagem.
                </h2>

                <p className="mt-8 text-2xl leading-[1.8] text-white/75 italic max-w-4xl">
                  Minha formação em Linguística Aplicada me permite conectar pensamento
                  técnico, comunicação e estratégia — algo essencial em um mundo dominado
                  por IA, automação e arquitetura de sistemas complexos.
                </p>

                <div className="mt-12 flex flex-wrap gap-4">
                  {[
                    'Português — Nativo',
                    'Inglês — Fluente',
                    'Alemão — Intermediário',
                  ].map((lang) => (
                    <div
                      key={lang}
                      className="px-5 py-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md text-lg text-white/90"
                    >
                      {lang}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* SIDEBAR */}

          <aside className="space-y-8">
            {/* CTA */}

            <section className="relative overflow-hidden rounded-[36px] bg-[#315b92] p-8 text-white shadow-[0_20px_60px_rgba(49,91,146,0.25)]">
              <div className="absolute top-0 right-0 w-52 h-52 bg-[#ec9a2e]/20 blur-3xl" />

              <div className="relative">
                <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center text-3xl mb-8">
                  ✦
                </div>

                <h3 className="text-4xl leading-tight font-black tracking-[-0.05em]">
                  Precisa de ajuda com cloud ou IA?
                </h3>

                <p className="mt-6 text-lg leading-8 text-white/75">
                  Arquitetura AWS, automação, plataformas modernas, observabilidade,
                  serverless e otimização de custos.
                </p>

                <button className="mt-10 w-full rounded-2xl bg-white text-[#1a3141] px-6 py-5 font-bold text-lg hover:-translate-y-1 transition-all duration-300 shadow-[0_12px_30px_rgba(0,0,0,0.15)]">
                  Conheça Meus Serviços
                </button>
              </div>
            </section>

            {/* CERTIFICATIONS */}

            <section className="rounded-[36px] border border-[#1a3141]/10 bg-white/60 backdrop-blur-xl p-7 shadow-[0_20px_60px_rgba(26,49,65,0.05)]">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-[#315b92]/10 flex items-center justify-center text-[#315b92] font-bold">
                  ✦
                </div>

                <div>
                  <div className="text-xs font-black uppercase tracking-[0.25em] text-[#315b92]">
                    Credenciais
                  </div>

                  <h3 className="text-2xl font-black tracking-[-0.04em] text-[#1a3141] mt-1">
                    Certificações
                  </h3>
                </div>
              </div>

              <div className="space-y-5">
                {certifications.map((item) => (
                  <article
                    key={item.title}
                    className="group rounded-[28px] border border-[#1a3141]/8 bg-white/70 p-6 hover:-translate-y-1 transition-all duration-300 hover:shadow-[0_16px_40px_rgba(26,49,65,0.08)]"
                  >
                    <div className="flex items-start gap-5">
                      <img
                        src={item.badge}
                        alt={item.title}
                        className="w-20 h-20 object-contain drop-shadow-[0_8px_20px_rgba(49,91,146,0.2)]"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] uppercase tracking-[0.22em] font-bold text-[#315b92] mb-2">
                          {item.provider}
                        </div>

                        <h4 className="text-2xl leading-tight font-black tracking-[-0.04em] text-[#1a3141]">
                          {item.title}
                        </h4>

                        <div className="mt-4 inline-flex items-center px-4 py-2 rounded-full bg-[#315b92]/10 text-[#315b92] text-sm font-bold">
                          {item.level}
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* EDUCATION */}

            <section className="rounded-[36px] border border-[#1a3141]/10 bg-[#eef3f8] p-7 shadow-[0_20px_60px_rgba(26,49,65,0.05)]">
              <div className="mb-8">
                <div className="text-xs font-black uppercase tracking-[0.25em] text-[#315b92] mb-3">
                  Formação
                </div>

                <h3 className="text-3xl font-black tracking-[-0.05em] text-[#1a3141] leading-tight">
                  Base acadêmica multidisciplinar
                </h3>
              </div>

              <div className="space-y-4">
                {[
                  {
                    title: 'Arquitetura Cloud',
                    subtitle: 'Especialização',
                  },
                  {
                    title: 'Sistemas de Informação',
                    subtitle: 'Graduação',
                  },
                  {
                    title: 'Linguística Aplicada',
                    subtitle: 'Mestrado',
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-[26px] bg-white/80 border border-white/80 p-6"
                  >
                    <div className="text-[#315b92] text-xs uppercase tracking-[0.2em] font-bold mb-3">
                      {item.subtitle}
                    </div>

                    <div className="text-2xl leading-tight font-black tracking-[-0.04em] text-[#1a3141]">
                      {item.title}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
