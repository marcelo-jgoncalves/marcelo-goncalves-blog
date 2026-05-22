export default function ModernPostPage() {
    return (
        <div className="min-h-screen bg-[#fceac2] text-[#1a3141] overflow-hidden">
            {/* Background Atmosphere */}
            <div className="fixed inset-0 opacity-[0.05] pointer-events-none bg-[radial-gradient(circle_at_top_left,_#315b92_0,_transparent_28%),radial-gradient(circle_at_bottom_right,_#da7b26_0,_transparent_24%)]" />

            {/* HEADER */}

            <header className="sticky top-0 z-50 border-b border-[#1a3141]/8 backdrop-blur-xl bg-[#fceac2]/75">
                <div className="max-w-7xl mx-auto px-6 lg:px-10 h-24 flex items-center justify-between">
                    <div className="text-4xl font-black tracking-[-0.06em] text-[#1a3141]">
                        Marcelo
                        <span className="text-[#315b92]">Gonçalves</span>
                    </div>

                    <nav className="hidden md:flex items-center gap-10 text-lg font-semibold text-[#1a3141]/80">
                        {['Home', 'Artigos', 'O Projeto', 'Serviços', 'Sobre'].map((item) => (
                            <a
                                key={item}
                                className="hover:text-[#315b92] transition-colors duration-300 cursor-pointer"
                            >
                                {item}
                            </a>
                        ))}
                    </nav>
                </div>
            </header>

            {/* HERO */}

            <section className="relative overflow-hidden border-b border-[#1a3141]/8">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(49,91,146,0.08),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(218,123,38,0.10),_transparent_30%)]" />

                <div className="relative max-w-6xl mx-auto px-6 lg:px-10 pt-24 pb-20">
                    <div className="max-w-5xl mx-auto text-center">
                        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-[#315b92]/10 bg-white/60 backdrop-blur-md text-[#315b92] font-bold text-sm tracking-wide mb-10">
                            <div className="w-2 h-2 rounded-full bg-[#da7b26] animate-pulse" />
                            tutorials-aws
                        </div>

                        <h1 className="text-5xl md:text-7xl leading-[0.92] tracking-[-0.07em] font-black text-[#1a3141]">
                            Como Construir Prompts Poderosos para IAs como GPT ou Gemini
                        </h1>

                        <p className="mt-10 text-2xl leading-relaxed text-[#1a3141]/65 max-w-3xl mx-auto">
                            Estratégias práticas para criar prompts mais precisos, estruturados e eficazes em modelos modernos de IA.
                        </p>

                        <div className="mt-12 flex flex-wrap justify-center gap-8 text-[#1a3141]/65 text-lg font-medium">
                            <div>Por Marcelo Gonçalves</div>
                            <div>07/12/2025</div>
                            <div>4 min de leitura</div>
                        </div>
                    </div>

                    <div className="mt-20 rounded-[40px] overflow-hidden border border-white/40 shadow-[0_30px_80px_rgba(26,49,65,0.12)]">
                        <img
                            src="https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1600&auto=format&fit=crop"
                            alt="Post cover"
                            className="w-full h-[520px] object-cover"
                        />
                    </div>
                </div>
            </section>

            {/* ARTICLE */}

            <section className="relative max-w-7xl mx-auto px-6 lg:px-10 py-16">
                <div className="grid lg:grid-cols-[1fr_340px] gap-12 items-start">
                    {/* CONTENT */}

                    <article>
                        {/* INTRO BLOCK */}

                        <div className="rounded-[36px] border border-[#1a3141]/10 bg-white/60 backdrop-blur-xl p-10 lg:p-14 shadow-[0_20px_60px_rgba(26,49,65,0.06)]">
                            <div className="max-w-3xl mx-auto">
                                <div className="inline-flex items-center gap-4 text-[#315b92] font-black tracking-[0.25em] uppercase text-sm mb-10">
                                    <div className="w-10 h-px bg-[#315b92]/40" />
                                    Introdução
                                </div>

                                <div className="space-y-10 text-[1.35rem] leading-[2.1] text-[#1a3141]/80">
                                    <p>
                                        Prompts não são apenas perguntas. Eles são a interface entre pensamento humano e modelos de linguagem. Quanto mais clara e estruturada for essa comunicação, melhores serão os resultados.
                                    </p>

                                    <p>
                                        A maioria das pessoas utiliza IA de forma superficial, mas profissionais que dominam engenharia de prompts conseguem extrair respostas mais estratégicas, previsíveis e úteis.
                                    </p>

                                    <blockquote className="relative border-l-4 border-[#315b92] pl-8 italic text-[#1a3141] font-medium text-[1.55rem] leading-[1.9]">
                                        “Modelos de IA respondem proporcionalmente à qualidade da instrução que recebem.”
                                    </blockquote>
                                </div>
                            </div>
                        </div>

                        {/* CONTENT BODY */}

                        <div className="max-w-3xl mx-auto mt-20">
                            <div className="space-y-24">
                                {[1, 2, 3].map((item) => (
                                    <section key={item}>
                                        <div className="flex items-center gap-4 mb-10">
                                            <div className="w-12 h-12 rounded-2xl bg-[#315b92]/10 flex items-center justify-center text-[#315b92] font-black text-lg">
                                                0{item}
                                            </div>

                                            <h2 className="text-4xl leading-tight tracking-[-0.05em] font-black text-[#1a3141]">
                                                Estruture o contexto antes da pergunta
                                            </h2>
                                        </div>

                                        <div className="space-y-10 text-[1.3rem] leading-[2.1] text-[#1a3141]/78">
                                            <p>
                                                Um dos maiores erros ao usar IA é enviar prompts sem contexto suficiente. Bons prompts delimitam objetivo, papel esperado, formato de resposta e restrições.
                                            </p>

                                            <p>
                                                Em ambientes corporativos, prompts estruturados aumentam previsibilidade, reduzem ambiguidades e permitem integração mais eficiente com automações e pipelines.
                                            </p>
                                        </div>

                                        <div className="mt-14 rounded-[34px] overflow-hidden border border-[#1a3141]/10 bg-[#1a3141] shadow-[0_25px_70px_rgba(26,49,65,0.2)]">
                                            <div className="px-8 py-5 border-b border-white/10 text-[#8cb5ea] text-sm font-black uppercase tracking-[0.25em]">
                                                Exemplo de Prompt
                                            </div>

                                            <div className="p-8 text-[1.1rem] leading-9 text-white/80 font-mono">
                                                Você é um arquiteto cloud especialista em AWS. Gere uma arquitetura serverless resiliente para um sistema de pagamentos com alta disponibilidade, baixa latência e observabilidade completa.
                                            </div>
                                        </div>
                                    </section>
                                ))}
                            </div>
                        </div>

                        {/* AUTHOR BLOCK */}

                        <section className="mt-28 rounded-[40px] overflow-hidden bg-[#1a3141] text-white shadow-[0_30px_80px_rgba(26,49,65,0.22)]">
                            <div className="relative p-10 lg:p-14">
                                <div className="absolute top-0 right-0 w-72 h-72 bg-[#315b92]/20 blur-3xl" />

                                <div className="relative flex flex-col lg:flex-row gap-10 items-start lg:items-center">
                                    <img
                                        src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop"
                                        alt="Marcelo"
                                        className="w-32 h-32 rounded-[30px] object-cover border border-white/10"
                                    />

                                    <div className="flex-1">
                                        <div className="text-[#8cb5ea] font-black uppercase tracking-[0.22em] text-sm mb-5">
                                            Sobre o autor
                                        </div>

                                        <h3 className="text-4xl leading-tight tracking-[-0.05em] font-black">
                                            Marcelo Gonçalves
                                        </h3>

                                        <p className="mt-6 text-xl leading-9 text-white/72 max-w-3xl">
                                            Engenheiro Cloud especializado em AWS, automação, arquitetura resiliente e criação de conteúdo técnico profundo sobre infraestrutura moderna.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </article>

                    {/* SIDEBAR */}

                    <aside className="space-y-8 lg:sticky lg:top-32">
                        {/* TOC */}

                        <section className="rounded-[34px] border border-[#1a3141]/10 bg-white/60 backdrop-blur-xl p-7 shadow-[0_20px_60px_rgba(26,49,65,0.05)]">
                            <div className="text-xs font-black uppercase tracking-[0.24em] text-[#315b92] mb-3">
                                Navegação
                            </div>

                            <h3 className="text-3xl leading-tight tracking-[-0.05em] font-black text-[#1a3141] mb-8">
                                Neste artigo
                            </h3>

                            <div className="space-y-3">
                                {[
                                    'O que é engenharia de prompts',
                                    'Como estruturar contexto',
                                    'Definindo restrições',
                                    'Criando respostas melhores',
                                    'Boas práticas profissionais',
                                ].map((item, index) => (
                                    <div
                                        key={item}
                                        className={`rounded-2xl p-4 border transition-all duration-300 cursor-pointer ${index === 0
                                                ? 'bg-[#315b92] text-white border-[#315b92]'
                                                : 'bg-white/70 border-[#1a3141]/8 text-[#1a3141]/75 hover:border-[#315b92]/20 hover:bg-white'
                                            }`}
                                    >
                                        <div className="text-sm font-bold leading-6">{item}</div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* SHARE */}

                        <section className="rounded-[34px] bg-[#315b92] p-7 text-white shadow-[0_20px_60px_rgba(49,91,146,0.22)]">
                            <div className="text-xs uppercase tracking-[0.24em] font-black text-white/70 mb-3">
                                Compartilhar
                            </div>

                            <h3 className="text-3xl leading-tight tracking-[-0.05em] font-black">
                                Gostou do conteúdo?
                            </h3>

                            <p className="mt-5 text-lg leading-8 text-white/75">
                                Compartilhe este artigo com profissionais que trabalham com IA, cloud e automação.
                            </p>

                            <div className="mt-8 grid grid-cols-3 gap-3">
                                {['LinkedIn', 'X', 'Copy'].map((item) => (
                                    <button
                                        key={item}
                                        className="h-14 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md text-sm font-bold hover:bg-white/20 transition-all duration-300"
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>
                        </section>

                        {/* NEWSLETTER */}

                        <section className="rounded-[34px] border border-[#1a3141]/10 bg-white/60 backdrop-blur-xl p-8 shadow-[0_20px_60px_rgba(26,49,65,0.05)]">
                            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#ec9a2e]/10 text-[#da7b26] text-sm font-bold mb-6">
                                Newsletter
                            </div>

                            <h3 className="text-4xl leading-tight tracking-[-0.05em] font-black text-[#1a3141]">
                                Aprofunde-se em IA, AWS e DevOps.
                            </h3>

                            <p className="mt-6 text-lg leading-8 text-[#1a3141]/70">
                                Receba análises exclusivas, arquitetura moderna e bastidores reais de engenharia.
                            </p>

                            <div className="mt-8 space-y-4">
                                <input
                                    placeholder="Seu melhor e-mail"
                                    className="w-full h-16 rounded-2xl border border-[#1a3141]/10 bg-white/80 px-5 text-lg outline-none"
                                />

                                <button className="w-full h-16 rounded-2xl bg-[#1a3141] text-white font-bold text-lg hover:-translate-y-1 transition-all duration-300 shadow-[0_12px_30px_rgba(26,49,65,0.22)]">
                                    Inscrever-se agora
                                </button>
                            </div>
                        </section>
                    </aside>
                </div>
            </section>

            {/* RELATED */}

            <section className="border-t border-[#1a3141]/8 py-24 mt-10">
                <div className="max-w-7xl mx-auto px-6 lg:px-10">
                    <div className="flex items-center gap-4 mb-12">
                        <div className="w-1 h-10 rounded-full bg-[#315b92]" />

                        <h2 className="text-5xl tracking-[-0.05em] font-black text-[#1a3141]">
                            Continue explorando
                        </h2>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map((item) => (
                            <article
                                key={item}
                                className="group overflow-hidden rounded-[34px] border border-[#1a3141]/10 bg-white/60 backdrop-blur-xl hover:-translate-y-2 transition-all duration-300 hover:shadow-[0_20px_60px_rgba(26,49,65,0.08)]"
                            >
                                <img
                                    src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop"
                                    alt="Related"
                                    className="w-full h-56 object-cover"
                                />

                                <div className="p-8">
                                    <div className="text-xs uppercase tracking-[0.24em] font-black text-[#315b92] mb-4">
                                        Cloud Architecture
                                    </div>

                                    <h3 className="text-3xl leading-tight tracking-[-0.05em] font-black text-[#1a3141]">
                                        Como arquitetar plataformas resilientes na AWS
                                    </h3>

                                    <p className="mt-5 text-lg leading-8 text-[#1a3141]/70">
                                        Estratégias modernas para construir sistemas escaláveis e observáveis.
                                    </p>

                                    <div className="mt-8 text-[#315b92] font-black text-lg">
                                        Ler artigo →
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* FOOTER */}

            <footer className="bg-[#1a3141] text-white mt-10 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
                    <div className="grid lg:grid-cols-4 gap-14">
                        <div>
                            <div className="text-4xl font-black tracking-[-0.06em]">
                                Marcelo
                                <span className="text-[#8cb5ea]">Gonçalves</span>
                            </div>

                            <p className="mt-6 text-lg leading-8 text-white/65">
                                Cloud, AWS, DevOps, Serverless e engenharia moderna aplicada ao mundo real.
                            </p>
                        </div>

                        {['Categorias', 'Links', 'Contato'].map((title) => (
                            <div key={title}>
                                <div className="text-white font-black text-2xl mb-6">{title}</div>

                                <div className="space-y-4 text-white/65 text-lg">
                                    <div>Arquitetura AWS</div>
                                    <div>DevOps</div>
                                    <div>IA</div>
                                    <div>Serverless</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    );
}
