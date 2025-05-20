<template>
  <div id="meta2d"></div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue';
import { Meta2d, Pen } from '@meta2d/core';
import { registerGraphics } from '@/components/Editor/registerDeviceIcons';
import { useSelection } from '@/services/selections';
import { preloadImage } from '@/config';

const { select } = useSelection();

const meta2dOptions = {
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

onMounted(async () => {
  console.log('View component mounted');
  
  // 创建实例
  window.meta2d = new Meta2d('meta2d', meta2dOptions);

  try {
    // 注册设备图标和图形库
    registerGraphics();

    // 预加载所有设备图标
    const iconPaths = [
      '/devices/valve.svg',
      '/devices/flowmeter.svg',
      '/devices/separator.svg',
      '/devices/pump.svg',
      '/devices/tank.svg',
      '/devices/tank2.svg',
      '/devices/gauge.svg',
      '/devices/filter.svg',
      '/devices/pump2.svg',
      '/devices/pool.svg',
      '/devices/drain.svg',
      '/devices/sludge.svg'
    ].map(path => import.meta.env.PROD ? `/thingtwin${path}` : path);

    await Promise.all(iconPaths.map(preloadImage));
    console.log('All device icons loaded');

    // 读取本地存储
    const savedData = localStorage.getItem('meta2d');
    if (savedData) {
      const data = JSON.parse(savedData);
      data.locked = location.pathname === '/preview' ? 1 : 0;
      meta2d.open(data);
    }

    // 添加事件监听
    meta2d.on('active', active);
    meta2d.on('inactive', inactive);
  } catch (error) {
    console.error('Error during initialization:', error);
  }
});

const active = (pens?: Pen[]) => {
  select(pens);
};

const inactive = () => {
  select();
};

onUnmounted(() => {
  if (meta2d) {
    meta2d.off('active', active);
    meta2d.off('inactive', inactive);
    meta2d.destroy();
  }
});
</script>

<style lang="postcss" scoped>
#meta2d {
  height: calc(100vh - 80px);
  width: 100%;
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
  fill: rgba(255, 255, 255, 0.1) !important;
  stroke-width: 2 !important;
}

:deep(.meta2d-pen:hover) {
  filter: drop-shadow(0 0 4px rgba(64, 196, 255, 0.5));
}

:deep(.meta2d-pen.active) {
  filter: drop-shadow(0 0 8px rgba(64, 196, 255, 0.5));
}
</style>
