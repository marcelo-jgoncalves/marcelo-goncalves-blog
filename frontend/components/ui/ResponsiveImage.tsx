//
// Serve imagens responsivas de forma transparente:
// - Base path sem extensão (novo formato): renderiza <picture> com AVIF + WebP em 3 tamanhos
//   Browser escolhe automaticamente o melhor formato + tamanho para o viewport.
// - Prop `lqip`: data URI inline (ex: "data:image/webp;base64,...") usada como
//   background-image de blur placeholder enquanto a imagem real carrega. Zero
//   requisição HTTP extra — sem risco de 403 para posts sem lqip gerado.

interface ResponsiveImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
  className?: string;
  lqip?: string; // data URI inline do blur placeholder (imagem_lqip_base64)
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
  lqip,
}: ResponsiveImageProps) {
  if (!src) return null;

  const basePath = toBasePath(src);

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
    sizes,
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
          // lqip é uma data URI inline — zero HTTP request, zero risco de 403.
          // Ausente: sem background (degradação silenciosa para posts sem lqip).
          ...(lqip && {
            backgroundImage: `url(${lqip})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }),
        }}
      >
        <source media="(max-width: 480px)" type="image/avif" srcSet={`${basePath}-480.avif`} />
        <source media="(max-width: 480px)" type="image/webp" srcSet={`${basePath}-480.webp`} />
        <source media="(max-width: 768px)" type="image/avif" srcSet={`${basePath}-768.avif`} />
        <source media="(max-width: 768px)" type="image/webp" srcSet={`${basePath}-768.webp`} />
        <source type="image/avif" srcSet={`${basePath}-1280.avif`} />
        <img {...imgProps} alt={alt} />
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
      <img {...imgProps} alt={alt} />
    </picture>
  );
}
