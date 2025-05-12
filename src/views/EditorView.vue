<template>
  <div class="editor-container h-[calc(100vh-8rem)]">
    <!-- 添加科技感标题 -->
    <div class="header-title">
      <span class="highlight">污水处理系统</span>数字孪生平台
      <div class="subtitle">Wastewater Treatment Digital Twin Platform</div>
      <div class="tech-line left"></div>
      <div class="tech-line right"></div>
    </div>
    
    <!-- 添加改进的工具栏 -->
    <div class="toolbar bg-gray-800 p-2 flex items-center space-x-2">
      <div class="left-tools flex space-x-2">
        <button @click="clearScene" class="btn bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded text-sm">
          <i class="fas fa-file"></i> 新建
        </button>
        <button @click="saveScene" class="btn bg-blue-600 hover:bg-blue-500 text-white px-2 py-1 rounded text-sm">
          <i class="fas fa-save"></i> 保存
        </button>
        <button @click="loadScene" class="btn bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded text-sm">
          <i class="fas fa-folder-open"></i> 打开
        </button>
      </div>
      <div class="divider border-l border-gray-600 h-6 mx-2"></div>
      <div class="draw-tools flex space-x-2">
        <button @click="setTool('select')" class="btn-icon" :class="{ 'active': activeTool === 'select' }">
          <i class="fas fa-mouse-pointer"></i>
        </button>
        <button @click="setTool('rect')" class="btn-icon" :class="{ 'active': activeTool === 'rect' }">
          <i class="fas fa-square"></i>
        </button>
        <button @click="setTool('circle')" class="btn-icon" :class="{ 'active': activeTool === 'circle' }">
          <i class="fas fa-circle"></i>
        </button>
        <button @click="setTool('line')" class="btn-icon" :class="{ 'active': activeTool === 'line' }">
          <i class="fas fa-minus"></i>
        </button>
        <button @click="setTool('text')" class="btn-icon" :class="{ 'active': activeTool === 'text' }">
          <i class="fas fa-font"></i>
        </button>
      </div>
      <div class="divider border-l border-gray-600 h-6 mx-2"></div>
      <div class="view-tools flex space-x-2">
        <button @click="zoomIn" class="btn-icon">
          <i class="fas fa-search-plus"></i>
        </button>
        <button @click="zoomOut" class="btn-icon">
          <i class="fas fa-search-minus"></i>
        </button>
        <button @click="resetZoom" class="btn-icon">
          <i class="fas fa-redo"></i>
        </button>
      </div>
      <div class="flex-1"></div>
      <div class="zoom-display px-3 py-1 bg-gray-700 rounded text-sm text-gray-300">
        缩放: {{ Math.round(scale * 100) }}%
      </div>
    </div>
    
    <div class="flex h-full">
      <!-- 左侧组件库面板 -->
      <div class="component-panel w-64 bg-background-light p-4 border-r border-gray-700 overflow-y-auto">
        <h2 class="text-xl font-semibold mb-4">组件库</h2>
        
        <!-- 标签页导航 -->
        <div class="tabs flex text-center text-xs">
          <div class="tab flex-1 py-2 border-b-2" :class="{'border-blue-500 text-blue-400': activeTab === 'water', 'border-transparent': activeTab !== 'water'}" @click="activeTab = 'water'">污水处理</div>
          <div class="tab flex-1 py-2 border-b-2" :class="{'border-blue-500 text-blue-400': activeTab === 'basic', 'border-transparent': activeTab !== 'basic'}" @click="activeTab = 'basic'">基础</div>
        </div>
        
        <!-- 搜索框 -->
        <div class="p-2">
          <div class="search-container relative">
            <input 
              type="text" 
              v-model="componentSearchQuery" 
              placeholder="搜索组件..." 
              class="w-full px-2 py-1 pl-7 bg-gray-700 rounded border border-gray-600 text-white text-xs"
            />
            <i class="fas fa-search absolute left-2 top-1.5 text-gray-400 text-xs"></i>
          </div>
        </div>
        
        <!-- 污水处理组件 -->
        <div v-show="activeTab === 'water'" class="p-2">
          <div class="components-grid">
            <div 
              v-for="(comp, index) in filteredWaterComponents" 
              :key="index"
              class="component cursor-pointer p-1 rounded flex flex-col items-center"
              draggable="true"
              @dragstart="onDragStart($event, comp)"
              @click="onComponentClick(comp)"
            >
              <img v-if="comp.data?.image" :src="comp.data.image" :alt="comp.name" class="w-10 h-10 mb-1" draggable="false" />
              <div v-else class="w-10 h-10 mb-1 flex items-center justify-center component-preview" draggable="false">
                <div v-if="comp.data?.rect" class="preview-rect" :style="{
                  background: comp.data.rect.fill || 'rgba(0, 102, 204, 0.6)',
                  borderColor: comp.data.rect.stroke || '#0066cc',
                  borderWidth: (comp.data.rect.strokeWidth || 2) + 'px'
                }"></div>
                <div v-else-if="comp.data?.ellipse" class="preview-circle" :style="{
                  background: comp.data.ellipse.fill || 'rgba(0, 102, 204, 0.6)',
                  borderColor: comp.data.ellipse.stroke || '#0066cc',
                  borderWidth: (comp.data.ellipse.strokeWidth || 2) + 'px'
                }"></div>
              </div>
              <span class="text-xs text-white text-center truncate w-full">{{ comp.name }}</span>
            </div>
          </div>
        </div>
        
        <!-- 基础组件 -->
        <div v-show="activeTab === 'basic'" class="p-2">
          <div class="grid grid-cols-3 gap-2">
            <div
              v-for="(item, index) in basicComponents"
              :key="index"
              class="component-item p-2 bg-gray-800 rounded cursor-pointer hover:bg-gray-700 flex flex-col items-center"
              draggable="true"
              @dragstart="(e) => onDragStart(e, item)"
            >
              <div class="icon-container w-10 h-10 flex items-center justify-center mb-1">
                <component :is="item.icon" class="w-8 h-8" />
              </div>
              <span class="text-xs text-center">{{ item.name }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 改进画布区域 -->
      <div class="canvas-container flex-1 relative" ref="canvasContainer">
        <div class="grid-overlay"></div>
        
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
                    boundBoxFunc: (oldBox: any, newBox: any) => {
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

        <!-- 坐标显示 -->
        <div class="absolute bottom-4 right-4 text-gray-400 text-sm">
          <div class="tech-info">
            <div class="info-item">
              <span class="info-label">坐标:</span>
              <span class="info-value">X: {{ mouseX || 0 }} Y: {{ mouseY || 0 }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">状态:</span>
              <span class="info-value status-normal">在线</span>
            </div>
          </div>
        </div>
        
        <!-- 科技感边框装饰 -->
        <div class="tech-border top-left"></div>
        <div class="tech-border top-right"></div>
        <div class="tech-border bottom-left"></div>
        <div class="tech-border bottom-right"></div>
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
import { ref, reactive, onMounted, onUnmounted, watch, computed } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import { wastewaterComponents, registerWastewaterIcons } from '../meta2d/wastewater-components';

// 定义组件类型
interface Component {
  id?: string;
  name: string;
  type?: string;
  icon?: string;
  data?: any;
  defaultProps?: any;
  width?: number;
  height?: number;
  image?: string;
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
const stage = ref<any>(null);
const layer = ref<any>(null);

// 鼠标位置
const mouseX = ref(0);
const mouseY = ref(0);

// 当前选中的工具
const activeTool = ref<string>('select');
// 缩放比例
const scale = ref<number>(1);

// 组件面板相关
const activeTab = ref('water'); // 'water' 或 'basic'
const componentSearchQuery = ref('');

// 污水处理组件列表
const waterComponents = ref<any[]>([]);

// 过滤水处理组件
const filteredWaterComponents = computed(() => {
  if (!componentSearchQuery.value) {
    return waterComponents.value;
  }
  const query = componentSearchQuery.value.toLowerCase();
  return waterComponents.value.filter(comp => 
    comp.name.toLowerCase().includes(query)
  );
});

// 画布元素
const elements = ref<any[]>([]);
const selectedElement = ref<number | null>(null);
const loadedImages = ref<Record<string, HTMLImageElement>>({});

// 更新鼠标移动处理
const updateMousePosition = (e: MouseEvent) => {
  if (!canvasContainer.value) return;
  const rect = canvasContainer.value.getBoundingClientRect();
  mouseX.value = Math.round(e.clientX - rect.left);
  mouseY.value = Math.round(e.clientY - rect.top);
};

// 设置当前工具
const setTool = (tool: string) => {
  activeTool.value = tool;
  
  // 清除选中状态
  selectedElement.value = null;
  
  // 根据工具类型设置舞台配置
  if (tool === 'select') {
    // 允许拖动元素
    stageConfig.draggable = false;
  } else {
    // 绘制模式时禁止拖动
    stageConfig.draggable = false;
  }
};

// 缩放功能
const zoomIn = () => {
  scale.value = Math.min(3, scale.value + 0.1);
  if (stage.value) {
    const stageInstance = stage.value.getStage();
    if (stageInstance) {
      stageInstance.scale({ x: scale.value, y: scale.value });
      stageInstance.batchDraw();
    }
  }
};

const zoomOut = () => {
  scale.value = Math.max(0.1, scale.value - 0.1);
  if (stage.value) {
    const stageInstance = stage.value.getStage();
    if (stageInstance) {
      stageInstance.scale({ x: scale.value, y: scale.value });
      stageInstance.batchDraw();
    }
  }
};

const resetZoom = () => {
  scale.value = 1;
  if (stage.value) {
    const stageInstance = stage.value.getStage();
    if (stageInstance) {
      stageInstance.scale({ x: 1, y: 1 });
      stageInstance.batchDraw();
    }
  }
};

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

// 初始化所有组件
const initComponents = () => {
  // 获取从wastewaterComponents中的组件
  const wasteComponents = wastewaterComponents();
  
  if (wasteComponents && wasteComponents.length > 0 && wasteComponents[0].children) {
    // 映射为组件格式
    waterComponents.value = wasteComponents[0].children;
    console.log('组件库初始化完成，总计:', waterComponents.value.length, '个组件');
  } else {
    console.warn('未能成功加载wastewater-components中的组件');
  }
};

// 元素拖拽开始
const onDragStart = (e: DragEvent, comp: any) => {
  console.log('拖拽开始，组件:', comp.name, '类型:', comp.type);
  
  // 设置拖拽效果
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'copy';
    
    try {
      // 序列化组件数据
      const compData = comp.data || {
        name: comp.name,
        width: comp.width,
        height: comp.height
      };
      
      const compStr = JSON.stringify(compData);
      console.log('序列化组件数据:', compStr);
      e.dataTransfer.setData('application/json', compStr);
    } catch (error) {
      console.error('设置拖拽数据失败:', error);
    }
  }
};

// 组件点击添加
const onComponentClick = (comp: any) => {
  console.log('组件点击:', comp.name);
  
  // 支持单击添加元素
  const centerX = (stageConfig.width / 2);
  const centerY = (stageConfig.height / 2);
  
  addElement(comp, centerX, centerY);
};

// 处理组件拖放到画布
const onDrop = (e: any) => {
  e.preventDefault();
  const event = e.evt as DragEvent;
  let componentData = '';
  
  // 尝试获取JSON数据
  try {
    componentData = event.dataTransfer?.getData('application/json') || '';
  } catch (error) {
    console.error('读取拖拽数据失败:', error);
    return;
  }
  
  if (!componentData) {
    console.warn('没有拖拽数据');
    return;
  }
  
  let component;
  try {
    component = JSON.parse(componentData);
  } catch (error) {
    console.error('解析拖拽数据失败:', error);
    return;
  }
  
  const stage = e.target.getStage();
  const pointerPosition = stage.getPointerPosition();
  const stagePos = stage.position();
  
  // 计算相对于画布的实际位置
  const x = (pointerPosition.x - stagePos.x) / stage.scaleX();
  const y = (pointerPosition.y - stagePos.y) / stage.scaleY();
  
  // 直接使用组件数据
  addElement({
    name: component.name || "组件", 
    data: component
  }, x, y);
};

// 添加元素到画布
const addElement = async (component: Component, x: number, y: number) => {
  const id = uuidv4();
  
  // 从组件中提取属性
  const compData = component.data || {};
  const compType = compData.rect ? 'rect' : 
                  compData.ellipse ? 'circle' : 
                  compData.image ? 'image' : 
                  component.type || 'rect';
                  
  // 默认属性
  const defaultWidth = compData.width || component.width || 100;
  const defaultHeight = compData.height || component.height || 100;
  const defaultName = compData.name || component.name || 'Element';
  
  // 创建基本元素
  let element: any = {
    id,
    name: defaultName,
    type: compType,
    x,
    y,
    width: defaultWidth,
    height: defaultHeight,
    dataSource: '',
    dataPoint: '',
  };
  
  // 根据类型设置特定属性
  if (compType === 'rect') {
    element = {
      ...element,
      fill: compData.rect?.fill || '#3B82F6',
      stroke: compData.rect?.stroke || '#1D4ED8',
      strokeWidth: compData.rect?.strokeWidth || 1,
    };
  } else if (compType === 'circle') {
    element = {
      ...element,
      radius: compData.width ? compData.width / 2 : 50,
      fill: compData.ellipse?.fill || '#10B981',
      stroke: compData.ellipse?.stroke || '#059669',
      strokeWidth: compData.ellipse?.strokeWidth || 1,
    };
  } else if (compType === 'image') {
    const imageUrl = compData.image || component.image;
    if (imageUrl) {
      await loadImage(id, imageUrl);
      element.imageUrl = imageUrl;
    }
  }
  
  console.log('添加元素:', element);
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
  
  // 添加鼠标移动监听
  if (canvasContainer.value) {
    canvasContainer.value.addEventListener('mousemove', updateMousePosition);
  }
  
  // 初始化污水处理组件
  registerWastewaterIcons();
  initComponents();
});

// 卸载时清理
onUnmounted(() => {
  window.removeEventListener('resize', resizeStage);
  
  // 移除鼠标移动监听
  if (canvasContainer.value) {
    canvasContainer.value.removeEventListener('mousemove', updateMousePosition);
  }
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
/* 添加科技感标题样式 */
.header-title {
  color: #00a0ff;
  text-shadow: 0 0 15px rgba(0, 160, 255, 0.7);
  font-size: 1.6rem;
  font-weight: bold;
  text-align: center;
  padding: 0.6rem 0;
  width: 100%;
  background: linear-gradient(to right, rgba(10, 25, 50, 0.7), rgba(10, 45, 90, 0.9), rgba(10, 25, 50, 0.7));
  letter-spacing: 2px;
  border-bottom: 1px solid rgba(0, 140, 255, 0.4);
  position: relative;
  overflow: hidden;
}

/* 给标题添加科技感光效 */
.header-title::before {
  content: '';
  position: absolute;
  top: 0;
  left: -150%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0, 180, 255, 0.2), transparent);
  transform: skewX(-25deg);
  animation: shine 5s infinite;
}

@keyframes shine {
  0% { left: -150%; }
  50% { left: 150%; }
  100% { left: 150%; }
}

/* 标题强调样式 */
.header-title .highlight {
  color: #00e5ff;
  text-shadow: 0 0 20px rgba(0, 200, 255, 0.9);
}

/* 英文副标题 */
.header-title .subtitle {
  font-size: 0.8rem;
  color: rgba(0, 180, 255, 0.7);
  margin-top: 0.1rem;
  font-weight: normal;
  letter-spacing: 2px;
}

/* 添加科技感装饰线 */
.tech-line {
  position: absolute;
  height: 2px;
  width: 15%;
  background: linear-gradient(90deg, transparent, #00c0ff, transparent);
}

.tech-line.left {
  left: 5%;
  bottom: 15px;
}

.tech-line.right {
  right: 5%;
  bottom: 15px;
}

/* 工具栏样式 */
.toolbar {
  user-select: none;
  background-color: #0c1428 !important; /* 深蓝色 */
  border-bottom: 1px solid rgba(0, 140, 255, 0.3);
}

/* 图标按钮 */
.btn-icon {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(15, 30, 60, 0.7);
  border: 1px solid rgba(0, 140, 255, 0.4);
  border-radius: 4px;
  color: #e6f7ff;
  transition: all 0.2s ease;
}

.btn-icon:hover {
  background-color: rgba(20, 40, 80, 0.8);
  border-color: #00a0ff;
  box-shadow: 0 0 8px rgba(0, 160, 255, 0.4);
}

.btn-icon.active {
  background-color: rgba(0, 102, 204, 0.8);
  border-color: #00ccff;
  box-shadow: 0 0 10px rgba(0, 160, 255, 0.6), inset 0 0 15px rgba(0, 180, 255, 0.4);
}

/* 按钮样式 */
.btn {
  background-color: rgba(15, 30, 60, 0.7) !important;
  border: 1px solid rgba(0, 140, 255, 0.5);
  transition: all 0.2s ease;
  backdrop-filter: blur(2px);
}
.btn:hover {
  background-color: rgba(20, 40, 80, 0.8) !important;
  border-color: #00a0ff;
  box-shadow: 0 0 8px rgba(0, 160, 255, 0.5), inset 0 0 15px rgba(0, 160, 255, 0.3);
}

/* 缩放显示 */
.zoom-display {
  font-family: monospace;
}

/* 画布容器 */
.canvas-container {
  background-color: #0a1122; /* 深邃的蓝黑色背景 */
  background-image: 
    radial-gradient(circle at 50% 50%, rgba(0, 120, 255, 0.1) 0%, transparent 80%),
    linear-gradient(rgba(0, 120, 255, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 120, 255, 0.05) 1px, transparent 1px);
  background-size: 100% 100%, 20px 20px, 20px 20px;
  box-shadow: inset 0 0 120px rgba(0, 80, 255, 0.15);
  border: 1px solid rgba(0, 140, 255, 0.3);
  position: relative;
  overflow: hidden;
}

/* 网格叠加层 */
.grid-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  background-image: radial-gradient(circle at 1px 1px, rgba(0, 140, 255, 0.1) 1px, transparent 0);
  background-size: 30px 30px;
  z-index: 1;
}

/* 添加科技感边框 */
.tech-border {
  position: absolute;
  width: 40px;
  height: 40px;
  border: 2px solid #00a0ff;
  pointer-events: none;
  z-index: 5;
}

.tech-border.top-left {
  top: 10px;
  left: 10px;
  border-right: none;
  border-bottom: none;
}

.tech-border.top-right {
  top: 10px;
  right: 10px;
  border-left: none;
  border-bottom: none;
}

.tech-border.bottom-left {
  bottom: 10px;
  left: 10px;
  border-right: none;
  border-top: none;
}

.tech-border.bottom-right {
  bottom: 10px;
  right: 10px;
  border-left: none;
  border-top: none;
}

/* 信息显示区样式 */
.tech-info {
  display: flex;
  flex-direction: column;
  background: rgba(8, 20, 40, 0.7);
  border: 1px solid rgba(0, 140, 255, 0.5);
  border-radius: 4px;
  padding: 8px 12px;
  backdrop-filter: blur(5px);
  color: #00c0ff;
  font-size: 0.8rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}

.info-label {
  color: rgba(220, 240, 255, 0.8);
  margin-right: 8px;
}

.info-value {
  color: #00e5ff;
  font-weight: 500;
}

.info-value.status-normal {
  color: #00e060;
}

/* 保留原有样式 */
</style> 