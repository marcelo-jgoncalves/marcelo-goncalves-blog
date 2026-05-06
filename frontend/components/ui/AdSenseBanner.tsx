import './AdSenseBanner.css';

interface AdSenseBannerProps {
  hideOnMobile?: boolean;
}

export default function AdSenseBanner({ hideOnMobile = false }: AdSenseBannerProps) {
  return (
    <div className={`adsense-banner-wrapper${hideOnMobile ? ' adsense-banner-wrapper--hide-mobile' : ''}`}>
      <div className="adsense-placeholder" aria-label="Espaço reservado para anúncio">
        AdSense — 728×90
      </div>
    </div>
  );
}