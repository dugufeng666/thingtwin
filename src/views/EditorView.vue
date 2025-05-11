<template>
  <div class="editor-container h-[calc(100vh-8rem)]">
    <div class="flex h-full">
      <!-- 左侧组件库面板 -->
      <div class="component-panel w-64 bg-background-light p-4 border-r border-gray-700 overflow-y-auto">
        <h2 class="text-xl font-semibold mb-4">组件库</h2>
        
        <div class="mb-4">
          <div class="flex justify-between items-center mb-2">
            <h3 class="text-md font-medium">基础组件</h3>
            <button class="text-xs text-primary">全部</button>
          </div>
          <div class="grid grid-cols-3 gap-2">
            <div
              v-for="(item, index) in basicComponents"
              :key="index"
              class="component-item p-2 bg-gray-800 rounded cursor-pointer hover:bg-gray-700 flex flex-col items-center"
              draggable="true"
              @dragstart="onDragStart(item)"
            >
              <div class="icon-container w-10 h-10 flex items-center justify-center mb-1">
                <component :is="item.icon" class="w-8 h-8" />
              </div>
              <span class="text-xs text-center">{{ item.name }}</span>
            </div>
          </div>
        </div>

        <div class="mb-4">
          <div class="flex justify-between items-center mb-2">
            <h3 class="text-md font-medium">工业设备</h3>
            <button class="text-xs text-primary">全部</button>
          </div>
          <div class="grid grid-cols-3 gap-2">
            <div
              v-for="(item, index) in industrialComponents"
              :key="index"
              class="component-item p-2 bg-gray-800 rounded cursor-pointer hover:bg-gray-700 flex flex-col items-center"
              draggable="true"
              @dragstart="onDragStart(item)"
            >
              <div class="icon-container w-10 h-10 flex items-center justify-center mb-1">
                <img :src="item.icon" class="w-8 h-8" />
              </div>
              <span class="text-xs text-center">{{ item.name }}</span>
            </div>
          </div>
        </div>

        <div>
          <div class="flex justify-between items-center mb-2">
            <h3 class="text-md font-medium">我的组件</h3>
            <button class="btn btn-primary py-1 px-2 text-xs">上传</button>
          </div>
          <p v-if="!myComponents.length" class="text-gray-500 text-xs text-center py-4">
            还没有自定义组件，点击上传添加
          </p>
          <div v-else class="grid grid-cols-3 gap-2">
            <div
              v-for="(item, index) in myComponents"
              :key="index"
              class="component-item p-2 bg-gray-800 rounded cursor-pointer hover:bg-gray-700 flex flex-col items-center"
              draggable="true"
              @dragstart="onDragStart(item)"
            >
              <div class="icon-container w-10 h-10 flex items-center justify-center mb-1">
                <img :src="item.icon" class="w-8 h-8" />
              </div>
              <span class="text-xs text-center">{{ item.name }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 中间画布区域 -->
      <div class="flex-1 relative" ref="canvasContainer">
        <div class="absolute inset-0 bg-gray-900 grid bg-opacity-50" ref="canvasGrid"></div>
        <div ref="canvasWrapper" class="w-full h-full overflow-auto">
          <v-stage
            ref="stage"
            :config="stageConfig"
            @dragover.prevent
            @drop="onDrop"
            @click="onCanvasClick"
          >
            <v-layer ref="layer">
              <v-group
                v-for="(element, index) in elements"
                :key="index"
                :config="{
                  x: element.x,
                  y: element.y,
                  draggable: true,
                  id: element.id
                }"
                @dragend="handleDragEnd($event, index)"
                @click="selectElement(index)"
                @tap="selectElement(index)"
              >
                <v-rect
                  v-if="element.type === 'rect'"
                  :config="{
                    width: element.width,
                    height: element.height,
                    fill: element.fill,
                    stroke: element.stroke,
                    strokeWidth: 1
                  }"
                ></v-rect>
                <v-circle
                  v-else-if="element.type === 'circle'"
                  :config="{
                    radius: element.radius,
                    fill: element.fill,
                    stroke: element.stroke,
                    strokeWidth: 1
                  }"
                ></v-circle>
                <v-image
                  v-else-if="element.type === 'image'"
                  :config="{
                    image: loadedImages[element.id],
                    width: element.width,
                    height: element.height
                  }"
                ></v-image>
                <v-transformer
                  v-if="selectedElement === index"
                  :config="{
                    boundBoxFunc: (oldBox, newBox) => {
                      if (newBox.width < 5 || newBox.height < 5) {
                        return oldBox;
                      }
                      return newBox;
                    }
                  }"
                  @transform="handleTransform($event, index)"
                ></v-transformer>
              </v-group>
            </v-layer>
          </v-stage>
        </div>

        <!-- 工具栏 -->
        <div class="absolute top-4 right-4 bg-background-light rounded shadow-lg p-2 flex space-x-2">
          <button class="btn btn-primary text-sm py-1" @click="saveScene">保存</button>
          <button class="btn btn-secondary text-sm py-1" @click="loadScene">加载</button>
          <button class="btn bg-red-500 hover:bg-red-700 text-white text-sm py-1" @click="clearScene">清空</button>
        </div>
      </div>
      
      <!-- 右侧属性面板 -->
      <div class="property-panel w-64 bg-background-light p-4 border-l border-gray-700 overflow-y-auto">
        <h2 class="text-xl font-semibold mb-4">属性</h2>
        
        <template v-if="selectedElement !== null">
          <div class="space-y-4">
            <div class="space-y-1">
              <label class="text-sm text-gray-400">名称</label>
              <input 
                v-model="elements[selectedElement].name" 
                class="input w-full" 
              />
            </div>
            
            <div class="grid grid-cols-2 gap-2">
              <div class="space-y-1">
                <label class="text-sm text-gray-400">X 坐标</label>
                <input 
                  v-model.number="elements[selectedElement].x" 
                  type="number" 
                  class="input w-full" 
                />
              </div>
              <div class="space-y-1">
                <label class="text-sm text-gray-400">Y 坐标</label>
                <input 
                  v-model.number="elements[selectedElement].y" 
                  type="number" 
                  class="input w-full" 
                />
              </div>
            </div>
            
            <div v-if="elements[selectedElement].type !== 'circle'" class="grid grid-cols-2 gap-2">
              <div class="space-y-1">
                <label class="text-sm text-gray-400">宽度</label>
                <input 
                  v-model.number="elements[selectedElement].width" 
                  type="number" 
                  class="input w-full" 
                />
              </div>
              <div class="space-y-1">
                <label class="text-sm text-gray-400">高度</label>
                <input 
                  v-model.number="elements[selectedElement].height" 
                  type="number" 
                  class="input w-full" 
                />
              </div>
            </div>
            
            <div v-if="elements[selectedElement].type === 'circle'" class="space-y-1">
              <label class="text-sm text-gray-400">半径</label>
              <input 
                v-model.number="elements[selectedElement].radius" 
                type="number" 
                class="input w-full" 
              />
            </div>
            
            <div v-if="elements[selectedElement].type !== 'image'" class="space-y-1">
              <label class="text-sm text-gray-400">填充颜色</label>
              <div class="flex">
                <input 
                  v-model="elements[selectedElement].fill" 
                  type="color" 
                  class="w-10 h-10 bg-transparent border-0 cursor-pointer" 
                />
                <input 
                  v-model="elements[selectedElement].fill" 
                  type="text" 
                  class="input flex-1 ml-2" 
                />
              </div>
            </div>
            
            <div v-if="elements[selectedElement].type !== 'image'" class="space-y-1">
              <label class="text-sm text-gray-400">边框颜色</label>
              <div class="flex">
                <input 
                  v-model="elements[selectedElement].stroke" 
                  type="color" 
                  class="w-10 h-10 bg-transparent border-0 cursor-pointer" 
                />
                <input 
                  v-model="elements[selectedElement].stroke" 
                  type="text" 
                  class="input flex-1 ml-2" 
                />
              </div>
            </div>
            
            <div class="pt-4 border-t border-gray-700">
              <h3 class="text-md font-medium mb-2">数据绑定</h3>
              <div class="space-y-1">
                <label class="text-sm text-gray-400">数据源</label>
                <select v-model="elements[selectedElement].dataSource" class="input w-full">
                  <option value="">无</option>
                  <option value="device1">设备1</option>
                  <option value="device2">设备2</option>
                  <option value="device3">设备3</option>
                </select>
              </div>
              
              <div class="space-y-1 mt-2">
                <label class="text-sm text-gray-400">数据点</label>
                <select v-model="elements[selectedElement].dataPoint" class="input w-full">
                  <option value="">无</option>
                  <option value="temperature">温度</option>
                  <option value="pressure">压力</option>
                  <option value="flow">流量</option>
                  <option value="level">液位</option>
                  <option value="status">设备状态</option>
                  <option value="ph">pH值</option>
                  <option value="oxygen">溶解氧</option>
                  <option value="tss">悬浮固体</option>
                  <option value="cod">COD</option>
                  <option value="chlorine">余氯</option>
                  <option value="turbidity">浊度</option>
                  <option value="conductivity">电导率</option>
                </select>
              </div>
            </div>
            
            <div class="flex justify-end pt-4">
              <button class="btn bg-red-600 hover:bg-red-700 text-white" @click="deleteElement">删除</button>
            </div>
          </div>
        </template>
        
        <template v-else>
          <div class="text-gray-500 text-center py-10">
            <p>未选中任何元素</p>
            <p class="text-xs mt-2">点击画布中的元素来编辑其属性</p>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue';
