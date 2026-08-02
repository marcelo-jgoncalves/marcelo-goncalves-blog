<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'
import { CODE_LANGUAGES } from '../../composables/useTiptapExtensions'
import type { TiptapCommands } from '../../composables/useTiptapCommands'

defineProps<{ editor: Editor; commands: TiptapCommands }>()
</script>

<template>
  <div class="tiptap-toolbar">
    <button
      type="button"
      @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
      :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
    >H2</button>

    <button
      type="button"
      @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
      :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
    >H3</button>

    <button
      type="button"
      @click="editor.chain().focus().toggleBold().run()"
      :class="{ 'is-active': editor.isActive('bold') }"
    >B</button>

    <div class="divider"></div>

    <button
      type="button"
      @click="editor.chain().focus().toggleBulletList().run()"
      :class="{ 'is-active': editor.isActive('bulletList') }"
      title="Lista com Marcadores"
    ><i class="fas fa-list-ul"></i></button>

    <button
      type="button"
      @click="editor.chain().focus().toggleOrderedList().run()"
      :class="{ 'is-active': editor.isActive('orderedList') }"
      title="Lista Numerada"
    ><i class="fas fa-list-ol"></i></button>

    <div class="divider"></div>

    <button
      type="button"
      @click="editor.chain().focus().toggleCodeBlock().run()"
      :class="{ 'is-active': editor.isActive('codeBlock') }"
      title="Bloco de Código"
    >&lt;/&gt;</button>

    <select
      v-if="editor.isActive('codeBlock')"
      class="lang-select"
      :value="editor.getAttributes('codeBlock').language"
      @change="commands.setCodeLanguage"
      title="Linguagem do bloco de código"
    >
      <option v-for="lang in CODE_LANGUAGES" :key="lang.value" :value="lang.value">{{ lang.label }}</option>
    </select>

    <button
      type="button"
      @click="editor.chain().focus().toggleBlockquote().run()"
      :class="{ 'is-active': editor.isActive('blockquote') }"
      title="Citação"
    ><i class="fas fa-quote-right"></i></button>

    <button
      type="button"
      @click="commands.setLink"
      :class="{ 'is-active': editor.isActive('link') }"
      title="Inserir Link"
    ><i class="fas fa-link"></i></button>

    <button
      type="button"
      @click="commands.triggerImageUpload"
      title="Inserir Imagem"
    ><i class="fas fa-image"></i></button>

    <div class="divider"></div>

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
      title="Inserir Vídeo do YouTube"
      :class="{ 'is-active': editor.isActive('youtube') }"
    >
      <i class="fab fa-youtube"></i>
    </button>

    <div class="divider"></div>

    <button type="button" @click="commands.addCallout('info')" :class="{ 'is-active': editor.isActive('callout', { type: 'info' }) }" title="Callout: Saiba mais"><i class="fas fa-circle-info"></i></button>
    <button type="button" @click="commands.addCallout('warn')" :class="{ 'is-active': editor.isActive('callout', { type: 'warn' }) }" title="Callout: Atenção"><i class="fas fa-triangle-exclamation"></i></button>
    <button type="button" @click="commands.addCallout('error')" :class="{ 'is-active': editor.isActive('callout', { type: 'error' }) }" title="Callout: Evite"><i class="fas fa-circle-xmark"></i></button>
    <button type="button" @click="commands.addCallout('ok')" :class="{ 'is-active': editor.isActive('callout', { type: 'ok' }) }" title="Callout: Boa prática"><i class="fas fa-circle-check"></i></button>
    <button type="button" @click="commands.addCallout('tip')" :class="{ 'is-active': editor.isActive('callout', { type: 'tip' }) }" title="Callout: Dica de bastidor"><i class="fas fa-lightbulb"></i></button>
    <button type="button" @click="commands.editCalloutTitle" :disabled="!editor.isActive('callout')" title="Editar título do callout"><i class="fas fa-pen"></i></button>

    <div class="divider"></div>

    <button type="button" @click="commands.setPullQuote" :class="{ 'is-active': editor.isActive('pullQuote') }" title="Citação em destaque"><i class="fas fa-quote-left"></i></button>
    <button type="button" @click="commands.editPullQuoteCite" :disabled="!editor.isActive('pullQuote')" title="Editar atribuição da citação"><i class="fas fa-signature"></i></button>

    <div class="divider"></div>

    <button type="button" @click="commands.setClosingFlourish" title="Bloco de encerramento"><i class="fas fa-flag-checkered"></i></button>

    <div class="divider"></div>

    <button
      type="button"
      @click="commands.setHorizontalRule"
      title="Divisor Horizontal"
    >—</button>

    <button
      type="button"
      @click="editor.chain().focus().clearNodes().run()"
      title="Limpar Formatação do Bloco"
    >Limpar</button>
  </div>
</template>

<style scoped>
.tiptap-toolbar {
  padding: var(--space-1);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  gap: var(--space-1);
  background: var(--slate-50);
  border-radius: 8px 8px 0 0;
  flex-wrap: wrap;
}

.tiptap-toolbar button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px 12px;
  border: 1px solid var(--border-color);
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  min-width: 40px;
}

.tiptap-toolbar button.is-active {
  background: var(--accent);
  color: white;
  border-color: var(--accent);
}

.tiptap-toolbar button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.lang-select {
  padding: 4px 8px;
  border: 1px solid var(--border-color);
  background: white;
  border-radius: 4px;
  font-weight: 600;
  font-size: var(--text-sm);
  cursor: pointer;
}

.divider {
  width: 1px;
  background: var(--border-color);
  margin: 0 4px;
}
</style>
