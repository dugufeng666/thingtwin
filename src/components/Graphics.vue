<template>
  <div class="graphics">
    <t-collapse :defaultExpandAll="true">
      <t-collapse-panel
        :header="item.name"
        v-for="item in graphicGroups"
        :key="item.name"
      >
        <template v-for="elem in item.list">
          <div
            class="graphic"
            :draggable="true"
            @dragstart="dragStart($event, elem)"
            @click.prevent="dragStart($event, elem)"
          >
            <template v-if="elem.data.image">
              <img :src="elem.data.image" :alt="elem.name" class="l-icon" />
            </template>
            <template v-else>
              <div :class="[elem.icon, 'l-icon']"></div>
            </template>
            <p :title="elem.name">{{ elem.name }}</p>
          </div>
        </template>
      </t-collapse-panel>
    </t-collapse>
  </div>
</template>

<script lang="ts" setup>
import { TextAlign, TextBaseline } from '@meta2d/core';

interface PenData {
  width: number;
  height: number;
  name: string;
  text?: string;
  image?: string;
  textPosition?: string;
  textColor?: string;
  borderRadius?: number;
  textTop?: number;
  z?: number;
  offsetX?: number;
  background?: string;
  textBaseline?: TextBaseline;
  textWidth?: number;
  textHeight?: number;
  textAlign?: TextAlign;
  textLeft?: number;
  lineTop?: number;
  lineLeft?: number;
  fillStyle?: string;
  strokeStyle?: string;
  lineWidth?: number;
  color?: string;
  list?: Array<{
    text: string;
  }>;
  props?: {
    custom: Array<{
      key: string;
      label: string;
      type: string;
      min?: number;
      placeholder?: string;
    }>;
  };
}

interface GraphicItem {
  name: string;
  icon: string;
  id?: string | number;
  data: PenData;
}

interface GraphicGroup {
  name: string;
  show: boolean;
  list: GraphicItem[];
}

