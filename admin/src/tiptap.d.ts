// Import needed only to put this file in "module mode": without any
// import/export, TS treats declare module as an ambient global, and the
// augmentation below would stop merging with @tiptap/core's real types.
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