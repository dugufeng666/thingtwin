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
        <button @click="exportToJSON" class="btn bg-purple-600 hover:bg-purple-500 text-white px-2 py-1 rounded text-sm">
          <i class="fas fa-file-export"></i> 导出JSON
        </button>
        <button @click="triggerImportJSON" class="btn bg-green-600 hover:bg-green-500 text-white px-2 py-1 rounded text-sm">
          <i class="fas fa-file-import"></i> 导入JSON
        </button>
        <input 
          type="file" 
          ref="jsonFileInput" 
          accept=".json" 
          style="display: none" 
          @change="importFromJSON"
        />
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
        <button @click="setTool('connector')" class="btn-icon" :class="{ 'active': activeTool === 'connector' }">
          <i class="fas fa-project-diagram"></i>
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
              @click="onComponentClick(item)"
            >
              <div class="icon-container w-10 h-10 flex items-center justify-center mb-1 text-blue-400">
                <!-- 直接使用SVG渲染基础图形图标 -->
                <svg v-if="item.type === 'rect'" class="w-8 h-8" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" fill="currentColor" fill-opacity="0.3" stroke="currentColor" stroke-width="2" />
                </svg>
                <svg v-else-if="item.type === 'circle'" class="w-8 h-8" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" fill="currentColor" fill-opacity="0.3" stroke="currentColor" stroke-width="2" />
                </svg>
                <svg v-else-if="item.type === 'polygon' && item.id === 'triangle'" class="w-8 h-8" viewBox="0 0 24 24">
                  <polygon points="12,2 22,22 2,22" fill="currentColor" fill-opacity="0.3" stroke="currentColor" stroke-width="2" />
                </svg>
                <svg v-else-if="item.type === 'polygon' && item.id === 'diamond'" class="w-8 h-8" viewBox="0 0 24 24">
                  <polygon points="12,2 22,12 12,22 2,12" fill="currentColor" fill-opacity="0.3" stroke="currentColor" stroke-width="2" />
                </svg>
                <svg v-else-if="item.type === 'text'" class="w-8 h-8" viewBox="0 0 24 24">
                  <text x="12" y="16" text-anchor="middle" font-size="18" font-weight="bold" fill="currentColor">T</text>
                </svg>
                <svg v-else class="w-8 h-8" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" fill="currentColor" fill-opacity="0.3" stroke="currentColor" stroke-width="2" rx="2" ry="2" />
                </svg>
              </div>
              <span class="text-xs text-center truncate w-full">{{ item.name }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 改进画布区域 -->
      <div 
        class="canvas-container flex-1 relative" 
        ref="canvasContainer"
        @dragover.prevent="onCanvasDragOver"
        @dragleave.prevent="onCanvasDragLeave"
      >
        <div class="grid-overlay"></div>
        
        <div ref="canvasWrapper" class="w-full h-full overflow-auto">
          <v-stage
            ref="stage"
            :config="stageConfig"
            @dragover.prevent
            @dragenter.prevent
            @drop="onDrop"
            @click="onCanvasClick"
            @mousemove="updateMousePositionOnCanvas"
            @wheel="handleWheelZoom"
          >
            <v-layer ref="layer">
              <v-group
                v-for="(element, index) in elements"
                :key="index"
                :config="{
                  x: element.x,
                  y: element.y,
                  draggable: true,
                  id: element.id,
                  rotation: element.rotation || 0,
                  shadowColor: selectedElement === index ? 'rgba(0, 160, 255, 0.6)' : undefined,
                  shadowBlur: selectedElement === index ? 10 : undefined,
                  shadowOffset: selectedElement === index ? { x: 0, y: 0 } : undefined,
                  shadowOpacity: selectedElement === index ? 0.6 : undefined
                }"
                @dragend="handleDragEnd($event, index)"
                @click="selectElement(index)"
                @tap="selectElement(index)"
                @mouseenter="handleElementHover(index, true)"
                @mouseleave="handleElementHover(index, false)"
              >
                <v-rect
                  v-if="element.type === 'rect'"
                  :config="{
                    width: element.width,
                    height: element.height,
                    fill: element.fill,
                    stroke: element.stroke,
                    strokeWidth: element.strokeWidth || 1,
                    cornerRadius: element.cornerRadius || 0,
                    opacity: element.opacity !== undefined ? element.opacity : 1,
                    shadowColor: element.shadowColor,
                    shadowBlur: element.shadowBlur,
                    shadowOffset: element.shadowOffset,
                    shadowOpacity: element.shadowOpacity
                  }"
                ></v-rect>
                <v-circle
                  v-else-if="element.type === 'circle'"
                  :config="{
                    radius: element.radius,
                    fill: element.fill,
                    stroke: element.stroke,
                    strokeWidth: element.strokeWidth || 1,
                    opacity: element.opacity !== undefined ? element.opacity : 1,
                    shadowColor: element.shadowColor,
                    shadowBlur: element.shadowBlur,
                    shadowOffset: element.shadowOffset,
                    shadowOpacity: element.shadowOpacity
                  }"
                ></v-circle>
                <v-image
                  v-else-if="element.type === 'image'"
                  :config="{
                    image: loadedImages[element.id],
                    width: element.width,
                    height: element.height,
                    opacity: element.opacity !== undefined ? element.opacity : 1
                  }"
                ></v-image>
                <v-text
                  v-else-if="element.type === 'text'"
                  :config="{
                    text: element.text || 'Text',
                    fontSize: element.fontSize || 16,
                    fontFamily: element.fontFamily || 'Arial',
                    fill: element.fill || '#FFFFFF',
                    padding: element.padding || 5,
                    align: element.align || 'center',
                    opacity: element.opacity !== undefined ? element.opacity : 1
                  }"
                ></v-text>
                <v-line 
                  v-else-if="element.type === 'polygon'"
                  :config="{
                    points: element.points,
                    fill: element.fill,
                    stroke: element.stroke,
                    strokeWidth: element.strokeWidth || 1,
                    closed: true,
                    opacity: element.opacity !== undefined ? element.opacity : 1,
                    shadowColor: element.shadowColor,
                    shadowBlur: element.shadowBlur,
                    shadowOffset: element.shadowOffset,
                    shadowOpacity: element.shadowOpacity
                  }"
                ></v-line>
                <v-path 
                  v-else-if="element.type === 'path'"
                  :config="{
                    data: element.data,
                    fill: element.fill,
                    stroke: element.stroke,
                    strokeWidth: element.strokeWidth || 1,
                    opacity: element.opacity !== undefined ? element.opacity : 1
                  }"
                ></v-path>
                <v-transformer
                  v-if="selectedElement === index"
                  :config="{
                    boundBoxFunc: (oldBox: any, newBox: any) => {
                      if (newBox.width < 5 || newBox.height < 5) {
                        return oldBox;
                      }
                      return newBox;
                    },
                    rotateEnabled: true,
                    enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
                    anchorStroke: '#00a0ff',
                    anchorFill: '#0a1122',
                    anchorSize: 8,
                    borderStroke: '#00a0ff',
                    borderDash: [5, 5],
                    rotationSnaps: [0, 45, 90, 135, 180, 225, 270, 315]
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
import { ref, reactive, onMounted, onUnmounted, watch, computed, nextTick, h } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import { wastewaterComponents, registerWastewaterIcons } from '../meta2d/wastewater-components';
import Konva from 'konva';

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
// 当前连接线起点
const connectorStartPoint = ref<{ x: number; y: number; nodeId: string | null } | null>(null);
// 当前临时连接线
const tempConnector = ref<any>(null);
// 所有连接线
const connectors = ref<any[]>([]);
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

