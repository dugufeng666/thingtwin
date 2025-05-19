<template>
  <div class="app-props">
    <FileProps v-if="selections.mode === SelectionMode.File" />
    <PenProps v-else-if="selections.mode === SelectionMode.Pen" />
  </div>
</template>

<script lang="ts" setup>
import FileProps from './FileProps.vue';
import PenProps from './PenProps.vue';

import { useSelection, SelectionMode } from '@/services/selections';

const { selections } = useSelection();
</script>
<style lang="postcss" scoped>
.app-props {
  padding: 16px;
  background-color: #001529;
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  height: 100%;
  overflow-y: auto;

  :deep(.t-form__label) {
    color: rgba(255, 255, 255, 0.9) !important;
  }

  :deep(.t-input),
  :deep(.t-textarea),
  :deep(.t-select) {
    background-color: rgba(0, 24, 48, 0.8) !important;
    border-color: rgba(255, 255, 255, 0.15) !important;
    color: rgba(255, 255, 255, 0.9) !important;

    &::placeholder {
      color: rgba(255, 255, 255, 0.4) !important;
    }

    &:hover,
    &:focus {
      border-color: rgba(64, 196, 255, 0.5) !important;
      box-shadow: 0 0 8px rgba(64, 196, 255, 0.2) !important;
    }
  }

  :deep(.t-input__inner) {
    color: rgba(255, 255, 255, 0.9) !important;
  }

  :deep(.t-select-option) {
    background-color: rgba(0, 24, 48, 0.95) !important;
    color: rgba(255, 255, 255, 0.9) !important;

    &:hover,
    &.t-select-option--selected {
      background-color: rgba(255, 255, 255, 0.1) !important;
    }
  }

  :deep(.t-select__dropdown) {
    background-color: #001529 !important;
    border: 1px solid rgba(255, 255, 255, 0.15) !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3) !important;
  }
}

::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}

::-webkit-scrollbar-track {
  background: #001529;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>
