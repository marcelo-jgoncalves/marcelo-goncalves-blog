import './AdSenseBanner.css';

export default function AdSenseBanner() {
  return (
    <div className="adsense-banner-wrapper">
      <div className="adsense-placeholder" aria-label="Espaço reservado para anúncio">
        AdSense — 728×90
      </div>
    </div>
  );
}