import { v4 as uuidv4 } from 'uuid';

// 定义组件类型
interface Component {
  id: string;
  name: string;
  type: string;
  icon: string;
  defaultProps: any;
}

// 舞台配置
const stageConfig = reactive({
  width: 800,
  height: 600,
  draggable: false,
});

// 引用
const canvasContainer = ref<HTMLElement | null>(null);
const canvasWrapper = ref<HTMLElement | null>(null);
const stage = ref(null);
const layer = ref(null);

// 画布元素
const elements = ref<any[]>([]);
const selectedElement = ref<number | null>(null);
const loadedImages = ref<Record<string, HTMLImageElement>>({});

// 基础组件
const basicComponents = ref<Component[]>([
  {
    id: 'rect',
    name: '矩形',
    type: 'rect',
    icon: 'RectIcon', // 这里应该是一个实际的组件
    defaultProps: {
      width: 100,
      height: 100,
      fill: '#3B82F6',
      stroke: '#1D4ED8',
    },
  },
  {
    id: 'circle',
    name: '圆形',
    type: 'circle',
    icon: 'CircleIcon', // 这里应该是一个实际的组件
    defaultProps: {
      radius: 50,
      fill: '#10B981',
      stroke: '#059669',
    },
  },
  {
    id: 'text',
    name: '文本',
    type: 'text',
    icon: 'TextIcon', // 这里应该是一个实际的组件
    defaultProps: {
      text: '文本',
      fontSize: 16,
      fill: '#FFFFFF',
    },
  }
]);

