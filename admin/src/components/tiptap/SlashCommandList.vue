<script setup lang="ts">
import { ref, watch } from 'vue'
import type { SlashCommandItem } from './SlashCommand'

const props = defineProps<{ items: SlashCommandItem[]; command: (item: SlashCommandItem) => void }>()

const selectedIndex = ref(0)

watch(() => props.items, () => { selectedIndex.value = 0 })

function selectItem(index: number) {
  const item = props.items[index]
  if (item) props.command(item)
}

function onKeyDown(event: KeyboardEvent): boolean {
  if (event.key === 'ArrowUp') {
    selectedIndex.value = (selectedIndex.value + props.items.length - 1) % props.items.length
    return true
  }
  if (event.key === 'ArrowDown') {
    selectedIndex.value = (selectedIndex.value + 1) % props.items.length
    return true
  }
  if (event.key === 'Enter') {
    selectItem(selectedIndex.value)
    return true
  }
  return false
}

defineExpose({ onKeyDown })
</script>

<template>
  <div class="slash-command-list" role="listbox" aria-label="Comandos de inserção de bloco">
    <button
      v-for="(item, index) in items"
      :key="item.title"
      type="button"
      role="option"
      class="slash-command-item"
      :class="{ 'is-selected': index === selectedIndex }"
      :aria-selected="index === selectedIndex"
      @click="selectItem(index)"
      @mouseenter="selectedIndex = index"
    >
      <i :class="item.icon" aria-hidden="true"></i>
      <span>{{ item.title }}</span>
    </button>
    <div v-if="items.length === 0" class="slash-command-empty">Nenhum comando encontrado</div>
  </div>
</template>

<style scoped>
.slash-command-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
  background: white;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 0.3rem;
  max-height: 320px;
  overflow-y: auto;
  min-width: 220px;
}

.slash-command-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  border: none;
  background: transparent;
  padding: 0.45rem 0.6rem;
  border-radius: 6px;
  cursor: pointer;
  text-align: left;
  font-size: var(--text-sm);
  color: var(--dark-800);
}

.slash-command-item i {
  width: 16px;
  text-align: center;
  color: var(--accent);
}

.slash-command-item.is-selected {
  background: var(--accent-light);
}

.slash-command-empty {
  padding: 0.5rem 0.6rem;
  color: var(--slate-400);
  font-size: var(--text-sm);
}
</style>