const graphicGroups: GraphicGroup[] = [
  {
    name: '设备',
    show: true,
    list: [
      {
        name: '分集水器',
        icon: 'l-device-separator',
        id: 'device_1',
        data: {
          width: 100,
          height: 40,
          name: 'image',
          text: '分集水器',
          image: '/devices/separator.svg',
          textPosition: 'bottom',
          textColor: '#fff',
        },
      },
      {
        name: '加药泵',
        icon: 'l-device-pump',
        id: 'device_2',
        data: {
          width: 40,
          height: 80,
          name: 'image',
          text: '加药泵',
          image: '/devices/pump.svg',
          textPosition: 'bottom',
          textColor: '#fff',
        },
      },
      {
        name: '加药箱',
        icon: 'l-device-tank',
        id: 'device_3',
        data: {
          width: 60,
          height: 100,
          name: 'image',
          text: '加药箱',
          image: '/devices/tank.svg',
          textPosition: 'bottom',
          textColor: '#fff',
        },
      },
      {
        name: '加药箱2',
        icon: 'l-device-tank2',
        id: 'device_4',
        data: {
          width: 60,
          height: 100,
          name: 'image',
          text: '加药箱2',
          image: '/devices/tank2.svg',
          textPosition: 'bottom',
          textColor: '#fff',
        },
      },
      {
        name: '压力表',
        icon: 'l-device-gauge',
        id: 'device_5',
        data: {
          width: 60,
          height: 60,
          name: 'image',
          text: '压力表',
          image: '/devices/gauge.svg',
          textPosition: 'bottom',
          textColor: '#fff',
        },
      },
      {
        name: '压滤机',
        icon: 'l-device-filter',
        id: 'device_6',
        data: {
          width: 120,
          height: 40,
          name: 'image',
          text: '压滤机',
          image: '/devices/filter.svg',
          textPosition: 'bottom',
          textColor: '#fff',
        },
      },
      {
        name: '回流泵',
        icon: 'l-device-pump2',
        id: 'device_7',
        data: {
          width: 80,
          height: 40,
          name: 'image',
          text: '回流泵',
          image: '/devices/pump2.svg',
          textPosition: 'bottom',
          textColor: '#fff',
        },
      },
      {
        name: '废水池',
        icon: 'l-device-pool',
        id: 'device_8',
        data: {
          width: 120,
          height: 120,
          name: 'image',
          text: '废水池',
          image: '/devices/pool.svg',
          textPosition: 'bottom',
          textColor: '#fff',
        },
      },
      {
        name: '排水泵',
        icon: 'l-device-drain',
        id: 'device_9',
        data: {
          width: 80,
          height: 40,
          name: 'image',
          text: '排水泵',
          image: '/devices/drain.svg',
          textPosition: 'bottom',
          textColor: '#fff',
        },
      },
      {
        name: '污泥收集',
        icon: 'l-device-sludge',
        id: 'device_10',
        data: {
          width: 120,
          height: 120,
          name: 'image',
          text: '污泥收集',
          image: '/devices/sludge.svg',
          textPosition: 'bottom',
          textColor: '#fff',
        },
      },
      {
        name: '污泥泵',
        icon: 'l-device-sludge-pump',
        id: 'device_11',
        data: {
          width: 40,
          height: 100,
          name: 'image',
          text: '污泥泵',
          image: '/devices/sludge-pump.svg',
          textPosition: 'bottom',
          textColor: '#fff',
        },
      },
      {
        name: '沉淀池',
        icon: 'l-device-settling',
        id: 'device_12',
        data: {
          width: 150,
          height: 150,
          name: 'image',
          text: '沉淀池',
          image: '/devices/settling.svg',
          textPosition: 'bottom',
          textColor: '#fff',
        },
      },
    ],
  },
  {
    name: '基本形状',
    show: true,
    list: [
      {
        name: '正方形',
        icon: 'l-rect',
        id: 1,
        data: {
          width: 100,
          height: 100,
          name: 'rectangle',
          strokeStyle: 'rgb(0, 31, 151)'
        },
      },
      {
        name: '矩形',
        icon: 'l-rectangle',
        id: 2,
        data: {
          width: 200,
          height: 50,
          name: 'rectangle',
          borderRadius: 0.1,
          strokeStyle: 'rgb(0, 31, 151)'
        },
      },
      {
        name: '圆',
        icon: 'l-circle',
        id: 3,
        data: {
          width: 100,
          height: 100,
          name: 'circle',
          strokeStyle: 'rgb(0, 31, 151)'
        },
      },
      {
        name: '三角形',
        icon: 'l-triangle',
        id: 4,
        data: {
          width: 100,
          height: 100,
          name: 'triangle',
          strokeStyle: 'rgb(0, 31, 151)'
        },
      },
      {
        name: '菱形',
        icon: 'l-diamond',
        id: 5,
        data: {
          width: 100,
          height: 100,
          name: 'diamond',
          strokeStyle: 'rgb(0, 31, 151)'
        },
      },
      {
        name: '五边形',
        icon: 'l-pentagon',
        id: 6,
        data: {
          width: 100,
          height: 100,
          name: 'pentagon',
          strokeStyle: 'rgb(0, 31, 151)'
        },
      },
      {
        name: '六边形',
        icon: 'l-hexagon',
        id: 7,
        data: {
          width: 100,
          height: 100,
          name: 'hexagon',
          strokeStyle: 'rgb(0, 31, 151)'
        },
      },
      {
        name: '五角星',
        icon: 'l-pentagram',
        id: 8,
        data: {
          width: 100,
          height: 100,
          name: 'pentagram',
          strokeStyle: 'rgb(0, 31, 151)'
        },
      },
      {
        name: '左箭头',
        icon: 'l-arrow-left',
        id: 9,
        data: {
          width: 120,
          height: 60,
          name: 'leftArrow',
          strokeStyle: 'rgb(0, 31, 151)'
        },
      },
      {
        name: '右箭头',
        icon: 'l-arrow-right',
        id: 10,
        data: {
          width: 120,
          height: 60,
          name: 'rightArrow',
          strokeStyle: 'rgb(0, 31, 151)'
        },
      },
      {
        name: '双向箭头',
        icon: 'l-twoway-arrow',
        id: 11,
        data: {
          width: 150,
          height: 60,
          name: 'twowayArrow',
          strokeStyle: 'rgb(0, 31, 151)'
        },
      },
      {
        name: '云',
        icon: 'l-cloud',
        id: 13,
        data: {
          width: 100,
          height: 100,
          name: 'cloud',
          strokeStyle: 'rgb(0, 31, 151)'
        },
      },
      {
        name: '消息框',
        icon: 'l-msg',
        id: 14,
        data: {
          width: 100,
          height: 100,
          name: 'message',
          textTop: -0.1,
          strokeStyle: 'rgb(0, 31, 151)'
        },
      },
      {
        name: '文件',
        icon: 'l-file',
        id: 15,
        data: {
          width: 80,
          height: 100,
          name: 'file',
          strokeStyle: 'rgb(0, 31, 151)'
        },
      },
      {
        name: '立方体',
        icon: 'l-cube',
        id: 18,
        data: {
          width: 100,
          height: 100,
          name: 'cube',
          strokeStyle: 'rgb(0, 31, 151)'
        },
      },
      {
        name: '人',
        icon: 'l-people',
        id: 19,
        data: {
          width: 70,
          height: 100,
          name: 'people',
          strokeStyle: 'rgb(0, 31, 151)'
        },
      },
    ],
  },
];

const dragStart = (e: any, elem: GraphicItem) => {
  if (!elem) {
    return;
  }
  e.stopPropagation();

  // 拖拽事件
  if (e instanceof DragEvent) {
    // 设置拖拽数据
    e.dataTransfer?.setData('Meta2d', JSON.stringify(elem.data));
  } else {
    // 支持单击添加图元。平板模式
    meta2d.canvas.addCaches = [elem.data];
  }
};
</script>
<style lang="postcss" scoped>
.graphics {
  height: 100%;
  overflow-y: auto;
  background-color: #001529;
  border-right: 1px solid rgba(255, 255, 255, 0.1);

  :deep(.t-collapse) {
    border: none;
    background-color: transparent;

    .t-collapse-panel {
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      background-color: transparent;

      &__header {
        height: 48px;
        color: #fff;
        font-size: 14px;
        background-color: rgba(255, 255, 255, 0.03);
        transition: all 0.3s ease;

      &:hover {
          background-color: rgba(255, 255, 255, 0.08);
        }

        .t-collapse-panel__header-right {
          color: #fff;
        }
      }

      &__content {
        background-color: rgba(0, 24, 48, 0.8) !important;
        padding: 16px;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 12px;
      }
    }
  }
}

.graphic {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px;
  cursor: move;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.02);
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.08);
    box-shadow: 0 0 8px rgba(64, 196, 255, 0.2);
    transform: translateY(-1px);
  }

  .l-icon {
    width: 24px;
    height: 24px;
    color: rgb(0, 31, 151);
    display: inline-block;
  }

  img.l-icon {
    object-fit: contain;
  }

  div.l-icon {
    background-color: currentColor;
  }

  p {
    margin: 0;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.9);
    text-align: center;
    width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
    white-space: nowrap;
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
