<script setup lang="ts">
import { FloatingMenu } from '@tiptap/vue-3/menus'
import type { Editor } from '@tiptap/vue-3'
import type { TiptapCommands } from '../../composables/useTiptapCommands'

defineProps<{ editor: Editor; commands: TiptapCommands }>()
</script>

<template>
  <floating-menu
    :editor="editor"
    :options="{ placement: 'left-start' }"
  >
    <div class="floating-menu-card">
      <button
        type="button"
        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
        title="Título 2"
      >H2</button>

      <button
        type="button"
        @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
        title="Título 3"
      >H3</button>

      <button
        type="button"
        @click="editor.chain().focus().toggleBulletList().run()"
        :class="{ 'is-active': editor.isActive('bulletList') }"
        title="Lista"
      ><i class="fas fa-list-ul"></i></button>

      <button
        type="button"
        @click="editor.chain().focus().toggleOrderedList().run()"
        :class="{ 'is-active': editor.isActive('orderedList') }"
        title="Lista Numerada"
      ><i class="fas fa-list-ol"></i></button>

      <button
        type="button"
        @click="editor.chain().focus().toggleCodeBlock().run()"
        :class="{ 'is-active': editor.isActive('codeBlock') }"
        title="Bloco de Código"
      >&lt;/&gt;</button>

      <button
        type="button"
        @click="editor.chain().focus().toggleBlockquote().run()"
        :class="{ 'is-active': editor.isActive('blockquote') }"
        title="Citação"
      ><i class="fas fa-quote-right"></i></button>

      <button
        type="button"
        @click="commands.triggerImageUpload"
        title="Inserir Imagem"
      ><i class="fas fa-image"></i></button>

      <button
        type="button"
        @click="commands.insertTable"
        title="Inserir Tabela"
        :class="{ 'is-active': editor.isActive('table') }"
      >
        <i class="fas fa-table"></i>
      </button>

      <button
        type="button"
        @click="commands.addYoutubeVideo"
        title="Inserir Vídeo"
        :class="{ 'is-active': editor.isActive('youtube') }"
      >
        <i class="fab fa-youtube"></i>
      </button>

      <div class="menu-divider"></div>

      <button type="button" @click="commands.addCallout('info')" title="Callout: Saiba mais"><i class="fas fa-circle-info"></i></button>
      <button type="button" @click="commands.addCallout('warn')" title="Callout: Atenção"><i class="fas fa-triangle-exclamation"></i></button>
      <button type="button" @click="commands.addCallout('error')" title="Callout: Evite"><i class="fas fa-circle-xmark"></i></button>
      <button type="button" @click="commands.addCallout('ok')" title="Callout: Boa prática"><i class="fas fa-circle-check"></i></button>
      <button type="button" @click="commands.addCallout('tip')" title="Callout: Dica de bastidor"><i class="fas fa-lightbulb"></i></button>

      <div class="menu-divider"></div>

      <button type="button" @click="commands.setPullQuote" title="Citação em destaque"><i class="fas fa-quote-left"></i></button>
      <button type="button" @click="commands.setClosingFlourish" title="Bloco de encerramento"><i class="fas fa-flag-checkered"></i></button>

      <div class="menu-divider"></div>

      <button
        type="button"
        @click="commands.setHorizontalRule"
        title="Divisor"
      >—</button>
    </div>
  </floating-menu>
</template>

<style scoped>
.floating-menu-card {
  display: flex;
  align-items: center;
  background-color: white;
  padding: 0.2rem 0.4rem;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 1px solid var(--border-color);
  gap: 0.2rem;
  white-space: nowrap;
  flex-wrap: nowrap;
}

.floating-menu-card button {
  border: none;
  background: transparent;
  color: var(--dark-600);
  font-size: var(--text-sm);
  font-weight: 600;
  padding: 0.4rem 0.6rem;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.2s;
  line-height: 1;
}

.floating-menu-card button:hover {
  background-color: var(--slate-100);
  color: var(--dark-800);
}

.floating-menu-card button.is-active {
  background-color: var(--accent-light);
  color: var(--accent);
}

.menu-divider {
  width: 1px;
  height: 1.25rem;
  background-color: var(--slate-300);
  margin: 0 0.3rem;
  display: inline-block;
}
</style>
