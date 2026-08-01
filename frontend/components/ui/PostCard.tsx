import Link from 'next/link';
import styles from './PostCard.module.css';
import ReadArticle from '@/components/ui/ReadArticle';
import { formatDateShort, categoryName } from '@/lib/format';
import ResponsiveImage from '@/components/ui/ResponsiveImage';

const GRADIENT_VARIANTS = ['t-soft', 't-petrol', 't-clay', 't-teal', 't-deep', 't-moss'] as const;

export interface PostCardProps {
  post: {
    slug: string;
    titulo: string;
    resumo?: string;
    categoria_slug: string;
    categoria?: {
      nome_exibicao: string;
    };
    subcategoria_nome?: string;
    data_publicacao?: string;
    imagem_destaque_url?: string;
    imagem_destaque_alt_text?: string;
    imagem_lqip_base64?: string;
    tempo_leitura_min?: number;
  };
  dataAudit?: string;
  dataCat?: string;
}

function gradientVariant(slug: string): string {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  }
  return GRADIENT_VARIANTS[hash % GRADIENT_VARIANTS.length];
}

export default function PostCard({ post, dataAudit, dataCat }: PostCardProps) {
  const categoryLabel = categoryName(post);

  return (
    <Link href={`/post/${post.slug}`} className={`post-card ${styles.postCard}`} data-audit={dataAudit} data-cat={dataCat}>
      <div className={`${styles.pcImg} ${gradientVariant(post.slug)}`}>
        {post.imagem_destaque_url && (
          <ResponsiveImage
            src={post.imagem_destaque_url}
            alt={post.imagem_destaque_alt_text || post.titulo}
            fill
            lqip={post.imagem_lqip_base64}
          />
        )}
        {categoryLabel && <span className={styles.tag}>{categoryLabel}</span>}
      </div>

      <div className={styles.pcBody}>
        {(post.subcategoria_nome || categoryLabel) && (
          <span className={styles.pcCat}>{post.subcategoria_nome || categoryLabel}</span>
        )}
        <span className={styles.pcTitle} title={post.titulo}>{post.titulo}</span>
        {post.resumo && <span className={`pc-excerpt ${styles.pcExcerpt}`}>{post.resumo}</span>}
      </div>

      <div className={`pc-foot ${styles.pcFoot}`}>
        <span>
          {formatDateShort(post.data_publicacao)}
          {post.tempo_leitura_min ? ` · ${post.tempo_leitura_min} min de leitura` : ''}
        </span>
        <ReadArticle color="var(--petrol)" />
      </div>
    </Link>
  );
}
