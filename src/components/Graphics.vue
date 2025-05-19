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
            <img :src="elem.data.image" :alt="elem.name" class="l-icon" />
            <p :title="elem.name">{{ elem.name }}</p>
          </div>
        </template>
      </t-collapse-panel>
    </t-collapse>
  </div>
</template>

<script lang="ts" setup>
const graphicGroups = [
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
          name: 'square',
        },
      },
      {
        name: '矩形',
        icon: 'l-rectangle',
        id: 2,
        data: {
          width: 200,
          height: 50,
          borderRadius: 0.1,
          name: 'rectangle',
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
        },
      },
      {
        name: '消息框',
        icon: 'l-msg',
        id: 14,
        data: {
          textTop: -0.1,
          width: 100,
          height: 100,
          name: 'message',
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
        },
      },
      {
        name: '立方体',
        icon: 'l-cube',
        id: 18,
        data: {
          width: 60,
          height: 100,
          name: 'cube',
          z: 0.25,
          props: {
            custom: [
              {
                key: 'z',
                label: 'Z',
                type: 'number',
                min: 0,
                placeholder: '<= 1 即宽度的比例',
              },
              {
                key: 'backgroundFront',
                label: '前背景色',
                type: 'color',
              },
              {
                key: 'backgroundUp',
                label: '顶背景色',
                type: 'color',
              },
              {
                key: 'backgroundRight',
                label: '右背景色',
                type: 'color',
              },
            ],
          },
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
        },
      },
    ],
  },
  {
    name: '流程图',
    show: true,
    list: [
      {
        name: '开始/结束',
        icon: 'l-flow-start',
        id: 21,
        data: {
          text: '开始/结束',
          width: 120,
          height: 40,
          borderRadius: 0.5,
          name: 'rectangle',
        },
      },
      {
        name: '流程',
        icon: 'l-rectangle',
        id: 22,
        data: {
          text: '流程',
          width: 120,
          height: 40,
          name: 'rectangle',
        },
      },
      {
        name: '判定',
        icon: 'l-diamond',
        id: 23,
        data: {
          text: '判定',
          width: 120,
          height: 60,
          name: 'diamond',
        },
      },
      {
        name: '数据',
        icon: 'l-flow-data',
        id: 24,
        data: {
          text: '数据',
          width: 120,
          height: 50,
          name: 'flowData',
          offsetX: 0.14,
        },
      },
      {
        name: '准备',
        icon: 'l-flow-ready',
        id: 25,
        data: {
          text: '准备',
          width: 120,
          height: 50,
          name: 'hexagon',
        },
      },
      {
        name: '子流程',
        icon: 'l-flow-subprocess',
        id: 26,
        data: {
          text: '子流程',
          width: 120,
          height: 50,
          name: 'flowSubprocess',
        },
      },
      {
        name: '数据库',
        icon: 'l-db',
        id: 27,
        data: {
          text: '数据库',
          width: 80,
          height: 120,
          name: 'flowDb',
        },
      },
      {
        name: '文档',
        icon: 'l-flow-document',
        id: 28,
        data: {
          text: '文档',
          width: 120,
          height: 100,
          name: 'flowDocument',
        },
      },
      {
        name: '内部存储',
        icon: 'l-internal-storage',
        id: 29,
        data: {
          text: '内部存储',
          width: 120,
          height: 80,
          name: 'flowInternalStorage',
        },
      },
      {
        name: '外部存储',
        icon: 'l-extern-storage',
        id: 30,
        data: {
          text: '外部存储',
          width: 120,
          height: 80,
          name: 'flowExternStorage',
        },
      },
      {
        name: '队列',
        icon: 'l-flow-queue',
        id: 31,
        data: {
          text: '队列',
          width: 100,
          height: 100,
          name: 'flowQueue',
        },
      },
      {
        name: '手动输入',
        icon: 'l-flow-manually',
        id: 32,
        data: {
          text: '手动输入',
          width: 120,
          height: 80,
          name: 'flowManually',
        },
      },
      {
        name: '展示',
        icon: 'l-flow-display',
        id: 33,
        data: {
          text: '展示',
          width: 120,
          height: 80,
          name: 'flowDisplay',
        },
      },
      {
        name: '并行模式',
        icon: 'l-flow-parallel',
        id: 34,
        data: {
          text: '并行模式',
          width: 120,
          height: 50,
          name: 'flowParallel',
        },
      },
      {
        name: '注释',
        icon: 'l-flow-comment',
        id: 35,
        data: {
          text: '注释',
          width: 100,
          height: 100,
          name: 'flowComment',
        },
      },
    ],
  },
  {
    name: '活动图',
    show: true,
    list: [
      {
        name: '开始',
        icon: 'l-inital',
        id: 36,
        data: {
          text: '',
          width: 30,
          height: 30,
          name: 'circle',
          background: '#555',
          lineWidth: 0,
        },
      },
      {
        name: '结束',
        icon: 'l-final',
        id: 37,
        data: {
          width: 30,
          height: 30,
          name: 'activityFinal',
        },
      },
      {
        name: '活动',
        icon: 'l-action',
        id: 38,
        data: {
          text: '活动',
          width: 120,
          height: 50,
          borderRadius: 0.25,
          name: 'rectangle',
        },
      },
      {
        name: '决策/合并',
        icon: 'l-diamond',
        id: 39,
        data: {
          text: '决策/合并',
          width: 120,
          height: 50,
          name: 'diamond',
        },
      },
      {
        name: '垂直泳道',
        icon: 'l-swimlane-v',
        id: 40,
        data: {
          text: '垂直泳道',
          width: 200,
          height: 500,
          name: 'swimlaneV',
          textBaseline: 'top',
          textTop: 20,
          // textHeight: ,
          lineTop: 0.08,
        },
      },
      {
        name: '水平泳道',
        icon: 'l-swimlane-h',
        id: 41,
        data: {
          text: '水平泳道',
          width: 500,
          height: 200,
          name: 'swimlaneH',
          textWidth: 0.01,
          textLeft: 0.04,
          textAlign: 'left',
          lineLeft: 0.08,
        },
      },
      {
        name: '垂直分岔/汇合',
        icon: 'l-fork-v',
        id: 42,
        data: {
          text: '垂直分岔/汇合',
          width: 10,
          height: 150,
          name: 'forkV',
          fillStyle: '#555',
          strokeStyle: 'transparent',
        },
      },
      {
        name: '水平分岔/汇合',
        icon: 'l-fork',
        id: 43,
        data: {
          text: '水平分岔/汇合',
          width: 150,
          height: 10,
          name: 'forkH',
          fillStyle: '#555',
          strokeStyle: 'transparent',
        },
      },
    ],
  },
  {
    name: '时序图和类图',
    show: true,
    list: [
      {
        name: '生命线',
        icon: 'l-lifeline',
        id: 44,
        data: {
          text: '生命线',
          width: 150,
          height: 400,
          textHeight: 50,
          name: 'lifeline',
        },
      },
      {
        name: '激活',
        icon: 'l-focus',
        id: 45,
        data: {
          text: '激活',
          width: 12,
          height: 200,
          name: 'sequenceFocus',
        },
      },
      {
        name: '简单类',
        icon: 'l-simple-class',
        id: 46,
        data: {
          text: 'Topolgoy',
          width: 270,
          height: 200,
          textHeight: 200,
          name: 'simpleClass',
          textAlign: 'center',
          textBaseline: 'top',
          textTop: 10,
          list: [
            {
              text: '- name: string\n+ setName(name: string): void',
            },
          ],
        },
      },
      {
        name: '类',
        icon: 'l-class',
        id: 47,
        data: {
          text: 'Topolgoy',
          width: 270,
          height: 200,
          textHeight: 200,
          name: 'interfaceClass',
          textAlign: 'center',
          textBaseline: 'top',
          textTop: 10,
          list: [
            {
              text: '- name: string',
            },
            {
              text: '+ setName(name: string): void',
            },
          ],
        },
      },
    ],
  },
  {
    name: '故障树',
    show: true,
    list: [
      {
        name: '与门',
        icon: 'l-ANDmen',
        data: {
          name: 'andGate',
          width: 100,
          height: 150,
        },
      },
      {
        name: '基本事件',
        icon: 'l-jibenshijian',
        data: {
          name: 'basicEvent',
          width: 100,
          height: 150,
        },
      },
      {
        name: '未展开事件',
        icon: 'l-weizhankaishijian',
        data: {
          name: 'unexpandedEvent',
          width: 100,
          height: 150,
        },
      },
      {
        name: '优先AND门',
        icon: 'l-youxianANDmen',
        data: {
          name: 'priorityAndGate',
          width: 100,
          height: 150,
        },
      },
      {
        name: '禁止门',
        icon: 'l-jinzhimen',
        data: {
          name: 'forbiddenGate',
          width: 100,
          height: 150,
        },
      },
      {
        name: '事件',
        icon: 'l-shijian',
        data: {
          name: 'event',
          width: 100,
          height: 150,
        },
      },
      {
        name: '开关事件',
        icon: 'l-kaiguanshijian',
        data: {
          name: 'switchEvent',
          width: 100,
          height: 150,
        },
      },
      {
        name: '条件事件',
        icon: 'l-tiaojianshijian',
        data: {
          name: 'conditionalEvent',
          width: 150,
          height: 100,
        },
      },
      {
        name: '转移符号',
        icon: 'l-zhuanyifuhao',
        data: {
          name: 'transferSymbol',
          width: 100,
          height: 150,
        },
      },
      {
        name: '或门',
        icon: 'l-ORmen',
        data: {
          name: 'orGate',
          width: 100,
          height: 150,
        },
      },
      {
        name: '异或门',
        icon: 'l-yihuomen',
        data: {
          name: 'xorGate',
          width: 100,
          height: 150,
        },
      },
      {
        name: '表决门',
        icon: 'l-biaojuemen',
        data: {
          name: 'votingGate',
          width: 100,
          height: 150,
        },
      },
    ],
  },
  {
    name: '脑图',
    show: true,
    list: [
      {
        name: '主题',
        icon: 'l-zhuti',
        data: {
          text: '主题',
          width: 200,
          height: 50,
          name: 'mindNode',
          borderRadius: 0.5,
        },
      },
      {
        name: '子主题',
        icon: 'l-zizhuti',
        data: {
          text: '子主题',
          width: 160,
          height: 40,
          name: 'mindLine',
        },
      },
    ],
  },
];

const dragStart = (e: any, elem: any) => {
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

  img {
    width: 24px;
    height: 24px;
    color: #fff;
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
