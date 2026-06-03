'use client';

import styles from './PostFooter.module.css';

export interface PostFooterProps {
  author: {
    name: string;
    bio: string;
    avatarInitials: string;
    profileUrl: string;
  };
  shareUrls: {
    linkedin: string;
    twitter: string;
  };
}

function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

export default function PostFooter({ author, shareUrls }: PostFooterProps) {
  return (
    <div id="post-footer" className={styles.postFooter}>
      <section className={styles.author}>
        <div className={styles.avatar} aria-hidden="true">
          {author.avatarInitials}
        </div>
        <div className={styles.info}>
          <p>
            <strong className={styles.authorName}>{author.name}</strong>
            {' '}
            {stripHtmlTags(author.bio)}{' '}
            <a href={author.profileUrl} className={styles.profileLink}>
              Veja o perfil
            </a>
            .
          </p>
        </div>
        <div className={styles.actions}>
          <span className={styles.netLabel}>Acompanhe nas redes</span>
          <div className={styles.nets}>
            <a
              href={shareUrls.linkedin}
              className={`${styles.net} ${styles.linkedin}`}
              aria-label="LinkedIn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a
              href="#"
              className={`${styles.net} ${styles.instagram}`}
              aria-label="Instagram"
              title="Em breve"
              onClick={(e) => e.preventDefault()}
            >
              <i className="fab fa-instagram"></i>
            </a>
            <a
              href={shareUrls.twitter}
              className={`${styles.net} ${styles.x}`}
              aria-label="X (Twitter)"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-x-twitter"></i>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
