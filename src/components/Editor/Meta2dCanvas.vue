<template>
  <div class="meta2d-canvas">
    <div id="meta2d" class="meta2d"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted } from 'vue';
import { Meta2d } from '@meta2d/core';
import type { Options } from '@meta2d/core';
import { flowPens } from '@meta2d/flow-diagram';
import { activityDiagram } from '@meta2d/activity-diagram';
import { classPens } from '@meta2d/class-diagram';
import { sequencePens, sequencePensbyCtx } from '@meta2d/sequence-diagram';
import { formPens } from '@meta2d/form-diagram';

declare const window: any;

export default defineComponent({
  name: 'Meta2dCanvas',
  setup() {
    let meta2d: Meta2d;

    const meta2dOptions: Options = {
      grid: true,
      rule: true,
      background: '#1e1e1e',
    };

    onMounted(() => {
      meta2d = new Meta2d('meta2d', meta2dOptions);
      
      // 注册图形库
      meta2d.register(flowPens());
      meta2d.register(activityDiagram());
      meta2d.register(classPens());
      meta2d.register(sequencePens());
      meta2d.registerCanvasDraw(sequencePensbyCtx());
      meta2d.registerCanvasDraw(formPens());

      // 挂载到window，方便调试
      window.meta2d = meta2d;
    });

    onUnmounted(() => {
      if (meta2d) {
        meta2d.destroy();
      }
    });

    return {};
  },
});
</script>

<style scoped>
.meta2d-canvas {
  width: 100%;
  height: 100%;
  position: relative;
}

.meta2d {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
</style> 