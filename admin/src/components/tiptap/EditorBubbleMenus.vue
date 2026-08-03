<script setup lang="ts">
import { BubbleMenu } from '@tiptap/vue-3/menus'
import type { Editor } from '@tiptap/vue-3'
import type { TiptapCommands } from '../../composables/useTiptapCommands'

defineProps<{ editor: Editor; commands: TiptapCommands }>()
</script>

<template>
  <bubble-menu
    :editor="editor"
    class="bubble-menu"
  >
    <button
      type="button"
      @click="editor.chain().focus().toggleBold().run()"
      :class="{ 'is-active': editor.isActive('bold') }"
    >Bold</button>

    <button
      type="button"
      @click="editor.chain().focus().toggleItalic().run()"
      :class="{ 'is-active': editor.isActive('italic') }"
    >Italic</button>

    <button
      type="button"
      @click="commands.setLink"
      :class="{ 'is-active': editor.isActive('link') }"
    >Link</button>

    <button
      type="button"
      @click="editor.chain().focus().toggleCode().run()"
      :class="{ 'is-active': editor.isActive('code') }"
      title="Código em linha"
    >&lt;/&gt;</button>

    <button
       type="button"
       @click="editor.chain().focus().unsetAllMarks().run()"
       class="btn-clear"
    >Limpar</button>
  </bubble-menu>
  <bubble-menu
    :editor="editor"
    :options="{ placement: 'top' }"
    :should-show="({ editor: e }) => e.isActive('table')"
    class="bubble-menu-table"
  >
    <div class="btn-group">
      <button
        type="button"
        @click="editor.chain().focus().addColumnAfter().run()"
        title="Inserir Coluna (Direita)"
        class="btn-icon"
      >
        <i class="fas fa-columns"></i>
        <span class="mini-badge">+</span>
      </button>

      <button
        type="button"
        @click="editor.chain().focus().addRowAfter().run()"
        title="Inserir Linha (Abaixo)"
        class="btn-icon"
      >
        <i class="fas fa-bars"></i>
        <span class="mini-badge">+</span>
      </button>
    </div>

    <div class="menu-divider"></div>

    <div class="btn-group">
      <button
        type="button"
        @click="editor.chain().focus().deleteColumn().run()"
        title="Remover Coluna"
        class="btn-icon btn-danger"
      >
        <i class="fas fa-columns"></i>
        <span class="mini-badge">-</span>
      </button>

      <button
        type="button"
        @click="editor.chain().focus().deleteRow().run()"
        title="Remover Linha"
        class="btn-icon btn-danger"
      >
        <i class="fas fa-bars"></i>
        <span class="mini-badge">-</span>
      </button>
    </div>

    <div class="menu-divider"></div>

    <div class="btn-group">
      <button
        type="button"
        @click="editor.chain().focus().mergeCells().run()"
        title="Mesclar/Desmesclar Células"
        class="btn-text"
      >
        <i class="fas fa-expand-arrows-alt"></i>
      </button>

      <button
        type="button"
        @click="editor.chain().focus().deleteTable().run()"
        title="Excluir Tabela Inteira"
        class="btn-icon btn-danger"
      >
        <i class="fas fa-trash-alt"></i>
      </button>
    </div>
  </bubble-menu>
</template>

<style scoped>
.bubble-menu {
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

.bubble-menu button {
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

.bubble-menu button:hover {
  background-color: var(--slate-100);
  color: var(--dark-800);
}

.bubble-menu button.is-active {
  background-color: var(--accent-light);
  color: var(--accent);
}

.btn-clear {
  color: #e53e3e !important;
}

.btn-clear:hover {
  background-color: #fff5f5 !important;
}

/* === Table bubble menu === */
.bubble-menu-table {
  display: flex;
  align-items: center;
  background-color: var(--dark-800);
  padding: 0.3rem 0.5rem;
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
  gap: 0.5rem;
  z-index: 50;
}

.bubble-menu-table .btn-group {
  display: flex;
  gap: 2px;
  align-items: center;
}

.bubble-menu-table button {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: var(--slate-300);
  padding: 6px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 28px;
  height: 28px;
}

.bubble-menu-table button:hover {
  background-color: var(--dark-600);
  color: #fff;
}

.bubble-menu-table i {
  font-size: 0.9rem;
}

.mini-badge {
  position: absolute;
  top: 2px;
  right: 0px;
  font-size: 0.6rem;
  font-weight: bold;
  line-height: 1;
}

.bubble-menu-table .btn-danger:hover {
  background-color: rgba(229, 62, 62, 0.3);
  color: #fc8181;
}

.bubble-menu-table .menu-divider {
  width: 1px;
  height: 20px;
  background-color: var(--dark-600);
  margin: 0 2px;
}

.bubble-menu-table .btn-text {
  padding: 0 8px;
}
</style>
