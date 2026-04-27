import { ImageResponse } from 'next/og';
import { SITE_NAME, SITE_DESCRIPTION, AUTHOR_NAME } from '@/lib/config';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function RootOgImage() {
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
              color: '#f97316',
              fontSize: '20px',
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
              color: '#f8fafc',
              fontSize: '64px',
              fontWeight: 800,
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            IA, AWS &amp; DevOps —<br />detalhe por detalhe.
          </h1>
          <p
            style={{
              color: '#94a3b8',
              fontSize: '24px',
              lineHeight: 1.4,
              margin: 0,
              maxWidth: '800px',
            }}
          >
            {SITE_DESCRIPTION}
          </p>
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
          <span style={{ color: '#64748b', fontSize: '20px' }}>{AUTHOR_NAME}</span>
          <span
            style={{
              backgroundColor: '#f97316',
              color: '#fff',
              fontSize: '16px',
              fontWeight: 600,
              padding: '8px 20px',
              borderRadius: '6px',
            }}
          >
            Leia agora →
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
