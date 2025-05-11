<template>
  <div class="meta2d-editor-view">
    <div class="page-header bg-gray-900 p-4 flex justify-between items-center">
      <h1 class="text-2xl font-bold">污水处理系统组态编辑器</h1>
      <div class="flex gap-2">
        <button class="btn bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded">
          预览
        </button>
        <button class="btn bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded">
          发布
        </button>
      </div>
    </div>
    
    <Meta2dEditor />
  </div>
</template>

<script setup>
import Meta2dEditor from '../meta2d/Meta2dEditor.vue';
</script>

<style scoped>
.meta2d-editor-view {
  height: calc(100vh - 4rem);
  display: flex;
  flex-direction: column;
}

.page-header {
  border-bottom: 1px solid #333;
}
</style> 