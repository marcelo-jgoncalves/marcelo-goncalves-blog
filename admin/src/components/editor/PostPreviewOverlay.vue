<script setup lang="ts">
import { sanitizeHtml } from '../../utils/sanitizeHtml'
import type { PostFormState } from '../../composables/usePostForm'

defineProps<{
  form: PostFormState
  categoriaNome: string
  authorName: string
  authorInitials: string
  authorAvatarUrl: string
  words: number
  coverFullUrl: string
}>()

const open = defineModel<boolean>('open', { required: true })
</script>

<template>
  <Transition name="ia-fade">
    <div v-if="open" class="ia-preview-overlay ia-scroll">
      <header class="ia-preview-top">
        <button class="ia-preview-back" @click="open = false">‹ Voltar à escrita</button>
        <span class="ia-preview-label">Como o leitor verá</span>
      </header>
      <article class="ia-preview-article">
        <div class="ia-preview-eyebrow"><span class="ia-preview-eyebrow-line"></span>{{ categoriaNome }}</div>
        <h1 class="ia-preview-h1">{{ form.titulo || 'Título do post' }}</h1>
        <p v-if="form.subtitulo" class="ia-preview-sub">{{ form.subtitulo }}</p>
        <div class="ia-preview-author">
          <div class="ia-preview-avatar">
            <img v-if="authorAvatarUrl" :src="authorAvatarUrl" :alt="authorName" />
            <span v-else>{{ authorInitials }}</span>
          </div>
          <div>
            <div class="ia-preview-author-name">{{ authorName }}</div>
            <div class="ia-preview-author-meta">{{ form.tempo_leitura_min }} min de leitura · {{ words }} palavras</div>
          </div>
        </div>
        <div v-if="coverFullUrl" class="ia-preview-cover" :style="{ backgroundImage: `url(${coverFullUrl})` }"></div>
        <div class="ia-read" v-html="sanitizeHtml(form.conteudo_html) || '<p style=\'color:#7E969E\'>Sem conteúdo ainda.</p>'"></div>
      </article>
    </div>
  </Transition>
</template>

<style scoped>
.ia-fade-enter-active, .ia-fade-leave-active { transition: opacity .2s; }
.ia-fade-enter-from, .ia-fade-leave-to { opacity: 0; }

.ia-preview-overlay { position: fixed; inset: 0; z-index: 50; background: var(--slate-50); overflow-y: auto; }
.ia-preview-top {
  position: sticky; top: 0; z-index: 2; background: rgba(15,76,92,.96); backdrop-filter: blur(10px);
  padding: 12px 28px; display: flex; align-items: center; gap: 14px; color: #fff;
}
.ia-preview-back {
  background: rgba(255,255,255,.12); border: 1px solid rgba(255,255,255,.2); color: #fff; font-size: 12.5px;
  font-weight: 600; padding: 8px 14px; border-radius: 9px; cursor: pointer;
}
.ia-preview-back:hover { background: rgba(255,255,255,.2); }
.ia-preview-label { font-family: var(--font-mono); font-size: 10px; letter-spacing: .18em; text-transform: uppercase; color: rgba(255,255,255,.7); }