// 工业组件
const industrialComponents = ref<Component[]>([
  {
    id: 'tank',
    name: '储罐',
    type: 'image',
    icon: '/components/symbols/tank.svg',
    defaultProps: {
      width: 100,
      height: 120,
      imageUrl: '/components/symbols/tank.svg',
    },
  },
  {
    id: 'pump',
    name: '泵',
    type: 'image',
    icon: '/components/symbols/pump.svg',
    defaultProps: {
      width: 80,
      height: 80,
      imageUrl: '/components/symbols/pump.svg',
    },
  },
  {
    id: 'valve',
    name: '阀门',
    type: 'image',
    icon: '/components/symbols/valve.svg',
    defaultProps: {
      width: 60,
      height: 60,
      imageUrl: '/components/symbols/valve.svg',
    },
  },
  {
    id: 'flowmeter',
    name: '流量计',
    type: 'image',
    icon: '/components/symbols/flowmeter.svg',
    defaultProps: {
      width: 80,
      height: 80,
      imageUrl: '/components/symbols/flowmeter.svg',
    },
  },
  {
    id: 'filter',
    name: '过滤器',
    type: 'image',
    icon: '/components/symbols/filter.svg',
    defaultProps: {
      width: 80,
      height: 100,
      imageUrl: '/components/symbols/filter.svg',
    },
  },
  {
    id: 'aeration',
    name: '曝气池',
    type: 'image',
    icon: '/components/symbols/aeration.svg',
    defaultProps: {
      width: 120,
      height: 100,
      imageUrl: '/components/symbols/aeration.svg',
    },
  },
  {
    id: 'settling',
    name: '沉淀池',
    type: 'image',
    icon: '/components/symbols/settling.svg',
    defaultProps: {
      width: 120,
      height: 100,
      imageUrl: '/components/symbols/settling.svg',
    },
  },
  {
    id: 'chlorination',
    name: '消毒池',
    type: 'image',
    icon: '/components/symbols/chlorination.svg',
    defaultProps: {
      width: 100,
      height: 100,
      imageUrl: '/components/symbols/chlorination.svg',
    },
  }
]);

// 我的组件
const myComponents = ref<Component[]>([]);

// 处理组件拖拽开始
const onDragStart = (component: Component) => {
  if (!event) return;
  const dragEvent = event as DragEvent;
  dragEvent.dataTransfer?.setData('componentData', JSON.stringify(component));
};

// 处理组件拖放到画布
const onDrop = (e: any) => {
  e.preventDefault();
  const event = e.evt as DragEvent;
  const componentData = event.dataTransfer?.getData('componentData');
  if (!componentData) return;
  
  const component = JSON.parse(componentData);
  
  const stage = e.target.getStage();
  const pointerPosition = stage.getPointerPosition();
  const stagePos = stage.position();
  
  // 计算相对于画布的实际位置
  const x = (pointerPosition.x - stagePos.x) / stage.scaleX();
  const y = (pointerPosition.y - stagePos.y) / stage.scaleY();
  
  addElement(component, x, y);
};

