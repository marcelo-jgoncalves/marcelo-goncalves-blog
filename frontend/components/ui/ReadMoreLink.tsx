/* frontend/components/ui/ReadMoreLink.tsx */
import Link from 'next/link';

interface ReadMoreLinkProps {
  href: string;
  text?: string;
  className?: string;
}

export default function ReadMoreLink({ href, text = "Ler mais →", className = "" }: ReadMoreLinkProps) {
  return (
    <Link href={href} className={`read-more-global ${className}`}>
      {text}
    </Link>
  );
}