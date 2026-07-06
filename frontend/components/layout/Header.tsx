import Link from 'next/link';
import './Header.css';
import HeaderNav from './HeaderNav';

export default function Header() {
  return (
    <header className="site-header site-header--dark" data-audit="header">
      <div className="nav-in" data-audit="header-nav-in">
        <Link href="/" className="brand" data-audit="header-brand">
          <span>Marcelo</span><span className="b2">Gonçalves</span>
        </Link>
        <HeaderNav />
      </div>
    </header>
  );
}
