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

/** Detecta URLs legadas que já têm extensão de imagem */
function isLegacyUrl(src: string): boolean {
  return /\.(webp|avif|jpg|jpeg|png|gif)(\?.*)?$/i.test(src);
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

  // Retrocompatibilidade: posts existentes têm URL com extensão
  if (isLegacyUrl(src)) {
    return (
      <Image
        src={src}
        alt={alt}
        fill={fill}
        priority={priority}
        sizes={sizes}
        className={className}
        style={style}
      />
    );
  }

  // Novo formato: src é o basePath sem extensão
  // Ex: "https://cdn.../media/1234-uuid-nome"
  // Variantes geradas pelo imageProcessor:
  //   {basePath}-480.avif  |  {basePath}-480.webp
  //   {basePath}-768.avif  |  {basePath}-768.webp
  //   {basePath}-1280.avif |  {basePath}-1280.webp

  const imgProps: React.ImgHTMLAttributes<HTMLImageElement> & { fetchPriority?: string } = {
    src: `${src}-1280.webp`,
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
        }}
      >
        <source media="(max-width: 480px)" type="image/avif" srcSet={`${src}-480.avif`} />
        <source media="(max-width: 480px)" type="image/webp" srcSet={`${src}-480.webp`} />
        <source media="(max-width: 768px)" type="image/avif" srcSet={`${src}-768.avif`} />
        <source media="(max-width: 768px)" type="image/webp" srcSet={`${src}-768.webp`} />
        <source type="image/avif" srcSet={`${src}-1280.avif`} />
        <img {...imgProps} />
      </picture>
    );
  }

  return (
    <picture>
      <source media="(max-width: 480px)" type="image/avif" srcSet={`${src}-480.avif`} />
      <source media="(max-width: 480px)" type="image/webp" srcSet={`${src}-480.webp`} />
      <source media="(max-width: 768px)" type="image/avif" srcSet={`${src}-768.avif`} />
      <source media="(max-width: 768px)" type="image/webp" srcSet={`${src}-768.webp`} />
      <source type="image/avif" srcSet={`${src}-1280.avif`} />
      <img {...imgProps} />
    </picture>
  );
}
