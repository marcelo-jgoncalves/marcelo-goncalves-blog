/* frontend/components/ui/Pill.tsx
   Tag/badge mono reutilizável — ver Pill.module.css para o racional. */

import type { ReactNode } from 'react';
import styles from './Pill.module.css';

interface PillProps {
  children: ReactNode;
  className?: string;
}

export default function Pill({ children, className }: PillProps) {
  return (
    <span className={`${styles.pill}${className ? ` ${className}` : ''}`}>
      {children}
    </span>
  );
}
