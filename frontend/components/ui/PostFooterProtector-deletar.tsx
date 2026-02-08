'use client';

import React, { useState, useEffect } from 'react';

export default function PostFooterProtector({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Enquanto não montar no cliente, retorna NULL ou um placeholder simples.
  // Isso evita que o React tente comparar o HTML complexo do rodapé
  // com a árvore DOM instável do post.
  if (!isMounted) {
    return null;
  }

  return <div className="fade-in">{children}</div>;
}