.ia-preview-article { max-width: 720px; margin: 0 auto; padding: 52px 32px 120px; }
.ia-preview-eyebrow { display: flex; align-items: center; gap: 10px; font-family: var(--font-mono); font-size: 11px; letter-spacing: .22em; text-transform: uppercase; color: var(--accent); margin-bottom: 18px; }
.ia-preview-eyebrow-line { width: 24px; height: 1px; background: var(--accent); }
.ia-preview-h1 { font-family: var(--font-sans); font-weight: 800; font-size: clamp(2.2rem,4.6vw,3.1rem); line-height: 1.04; letter-spacing: -.04em; color: var(--petrol); margin: 0 0 18px; }
.ia-preview-sub { font-family: 'Newsreader', serif; font-size: 1.4rem; line-height: 1.5; color: #5c6f76; margin: 0 0 26px; }
.ia-preview-author { display: flex; align-items: center; gap: 14px; padding-bottom: 26px; border-bottom: 1px solid var(--border-color); }
.ia-preview-avatar {
  width: 42px; height: 42px; border-radius: 50%; background: linear-gradient(150deg, var(--petrol), var(--petrol-deep));
  display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 700; font-size: 14px; flex: none;
  overflow: hidden;
}
.ia-preview-avatar img { width: 100%; height: 100%; object-fit: cover; }
.ia-preview-author-name { font-weight: 700; font-size: 13.5px; color: var(--dark-700); }
.ia-preview-author-meta { font-family: var(--font-mono); font-size: 11px; color: var(--slate-400); margin-top: 2px; }
.ia-preview-cover { aspect-ratio: 16/8; border-radius: 16px; background-size: cover; background-position: center; margin: 32px 0 8px; box-shadow: 0 12px 30px rgba(12,32,39,.12); }

.ia-read { margin-top: 32px; font-family: 'Newsreader', Georgia, serif; }
.ia-read :deep(p) { font-size: 1.32rem; line-height: 1.8; color: #26343a; margin: 0 0 1em; }
.ia-read :deep(h2) { font-family: var(--font-sans); font-weight: 800; font-size: 1.8rem; color: var(--petrol); margin: 1.5em 0 .4em; }
.ia-read :deep(h3) { font-family: var(--font-sans); font-weight: 700; font-size: 1.3rem; color: var(--petrol); margin: 1.3em 0 .35em; }
.ia-read :deep(strong) { color: #A94C2D; font-weight: 600; }
.ia-read :deep(blockquote) { margin: 1.2em 0; padding-left: 20px; border-left: 3px solid var(--petrol); font-style: italic; color: var(--slate-500); }
.ia-read :deep(ul), .ia-read :deep(ol) { color: #26343a; font-size: 1.2rem; line-height: 1.75; margin: 0 0 1em 1.3em; }
.ia-read :deep(a) { color: var(--petrol); border-bottom: 1px solid rgba(15,76,92,.4); }
.ia-read :deep(.inline-code) {
  font-family: var(--font-mono); font-size: .85em; background: var(--slate-100); color: #d53f8c;
  padding: 1px 6px; border-radius: 4px;
}
.ia-read :deep(pre) {
  font-family: var(--font-mono); font-size: .92rem; line-height: 1.6; background: var(--petrol-deep);
  color: #D6E4E7; padding: 16px 18px; border-radius: 12px; overflow: auto; margin: 1.1em 0;
}
.ia-read :deep(hr) { border: none; border-top: 1px solid #D8CEBD; margin: 2em auto; width: 70px; }

/* Tiptap rich blocks (same classes as RichTextEditor.vue / frontend post.css) */
.ia-read :deep(.callout), .ia-read :deep(.tip) {
  display: flex; gap: 18px; align-items: flex-start; background: #fff; border: 1px solid var(--border-color);
  border-left: 4px solid var(--petrol); border-radius: 12px; padding: 22px 26px; margin: 1.6em 0;
}
.ia-read :deep(.callout .ic), .ia-read :deep(.tip .ic) {
  flex: none; width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center;
  font-family: var(--font-mono); font-weight: 700; font-size: 18px; background: rgba(15,76,92,.1); color: var(--petrol);
}
.ia-read :deep(.callout .t), .ia-read :deep(.tip .t) {
  font-family: var(--font-mono); font-size: 10.5px; letter-spacing: .18em; text-transform: uppercase;
  font-weight: 500; margin-bottom: 6px; color: var(--petrol);
}
.ia-read :deep(.callout .c p), .ia-read :deep(.tip .c p) { margin: 0; font-size: 1.05rem; line-height: 1.6; }
.ia-read :deep(.callout.warn) { border-left-color: var(--accent); background: #FCF6F1; }
.ia-read :deep(.callout.warn .ic) { background: var(--accent-light); color: #A94C2D; }
.ia-read :deep(.callout.warn .t) { color: #A94C2D; }
.ia-read :deep(.callout.error) { border-left-color: #A33A2B; background: #FBF0EE; }
.ia-read :deep(.callout.error .ic) { background: #F4D9D4; color: #A33A2B; }
.ia-read :deep(.callout.error .t) { color: #A33A2B; }
.ia-read :deep(.callout.ok) { border-left-color: var(--moss); background: #F1F5F0; }
.ia-read :deep(.callout.ok .ic) { background: #DCE8DD; color: var(--moss); }
.ia-read :deep(.callout.ok .t) { color: var(--moss); }
.ia-read :deep(.tip) { border-left-color: var(--accent); }
.ia-read :deep(.tip .ic) { background: var(--accent-light); color: #A94C2D; }
.ia-read :deep(.tip .t) { color: var(--accent); }

.ia-read :deep(.pull) { margin: 1.8em 0; padding: 8px 0 8px 28px; border-left: 3px solid var(--accent); }
.ia-read :deep(.pull p) {
  margin: 0; font-size: 1.5rem; line-height: 1.4; font-weight: 500; font-style: italic;
  color: var(--petrol); letter-spacing: -.015em;
}
.ia-read :deep(.pull .cite) { font-family: var(--font-mono); font-size: 11.5px; letter-spacing: .08em; color: var(--slate-400); margin-top: 14px; font-style: normal; }

.ia-read :deep(.closing) { margin-top: 1.8em; padding: 30px 32px; background: var(--petrol); border-radius: 16px; color: var(--slate-50); }
.ia-read :deep(.closing h3) { font-weight: 800; font-size: 1.4rem; letter-spacing: -.025em; color: #fff; margin-bottom: 8px; }
.ia-read :deep(.closing p) { font-size: 1.05rem; line-height: 1.6; color: rgba(250,248,243,.72); max-width: 520px; margin: 0; }

.ia-read :deep(table) { border-collapse: collapse; table-layout: fixed; width: 100%; margin: 1.5rem 0; }
.ia-read :deep(table td), .ia-read :deep(table th) { position: relative; vertical-align: top; padding: 8px 10px; border: 1px solid var(--border-color); }
.ia-read :deep(table th) { background: var(--slate-50); font-weight: 600; text-align: left; }

.ia-read :deep(div[data-youtube-video]) { margin: 1.3em 0; }
.ia-read :deep(iframe) { border: 8px solid #000; border-radius: 4px; display: block; margin: 0 auto; max-width: 100%; }
</style>
