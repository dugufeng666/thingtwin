<template>
  <div id="meta2d"></div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue';
import {
  Meta2d,
  Pen,
  register,
  registerAnchors,
  registerCanvasDraw,
} from '@meta2d/core';
import { flowPens, flowAnchors } from '@meta2d/flow-diagram';
import {
  activityDiagram,
  activityDiagramByCtx,
} from '@meta2d/activity-diagram';
import { classPens } from '@meta2d/class-diagram';
import { sequencePens, sequencePensbyCtx } from '@meta2d/sequence-diagram';
import { register as registerEcharts } from '@meta2d/chart-diagram';
import { formPens } from '@meta2d/form-diagram';
import { chartsPens } from '@meta2d/le5le-charts';
import { ftaPens, ftaPensbyCtx, ftaAnchors } from '@meta2d/fta-diagram';
import { registerGraphics } from '@/components/Editor/registerDeviceIcons';

import { useSelection } from '@/services/selections';

const { select } = useSelection();

const meta2dOptions: any = {
  rule: true,
  ruleColor: 'rgba(255, 255, 255, 0.2)',
  grid: true,
  gridColor: 'rgba(255, 255, 255, 0.08)',
  gridSize: 10,
  color: '#fff',
  activeColor: '#40C4FF',
  hoverColor: '#80D8FF',
  anchorColor: '#fff',
  anchorRadius: 4,
  anchorBackground: '#001529',
  background: '#001529',
  textColor: '#fff',
  font: {
    color: '#fff',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
};

onMounted(() => {
  // 创建实例
  new Meta2d('meta2d', meta2dOptions);

  // 注册设备图标
  registerGraphics();

  // 按需注册图形库
  // 以下为自带基础图形库
  register(flowPens());
  registerAnchors(flowAnchors());
  register(activityDiagram());
  registerCanvasDraw(activityDiagramByCtx());
  register(classPens());
  register(sequencePens());
  registerCanvasDraw(sequencePensbyCtx());
  registerEcharts();
  registerCanvasDraw(formPens());
  registerCanvasDraw(chartsPens());
  register(ftaPens());
  registerCanvasDraw(ftaPensbyCtx());
  registerAnchors(ftaAnchors());

  // 注册其他自定义图形库
  // ...

  // 读取本地存储
  let data: any = localStorage.getItem('meta2d');
  if (data) {
    data = JSON.parse(data);

    // 判断是否为运行查看，是-设置为预览模式
    if (location.pathname === '/preview') {
      data.locked = 1;
    } else {
      data.locked = 0;
    }
    meta2d.open(data);
  }

  meta2d.on('active', active);
  meta2d.on('inactive', inactive);
});

const active = (pens?: Pen[]) => {
  select(pens);
};

const inactive = () => {
  select();
};

onUnmounted(() => {
  meta2d.destroy();
});
</script>

<style lang="postcss" scoped>
#meta2d {
  height: calc(100vh - 80px);
  z-index: 1;
  background-color: #001529;
  box-shadow: inset 0 0 50px rgba(64, 196, 255, 0.1);
}

:deep(.meta2d-rule) {
  background-color: rgba(255, 255, 255, 0.03) !important;
}

:deep(.meta2d-rule-text) {
  color: rgba(255, 255, 255, 0.5) !important;
}

:deep(.meta2d-grid) {
  stroke: rgba(255, 255, 255, 0.08) !important;
}

:deep(.meta2d-pen) {
  stroke: #fff !important;
  fill: rgba(255, 255, 255, 0.1) !important;
}

:deep(.meta2d-pen:hover) {
  stroke: #40C4FF !important;
  filter: drop-shadow(0 0 4px rgba(64, 196, 255, 0.5));
}

:deep(.meta2d-pen.active) {
  stroke: #40C4FF !important;
  filter: drop-shadow(0 0 8px rgba(64, 196, 255, 0.5));
}
</style>