// 处理画布上的鼠标移动，显示考虑缩放的坐标
const updateMousePositionOnCanvas = (e: any) => {
  const stage = e.target.getStage();
  const pointerPosition = stage.getPointerPosition();
  const stagePos = stage.position();
  
  // 计算考虑缩放后的鼠标位置
  mouseX.value = Math.round((pointerPosition.x - stagePos.x) / scale.value);
  mouseY.value = Math.round((pointerPosition.y - stagePos.y) / scale.value);
};

// 处理滚轮缩放
const handleWheelZoom = (e: any) => {
  e.evt.preventDefault();
  
  const stage = e.target.getStage();
  const oldScale = scale.value;
  const pointerPosition = stage.getPointerPosition();
  const mousePointTo = {
    x: (pointerPosition.x - stage.x()) / oldScale,
    y: (pointerPosition.y - stage.y()) / oldScale
  };
  
  // 计算新的缩放比例
  const newScale = e.evt.deltaY < 0 ? oldScale * 1.1 : oldScale / 1.1;
  scale.value = Math.max(0.1, Math.min(newScale, 5));
  
  // 更新舞台位置和缩放
  stage.scale({ x: scale.value, y: scale.value });
  
  // 调整舞台位置以保持鼠标位置固定
  const newPos = {
    x: pointerPosition.x - mousePointTo.x * scale.value,
    y: pointerPosition.y - mousePointTo.y * scale.value
  };
  stage.position(newPos);
  stage.batchDraw();
};

// 处理元素悬停
const handleElementHover = (index: number, isHovering: boolean) => {
  if (selectedElement.value !== index) {
    const stageInstance = stage.value?.getStage();
    if (stageInstance) {
      const node = stageInstance.findOne(`#${elements.value[index].id}`);
      if (node) {
        // 在悬停时添加柔和发光效果
        node.shadowEnabled(isHovering);
        node.shadowColor(isHovering ? '#00a0ff' : undefined);
        node.shadowBlur(isHovering ? 10 : 0);
        node.shadowOpacity(isHovering ? 0.5 : 0);
        stageInstance.batchDraw();
      }
    }
  }
};

// 设置当前工具
const setTool = (tool: string) => {
  activeTool.value = tool;
  
  // 清除选中状态
  selectedElement.value = null;
  
  // 如果切换到连接线工具，需要设置舞台为可拖动
  if (tool === 'connector') {
    // 准备创建连接线
    if (stage.value) {
      const stageInstance = stage.value.getStage();
      
      // 添加鼠标移动监听，用于绘制临时连接线
      stageInstance.on('mousemove.connector', handleConnectorMouseMove);
      stageInstance.on('click.connector', handleConnectorClick);
    }
  } else {
    // 移除连接线相关的事件监听
    if (stage.value) {
      const stageInstance = stage.value.getStage();
      stageInstance.off('mousemove.connector');
      stageInstance.off('click.connector');
    }
    
    // 清除临时连接线
    if (tempConnector.value) {
      tempConnector.value.destroy();
      tempConnector.value = null;
    }
    
    // 重置连接线起点
    connectorStartPoint.value = null;
  }
  
  // 根据工具类型设置舞台配置
  if (tool === 'select') {
    // 允许拖动元素
    stageConfig.draggable = false;
  } else {
    // 绘制模式时禁止拖动
    stageConfig.draggable = false;
  }
};

// 处理连接线鼠标移动
const handleConnectorMouseMove = (e: any) => {
  if (activeTool.value !== 'connector' || !connectorStartPoint.value) return;
  
  const stage = e.target.getStage();
  const pointerPosition = stage.getPointerPosition();
  if (!pointerPosition) return;
  
  // 计算相对于画布的实际位置，考虑缩放和平移
  const endPoint = {
    x: (pointerPosition.x - stage.position().x) / scale.value,
    y: (pointerPosition.y - stage.position().y) / scale.value
  };
  
  // 如果已有临时线，更新它；否则创建新的临时线
  if (tempConnector.value) {
    tempConnector.value.points([
      connectorStartPoint.value.x,
      connectorStartPoint.value.y,
      endPoint.x,
      endPoint.y
    ]);
  } else {
    // 创建临时连接线
    if (layer.value) {
      tempConnector.value = new Konva.Line({
        points: [
          connectorStartPoint.value.x,
          connectorStartPoint.value.y,
          endPoint.x,
          endPoint.y
        ],
        stroke: '#00a0ff',
        strokeWidth: 2,
        dash: [5, 5],
        listening: false
      });
      
      layer.value.getStage().findOne('Layer').add(tempConnector.value);
      layer.value.getStage().batchDraw();
    }
  }
};

