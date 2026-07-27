/* frontend/components/ui/PostCard.tsx */
import Link from 'next/link';
import './PostCard.css';
import LerArtigo from '@/components/ui/LerArtigo';
import { formatDateShort } from '@/lib/format';
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

export default function PostCard({ post, dataAudit, dataCat }: PostCardProps) {
  const categoriaNome = post.categoria?.nome_exibicao || slugToName(post.categoria_slug);

  return (
    <Link href={`/post/${post.slug}`} className="post-card" data-audit={dataAudit} data-cat={dataCat}>
      <div className={`pc-img ${gradientVariant(post.slug)}`}>
        {post.imagem_destaque_url && (
          <ResponsiveImage
            src={post.imagem_destaque_url}
            alt={post.imagem_destaque_alt_text || post.titulo}
            fill
            lqip={post.imagem_lqip_base64}
          />
        )}
        {categoriaNome && <span className="tag">{categoriaNome}</span>}
      </div>

      <div className="pc-body">
        {(post.subcategoria_nome || categoriaNome) && (
          <span className="pc-cat">{post.subcategoria_nome || categoriaNome}</span>
        )}
        <span className="pc-title" title={post.titulo}>{post.titulo}</span>
        {post.resumo && <span className="pc-excerpt">{post.resumo}</span>}
      </div>

      <div className="pc-foot">
        <span>
          {formatDateShort(post.data_publicacao)}
          {post.tempo_leitura_min ? ` · ${post.tempo_leitura_min} min de leitura` : ''}
        </span>
        <LerArtigo color="var(--petrol)" />
      </div>
    </Link>
  );
}
