<template>
  <div class="editor-container">
    <div class="toolbar">
      <!-- 工具栏将在后续添加 -->
    </div>
    <div class="main-content">
      <div class="left-panel">
        <!-- 左侧面板将在后续添加 -->
      </div>
      <div class="canvas-container">
        <Meta2dCanvas />
      </div>
      <div class="right-panel">
        <!-- 右侧面板将在后续添加 -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Meta2dCanvas from '@/components/Editor/Meta2dCanvas.vue';

export default defineComponent({
  name: 'Editor',
  components: {
    Meta2dCanvas,
  },
  setup() {
    return {};
  },
});
</script>

<style scoped>
.editor-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #1e1e1e;
}

.toolbar {
  height: 48px;
  background-color: #252526;
  border-bottom: 1px solid #333;
}

.main-content {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.left-panel {
  width: 240px;
  background-color: #252526;
  border-right: 1px solid #333;
}

.canvas-container {
  flex: 1;
  position: relative;
}

.right-panel {
  width: 240px;
  background-color: #252526;
  border-left: 1px solid #333;
}
</style> 