// 处理连接线点击
const handleConnectorClick = (e: any) => {
  if (activeTool.value !== 'connector') return;
  
  const stage = e.target.getStage();
  const pointerPosition = stage.getPointerPosition();
  if (!pointerPosition) return;
  
  // 计算相对于画布的实际位置，考虑缩放和平移
  const clickPoint = {
    x: (pointerPosition.x - stage.position().x) / scale.value,
    y: (pointerPosition.y - stage.position().y) / scale.value
  };
  
  // 检查点击的是否是某个节点
  let targetNodeId = null;
  const hitResult = stage.getIntersection(pointerPosition);
  if (hitResult && hitResult.getAttr('id')) {
    targetNodeId = hitResult.getAttr('id');
  }
  
  // 如果没有起点，设置起点
  if (!connectorStartPoint.value) {
    connectorStartPoint.value = {
      x: clickPoint.x,
      y: clickPoint.y,
      nodeId: targetNodeId
    };
    return;
  }
  
  // 如果有起点，创建连接线
  const connector = {
    id: uuidv4(),
    type: 'connector',
    fromX: connectorStartPoint.value.x,
    fromY: connectorStartPoint.value.y,
    toX: clickPoint.x,
    toY: clickPoint.y,
    fromNodeId: connectorStartPoint.value.nodeId,
    toNodeId: targetNodeId,
    stroke: '#00a0ff',
    strokeWidth: 2,
    lineDash: [0, 0],
    arrow: true
  };
  
  // 添加到连接线列表
  connectors.value.push(connector);
  
  // 移除临时连接线
  if (tempConnector.value) {
    tempConnector.value.destroy();
    tempConnector.value = null;
  }
  
  // 绘制新连接线
  if (layer.value) {
    const newLine = new Konva.Line({
      points: [connector.fromX, connector.fromY, connector.toX, connector.toY],
      stroke: connector.stroke,
      strokeWidth: connector.strokeWidth,
      id: connector.id,
      dash: connector.lineDash,
    });
    
    // 如果需要箭头
    if (connector.arrow) {
      newLine.setAttr('pointerLength', 10);
      newLine.setAttr('pointerWidth', 10);
      newLine.setAttr('pointerAtBeginning', false);
      newLine.setAttr('pointerAtEnding', true);
    }
    
    layer.value.getStage().findOne('Layer').add(newLine);
    layer.value.getStage().batchDraw();
  }
  
  // 重置连接线起点，准备下一条连接线
  connectorStartPoint.value = null;
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
    name: '正方形',
    type: 'rect',
    icon: 'RectIcon',
    defaultProps: {
      width: 80,
      height: 80,
      fill: '#3B82F6',
      stroke: '#1D4ED8',
    },
  },
  {
    id: 'rectangle',
    name: '矩形',
    type: 'rect',
    icon: 'RectIcon',
    defaultProps: {
      width: 120,
      height: 80,
      fill: '#3B82F6',
      stroke: '#1D4ED8',
    },
  },
  {
    id: 'circle',
    name: '圆形',
    type: 'circle',
    icon: 'CircleIcon',
    defaultProps: {
      radius: 50,
      fill: '#10B981',
      stroke: '#059669',
    },
  },
  {
    id: 'triangle',
    name: '三角形',
    type: 'polygon',
    icon: 'TriangleIcon',
    defaultProps: {
      points: [0, -50, 50, 50, -50, 50],
      fill: '#F59E0B',
      stroke: '#D97706',
    },
  },
  {
    id: 'diamond',
    name: '菱形',
    type: 'polygon',
    icon: 'DiamondIcon',
    defaultProps: {
      points: [0, -50, 50, 0, 0, 50, -50, 0],
      fill: '#8B5CF6',
      stroke: '#7C3AED',
    },
  },
  {
    id: 'pentagon',
    name: '五边形',
    type: 'polygon',
    icon: 'PentagonIcon',
    defaultProps: {
      points: [0, -50, 47, -15, 30, 40, -30, 40, -47, -15],
      fill: '#EC4899',
      stroke: '#DB2777',
    },
  },
  {
    id: 'hexagon',
    name: '六边形',
    type: 'polygon',
    icon: 'HexagonIcon',
    defaultProps: {
      points: [30, -50, 60, 0, 30, 50, -30, 50, -60, 0, -30, -50],
      fill: '#06B6D4',
      stroke: '#0891B2',
    },
  },
  {
    id: 'star',
    name: '五角星',
    type: 'polygon',
    icon: 'StarIcon',
    defaultProps: {
      points: [0, -50, 15, -15, 50, -15, 25, 10, 35, 50, 0, 25, -35, 50, -25, 10, -50, -15, -15, -15],
      fill: '#F59E0B',
      stroke: '#D97706',
    },
  },
  {
    id: 'leftArrow',
    name: '左箭头',
    type: 'polygon',
    icon: 'LeftArrowIcon',
    defaultProps: {
      points: [-50, 0, 0, 30, 0, 15, 50, 15, 50, -15, 0, -15, 0, -30],
      fill: '#EF4444',
      stroke: '#DC2626',
    },
  },
  {
    id: 'rightArrow',
    name: '右箭头',
    type: 'polygon',
    icon: 'RightArrowIcon',
    defaultProps: {
      points: [50, 0, 0, -30, 0, -15, -50, -15, -50, 15, 0, 15, 0, 30],
      fill: '#EF4444',
      stroke: '#DC2626',
    },
  },
  {
    id: 'doubleArrow',
    name: '双向箭头',
    type: 'polygon',
    icon: 'DoubleArrowIcon',
    defaultProps: {
      points: [50, 0, 30, -20, 30, -10, -30, -10, -30, -20, -50, 0, -30, 20, -30, 10, 30, 10, 30, 20],
      fill: '#EF4444',
      stroke: '#DC2626',
    },
  },
  {
    id: 'cloud',
    name: '云',
    type: 'path',
    icon: 'CloudIcon',
    defaultProps: {
      data: 'M 25,60 C 25,49.5 33,44 44,44 C 44,35 57.5,25.5 70,33 C 76,23.5 90,23.5 97,32 C 106,23 119,29.5 119.5,40 C 129,42.5 133.5,52.5 129,60 Z',
      fill: '#60A5FA',
      stroke: '#3B82F6',
    },
  },
  {
    id: 'speechBubble',
    name: '消息框',
    type: 'path',
    icon: 'SpeechBubbleIcon',
    defaultProps: {
      data: 'M 10,10 H 120 V 80 H 70 L 50,100 L 30,80 H 10 Z',
      fill: '#9CA3AF',
      stroke: '#6B7280',
    },
  },
  {
    id: 'document',
    name: '文件',
    type: 'path',
    icon: 'DocumentIcon',
    defaultProps: {
      data: 'M 20,10 H 80 L 100,30 V 110 H 20 Z M 80,10 V 30 H 100',
      fill: '#F3F4F6',
      stroke: '#9CA3AF',
    },
  },
  {
    id: 'cube',
    name: '立方体',
    type: 'path',
    icon: 'CubeIcon',
    defaultProps: {
      data: 'M 30,30 L 90,10 L 110,70 L 50,90 Z M 90,10 L 90,70 L 110,70 M 90,70 L 30,90 L 30,30',
      fill: '#8B5CF6',
      stroke: '#7C3AED',
    },
  },
  {
    id: 'person',
    name: '人物',
    type: 'path',
    icon: 'PersonIcon',
    defaultProps: {
      data: 'M 60,20 A 10,10 0 1 1 60,40 A 10,10 0 1 1 60,20 Z M 40,50 H 80 L 90,100 H 80 L 70,60 L 60,100 L 50,60 L 40,100 H 30 Z',
      fill: '#F3F4F6',
      stroke: '#9CA3AF',
    },
  },
  {
    id: 'text',
    name: '文本',
    type: 'text',
    icon: 'TextIcon',
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
  console.log('拖拽开始，组件:', comp.name);
  
  // 设置拖拽效果
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'copy';
    
    // 创建自定义拖拽图像以提高用户体验
    if (comp.data?.image || comp.image) {
      const img = new Image();
      img.src = comp.data?.image || comp.image;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 80;
        canvas.height = 80;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, 80, 80);
          ctx.globalAlpha = 0.7; // 半透明效果
          e.dataTransfer?.setDragImage(canvas, 40, 40);
        }
      };
    } else {
      // 为基础图形创建拖拽图像
      const canvas = document.createElement('canvas');
      canvas.width = 80;
      canvas.height = 80;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'rgba(59, 130, 246, 0.5)';
        ctx.strokeStyle = '#3B82F6';
        ctx.lineWidth = 2;
        
        if (comp.type === 'rect') {
          ctx.fillRect(10, 10, 60, 60);
          ctx.strokeRect(10, 10, 60, 60);
        } else if (comp.type === 'circle') {
          ctx.beginPath();
          ctx.arc(40, 40, 30, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        } else if (comp.type === 'polygon' && comp.id === 'triangle') {
          ctx.beginPath();
          ctx.moveTo(40, 10);
          ctx.lineTo(70, 70);
          ctx.lineTo(10, 70);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }
        
        e.dataTransfer?.setDragImage(canvas, 40, 40);
      }
    }
    
    try {
      // 序列化组件数据 - 使用与Meta2d兼容的方式
      const compData = {
        id: uuidv4(),
        type: comp.type || (comp.data?.rect ? 'rect' : comp.data?.ellipse ? 'circle' : 'image'),
        name: comp.name || '组件',
        width: comp.width || comp.data?.width || comp.defaultProps?.width || 100,
        height: comp.height || comp.data?.height || comp.defaultProps?.height || 100,
        image: comp.data?.image || comp.image,
        data: comp.data || {},
        defaultProps: comp.defaultProps || {}
      };
      
      const compStr = JSON.stringify(compData);
      console.log('序列化组件数据:', compStr);
      
      // 设置两种数据格式，确保兼容性
      e.dataTransfer.setData('application/json', compStr);
      e.dataTransfer.setData('Meta2d', compStr);
      e.dataTransfer.setData('text/plain', compStr); // 兼容某些浏览器
      
      // 设置一个样式类标识拖拽状态
      document.body.classList.add('dragging');
    } catch (error) {
      console.error('设置拖拽数据失败:', error);
    }
  }
};

