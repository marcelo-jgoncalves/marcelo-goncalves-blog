/* frontend/components/ui/Kicker.tsx
   Ver Kicker.module.css para o racional. */

import type { ReactNode } from 'react';
import styles from './Kicker.module.css';

interface KickerProps {
  children: ReactNode;
  dark?: boolean;
  className?: string;
}

export default function Kicker({ children, dark, className }: KickerProps) {
  return (
    <span className={`${styles.kicker}${dark ? ` ${styles.kickerDark}` : ''}${className ? ` ${className}` : ''}`}>
      {children}
    </span>
  );
}