// 添加元素到画布
const addElement = async (component: Component, x: number, y: number) => {
  const id = uuidv4();
  
  // 创建基本元素
  const element = {
    id,
    name: component.name,
    type: component.type,
    x,
    y,
    ...component.defaultProps,
    dataSource: '',
    dataPoint: '',
  };
  
  // 如果是图像类型，加载图像
  if (component.type === 'image' && component.defaultProps.imageUrl) {
    await loadImage(id, component.defaultProps.imageUrl);
  }
  
  elements.value.push(element);
  
  // 选择新添加的元素
  selectedElement.value = elements.value.length - 1;
};

// 加载图像
const loadImage = (id: string, url: string): Promise<void> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      loadedImages.value[id] = img;
      resolve();
    };
    img.src = url;
  });
};

// 处理元素拖动结束
const handleDragEnd = (e: any, index: number) => {
  const node = e.target;
  elements.value[index].x = node.x();
  elements.value[index].y = node.y();
};

// 处理元素变换
const handleTransform = (e: any, index: number) => {
  const node = e.target;
  const scaleX = node.scaleX();
  const scaleY = node.scaleY();
  
  // 重置缩放，应用新的宽高
  node.scaleX(1);
  node.scaleY(1);
  
  const element = elements.value[index];
  
  if (element.type === 'rect' || element.type === 'image') {
    element.width = Math.max(5, node.width() * scaleX);
    element.height = Math.max(5, node.height() * scaleY);
  } else if (element.type === 'circle') {
    // 对于圆形，我们取两个缩放的平均值来缩放半径
    const avgScale = (scaleX + scaleY) / 2;
    element.radius = Math.max(5, element.radius * avgScale);
  }
  
  // 更新位置
  element.x = node.x();
  element.y = node.y();
};

// 处理画布点击
const onCanvasClick = (e: any) => {
  // 如果点击的是舞台背景，取消选择
  if (e.target === e.target.getStage()) {
    selectedElement.value = null;
  }
};

// 选择元素
const selectElement = (index: number) => {
  selectedElement.value = index;
};

// 删除元素
const deleteElement = () => {
  if (selectedElement.value !== null) {
    elements.value.splice(selectedElement.value, 1);
    selectedElement.value = null;
  }
};

// 保存场景
const saveScene = () => {
  const scene = {
    elements: elements.value,
    stageConfig: {
      width: stageConfig.width,
      height: stageConfig.height,
    }
  };
  
  localStorage.setItem('thingTwinScene', JSON.stringify(scene));
  alert('场景已保存');
};

// 加载场景
const loadScene = async () => {
  const savedScene = localStorage.getItem('thingTwinScene');
  if (!savedScene) {
    alert('没有找到保存的场景');
    return;
  }
  
  try {
    const scene = JSON.parse(savedScene);
    
    // 更新舞台配置
    if (scene.stageConfig) {
      stageConfig.width = scene.stageConfig.width;
      stageConfig.height = scene.stageConfig.height;
    }
    
    // 清除当前元素
    elements.value = [];
    
    // 加载图像
    for (const element of scene.elements) {
      if (element.type === 'image' && element.imageUrl) {
        await loadImage(element.id, element.imageUrl);
      }
    }
    
    // 添加元素
    elements.value = scene.elements;
    
    // 取消选择
    selectedElement.value = null;
  } catch (error) {
    console.error('加载场景失败:', error);
    alert('加载场景失败');
  }
};

// 清空场景
const clearScene = () => {
  if (confirm('确定要清空当前场景吗？这个操作无法撤销。')) {
    elements.value = [];
    selectedElement.value = null;
  }
};

// 调整舞台大小
const resizeStage = () => {
  if (!canvasContainer.value) return;
  
  const containerWidth = canvasContainer.value.clientWidth;
  const containerHeight = canvasContainer.value.clientHeight;
  
  stageConfig.width = containerWidth;
  stageConfig.height = containerHeight;
};

// 生命周期钩子
onMounted(() => {
  resizeStage();
  window.addEventListener('resize', resizeStage);
});

// 监视选中元素变化
watch(selectedElement, (newVal) => {
  if (newVal !== null) {
    // 通过 Konva 的 API 找到对应的 transformer 并附加到选中的元素
    const transformers = layer.value.findOne('Transformer');
    const node = stage.value.findOne(`#${elements.value[newVal].id}`);
    if (transformers && node) {
      transformers.nodes([node]);
    }
  }
});
</script>

<style scoped>
/* 自定义样式 */
</style> 