// 处理组件拖放到画布
const onDrop = (e: any) => {
  e.preventDefault();
  document.body.classList.remove('dragging');
  if (canvasContainer.value) {
    canvasContainer.value.classList.remove('drag-over');
  }
  
  // 直接从事件对象获取dataTransfer
  const dataTransfer = e.evt?.dataTransfer || e.dataTransfer;
  if (!dataTransfer) {
    console.error('无法获取dataTransfer对象');
    return;
  }
  
  let componentData = '';
  
  // 首先尝试Meta2d格式数据，这样可以兼容Meta2dEditor
  try {
    componentData = dataTransfer.getData('Meta2d') || '';
    console.log('Meta2d数据:', componentData);
  } catch (error) {
    console.warn('没有Meta2d格式数据');
  }
  
  // 如果没有Meta2d格式，尝试获取JSON格式
  if (!componentData) {
    try {
      componentData = dataTransfer.getData('application/json') || '';
      console.log('JSON数据:', componentData);
    } catch (error) {
      console.error('读取拖拽数据失败:', error);
      return;
    }
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
  
  if (!component) {
    console.warn('无效的组件数据');
    return;
  }
  
  // 确保stage是有效的
  const stageInstance = e.target ? e.target.getStage() : (e.currentTarget ? e.currentTarget.getStage() : null);
  if (!stageInstance) {
    console.error('无法获取舞台实例');
    return;
  }
  
  // 获取鼠标位置 - 处理不同的事件对象格式
  let pointerPosition;
  if (e.evt) {
    // Vue-Konva事件格式
    pointerPosition = stageInstance.getPointerPosition();
  } else {
    // 原生事件格式
    const rect = stageInstance.container().getBoundingClientRect();
    pointerPosition = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }
  
  if (!pointerPosition) {
    console.warn('无法获取鼠标位置');
    return;
  }
  
  // 获取当前舞台的位置和缩放
  const stagePos = stageInstance.position();
  const stageScale = scale.value;
  
  // 关键修复：正确计算相对于画布的实际位置，考虑缩放和平移
  const x = (pointerPosition.x - stagePos.x) / stageScale;
  const y = (pointerPosition.y - stagePos.y) / stageScale;
  
  // 网格对齐，有助于元素更精确放置
  const gridSize = 10;
  const alignedX = Math.round(x / gridSize) * gridSize;
  const alignedY = Math.round(y / gridSize) * gridSize;
  
  console.log(`放置元素 - 原始坐标:(${x}, ${y}), 对齐后:(${alignedX}, ${alignedY})`);
  
  // 添加元素到舞台
  const addedElement = addElement(component, alignedX, alignedY);
  
  // 确保添加后立即渲染更新舞台
  if (stageInstance) {
    stageInstance.batchDraw();
  }
  
  // 显示添加成功的视觉反馈
  showDropFeedback(alignedX, alignedY);
  
  return addedElement;
};

// 显示拖放反馈效果
const showDropFeedback = (x: number, y: number) => {
  if (!stage.value) return;
  
  const feedbackLayer = new Konva.Layer();
  const circle = new Konva.Circle({
    x: x,
    y: y,
    radius: 30,
    fill: 'rgba(0, 160, 255, 0.3)',
    stroke: '#00a0ff',
    strokeWidth: 2,
    opacity: 0.8
  });
  
  feedbackLayer.add(circle);
  stage.value.getStage().add(feedbackLayer);
  
  // 动画效果
  const anim = new Konva.Animation((frame: any) => {
    if (!frame) return;
    circle.radius(circle.radius() + frame.timeDiff * 0.1);
    circle.opacity(circle.opacity() - frame.timeDiff * 0.001);
    
    if (circle.opacity() <= 0) {
      anim.stop();
      feedbackLayer.destroy();
    }
  }, feedbackLayer);
  
  anim.start();
};

// 组件点击添加
const onComponentClick = (comp: any) => {
  console.log('组件点击:', comp.name);
  
  // 支持单击添加元素
  // 根据当前视口计算添加位置
  let centerX = stageConfig.width / 2;
  let centerY = stageConfig.height / 2;
  
  if (stage.value) {
    const stageInstance = stage.value.getStage();
    const viewportCenter = {
      x: stageInstance.width() / 2,
      y: stageInstance.height() / 2
    };
    
    // 改进: 正确计算视口中心在画布中的位置，考虑缩放和平移
    centerX = (viewportCenter.x - stageInstance.position().x) / scale.value;
    centerY = (viewportCenter.y - stageInstance.position().y) / scale.value;
    
    // 网格对齐
    const gridSize = 10;
    centerX = Math.round(centerX / gridSize) * gridSize;
    centerY = Math.round(centerY / gridSize) * gridSize;
  }
  
  // 创建完整的组件数据
  const componentData = {
    id: uuidv4(),
    type: comp.type || (comp.data?.rect ? 'rect' : comp.data?.ellipse ? 'circle' : 'image'),
    name: comp.name || '组件',
    width: comp.width || comp.data?.width || 100,
    height: comp.height || comp.data?.height || 100,
    image: comp.data?.image || comp.image,
    data: comp.data || {},
    defaultProps: comp.defaultProps || {}
  };
  
  // 添加元素并确保渲染更新
  const addedElement = addElement(componentData, centerX, centerY);
  nextTick(() => {
    if (stage.value) {
      const stageInstance = stage.value.getStage();
      stageInstance.batchDraw();
    }
  });
  
  // 显示添加成功的视觉反馈
  showDropFeedback(centerX, centerY);
};

// 添加元素到画布 - 修复元素定位问题
const addElement = async (component: any, x: number, y: number) => {
  // 如果已经有ID则使用，否则生成新ID
  const id = component.id || uuidv4();
  
  // 确定组件类型
  const compData = component.data || {};
  const defaultProps = component.defaultProps || {};
  const compType = component.type || 
                 (compData.rect ? 'rect' : 
                 compData.ellipse ? 'circle' : 
                 compData.image ? 'image' : 'rect');
                  
  // 默认属性
  const defaultWidth = component.width || compData.width || defaultProps.width || 100;
  const defaultHeight = component.height || compData.height || defaultProps.height || 100;
  const defaultName = component.name || compData.name || 'Element';
  
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
    rotation: 0,
  };
  
  // 根据类型设置特定属性
  if (compType === 'rect') {
    element = {
      ...element,
      fill: compData.rect?.fill || defaultProps.fill || '#3B82F6',
      stroke: compData.rect?.stroke || defaultProps.stroke || '#1D4ED8',
      strokeWidth: compData.rect?.strokeWidth || defaultProps.strokeWidth || 1,
      cornerRadius: compData.rect?.cornerRadius || defaultProps.cornerRadius || 0,
      opacity: 1,
    };
  } else if (compType === 'circle') {
    element = {
      ...element,
      radius: defaultProps.radius || compData.width ? compData.width / 2 : 50,
      fill: compData.ellipse?.fill || defaultProps.fill || '#10B981',
      stroke: compData.ellipse?.stroke || defaultProps.stroke || '#059669',
      strokeWidth: compData.ellipse?.strokeWidth || defaultProps.strokeWidth || 1,
      opacity: 1,
    };
  } else if (compType === 'polygon') {
    element = {
      ...element,
      points: defaultProps.points || [],
      fill: defaultProps.fill || '#8B5CF6',
      stroke: defaultProps.stroke || '#7C3AED',
      strokeWidth: defaultProps.strokeWidth || 1,
      opacity: 1,
    };
  } else if (compType === 'path') {
    element = {
      ...element,
      data: defaultProps.data || '',
      fill: defaultProps.fill || '#60A5FA',
      stroke: defaultProps.stroke || '#3B82F6',
      strokeWidth: defaultProps.strokeWidth || 1,
      opacity: 1,
    };
  } else if (compType === 'image') {
    const imageUrl = compData.image || component.image;
    if (imageUrl) {
      try {
        await loadImage(id, imageUrl);
        element.imageUrl = imageUrl;
      } catch (error) {
        console.error('加载图像失败:', error);
      }
    }
  } else if (compType === 'text') {
    element = {
      ...element,
      text: defaultProps.text || 'Text',
      fontSize: defaultProps.fontSize || 16,
      fontFamily: defaultProps.fontFamily || 'Arial',
      fill: defaultProps.fill || '#FFFFFF',
      align: defaultProps.align || 'center',
      padding: defaultProps.padding || 5,
      opacity: 1,
    };
  }
  
  console.log('添加元素:', element);
  elements.value.push(element);
  
  // 选择新添加的元素
  selectedElement.value = elements.value.length - 1;
  
  // 通知用户界面更新
  nextTick(() => {
    if (stage.value) {
      stage.value.getStage().batchDraw();
    }
  });
  
  return element;
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
  
  // 获取元素的新位置
  const newX = node.x();
  const newY = node.y();
  
  // 网格对齐
  const gridSize = 10;
  const alignedX = Math.round(newX / gridSize) * gridSize;
  const alignedY = Math.round(newY / gridSize) * gridSize;
  
  // 更新元素位置并确保其固定在画布上
  elements.value[index].x = alignedX;
  elements.value[index].y = alignedY;
  
  // 设置节点位置，确保节点位置和数据保持一致
  node.position({
    x: alignedX,
    y: alignedY
  });
  
  // 确保舞台重新渲染
  if (stage.value) {
    stage.value.getStage().batchDraw();
  }
  
  console.log(`元素 ${elements.value[index].name} 已固定在位置 (${alignedX}, ${alignedY})`);
};

