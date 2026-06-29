/* frontend/components/ui/StaticPicture.tsx */
//
// Assets estáticos do site (logos, badges) otimizados em build-time via
// scripts/optimize-static-images.mjs — diferente de ResponsiveImage (que
// serve imagem de conteúdo dinâmico vindo do upload/imageProcessor).
// Aqui não há breakpoint de viewport (o tamanho de exibição é fixo em CSS
// em qualquer largura de tela) — só densidade de pixel (1x/2x retina).

interface StaticPictureProps {
  name: string;
  category: 'badges' | 'logos';
  alt: string;
  title?: string;
  className?: string;
  width?: number;
  height?: number;
}

export default function StaticPicture({
  name,
  category,
  alt,
  title,
  className,
  width,
  height,
}: StaticPictureProps) {
  const base = `/static/${category}/${name}`;

  return (
    <picture>
      <source
        type="image/avif"
        srcSet={`${base}-1x.avif 1x, ${base}-2x.avif 2x`}
      />
      <source
        type="image/webp"
        srcSet={`${base}-1x.webp 1x, ${base}-2x.webp 2x`}
      />
      <img
        src={`${base}-1x.webp`}
        alt={alt}
        title={title}
        className={className}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
      />
    </picture>
  );
}
