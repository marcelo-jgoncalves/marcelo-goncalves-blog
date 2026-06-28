import styles from './PostFooter.module.css';

export interface PostFooterProps {
  author: {
    name: string;
    bio: string;
    avatarInitials: string;
  };
  social?: {
    linkedin_url?: string;
    github_url?: string;
    instagram_url?: string;
  };
}

export default function PostFooter({ author, social }: PostFooterProps) {
  const hasSocial = social && (social.linkedin_url || social.github_url || social.instagram_url);

  return (
    <div className={styles.authorbox} data-audit="post-authorbox">
      <div className={styles.av} aria-hidden="true">{author.avatarInitials}</div>
      <div className={styles.abBody}>
        <b className={styles.abName}>{author.name}</b>{' '}
        {/* nosemgrep: typescript.react.security.audit.react-dangerouslysetinnerhtml.react-dangerouslysetinnerhtml -- bio é sanitizado no backend (adminAuthors/index.ts, sanitizePostHtml) antes de persistir */}
        <span dangerouslySetInnerHTML={{ __html: author.bio }} />
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
            <a href={social?.instagram_url || '#'} aria-label="Instagram" target="_blank" rel="noopener noreferrer author">
              <i className="fab fa-instagram" aria-hidden="true" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