// 选择元素
const selectElement = (index: number) => {
  selectedElement.value = index;
  
  // 使用 nextTick 确保 DOM 已更新
  nextTick(() => {
    if (stage.value && layer.value) {
      const transformers = layer.value.getStage().find('Transformer');
      if (transformers.length > 0) {
        const transformer = transformers[0];
        const node = stage.value.getStage().findOne(`#${elements.value[index].id}`);
        if (node) {
          // 配置transformer的外观
          transformer.anchorStroke('#00a0ff');
          transformer.anchorFill('#0a1122');
          transformer.anchorSize(8);
          transformer.borderStroke('#00a0ff');
          transformer.borderWidth(1);
          transformer.enabledAnchors(['top-left', 'top-right', 'bottom-left', 'bottom-right']);
          transformer.rotateEnabled(true);
          
          // 设置要变换的节点
          transformer.nodes([node]);
          transformer.moveToTop();
          layer.value.getStage().batchDraw();
        }
      }
    }
  });
};

// 处理元素变换
const handleTransform = (e: any, index: number) => {
  const node = e.target;
  const scaleX = node.scaleX();
  const scaleY = node.scaleY();
  const rotation = node.rotation();
  
  // 重置缩放，应用新的宽高
  node.scaleX(1);
  node.scaleY(1);
  
  const element = elements.value[index];
  
  if (element.type === 'rect' || element.type === 'image') {
    element.width = Math.max(5, node.width() * scaleX);
    element.height = Math.max(5, node.height() * scaleY);
    element.rotation = rotation; // 保存旋转角度
  } else if (element.type === 'circle') {
    // 对于圆形，我们取两个缩放的平均值来缩放半径
    const avgScale = (scaleX + scaleY) / 2;
    element.radius = Math.max(5, element.radius * avgScale);
    element.rotation = rotation; // 保存旋转角度
  } else if (element.type === 'polygon') {
    // 对于多边形，我们需要缩放每个点
    if (element.points && Array.isArray(element.points)) {
      const newPoints = [];
      for (let i = 0; i < element.points.length; i += 2) {
        const x = element.points[i] * scaleX;
        const y = element.points[i + 1] * scaleY;
        newPoints.push(x, y);
      }
      element.points = newPoints;
    }
    element.rotation = rotation;
  } else if (element.type === 'path') {
    // 路径形状需要特殊处理，通过宽高比例缩放
    element.width = Math.max(5, node.width() * scaleX);
    element.height = Math.max(5, node.height() * scaleY);
    element.scaleX = scaleX;
    element.scaleY = scaleY;
    element.rotation = rotation;
  } else if (element.type === 'text') {
    element.width = Math.max(5, node.width() * scaleX);
    element.height = Math.max(5, node.height() * scaleY);
    element.fontSize = Math.max(8, element.fontSize * Math.min(scaleX, scaleY));
    element.rotation = rotation;
  }
  
  // 网格对齐
  const gridSize = 10;
  const alignedX = Math.round(node.x() / gridSize) * gridSize;
  const alignedY = Math.round(node.y() / gridSize) * gridSize;
  
  // 更新位置
  element.x = alignedX;
  element.y = alignedY;
  
  // 设置节点位置，确保节点位置和数据保持一致
  node.position({
    x: alignedX,
    y: alignedY
  });
  
  // 确保舞台重新渲染
  if (stage.value) {
    stage.value.getStage().batchDraw();
  }
};

