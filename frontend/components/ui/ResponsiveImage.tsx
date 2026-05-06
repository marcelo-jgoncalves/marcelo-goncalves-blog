// frontend/components/ui/ResponsiveImage.tsx
//
// Serve imagens responsivas de forma transparente:
// - URL legada (termina em .webp/.jpg/.png): renderiza <Image> do Next.js (retrocompatível)
// - Base path sem extensão (novo formato): renderiza <picture> com AVIF + WebP em 3 tamanhos
//   Browser escolhe automaticamente o melhor formato + tamanho para o viewport.

import Image from "next/image";

interface ResponsiveImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Normaliza src para basePath sem extensão.
 * URLs do admin antigo chegam com .webp/.jpg appended (ex: media/uuid.webp),
 * mas o imageProcessor gera variantes como media/uuid-480.avif.
 * Strippando a extensão, o <picture> constrói as URLs corretas das variantes.
 */
function toBasePath(src: string): string {
  return src.replace(/\.(webp|avif|jpg|jpeg|png|gif)(\?.*)?$/i, '');
}

export default function ResponsiveImage({
  src,
  alt,
  fill = false,
  priority = false,
  sizes,
  className,
  style,
}: ResponsiveImageProps) {
  if (!src) return null;

  const basePath = toBasePath(src);

  // Novo formato: src é o basePath sem extensão
  // Ex: "https://cdn.../media/1234-uuid-nome"
  // Variantes geradas pelo imageProcessor:
  //   {basePath}-480.avif  |  {basePath}-480.webp
  //   {basePath}-768.avif  |  {basePath}-768.webp
  //   {basePath}-1280.avif |  {basePath}-1280.webp

  const imgProps: React.ImgHTMLAttributes<HTMLImageElement> & { fetchPriority?: string } = {
    src: `${basePath}-1280.webp`,
    alt,
    loading: priority ? "eager" : "lazy",
    fetchPriority: priority ? "high" : "auto",
    decoding: "async",
    style: fill
      ? { width: "100%", height: "100%", objectFit: "cover", display: "block" }
      : undefined,
    className,
  };

  if (fill) {
    return (
      <picture
        style={{
          display: "block",
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          backgroundImage: `url(${basePath}-lqip.webp)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <source media="(max-width: 480px)" type="image/avif" srcSet={`${basePath}-480.avif`} />
        <source media="(max-width: 480px)" type="image/webp" srcSet={`${basePath}-480.webp`} />
        <source media="(max-width: 768px)" type="image/avif" srcSet={`${basePath}-768.avif`} />
        <source media="(max-width: 768px)" type="image/webp" srcSet={`${basePath}-768.webp`} />
        <source type="image/avif" srcSet={`${basePath}-1280.avif`} />
        <img {...imgProps} />
      </picture>
    );
  }

  return (
    <picture>
      <source media="(max-width: 480px)" type="image/avif" srcSet={`${basePath}-480.avif`} />
      <source media="(max-width: 480px)" type="image/webp" srcSet={`${basePath}-480.webp`} />
      <source media="(max-width: 768px)" type="image/avif" srcSet={`${basePath}-768.avif`} />
      <source media="(max-width: 768px)" type="image/webp" srcSet={`${basePath}-768.webp`} />
      <source type="image/avif" srcSet={`${basePath}-1280.avif`} />
      <img {...imgProps} />
    </picture>
  );
}
