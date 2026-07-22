'use client';

import { useState } from 'react';
import './AvatarImage.css';

interface AvatarImageProps {
  src: string;
  alt: string;
}

export default function AvatarImage({ src, alt }: AvatarImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <i className="fa-solid fa-user avatar-fallback-icon" aria-hidden="true" />;
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
    />
  );
}
