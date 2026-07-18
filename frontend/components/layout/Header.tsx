import Link from 'next/link';
import './Header.css';
import HeaderNav from './HeaderNav';
import ReadingProgressBar from '@/components/ui/ReadingProgressBar';

export default function Header() {
  return (
    <header className="site-header" data-audit="header">
      <ReadingProgressBar />
      <div className="nav-in" data-audit="header-nav-in">
        <Link href="/" className="brand" data-audit="header-brand">
          <span>Marcelo</span><span className="b2">Gonçalves</span>
        </Link>
        <HeaderNav />
      </div>
    </header>
  );
}
