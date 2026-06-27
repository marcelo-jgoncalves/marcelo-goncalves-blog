// src/tiptap.d.ts
// Import necessário apenas para colocar este arquivo em "module mode" —
// sem nenhum import/export, o TS trata declare module como ambient global
// e a augmentation abaixo deixa de se mesclar com os tipos reais do @tiptap/core.
import '@tiptap/vue-3'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    youtube: {
      setYoutubeVideo: (options: { src: string; width?: number; height?: number; start?: number }) => ReturnType
    }
    table: {
      insertTable: (options?: { rows?: number; cols?: number; withHeaderRow?: boolean }) => ReturnType
    }
  }
}