import styles from './PostFooter.module.css';

export interface PostFooterProps {
  author: {
    name: string;
    bio: string;
    avatarInitials: string;
    profileUrl: string;
  };
  social?: {
    linkedin_url?: string;
    github_url?: string;
    instagram_url?: string;
  };
}

const AUTHOR_ROLE = 'Engenheiro Cloud Sênior & Arquiteto AWS';

function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

export default function PostFooter({ author, social }: PostFooterProps) {
  const hasSocial = social && (social.linkedin_url || social.github_url || social.instagram_url);

  return (
    <div className={styles.authorbox} data-audit="post-authorbox">
      <div className={styles.av} aria-hidden="true">{author.avatarInitials}</div>
      <div className={styles.abBody}>
        <div className={styles.abName}><b>{author.name}</b> é {AUTHOR_ROLE}</div>
        <p>
          {stripHtmlTags(author.bio)}{' '}
          <a href={author.profileUrl} className={styles.abLink}>Veja o perfil completo →</a>
        </p>
      </div>
      {hasSocial && (
        <div className={styles.abSocial}>
          <span className={styles.sl}>Acompanhe nas redes</span>
          <div className={styles.row}>
            {social?.linkedin_url && (
              <a href={social.linkedin_url} aria-label="LinkedIn" target="_blank" rel="noopener noreferrer author">
                <i className="fab fa-linkedin-in" aria-hidden="true" />
              </a>
            )}
            {social?.github_url && (
              <a href={social.github_url} aria-label="GitHub" target="_blank" rel="noopener noreferrer author">
                <i className="fab fa-github" aria-hidden="true" />
              </a>
            )}
            {social?.instagram_url && (
              <a href={social.instagram_url} aria-label="Instagram" target="_blank" rel="noopener noreferrer author">
                <i className="fab fa-instagram" aria-hidden="true" />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
