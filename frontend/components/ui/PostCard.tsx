/* frontend/components/ui/PostCard.tsx */
import Link from 'next/link';
import './PostCard.css';
import { formatDateShort } from '@/lib/format';

const GRADIENT_VARIANTS = ['t-soft', 't-petrol', 't-clay', 't-teal', 't-deep', 't-moss'] as const;

interface PostCardProps {
  post: {
    slug: string;
    titulo: string;
    resumo?: string;
    categoria_slug: string;
    categoria?: {
      nome_exibicao: string;
    };
    data_publicacao?: string;
  };
  dataAudit?: string;
}

function slugToName(slug?: string): string {
  if (!slug) return '';
  return slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function gradientVariant(slug: string): string {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  }
  return GRADIENT_VARIANTS[hash % GRADIENT_VARIANTS.length];
}

export default function PostCard({ post, dataAudit }: PostCardProps) {
  const categoriaNome = post.categoria?.nome_exibicao || slugToName(post.categoria_slug);

  return (
    <Link href={`/post/${post.slug}`} className="post-card" aria-label={post.titulo} data-audit={dataAudit}>
      <div className={`pc-img ${gradientVariant(post.slug)}`}>
        {categoriaNome && <span className="tag">{categoriaNome}</span>}
      </div>

      <div className="pc-body">
        {categoriaNome && <span className="pc-cat">{categoriaNome}</span>}
        <span className="pc-title" title={post.titulo}>{post.titulo}</span>
        {post.resumo && <span className="pc-excerpt">{post.resumo}</span>}
      </div>

      <div className="pc-foot">
        <span>{formatDateShort(post.data_publicacao)}</span>
        <span className="more">Ler →</span>
      </div>
    </Link>
  );
}
