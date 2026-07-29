/* frontend/components/ui/IndexNumber.tsx
   Ver IndexNumber.module.css para o racional. */

import type { ReactNode } from 'react';
import styles from './IndexNumber.module.css';

interface IndexNumberProps {
  children: ReactNode;
  dark?: boolean;
  className?: string;
}

export default function IndexNumber({ children, dark, className }: IndexNumberProps) {
  return (
    <span
      className={`${styles.number}${dark ? ` ${styles.numberDark}` : ''}${className ? ` ${className}` : ''}`}
      aria-hidden="true"
    >
      {children}
    </span>
  );
}
