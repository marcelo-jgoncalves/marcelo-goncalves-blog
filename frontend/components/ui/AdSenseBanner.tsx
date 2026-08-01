import styles from './AdSenseBanner.module.css';

interface AdSenseBannerProps {
  hideOnMobile?: boolean;
}

export default function AdSenseBanner({ hideOnMobile = false }: AdSenseBannerProps) {
  return (
    <div className={`${styles.adsenseBannerWrapper}${hideOnMobile ? ` ${styles.adsenseBannerWrapperHideMobile}` : ''}`}>
      <div className={styles.adsensePlaceholder} aria-label="Espaço reservado para anúncio">
        AdSense — 728×90
      </div>
    </div>
  );
}
