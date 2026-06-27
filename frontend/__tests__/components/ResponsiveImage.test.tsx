/**
 * @jest-environment jsdom
 */
// frontend/__tests__/components/ResponsiveImage.test.tsx
import React from 'react';
import { render } from '@testing-library/react';
import ResponsiveImage from '@/components/ui/ResponsiveImage';

// Next/Image renderiza como <img> em ambiente de teste
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    const { fill, priority, sizes, alt, ...rest } = props;
    return <img data-fill={String(fill)} data-priority={String(priority)} data-sizes={sizes as string} alt={alt as string} {...(rest as React.ImgHTMLAttributes<HTMLImageElement>)} />;
  },
}));

// URLs com extensão (.webp/.jpg/.png) são tratadas como basePath — a extensão
// é stripped e o componente renderiza <picture> com variantes AVIF/WebP.
// Isso cobre tanto URLs do admin antigo (uuid.webp) quanto novos basePaths.
const LEGACY_URL = 'https://cdn.example.com/media/ts-uuid-foto.webp';
const BASE_URL   = 'https://cdn.example.com/media/ts-uuid-foto';

describe('ResponsiveImage', () => {
  describe('URLs com extensão (tratadas como basePath)', () => {
    it('renderiza <picture> para URL com .webp (strip extensão)', () => {
      const { container } = render(<ResponsiveImage src={LEGACY_URL} alt="teste" />);
      expect(container.querySelector('picture')).not.toBeNull();
    });

    it('source mobile aponta para basePath-480.avif sem a extensão original', () => {
      const { container } = render(<ResponsiveImage src={LEGACY_URL} alt="teste" />);
      const src = container.querySelector('source[media="(max-width: 480px)"][type="image/avif"]')?.getAttribute('srcset');
      expect(src).toBe(`${BASE_URL}-480.avif`);
    });

    it('renderiza <picture> para URL com .jpg', () => {
      const { container } = render(
        <ResponsiveImage src="https://cdn.example.com/img.jpg" alt="teste" />
      );
      expect(container.querySelector('picture')).not.toBeNull();
    });

    it('renderiza <picture> para URL com .png', () => {
      const { container } = render(
        <ResponsiveImage src="https://cdn.example.com/img.png" alt="teste" />
      );
      expect(container.querySelector('picture')).not.toBeNull();
    });
  });

  describe('novo formato (basePath sem extensão)', () => {
    it('renderiza <picture> para URL sem extensão', () => {
      const { container } = render(<ResponsiveImage src={BASE_URL} alt="foto" />);
      expect(container.querySelector('picture')).not.toBeNull();
    });

    it('inclui sources AVIF para todos os breakpoints', () => {
      const { container } = render(<ResponsiveImage src={BASE_URL} alt="foto" />);
      const avifSources = container.querySelectorAll('source[type="image/avif"]');
      expect(avifSources).toHaveLength(3); // 480, 768, 1280
    });

    it('inclui sources WebP para todos os breakpoints', () => {
      const { container } = render(<ResponsiveImage src={BASE_URL} alt="foto" />);
      const webpSources = container.querySelectorAll('source[type="image/webp"]');
      expect(webpSources).toHaveLength(2); // 480, 768 (1280 é o <img> fallback)
    });

    it('source mobile AVIF aponta para -480.avif', () => {
      const { container } = render(<ResponsiveImage src={BASE_URL} alt="foto" />);
      const mobileAvif = container.querySelector('source[media="(max-width: 480px)"][type="image/avif"]');
      expect(mobileAvif?.getAttribute('srcset')).toBe(`${BASE_URL}-480.avif`);
    });

    it('source tablet WebP aponta para -768.webp', () => {
      const { container } = render(<ResponsiveImage src={BASE_URL} alt="foto" />);
      const tabletWebp = container.querySelector('source[media="(max-width: 768px)"][type="image/webp"]');
      expect(tabletWebp?.getAttribute('srcset')).toBe(`${BASE_URL}-768.webp`);
    });

    it('<img> fallback usa -1280.webp como src', () => {
      const { container } = render(<ResponsiveImage src={BASE_URL} alt="foto" />);
      const img = container.querySelector('img');
      expect(img?.getAttribute('src')).toBe(`${BASE_URL}-1280.webp`);
    });

    it('aplica alt text no <img>', () => {
      const { container } = render(<ResponsiveImage src={BASE_URL} alt="minha foto" />);
      expect(container.querySelector('img')?.getAttribute('alt')).toBe('minha foto');
    });
  });

  describe('modo fill', () => {
    it('renderiza <picture> com position absolute quando fill=true', () => {
      const { container } = render(<ResponsiveImage src={BASE_URL} alt="foto" fill />);
      const picture = container.querySelector('picture') as HTMLElement;
      expect(picture).not.toBeNull();
      expect(picture.style.position).toBe('absolute');
    });

    it('<img> tem object-fit: cover no modo fill', () => {
      const { container } = render(<ResponsiveImage src={BASE_URL} alt="foto" fill />);
      const img = container.querySelector('img') as HTMLImageElement;
      expect(img.style.objectFit).toBe('cover');
    });
  });

  describe('loading e prioridade', () => {
    it('aplica loading=lazy por padrão', () => {
      const { container } = render(<ResponsiveImage src={BASE_URL} alt="foto" />);
      expect(container.querySelector('img')?.getAttribute('loading')).toBe('lazy');
    });

    it('aplica loading=eager quando priority=true', () => {
      const { container } = render(<ResponsiveImage src={BASE_URL} alt="foto" priority />);
      expect(container.querySelector('img')?.getAttribute('loading')).toBe('eager');
    });
  });

  it('retorna null quando src está vazio', () => {
    const { container } = render(<ResponsiveImage src="" alt="foto" />);
    expect(container.firstChild).toBeNull();
  });
});
