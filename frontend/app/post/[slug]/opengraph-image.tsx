import { ImageResponse } from 'next/og';
import { getPost, getAuthor } from '@/lib/api';
import { SITE_NAME, AUTHOR_NAME } from '@/lib/config';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function PostOgImage({ params }: Props) {
  const { slug } = await params;

  let titulo = SITE_NAME;
  let resumo = '';
  let nomeAutor = AUTHOR_NAME;

  try {
    const data = await getPost(slug);
    if (data?.post) {
      titulo = data.post.titulo || SITE_NAME;
      resumo = data.post.resumo || '';
      const autorData = await getAuthor(data.post.autor_id || 'marcelo-goncalves');
      nomeAutor = autorData?.autor?.nome_exibicao || AUTHOR_NAME;
    }
  } catch {
    // fallback: usa valores padrão
  }

  const tituloTruncado = titulo.length > 72 ? titulo.substring(0, 72) + '…' : titulo;
  const resumoTruncado = resumo.length > 120 ? resumo.substring(0, 120) + '…' : resumo;
  const fonteSize = titulo.length > 50 ? '52px' : '64px';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#0f172a',
          padding: '64px 72px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span
            style={{
              color: 'var(--sand)',
              fontSize: '18px',
              fontWeight: 700,
              letterSpacing: '3px',
              textTransform: 'uppercase',
            }}
          >
            {SITE_NAME}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h1
            style={{
              color: 'var(--sand)',
              fontSize: fonteSize,
              fontWeight: 800,
              lineHeight: 1.15,
              margin: 0,
            }}
          >
            {tituloTruncado}
          </h1>
          {resumoTruncado && (
            <p
              style={{
                color: '#94a3b8',
                fontSize: '22px',
                lineHeight: 1.4,
                margin: 0,
              }}
            >
              {resumoTruncado}
            </p>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid #1e293b',
            paddingTop: '28px',
          }}
        >
          <span style={{ color: '#64748b', fontSize: '20px' }}>por {nomeAutor}</span>
          <span
            style={{
              backgroundColor: 'var(--petrol)',
              color: '#fff',
              fontSize: '16px',
              fontWeight: 600,
              padding: '8px 20px',
              borderRadius: '6px',
            }}
          >
            Ler artigo →
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
