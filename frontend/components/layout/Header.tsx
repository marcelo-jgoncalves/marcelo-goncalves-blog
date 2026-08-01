import Link from 'next/link';
import styles from './Header.module.css';
import HeaderNav from './HeaderNav';
import ReadingProgressBar from '@/components/ui/ReadingProgressBar';

export default function Header() {
  return (
    <header className={styles.siteHeader} data-audit="header">
      <ReadingProgressBar />
      <div className={styles.navIn} data-audit="header-nav-in">
        <Link href="/" className={styles.brand} data-audit="header-brand">
          <span>Marcelo</span><span className={styles.b2}>Gonçalves</span>
        </Link>
        <HeaderNav />
      </div>
    </header>
  );
}