// 处理画布点击
const onCanvasClick = (e: any) => {
  // 如果点击的是舞台背景，取消选择
  if (e.target === e.target.getStage()) {
    selectedElement.value = null;
  }
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
    connectors: connectors.value,
    stageConfig: {
      width: stageConfig.width,
      height: stageConfig.height,
    },
    version: '1.0.0',
    timestamp: new Date().toISOString()
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
    
    // 清除当前元素和连接线
    elements.value = [];
    connectors.value = [];
    
    // 清除Konva上现有的所有连接线
    if (layer.value) {
      layer.value.getStage().find('Line').forEach((line: any) => {
        if (line.id() !== 'tempConnector') {
          line.destroy();
        }
      });
    }
    
    // 加载图像
    for (const element of scene.elements) {
      if (element.type === 'image' && element.imageUrl) {
        await loadImage(element.id, element.imageUrl);
      }
    }
    
    // 添加元素
    elements.value = scene.elements;
    
    // 添加连接线
    if (scene.connectors && Array.isArray(scene.connectors)) {
      connectors.value = scene.connectors;
      
      // 重建连接线视图
      nextTick(() => {
        if (layer.value) {
          connectors.value.forEach(connector => {
            const newLine = new Konva.Line({
              points: [connector.fromX, connector.fromY, connector.toX, connector.toY],
              stroke: connector.stroke || '#00a0ff',
              strokeWidth: connector.strokeWidth || 2,
              id: connector.id,
              dash: connector.lineDash || [0, 0],
            });
            
            // 如果需要箭头
            if (connector.arrow) {
              newLine.setAttr('pointerLength', 10);
              newLine.setAttr('pointerWidth', 10);
              newLine.setAttr('pointerAtBeginning', false);
              newLine.setAttr('pointerAtEnding', true);
            }
            
            layer.value.getStage().findOne('Layer').add(newLine);
          });
          
          layer.value.getStage().batchDraw();
        }
      });
    }
    
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
    // 清除元素和连接线
    elements.value = [];
    connectors.value = [];
    
    // 清除Konva上的连接线
    if (layer.value) {
      layer.value.getStage().find('Line').forEach((line: any) => {
        if (line.id() !== 'tempConnector') {
          line.destroy();
        }
      });
      layer.value.getStage().batchDraw();
    }
    
    // 取消选择
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

// 导出场景为JSON文件
const exportToJSON = () => {
  const scene = {
    elements: elements.value,
    connectors: connectors.value,
    stageConfig: {
      width: stageConfig.width,
      height: stageConfig.height,
    },
    version: '1.0.0',
    timestamp: new Date().toISOString()
  };
  
  // 创建Blob对象
  const json = JSON.stringify(scene, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  // 创建下载链接
  const a = document.createElement('a');
  a.href = url;
  a.download = `thingtwin_scene_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  
  // 清理
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 0);
};

// 触发文件输入框点击
const jsonFileInput = ref<HTMLInputElement | null>(null);
const triggerImportJSON = () => {
  if (jsonFileInput.value) {
    jsonFileInput.value.click();
  }
};

// 从JSON文件导入场景
const importFromJSON = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) return;
  
  const file = input.files[0];
  const reader = new FileReader();
  
  reader.onload = async (e) => {
    try {
      const content = e.target?.result as string;
      const scene = JSON.parse(content);
      
      if (!scene.elements || !Array.isArray(scene.elements)) {
        throw new Error('无效的场景数据: 缺少元素数组');
      }
      
      // 更新舞台配置
      if (scene.stageConfig) {
        stageConfig.width = scene.stageConfig.width;
        stageConfig.height = scene.stageConfig.height;
      }
      
      // 清除当前元素和连接线
      elements.value = [];
      connectors.value = [];
      
      // 清除Konva上现有的所有连接线
      if (layer.value) {
        layer.value.getStage().find('Line').forEach((line: any) => {
          if (line.id() !== 'tempConnector') {
            line.destroy();
          }
        });
      }
      
      // 加载图像
      for (const element of scene.elements) {
        if (element.type === 'image' && element.imageUrl) {
          await loadImage(element.id, element.imageUrl);
        }
      }
      
      // 添加元素
      elements.value = scene.elements;
      
      // 添加连接线
      if (scene.connectors && Array.isArray(scene.connectors)) {
        connectors.value = scene.connectors;
        
        // 重建连接线视图
        nextTick(() => {
          if (layer.value) {
            connectors.value.forEach(connector => {
              const newLine = new Konva.Line({
                points: [connector.fromX, connector.fromY, connector.toX, connector.toY],
                stroke: connector.stroke || '#00a0ff',
                strokeWidth: connector.strokeWidth || 2,
                id: connector.id,
                dash: connector.lineDash || [0, 0],
              });
              
              // 如果需要箭头
              if (connector.arrow) {
                newLine.setAttr('pointerLength', 10);
                newLine.setAttr('pointerWidth', 10);
                newLine.setAttr('pointerAtBeginning', false);
                newLine.setAttr('pointerAtEnding', true);
              }
              
              layer.value.getStage().findOne('Layer').add(newLine);
            });
            
            layer.value.getStage().batchDraw();
          }
        });
      }
      
      // 取消选择
      selectedElement.value = null;
      
      // 保存到本地存储
      localStorage.setItem('thingTwinScene', JSON.stringify(scene));
      
      alert('场景导入成功');
    } catch (error) {
      console.error('导入场景失败:', error);
      alert(`导入场景失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
    
    // 重置文件输入以允许再次选择同一文件
    if (jsonFileInput.value) {
      jsonFileInput.value.value = '';
    }
  };
  
  reader.readAsText(file);
};

// 添加图标组件定义 - 全局注册这些组件
const RectIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', class: 'w-6 h-6' }, [
      h('rect', { x: 2, y: 2, width: 20, height: 20, fill: 'currentColor', 'fill-opacity': 0.3, stroke: 'currentColor', 'stroke-width': 2 })
    ]);
  }
};

const CircleIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', class: 'w-6 h-6' }, [
      h('circle', { cx: 12, cy: 12, r: 10, fill: 'currentColor', 'fill-opacity': 0.3, stroke: 'currentColor', 'stroke-width': 2 })
    ]);
  }
};

const TriangleIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', class: 'w-6 h-6' }, [
      h('polygon', { points: '12,2 22,22 2,22', fill: 'currentColor', 'fill-opacity': 0.3, stroke: 'currentColor', 'stroke-width': 2 })
    ]);
  }
};

const DiamondIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', class: 'w-6 h-6' }, [
      h('polygon', { points: '12,2 22,12 12,22 2,12', fill: 'currentColor', 'fill-opacity': 0.3, stroke: 'currentColor', 'stroke-width': 2 })
    ]);
  }
};

const PentagonIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', class: 'w-6 h-6' }, [
      h('polygon', { points: '12,2 22,8.5 19,18 5,18 2,8.5', fill: 'currentColor', 'fill-opacity': 0.3, stroke: 'currentColor', 'stroke-width': 2 })
    ]);
  }
};

const HexagonIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', class: 'w-6 h-6' }, [
      h('polygon', { points: '7,2 17,2 22,12 17,22 7,22 2,12', fill: 'currentColor', 'fill-opacity': 0.3, stroke: 'currentColor', 'stroke-width': 2 })
    ]);
  }
};

const StarIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', class: 'w-6 h-6' }, [
      h('polygon', { points: '12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9', fill: 'currentColor', 'fill-opacity': 0.3, stroke: 'currentColor', 'stroke-width': 2 })
    ]);
  }
};

const LeftArrowIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', class: 'w-6 h-6' }, [
      h('polygon', { points: '2,12 10,4 10,8 22,8 22,16 10,16 10,20', fill: 'currentColor', 'fill-opacity': 0.3, stroke: 'currentColor', 'stroke-width': 2 })
    ]);
  }
};

const RightArrowIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', class: 'w-6 h-6' }, [
      h('polygon', { points: '22,12 14,4 14,8 2,8 2,16 14,16 14,20', fill: 'currentColor', 'fill-opacity': 0.3, stroke: 'currentColor', 'stroke-width': 2 })
    ]);
  }
};

const DoubleArrowIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', class: 'w-6 h-6' }, [
      h('polygon', { points: '2,12 6,8 6,10 18,10 18,8 22,12 18,16 18,14 6,14 6,16', fill: 'currentColor', 'fill-opacity': 0.3, stroke: 'currentColor', 'stroke-width': 2 })
    ]);
  }
};

const CloudIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', class: 'w-6 h-6' }, [
      h('path', { d: 'M5,15c-1.1,0-2-0.9-2-2c0-1.1,0.9-2,2-2h1c0-2.2,1.8-4,4-4c1.5,0,2.9,0.9,3.6,2.2C14.1,8.4,14.9,8,15.8,8c1.5,0,2.7,1.2,2.7,2.7c0,0.3,0,0.5-0.1,0.8c0.6,0.5,1.1,1.2,1.1,2c0,1.4-1.1,2.5-2.5,2.5H5z', fill: 'currentColor', 'fill-opacity': 0.3, stroke: 'currentColor', 'stroke-width': 2 })
    ]);
  }
};

const SpeechBubbleIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', class: 'w-6 h-6' }, [
      h('path', { d: 'M2,4h20v14h-10l-5,4v-4H2V4z', fill: 'currentColor', 'fill-opacity': 0.3, stroke: 'currentColor', 'stroke-width': 2 })
    ]);
  }
};

const DocumentIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', class: 'w-6 h-6' }, [
      h('path', { d: 'M4,4h10l6,6v10H4V4z M14,4v6h6', fill: 'currentColor', 'fill-opacity': 0.3, stroke: 'currentColor', 'stroke-width': 2 })
    ]);
  }
};

const CubeIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', class: 'w-6 h-6' }, [
      h('path', { d: 'M4,6l8-4l8,4v12l-8,4l-8-4V6z M4,6l8,4l8-4 M12,10v12', fill: 'currentColor', 'fill-opacity': 0.3, stroke: 'currentColor', 'stroke-width': 2 })
    ]);
  }
};

const PersonIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', class: 'w-6 h-6' }, [
      h('circle', { cx: 12, cy: 7, r: 4, fill: 'currentColor', 'fill-opacity': 0.3, stroke: 'currentColor', 'stroke-width': 2 }),
      h('path', { d: 'M4,20v-2c0-2.2,1.8-4,4-4h8c2.2,0,4,1.8,4,4v2', fill: 'none', stroke: 'currentColor', 'stroke-width': 2 })
    ]);
  }
};

const TextIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', class: 'w-6 h-6' }, [
      h('text', { x: 12, y: 16, 'text-anchor': 'middle', 'font-size': 18, 'font-weight': 'bold', fill: 'currentColor' }, 'T')
    ]);
  }
};

// 图标组件映射表
const iconComponents: Record<string, any> = {
  RectIcon,
  CircleIcon,
  TriangleIcon,
  DiamondIcon,
  PentagonIcon,
  HexagonIcon,
  StarIcon,
  LeftArrowIcon,
  RightArrowIcon,
  DoubleArrowIcon,
  CloudIcon,
  SpeechBubbleIcon,
  DocumentIcon,
  CubeIcon,
  PersonIcon,
  TextIcon
};

// 处理画布拖拽悬停
const onCanvasDragOver = (e: DragEvent) => {
  if (canvasContainer.value) {
    canvasContainer.value.classList.add('drag-over');
  }
};

// 处理离开画布区域
const onCanvasDragLeave = (e: DragEvent) => {
  // 检查是否真的离开了容器而不是进入了子元素
  const rect = canvasContainer.value?.getBoundingClientRect();
  if (rect) {
    const { clientX, clientY } = e;
    if (
      clientX <= rect.left ||
      clientX >= rect.right ||
      clientY <= rect.top ||
      clientY >= rect.bottom
    ) {
      canvasContainer.value?.classList.remove('drag-over');
    }
  }
};
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

/* 拖拽相关样式 */
.component-item {
  transition: all 0.2s ease;
  position: relative;
  z-index: 10;
}

.component-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: rgba(30, 58, 138, 0.5);
}

.component-item:active {
  transform: translateY(0);
}

/* 拖拽中状态 */
body.dragging .component-panel {
  border-color: rgba(0, 160, 255, 0.8);
}

body.dragging .canvas-container {
  box-shadow: inset 0 0 30px rgba(0, 160, 255, 0.3);
}

/* 拖拽目标区域指示 */
.v-stage:not(.dragging-over) {
  transition: all 0.3s ease;
}

/* 强调拖拽放置区域 */
.canvas-container.drag-over {
  box-shadow: inset 0 0 40px rgba(0, 200, 255, 0.5);
  border-color: rgba(0, 200, 255, 0.8);
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
  background-image: 
    linear-gradient(rgba(0, 140, 255, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 140, 255, 0.1) 1px, transparent 1px);
  background-size: 20px 20px;
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

/* 组件面板样式 */
.component-panel {
  background-color: #0c1428;
  border-right: 1px solid rgba(0, 140, 255, 0.3);
}

.tab {
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab:hover {
  color: #00c0ff;
}

.component {
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.component:hover {
  background: rgba(0, 102, 204, 0.3);
  border: 1px solid rgba(0, 140, 255, 0.5);
  box-shadow: 0 0 10px rgba(0, 160, 255, 0.3);
  transform: translateY(-2px);
}

.component-preview {
  background: rgba(0, 51, 102, 0.3);
  border-radius: 4px;
  border: 1px solid rgba(0, 140, 255, 0.3);
}

.preview-rect {
  width: 30px;
  height: 25px;
  border-radius: 2px;
}

.preview-circle {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}

/* 属性面板样式 */
.property-panel {
  background-color: #0c1428;
  border-left: 1px solid rgba(0, 140, 255, 0.3);
}

.input {
  background-color: rgba(15, 30, 60, 0.7);
  border: 1px solid rgba(0, 140, 255, 0.4);
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  color: #e6f7ff;
  font-size: 0.875rem;
  transition: all 0.3s ease;
}

.input:hover, .input:focus {
  border-color: #00a0ff;
  box-shadow: 0 0 8px rgba(0, 160, 255, 0.4);
  outline: none;
}

/* 组件网格布局 */
.components-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(10, 20, 40, 0.8);
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 140, 255, 0.5);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 160, 255, 0.7);
}
</style> 