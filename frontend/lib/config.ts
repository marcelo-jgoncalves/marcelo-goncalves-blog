// Configuração global do site — fonte única de verdade para SEO e metadados.
// Atualizar NEXT_PUBLIC_SITE_URL no Terraform quando o domínio definitivo for configurado.

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://dsns2wusdrj9z.cloudfront.net'
).replace(/\/$/, '');

export const SITE_NAME = 'Marcelo Gonçalves';
export const SITE_DESCRIPTION = 'Consultoria de tecnologia para pequenas e médias empresas. Transformação digital, automação, cloud e Inteligência Artificial aplicadas ao seu negócio.';
export const BLOG_DESCRIPTION = 'Blog de autoridade sobre IA, AWS e Engenharia de Software por Marcelo Gonçalves. Análises profundas, tutoriais práticos e as últimas notícias do mundo tech.';
export const AUTHOR_NAME = 'Marcelo Gonçalves';
export const AUTHOR_TWITTER = '@marcelogoncalves';
export const AUTHOR_LINKEDIN_URL = 'https://www.linkedin.com/in/marcelo-jgoncalves';
export const AUTHOR_GITHUB_URL = 'https://github.com/marcelo-jgoncalves';
export const AUTHOR_EMAIL = 'contato@marcelogoncalves.com';
export const AUTHOR_LOCATION = 'Belo Horizonte, MG · Atendimento remoto';
// Empty until the real Instagram URL exists — a placeholder here would point
// any future consumer at a stranger's account. Consumers must render the
// link only when the value is non-empty.
export const AUTHOR_INSTAGRAM_URL = '';

// Controls whether the "Available for new projects" badge shows in the Home's final CTA.
export const ACCEPTING_NEW_PROJECTS = true;

// The /contato page's WhatsApp channel only shows up when whatsappUrl is
// filled with a real number (format https://wa.me/{number}).
export const contactChannels = {
  whatsappUrl: '',
};
