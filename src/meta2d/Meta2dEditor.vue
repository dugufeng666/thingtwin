<template>
  <div class="editor-container">
    <div class="header-title">
      <span class="highlight">组态设计</span>数字孪生平台
      <div class="subtitle">Industrial Configuration & Digital Twin Platform</div>
      <div class="tech-line left"></div>
      <div class="tech-line right"></div>
    </div>
    
    <div class="toolbar bg-gray-800 p-2 flex items-center space-x-2">
      <div class="left-tools flex space-x-2">
        <button @click="onNew" class="btn bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded text-sm">
          <i class="fas fa-file"></i> 新建
        </button>
        <button @click="onSave" class="btn bg-blue-600 hover:bg-blue-500 text-white px-2 py-1 rounded text-sm">
          <i class="fas fa-save"></i> 保存
        </button>
        <button @click="onOpen" class="btn bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded text-sm">
          <i class="fas fa-folder-open"></i> 打开
        </button>
      </div>
      <div class="divider border-l border-gray-600 h-6 mx-2"></div>
      <div class="draw-tools flex space-x-2">
        <button @click="onPen" class="btn-icon" :class="{ 'active': activeTool === 'pen' }">
          <i class="fas fa-pen"></i>
        </button>
        <button @click="onRect" class="btn-icon" :class="{ 'active': activeTool === 'rect' }">
          <i class="fas fa-square"></i>
        </button>
        <button @click="onCircle" class="btn-icon" :class="{ 'active': activeTool === 'circle' }">
          <i class="fas fa-circle"></i>
        </button>
        <button @click="onText" class="btn-icon" :class="{ 'active': activeTool === 'text' }">
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

    <div class="flex h-[calc(100vh-6.5rem)]">
      <!-- 组件侧边栏 - 更窄 -->
      <div class="component-panel w-48 bg-gray-800 overflow-y-auto">
        <!-- 组件库标签页 -->
        <div class="tabs flex text-center text-xs">
          <div class="tab flex-1 py-2 border-b-2" :class="{'border-blue-500 text-blue-400': activeTab === 'water', 'border-transparent': activeTab !== 'water'}" @click="activeTab = 'water'">工业组件</div>
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
        
        <!-- 工业组件 -->
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
              <img v-if="comp.image" :src="comp.image" :alt="comp.name" class="w-10 h-10 mb-1" draggable="false" />
              <div v-else class="w-10 h-10 mb-1 flex items-center justify-center component-preview" draggable="false">
                <div v-if="comp.data.rect" class="preview-rect" :style="{
                  background: comp.data.rect.fill || 'rgba(0, 102, 204, 0.6)',
                  borderColor: comp.data.rect.stroke || '#0066cc',
                  borderWidth: (comp.data.rect.strokeWidth || 2) + 'px'
                }"></div>
                <div v-else-if="comp.data.ellipse" class="preview-circle" :style="{
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
          <div class="components-grid">
            <div 
              v-for="(comp, index) in basicComponents" 
              :key="index"
              class="component cursor-pointer p-1 rounded flex flex-col items-center"
              draggable="true"
              @dragstart="onDragStart($event, comp)"
              @click="onComponentClick(comp)"
            >
              <div class="w-10 h-10 mb-1 flex items-center justify-center" :class="comp.iconClass" draggable="false">
                <svg v-if="comp.type === 'rect'" class="w-8 h-8" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" fill="currentColor" fill-opacity="0.3" stroke="currentColor" stroke-width="2" />
                </svg>
                
                <svg v-else-if="comp.type === 'circle'" class="w-8 h-8" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" fill="currentColor" fill-opacity="0.3" stroke="currentColor" stroke-width="2" />
                </svg>
                
                <svg v-else-if="comp.type === 'triangle'" class="w-8 h-8" viewBox="0 0 24 24">
                  <polygon points="12,2 22,22 2,22" fill="currentColor" fill-opacity="0.3" stroke="currentColor" stroke-width="2" />
                </svg>
                
                <svg v-else-if="comp.type === 'diamond'" class="w-8 h-8" viewBox="0 0 24 24">
                  <polygon points="12,2 22,12 12,22 2,12" fill="currentColor" fill-opacity="0.3" stroke="currentColor" stroke-width="2" />
                </svg>
                
                <svg v-else-if="comp.type === 'pentagon'" class="w-8 h-8" viewBox="0 0 24 24">
                  <polygon points="12,2 22,9 19,20 5,20 2,9" fill="currentColor" fill-opacity="0.3" stroke="currentColor" stroke-width="2" />
                </svg>
                
                <svg v-else-if="comp.type === 'hexagon'" class="w-8 h-8" viewBox="0 0 24 24">
                  <polygon points="7,2 17,2 22,12 17,22 7,22 2,12" fill="currentColor" fill-opacity="0.3" stroke="currentColor" stroke-width="2" />
                </svg>
                
                <svg v-else-if="comp.type === 'star'" class="w-8 h-8" viewBox="0 0 24 24">
                  <polygon points="12,2 15,8 21,9 17,14 18,20 12,17 6,20 7,14 3,9 9,8" fill="currentColor" fill-opacity="0.3" stroke="currentColor" stroke-width="2" />
                </svg>
                
                <svg v-else-if="comp.type === 'arrow' && comp.name === '右箭头'" class="w-8 h-8" viewBox="0 0 24 24">
                  <path d="M2,12 L14,12 L14,8 L22,12 L14,16 L14,12" fill="currentColor" fill-opacity="0.3" stroke="currentColor" stroke-width="2" />
                </svg>
                
                <svg v-else-if="comp.type === 'arrow' && comp.name === '左箭头'" class="w-8 h-8" viewBox="0 0 24 24">
                  <path d="M22,12 L10,12 L10,8 L2,12 L10,16 L10,12" fill="currentColor" fill-opacity="0.3" stroke="currentColor" stroke-width="2" />
                </svg>
                
                <svg v-else-if="comp.type === 'arrow' && comp.name === '双向箭头'" class="w-8 h-8" viewBox="0 0 24 24">
                  <path d="M2,12 L8,8 L8,10 L16,10 L16,8 L22,12 L16,16 L16,14 L8,14 L8,16 L2,12" fill="currentColor" fill-opacity="0.3" stroke="currentColor" stroke-width="2" />
                </svg>
                
                <svg v-else-if="comp.type === 'text'" class="w-8 h-8" viewBox="0 0 24 24">
                  <text x="12" y="16" text-anchor="middle" font-size="18" font-weight="bold" fill="currentColor">T</text>
                </svg>
                
                <svg v-else-if="comp.type === 'line'" class="w-8 h-8" viewBox="0 0 24 24">
                  <line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" stroke-width="3" />
                </svg>
                
                <svg v-else class="w-8 h-8" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" fill="currentColor" fill-opacity="0.3" stroke="currentColor" stroke-width="2" />
                </svg>
              </div>
              <span class="text-xs text-white text-center truncate w-full">{{ comp.name }}</span>
            </div>
          </div>
          
          <!-- 快速添加按钮 -->
          <div class="quick-tools mt-4 p-2 border-t border-gray-700">
            <button @click="addTestPump" class="btn w-full bg-blue-600 hover:bg-blue-500 text-white py-1 rounded text-xs mb-2">
              <i class="fas fa-plus-circle mr-1"></i>添加设备
            </button>
            <button @click="addTestRect" class="btn w-full bg-green-600 hover:bg-green-500 text-white py-1 rounded text-xs">
              <i class="fas fa-plus-circle mr-1"></i>添加容器
            </button>
          </div>
        </div>
      </div>

      <!-- 编辑器画布 -->
      <div class="canvas-container flex-1 relative">
        <div id="meta2d" ref="container" class="meta2d-container w-full h-full"></div>
        <div class="grid-overlay"></div>
        <div class="tech-border top-left"></div>
        <div class="tech-border top-right"></div>
        <div class="tech-border bottom-left"></div>
        <div class="tech-border bottom-right"></div>
        
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
        
        <!-- 实时数据指标卡 -->
        <div class="data-metrics">
          <div class="metrics-title-decoration"></div>
          <div class="metrics-title">组件属性预览</div>
          <div class="metrics-container">
            <div class="metric-item">
              <div class="metric-name">设备状态</div>
              <div class="metric-value">{{ simulatedData.inletFlow }}<span class="unit">%</span></div>
              <div class="metric-chart">
                <div class="chart-bar" :style="{ width: `${simulatedData.inletFlowPercent}%` }"></div>
              </div>
            </div>
            <div class="metric-item">
              <div class="metric-name">运行参数</div>
              <div class="metric-value">{{ simulatedData.outletQuality }}<span class="unit">单位</span></div>
              <div class="metric-chart">
                <div class="chart-bar" :style="{ width: `${simulatedData.outletQualityPercent}%` }"></div>
              </div>
            </div>
            <div class="metric-item">
              <div class="metric-name">负载率</div>
              <div class="metric-value">{{ simulatedData.aerationLevel }}<span class="unit">%</span></div>
              <div class="metric-chart">
                <div class="chart-bar" :style="{ width: `${simulatedData.aerationLevel}%` }"></div>
              </div>
            </div>
            <div class="metric-item">
              <div class="metric-name">系统状态</div>
              <div class="metric-value">{{ simulatedData.systemStatus }}</div>
              <div class="status-indicator" :class="{ 'status-normal': simulatedData.systemStatus === '正常' }"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 属性面板 - 更窄 -->
      <div class="property-panel w-52 bg-gray-800 overflow-y-auto">
        <div class="tabs flex text-center text-xs">
          <div class="tab flex-1 py-2 border-b-2 border-blue-500 text-blue-400">属性</div>
        </div>
        
        <div class="p-3">
          <div v-if="selectedNode">
            <div class="mb-3">
              <label class="block text-gray-400 text-xs mb-1">名称</label>
              <input 
                v-model="selectedNode.name" 
                @change="updateNode"
                class="w-full px-2 py-1 bg-gray-700 rounded border border-gray-600 text-white text-xs"
              />
            </div>
            <div class="grid grid-cols-2 gap-2 mb-3">
              <div>
                <label class="block text-gray-400 text-xs mb-1">X坐标</label>
                <input 
                  v-model.number="selectedNode.x" 
                  @change="updateNode"
                  type="number" 
                  class="w-full px-2 py-1 bg-gray-700 rounded border border-gray-600 text-white text-xs"
                />
              </div>
              <div>
                <label class="block text-gray-400 text-xs mb-1">Y坐标</label>
                <input 
                  v-model.number="selectedNode.y" 
                  @change="updateNode"
                  type="number" 
                  class="w-full px-2 py-1 bg-gray-700 rounded border border-gray-600 text-white text-xs"
                />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-2 mb-3">
              <div>
                <label class="block text-gray-400 text-xs mb-1">宽度</label>
                <input 
                  v-model.number="selectedNode.width" 
                  @change="updateNode"
                  type="number" 
                  class="w-full px-2 py-1 bg-gray-700 rounded border border-gray-600 text-white text-xs"
                />
              </div>
              <div>
                <label class="block text-gray-400 text-xs mb-1">高度</label>
                <input 
                  v-model.number="selectedNode.height" 
                  @change="updateNode"
                  type="number" 
                  class="w-full px-2 py-1 bg-gray-700 rounded border border-gray-600 text-white text-xs"
                />
              </div>
            </div>

            <!-- 数据绑定区域 -->
            <div class="mb-3 border-t border-gray-700 pt-3">
              <h4 class="text-white text-sm font-medium mb-2">数据绑定</h4>
              <div class="mb-2">
                <label class="block text-gray-400 text-xs mb-1">设备</label>
                <select 
                  v-model="selectedNode.deviceId" 
                  @change="updateNodeData"
                  class="w-full px-2 py-1 bg-gray-700 rounded border border-gray-600 text-white text-xs"
                >
                  <option value="">无</option>
                  <option v-for="device in devices" :key="device.id" :value="device.id">
                    {{ device.name }}
                  </option>
                </select>
              </div>
              <div v-if="selectedNode.deviceId">
                <label class="block text-gray-400 text-xs mb-1">数据点</label>
                <div v-if="deviceDataPoints.length > 0" class="max-h-28 overflow-y-auto pr-1">
                  <div v-for="(point, index) in deviceDataPoints" :key="index" class="flex items-center mb-1">
                    <input 
                      type="checkbox" 
                      :id="'dp-' + index" 
                      :value="point" 
                      v-model="selectedNode.dataPoints"
                      @change="updateNodeData"
                      class="mr-1"
                    />
                    <label :for="'dp-' + index" class="text-gray-300 text-xs truncate">{{ point }}</label>
                  </div>
                </div>
                <div v-else class="text-gray-500 text-xs">该设备没有可用数据点</div>
              </div>
            </div>

            <div class="flex justify-end mt-3">
              <button @click="deleteNode" class="btn bg-red-600 hover:bg-red-500 text-white px-2 py-1 rounded text-xs">
                <i class="fas fa-trash-alt mr-1"></i>删除
              </button>
            </div>
          </div>
          <div v-else-if="selectedLine">
            <div class="mb-3">
              <label class="block text-gray-400 text-xs mb-1">名称</label>
              <input 
                v-model="selectedLine.name" 
                @change="updateLine"
                class="w-full px-2 py-1 bg-gray-700 rounded border border-gray-600 text-white text-xs"
              />
            </div>
            <div class="mb-3">
              <label class="block text-gray-400 text-xs mb-1">线条颜色</label>
              <input 
                v-model="selectedLine.lineColor" 
                @change="updateLine"
                type="color" 
                class="w-full h-8 bg-gray-700 rounded border border-gray-600"
              />
            </div>
            <div class="mb-3">
              <label class="block text-gray-400 text-xs mb-1">线条宽度</label>
              <input 
                v-model.number="selectedLine.lineWidth" 
                @change="updateLine"
                type="number" 
                min="1" 
                max="10"
                class="w-full px-2 py-1 bg-gray-700 rounded border border-gray-600 text-white text-xs"
              />
            </div>
            <div class="flex justify-end mt-3">
              <button @click="deleteLine" class="btn bg-red-600 hover:bg-red-500 text-white px-2 py-1 rounded text-xs">
                <i class="fas fa-trash-alt mr-1"></i>删除
              </button>
            </div>
          </div>
          <div v-else class="text-gray-500 text-center py-10 text-xs">
            未选中任何元素
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue';
import { Meta2d } from '@meta2d/core';
import '@meta2d/svg';
import axios from 'axios';
import { wastewaterComponents, registerWastewaterIcons } from './wastewater-components';

// 添加鼠标坐标跟踪
const mouseX = ref(0);
const mouseY = ref(0);

// 组件库标签页
const activeTab = ref('water'); // 'water' 或 'basic'

// meta2d实例
let meta2d: any = null;
const container = ref<HTMLElement | null>(null);
const scale = ref(1);
const activeTool = ref('');

// 选中的元素
const selectedNode = ref<any>(null);
const selectedLine = ref<any>(null);

// 设备列表
const devices = ref<any[]>([]);

// 搜索功能
const componentSearchQuery = ref('');

// 过滤水处理组件
const filteredWaterComponents = computed(() => {
  if (!componentSearchQuery.value) {
    return waterComponents.value;
  }
  const query = componentSearchQuery.value.toLowerCase();
  return waterComponents.value.filter((comp: any) => 
    comp.name.toLowerCase().includes(query)
  );
});

// 污水处理组件列表
const waterComponents = ref<any[]>([]);

// 模拟实时数据
const simulatedData = reactive({
  inletFlow: 120,
  inletFlowPercent: 60,
  outletQuality: 15.3,
  outletQualityPercent: 25,
  aerationLevel: 68,
  systemStatus: '正常'
});

// 随机更新数据
const updateSimulatedData = () => {
  simulatedData.inletFlow = Math.round((120 + Math.random() * 20 - 10) * 10) / 10;
  simulatedData.inletFlowPercent = Math.min(100, Math.max(0, simulatedData.inletFlow / 2));
  
  simulatedData.outletQuality = Math.round((15 + Math.random() * 2 - 1) * 10) / 10;
  simulatedData.outletQualityPercent = Math.min(100, Math.max(0, simulatedData.outletQuality * 3));
  
  simulatedData.aerationLevel = Math.round(Math.min(100, Math.max(0, 68 + Math.random() * 10 - 5)));
  
  // 偶尔切换系统状态
  if (Math.random() > 0.95) {
    simulatedData.systemStatus = simulatedData.systemStatus === '正常' ? '警告' : '正常';
  }
};

// 定时更新数据
let dataUpdateTimer: any = null;

// 初始化所有组件
const initComponents = () => {
  // 获取已定义的图像组件
  const existingComponents = [
    {
      type: 'image',
      name: '泵',
      image: './components/symbols/pump.svg',
      width: 80,
      height: 80,
      data: {
        name: 'pump',
        text: '',
        width: 80,
        height: 80,
        image: './components/symbols/pump.svg',
      }
    },
    // ... 其他已有组件
  ];

  // 获取从wastewaterComponents中的组件
  const wasteComponents = wastewaterComponents();
  
  if (wasteComponents && wasteComponents.length > 0 && wasteComponents[0].children) {
    // 映射为与现有组件相同的格式
    const newComponents = wasteComponents[0].children.map(comp => {
      // 转换图像类型组件
      if (comp.data && comp.data.image) {
        return {
          type: 'image',
          name: comp.name,
          image: comp.data.image,
          width: comp.data.width || 80,
          height: comp.data.height || 80,
          data: { ...comp.data }
        };
      }
      
      // 转换矩形、圆形等形状组件
      return {
        type: comp.data.rect ? 'rect' : comp.data.ellipse ? 'circle' : 'custom',
        name: comp.name,
        width: comp.data.width || 80,
        height: comp.data.height || 80,
        data: { ...comp.data }
      };
    });
    
    // 合并所有组件
    waterComponents.value = [...existingComponents, ...newComponents];
    console.log('组件库初始化完成，总计:', waterComponents.value.length, '个组件');
  } else {
    waterComponents.value = existingComponents;
    console.warn('未能成功加载wastewater-components中的组件');
  }
};

// 基础组件列表
const basicComponents = [
  {
    type: 'rect',
    name: '正方形',
    iconClass: 'bg-blue-800 text-blue-200',
    width: 80,
    height: 80,
    data: {
      name: 'square',
      text: '',
      width: 80,
      height: 80,
      borderRadius: 0,
      rect: {
        fill: 'rgba(59, 130, 246, 0.3)',
        strokeWidth: 2,
        stroke: '#3B82F6'
      }
    }
  },
  {
    type: 'rect',
    name: '矩形',
    iconClass: 'bg-blue-800 text-blue-200',
    width: 100,
    height: 60,
    data: {
      name: 'rectangle',
      text: '',
      width: 100,
      height: 60,
      borderRadius: 0,
      rect: {
        fill: 'rgba(59, 130, 246, 0.3)',
        strokeWidth: 2,
        stroke: '#3B82F6'
      }
    }
  },
  {
    type: 'circle',
    name: '圆形',
    iconClass: 'bg-green-800 text-green-200',
    width: 80,
    height: 80,
    data: {
      name: 'circle',
      text: '',
      width: 80,
      height: 80,
      ellipse: {
        fill: 'rgba(16, 185, 129, 0.3)',
        strokeWidth: 2,
        stroke: '#10B981'
      }
    }
  },
  {
    type: 'triangle',
    name: '三角形',
    iconClass: 'bg-yellow-800 text-yellow-200',
    width: 80,
    height: 80,
    data: {
      name: 'triangle',
      text: '',
      width: 80,
      height: 80,
      points: [
        {x: 40, y: 0},
        {x: 0, y: 80},
        {x: 80, y: 80}
      ],
      lineWidth: 2,
      strokeStyle: '#D97706',
      fillStyle: 'rgba(217, 119, 6, 0.3)'
    }
  },
  {
    type: 'diamond',
    name: '菱形',
    iconClass: 'bg-purple-800 text-purple-200',
    width: 80,
    height: 80,
    data: {
      name: 'diamond',
      text: '',
      width: 80,
      height: 80,
      points: [
        {x: 40, y: 0},
        {x: 80, y: 40},
        {x: 40, y: 80},
        {x: 0, y: 40}
      ],
      lineWidth: 2,
      strokeStyle: '#8B5CF6',
      fillStyle: 'rgba(139, 92, 246, 0.3)'
    }
  },
  {
    type: 'pentagon',
    name: '五边形',
    iconClass: 'bg-pink-800 text-pink-200',
    width: 80,
    height: 80,
    data: {
      name: 'pentagon',
      text: '',
      width: 80,
      height: 80,
      points: [
        {x: 40, y: 0},
        {x: 80, y: 30},
        {x: 65, y: 80},
        {x: 15, y: 80},
        {x: 0, y: 30}
      ],
      lineWidth: 2,
      strokeStyle: '#EC4899',
      fillStyle: 'rgba(236, 72, 153, 0.3)'
    }
  },
  {
    type: 'hexagon',
    name: '六边形',
    iconClass: 'bg-indigo-800 text-indigo-200',
    width: 80,
    height: 70,
    data: {
      name: 'hexagon',
      text: '',
      width: 80,
      height: 70,
      points: [
        {x: 20, y: 0},
        {x: 60, y: 0},
        {x: 80, y: 35},
        {x: 60, y: 70},
        {x: 20, y: 70},
        {x: 0, y: 35}
      ],
      lineWidth: 2,
      strokeStyle: '#6366F1',
      fillStyle: 'rgba(99, 102, 241, 0.3)'
    }
  },
  {
    type: 'star',
    name: '五角星',
    iconClass: 'bg-amber-800 text-amber-200',
    width: 80,
    height: 80,
    data: {
      name: 'pentagram',
      text: '',
      width: 80,
      height: 80,
      points: [
        {x: 40, y: 0},
        {x: 50, y: 30},
        {x: 80, y: 30},
        {x: 55, y: 50},
        {x: 65, y: 80},
        {x: 40, y: 60},
        {x: 15, y: 80},
        {x: 25, y: 50},
        {x: 0, y: 30},
        {x: 30, y: 30}
      ],
      lineWidth: 2,
      strokeStyle: '#D97706',
      fillStyle: 'rgba(217, 119, 6, 0.3)'
    }
  },
  {
    type: 'arrow',
    name: '右箭头',
    iconClass: 'bg-red-800 text-red-200',
    width: 100,
    height: 60,
    data: {
      name: 'rightArrow',
      text: '',
      width: 100,
      height: 60,
      points: [
        {x: 0, y: 20},
        {x: 60, y: 20},
        {x: 60, y: 0},
        {x: 100, y: 30},
        {x: 60, y: 60},
        {x: 60, y: 40},
        {x: 0, y: 40}
      ],
      lineWidth: 2,
      strokeStyle: '#DC2626',
      fillStyle: 'rgba(220, 38, 38, 0.3)'
    }
  },
  {
    type: 'arrow',
    name: '左箭头',
    iconClass: 'bg-red-800 text-red-200',
    width: 100,
    height: 60,
    data: {
      name: 'leftArrow',
      text: '',
      width: 100,
      height: 60,
      points: [
        {x: 100, y: 20},
        {x: 40, y: 20},
        {x: 40, y: 0},
        {x: 0, y: 30},
        {x: 40, y: 60},
        {x: 40, y: 40},
        {x: 100, y: 40}
      ],
      lineWidth: 2,
      strokeStyle: '#DC2626',
      fillStyle: 'rgba(220, 38, 38, 0.3)'
    }
  },
  {
    type: 'arrow',
    name: '双向箭头',
    iconClass: 'bg-red-800 text-red-200',
    width: 120,
    height: 60,
    data: {
      name: 'twowayArrow',
      text: '',
      width: 120,
      height: 60,
      points: [
        {x: 0, y: 30},
        {x: 40, y: 0},
        {x: 40, y: 20},
        {x: 80, y: 20},
        {x: 80, y: 0},
        {x: 120, y: 30},
        {x: 80, y: 60},
        {x: 80, y: 40},
        {x: 40, y: 40},
        {x: 40, y: 60}
      ],
      lineWidth: 2,
      strokeStyle: '#DC2626',
      fillStyle: 'rgba(220, 38, 38, 0.3)'
    }
  },
  {
    type: 'text',
    name: '文本',
    iconClass: 'bg-yellow-800 text-yellow-200',
    width: 100,
    height: 40,
    data: {
      name: 'text',
      text: '双击编辑文本',
      width: 100,
      height: 40,
      textAlign: 'center',
      textBaseline: 'middle',
      fontSize: 16,
      color: '#FFFFFF'
    }
  },
  {
    type: 'line',
    name: '线条',
    iconClass: 'bg-purple-800 text-purple-200',
    data: {
      name: 'line',
      lineName: 'line',
      fromArrow: '',
      toArrow: 'triangleSolid',
      lineWidth: 2,
      strokeStyle: '#FFFFFF'
    }
  }
];

// 计算选中设备的数据点
const deviceDataPoints = computed(() => {
  if (!selectedNode.value?.deviceId) return [];
  
  const device = devices.value.find(d => d.id === selectedNode.value.deviceId);
  if (!device || !device.data) return [];
  
  return Object.keys(device.data);
});

// 更新鼠标移动处理
const updateMousePosition = (e: MouseEvent) => {
  if (!container.value || !meta2d) return;
  
  // 获取画布相对位置
  const rect = container.value.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  // 转换为画布坐标
  const pos = meta2d.pointCanvasToWindow({
    x: x,
    y: y
  });
  
  // 更新显示坐标
  mouseX.value = Math.round(pos.x);
  mouseY.value = Math.round(pos.y);
};

// 初始化编辑器
onMounted(async () => {
  console.log('初始化Meta2d编辑器...');
  
  try {
    // 注册污水处理组件图标
    registerWastewaterIcons();
    
    // 初始化组件库
    initComponents();
    
    // 创建meta2d实例 - 这是关键
    meta2d = new Meta2d('meta2d');
    
    console.log('Meta2d实例创建成功');
    
    // 重要：确保canvas可拖拽
    if (meta2d.canvas) {
      meta2d.canvas.dragItems = true;
      meta2d.canvas.hotkeyEnable = true;
    }
    
    // 初始化画布 - 设置选项
    initCanvas();
    
    // 注册事件处理
    meta2d.on('active', onElementSelected);
    meta2d.on('scale', onScale);
    meta2d.on('inactive', onElementInactive);
    meta2d.on('click', onClick);
    
    // 调试：监听移动事件
    meta2d.on('move', (pens: any) => {
      console.log('元素移动:', pens);
    });
    
    // 注册形状库
    meta2d.register(wastewaterComponents());
    
    // 重新强调元素可移动性
    meta2d.setOptions({
      movableNode: true,
      disableTranslate: false,
      dragOn: true,
      locked: 0
    });
    
    // 添加鼠标移动监听
    if (container.value) {
      container.value.addEventListener('mousemove', updateMousePosition);
    }
    
    // 加载设备数据
    await fetchDevices();
    
    // 从本地存储加载
    loadFromStorage();
    
    // 启动数据模拟
    dataUpdateTimer = setInterval(updateSimulatedData, 3000);
    
    // 添加键盘删除事件监听
    document.addEventListener('keydown', handleKeyDown);
    
    // 尝试移动所有元素，确保它们可移动
    setTimeout(() => {
      const allPens = meta2d.getPens();
      allPens.forEach(pen => {
        meta2d.setPenProps(pen, {
          locked: 0,
          movable: true,
          selectable: true
        });
      });
      meta2d.render();
      console.log('设置所有元素为可移动状态');
    }, 1000);
  } catch (error) {
    console.error('Meta2d初始化失败:', error);
  }
});

// 从本地存储加载
const loadFromStorage = () => {
  try {
    const savedData = localStorage.getItem('meta2d-wastewater');
    if (savedData) {
      const data = JSON.parse(savedData);
      
      // 确保所有线条都有可见的样式
      if (data.pens) {
        data.pens.forEach((pen: any) => {
          // 检查是否为线条类型
          if (pen.name === 'line' || pen.anchors || pen.from || pen.to) {
            pen.strokeStyle = pen.strokeStyle || '#00a0ff';
            pen.lineWidth = Math.max(pen.lineWidth || 0, 2);
          }
        });
      }
      
      meta2d.open(data);
      console.log('从本地存储加载数据成功');
      
      // 重新渲染以确保连线和节点都显示
      setTimeout(() => {
        // 再次确保所有线条可见
        meta2d.getAllLines().forEach((line: any) => {
          if (!line.strokeStyle || line.strokeStyle === 'transparent') {
            meta2d.updateLine({
              id: line.id,
              strokeStyle: '#00a0ff',
              lineWidth: Math.max(line.lineWidth || 0, 2)
            });
          }
        });
        
        meta2d.render();
      }, 100);
    }
  } catch (error) {
    console.error('从本地存储加载数据失败:', error);
  }
};

// 初始化画布
const initCanvas = () => {
  try {
    // 首先检查实例是否已创建
    if (meta2d) {
      console.log('当前meta2d实例：', meta2d);
    } else {
      console.error('meta2d实例未创建，请检查初始化');
      return;
    }
    
    // 尝试重新设置关键选项
    meta2d.store.options = {
      ...meta2d.store.options,
      // 确保元素可以移动的关键设置
      locked: 0,
      dragOn: true,  // 确保可拖动
      disableTranslate: false,
      disableScale: false,
      disableRotate: false,
      dragToPanning: false,
      movableLine: true,
      movableNode: true,
      autoAnchor: true
    };
    
    // 直接设置canvas选项
    if (meta2d.canvas) {
      meta2d.canvas.dragItems = true;
      meta2d.canvas.hotkeyEnable = true;
      console.log('已设置canvas.dragItems=true');
    }
    
    // 尝试设置选项
    meta2d.setOptions({
      grid: true,
      gridColor: '#282828',
      gridSize: 20,
      rule: true,
      ruleColor: '#888',
      // 关键配置：确保元素可以移动
      locked: 0,
      dragOn: true,
      dragToPanning: false,     
      disableTranslate: false,  
      disableScale: false,      
      disableRotate: false,     
      movableLine: true,        
      movableNode: true,
      hoverColor: '#00e5ff',
      anchorSize: 5,
      anchorColor: '#00a0ff',
      autoAnchor: true,
      hoverCursor: 'move',
      activeColor: '#00a0ff',
    });
    
    console.log('重新设置Meta2d选项完成');
    
    // 强制重新渲染
    meta2d.render();
  } catch (error) {
    console.error('设置Meta2d选项失败:', error);
  }
};

// 画布事件处理 - 确保选择状态正确
const onElementSelected = (nodes: any[], lines: any[]) => {
  if (nodes && nodes.length === 1) {
    console.log('选中节点:', nodes[0]);
    selectedNode.value = { ...nodes[0] };
    selectedLine.value = null;
    
    // 确保元素可移动属性
    meta2d.setPenProps(nodes[0], {
      locked: 0,
      movable: true,
      selectable: true
    });
    meta2d.render();
  } else if (lines && lines.length === 1) {
    console.log('选中线条:', lines[0]);
    const line = lines[0];
    // 确保选中的线条有明显的样式
    if (line.strokeStyle === 'transparent') {
      line.strokeStyle = '#00a0ff';
    }
    
    selectedLine.value = { ...lines[0] };
    selectedNode.value = null;
    
    // 确保线条可移动
    meta2d.setPenProps(line, {
      locked: 0,
      movable: true,
      selectable: true
    });
    meta2d.render();
  } else if (nodes.length === 0 && lines.length === 0) {
    // 只在没有选中任何元素时清除
    selectedNode.value = null;
    selectedLine.value = null;
  }
};

// 处理选中元素变为非活动状态
const onElementInactive = () => {
  console.log('元素变为非活动状态');
  
  meta2d.getAllLines().forEach((line: any) => {
    if (!line.strokeStyle || line.strokeStyle === 'transparent') {
      line.strokeStyle = '#00a0ff';
    }
  });
  meta2d.render();
};

// 处理点击事件
const onClick = (e: { pen: any }) => {
  console.log('点击事件:', e.pen ? '元素' : '空白区域');
  
  // 如果点击了元素，确保其可移动
  if (e.pen) {
    meta2d.setPenProps(e.pen, {
      locked: 0,
      movable: true,
      selectable: true
    });
  }
  
  meta2d.getAllLines().forEach((line: any) => {
    if (!line.strokeStyle || line.strokeStyle === 'transparent') {
      line.strokeStyle = '#00a0ff';
    }
  });
  meta2d.render();
};

// 加载设备列表
const fetchDevices = async () => {
  try {
    // 使用模拟数据替代API请求
    devices.value = [
      { 
        id: 'WTP-001', 
        name: '进水泵站', 
        type: '泵', 
        status: 'Online',
        data: {
          flow: 120.5,
          level: 65.3,
          status: 'running',
          power: 45.2
        }
      },
      { 
        id: 'WTP-002', 
        name: '曝气池', 
        type: '曝气池', 
        status: 'Online',
        data: {
          oxygen: 3.8,
          temperature: 26.5,
          ph: 7.2,
          cod: 210.5
        }
      },
      { 
        id: 'WTP-003', 
        name: '沉淀池', 
        type: '沉淀池', 
        status: 'Online',
        data: {
          level: 78.5,
          tss: 28.7,
          flow: 109.6,
          turbidity: 15.3
        }
      },
      { 
        id: 'WTP-004', 
        name: '消毒系统', 
        type: '消毒设备', 
        status: 'Online',
        data: {
          chlorine: 0.8,
          flow: 104.2,
          ph: 6.9,
          contactTime: 28.5
        }
      }
    ];
    console.log('已加载模拟设备数据');
  } catch (error) {
    console.error('获取设备列表失败:', error);
  }
};

// 元素拖拽开始 - 简化拖拽处理
const onDragStart = (e: DragEvent, comp: any) => {
  if (!e.dataTransfer) return;
  
  e.stopPropagation();
  
  // 设置拖拽效果
  e.dataTransfer.effectAllowed = 'copy';
  
  try {
    // 确保图形可移动
    const enhancedData = {
      ...(comp.data || comp),
      locked: 0,          // 0=不锁定，关键设置
      movable: true,      // 可移动，关键设置
      selectable: true,   // 可选择，关键设置
      resizable: true     // 可调整大小
    };
    
    e.dataTransfer.setData('Meta2d', JSON.stringify(enhancedData));
    
    document.body.classList.add('dragging');
  } catch (error) {
    console.error('拖拽失败:', error);
  }
};

// 组件点击添加
const onComponentClick = (comp: any) => {
  console.log('组件点击:', comp.name);
  
  // 支持单击添加图元，与官方示例保持一致
  if (meta2d) {
    try {
      const data = comp.data || comp;
      
      // 确保元素可选中和移动
      const enhancedData = {
        ...data,
        locked: 0,
        movable: true,
        selectable: true,
        resizable: true
      };
      
      // 设置位置到画布中心
      const x = meta2d.store.data.width / 2 - (data.width || 80) / 2;
      const y = meta2d.store.data.height / 2 - (data.height || 80) / 2;
      
      // 添加到画布
      const node = meta2d.addPen({
        ...enhancedData,
        x: x,
        y: y
      });
      
      console.log('组件添加结果:', node);
      
      // 确保元素属性正确
      if (node) {
        // 立即设置元素可移动属性
        meta2d.setPenProps(node, {
          locked: 0,
          movable: true,
          selectable: true
        });
        
        // 立即选中新添加的元素
        setTimeout(() => {
          meta2d.active([node]);
          meta2d.render();
        }, 50);
      }
      
      meta2d.render();
    } catch (error) {
      console.error('添加组件失败:', error);
    }
  }
};

// 缩放事件处理
const onScale = ({ scale: newScale }: { scale: number }) => {
  scale.value = newScale;
};

// 更新节点
const updateNode = () => {
  if (!selectedNode.value || !meta2d) return;

  meta2d.updateNode({
    id: selectedNode.value.id,
    name: selectedNode.value.name,
    x: selectedNode.value.x,
    y: selectedNode.value.y,
    width: selectedNode.value.width,
    height: selectedNode.value.height
  });
  
  meta2d.render();
};

// 更新节点数据绑定
const updateNodeData = () => {
  if (!selectedNode.value || !meta2d) return;

  meta2d.updateNode({
    id: selectedNode.value.id,
    deviceId: selectedNode.value.deviceId,
    dataPoints: selectedNode.value.dataPoints || []
  });
  
  meta2d.render();
};

// 更新线条
const updateLine = () => {
  if (!selectedLine.value || !meta2d) return;

  const lineColor = selectedLine.value.lineColor || selectedLine.value.strokeStyle || '#00a0ff';
  const lineWidth = Math.max(selectedLine.value.lineWidth || 0, 2);

  meta2d.updateLine({
    id: selectedLine.value.id,
    name: selectedLine.value.name,
    lineColor: lineColor,
    strokeStyle: lineColor, // 确保strokeStyle也被设置
    lineWidth: lineWidth,
    fromArrowColor: lineColor,
    toArrowColor: lineColor
  });
  
  meta2d.render();
};

// 删除节点
const deleteNode = () => {
  if (!selectedNode.value || !meta2d) return;
  
  try {
    console.log('正在删除节点:', selectedNode.value.id);
    meta2d.delete([selectedNode.value.id]);
    selectedNode.value = null;
    meta2d.render(); // 确保渲染更新
    console.log('节点删除成功');
  } catch (error) {
    console.error('删除节点失败:', error);
  }
};

// 删除线条
const deleteLine = () => {
  if (!selectedLine.value || !meta2d) return;
  
  try {
    console.log('正在删除线条:', selectedLine.value.id);
    meta2d.delete([selectedLine.value.id]);
    selectedLine.value = null;
    meta2d.render(); // 确保渲染更新
    console.log('线条删除成功');
  } catch (error) {
    console.error('删除线条失败:', error);
  }
};

// 工具栏事件处理
const onNew = () => {
  if (confirm('确定要新建吗？当前未保存的内容将丢失。')) {
    meta2d.clear();
    selectedNode.value = null;
    selectedLine.value = null;
  }
};

const onSave = () => {
  if (!meta2d) return;
  
  // 获取完整的编辑器数据
  const data = meta2d.data();
  
  // 确保连线数据被保存并设置为可见样式
  const linesData = meta2d.getAllLines();
  if (linesData && linesData.length > 0) {
    console.log(`保存${linesData.length}条连线`);
    // 确保所有线条的样式都是可见的
    linesData.forEach((line: any) => {
      line.strokeStyle = line.strokeStyle || '#00a0ff';
      line.lineWidth = line.lineWidth || 2;
    });
  }
  
  localStorage.setItem('meta2d-wastewater', JSON.stringify(data));
  alert('保存成功！');
};

const onOpen = () => {
  if (!meta2d) return;
  loadFromStorage();
};

const onPen = () => {
  console.log('激活线条工具');
  activeTool.value = 'pen';
  // 设置默认线条样式
  meta2d.setOptions({
    lineColor: '#00a0ff',
    lineWidth: 2,
    fromArrowColor: '#00a0ff',
    toArrowColor: '#00a0ff',
  });
  meta2d.drawLine();
};

const onRect = () => {
  console.log('激活矩形工具');
  activeTool.value = 'rect';
  meta2d.drawRect();
};

const onCircle = () => {
  console.log('激活圆形工具');
  activeTool.value = 'circle';
  meta2d.drawCircle();
};

const onText = () => {
  console.log('激活文字工具');
  activeTool.value = 'text';
  meta2d.drawText();
};

const zoomIn = () => {
  meta2d.scale(scale.value + 0.1);
};

const zoomOut = () => {
  meta2d.scale(Math.max(0.1, scale.value - 0.1));
};

const resetZoom = () => {
  meta2d.scale(1);
};

// 测试功能
const addTestRect = () => {
  console.log('添加测试矩形');
  try {
    const rectComp = basicComponents.find(comp => comp.type === 'rect');
    if (rectComp && rectComp.data) {
      const node = meta2d.addNode({
        ...rectComp.data,
        x: 200,
        y: 200
      });
      console.log('测试矩形添加结果:', node);
      meta2d.render();
    }
  } catch (error) {
    console.error('添加测试元素失败:', error);
  }
};

const addTestCircle = () => {
  console.log('添加测试圆形');
  try {
    const circleComp = basicComponents.find(comp => comp.type === 'circle');
    if (circleComp && circleComp.data) {
      const node = meta2d.addNode({
        ...circleComp.data,
        x: 300,
        y: 200
      });
      console.log('测试圆形添加结果:', node);
      meta2d.render();
    }
  } catch (error) {
    console.error('添加测试元素失败:', error);
  }
};

const addTestPump = () => {
  console.log('添加测试泵');
  try {
    const pumpComp = waterComponents.value.find(comp => comp.name === '泵');
    if (pumpComp && pumpComp.data) {
      const node = meta2d.addNode({
        ...pumpComp.data,
        x: 200,
        y: 300
      });
      console.log('测试泵添加结果:', node);
      meta2d.render();
    }
  } catch (error) {
    console.error('添加测试元素失败:', error);
  }
};

// 组件卸载
onUnmounted(() => {
  if (meta2d) {
    meta2d.off('active', onElementSelected);
    meta2d.off('scale', onScale);
    meta2d.off('inactive', onElementInactive);
    meta2d.off('click', onClick);
    meta2d.off('move');
    meta2d.destroy();
  }
  
  // 删除键盘事件监听
  document.removeEventListener('keydown', handleKeyDown);
  
  // 移除鼠标移动监听
  if (container.value) {
    container.value.removeEventListener('mousemove', updateMousePosition);
  }
  
  // 清除定时器
  if (dataUpdateTimer) {
    clearInterval(dataUpdateTimer);
  }
});

// 添加键盘删除事件处理函数
const handleKeyDown = (e: KeyboardEvent) => {
  if ((e.key === 'Delete' || e.key === 'Backspace') && 
      meta2d && meta2d.activeLayer?.pens.length) {
    console.log('正在通过键盘删除元素');
    meta2d.delete();
    meta2d.render();
  }
};

// 在onMounted中添加事件监听
document.addEventListener('keydown', handleKeyDown);

// 在onUnmounted中移除事件监听
document.removeEventListener('keydown', handleKeyDown);

// 调试函数：尝试修复所有元素为可移动状态
const fixAllElementsMovable = () => {
  if (!meta2d) return;
  
  try {
    // 获取所有元素
    const allPens = meta2d.getAllPens();
    console.log('当前画布上的元素数量:', allPens.length);
    
    // 设置所有元素可移动
    allPens.forEach(pen => {
      meta2d.setPenProps(pen, {
        locked: 0,
        movable: true,
        selectable: true,
        disableTranslate: false,
        disableScale: false,
        disableRotate: false
      });
    });
    
    // 重新渲染
    meta2d.render();
    console.log('已将所有元素设置为可移动状态');
    
    // 尝试选中第一个元素以便调试
    if (allPens.length > 0) {
      meta2d.active([allPens[0]]);
      console.log('已选中第一个元素:', allPens[0]);
    }
  } catch (error) {
    console.error('修复元素可移动状态失败:', error);
  }
};

// 在onMounted最后调用一次，或者创建UI按钮调用此函数
</script>

<style scoped>
.meta2d-container {
  background-color: #0a1122; /* 更深邃的蓝黑色背景 */
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

/* 拖拽状态样式 */
.meta2d-container.drag-target {
  cursor: copy;
}

.meta2d-container.drag-over {
  border: 2px dashed rgba(0, 140, 255, 0.7);
  background-image: 
    radial-gradient(circle at 50% 50%, rgba(0, 120, 255, 0.2) 0%, transparent 80%),
    linear-gradient(rgba(0, 120, 255, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 120, 255, 0.1) 1px, transparent 1px);
  box-shadow: inset 0 0 140px rgba(0, 80, 255, 0.25);
}

.component {
  transition: transform 0.1s ease, background-color 0.1s ease, box-shadow 0.2s ease;
}

.component:hover {
  background-color: rgba(0, 140, 255, 0.1);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

body.dragging .component {
  cursor: grabbing;
}

body.dragging .component:hover {
  transform: none;
  box-shadow: none;
}

/* 添加底部水流动画效果 */
.meta2d-container::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 5px;
  background: linear-gradient(90deg, 
    rgba(0, 140, 255, 0.2), 
    rgba(0, 180, 255, 0.5), 
    rgba(0, 140, 255, 0.2));
  animation: waterFlow 15s linear infinite;
  z-index: 2;
}

/* 添加水流动画 */
@keyframes waterFlow {
  0% {
    background-position: 0% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.editor-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #070e1a; /* 更深的蓝黑色作为容器背景 */
}

.toolbar {
  user-select: none;
  background-color: #0c1428 !important; /* 深蓝色 */
  border-bottom: 1px solid rgba(0, 140, 255, 0.3);
}

/* 解决Safari拖放问题 */
[draggable] {
  -webkit-user-drag: element;
}

/* 头部标题样式，类似于图片上的标题 */
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

/* 组件面板样式 */
.component-panel {
  background-color: rgba(8, 16, 32, 0.95) !important;
  border-right: 1px solid rgba(0, 140, 255, 0.3);
  box-shadow: 5px 0 15px rgba(0, 0, 0, 0.3);
}

/* 属性面板样式 */
.property-panel {
  background-color: rgba(8, 16, 32, 0.95) !important;
  border-left: 1px solid rgba(0, 140, 255, 0.3);
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.3);
}

/* 组件项样式 */
.component {
  border: 1px solid rgba(0, 140, 255, 0.4) !important;
  background-color: rgba(12, 24, 48, 0.5) !important;
  transition: all 0.2s ease;
  backdrop-filter: blur(2px);
}
.component:hover {
  border-color: #00a0ff !important; 
  background-color: rgba(15, 30, 60, 0.7) !important;
  box-shadow: 0 0 10px rgba(0, 160, 255, 0.6);
  transform: translateY(-2px);
}

/* 组件网格布局 */
.components-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
}

/* 标签页样式 */
.tabs {
  background-color: rgba(10, 30, 60, 0.5);
}

.tab {
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab:hover {
  background-color: rgba(15, 40, 80, 0.5);
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

/* 添加缩放指示器样式 */
.canvas-container .absolute {
  background-color: rgba(10, 30, 60, 0.7);
  padding: 4px 10px;
  border-radius: 4px;
  border: 1px solid rgba(0, 140, 255, 0.5);
  color: #00c0ff;
  font-weight: 500;
  backdrop-filter: blur(5px);
}

/* 表单控件样式统一 */
input, select {
  background-color: rgba(10, 30, 60, 0.6) !important;
  border: 1px solid rgba(0, 140, 255, 0.5) !important;
  color: #e6f7ff !important;
  transition: all 0.2s ease;
}

input:focus, select:focus {
  border-color: #00a0ff !important;
  box-shadow: 0 0 0 2px rgba(0, 160, 255, 0.2) !important;
  outline: none !important;
}

/* 添加组件预览样式 */
.component-preview {
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-rect {
  width: 80%;
  height: 80%;
  border-radius: 2px;
}

.preview-circle {
  width: 80%;
  height: 80%;
  border-radius: 50%;
}

/* 搜索框样式 */
.search-container {
  margin-bottom: 0.5rem;
}

input[type="text"]::placeholder {
  color: rgba(180, 230, 255, 0.4);
}

/* 滚动条样式 */
.component-panel::-webkit-scrollbar, 
.property-panel::-webkit-scrollbar,
.max-h-28::-webkit-scrollbar {
  width: 4px;
}

.component-panel::-webkit-scrollbar-track, 
.property-panel::-webkit-scrollbar-track,
.max-h-28::-webkit-scrollbar-track {
  background: rgba(8, 16, 32, 0.5);
}

.component-panel::-webkit-scrollbar-thumb, 
.property-panel::-webkit-scrollbar-thumb,
.max-h-28::-webkit-scrollbar-thumb {
  background: rgba(0, 140, 255, 0.5);
  border-radius: 2px;
}

.component-panel::-webkit-scrollbar-thumb:hover, 
.property-panel::-webkit-scrollbar-thumb:hover,
.max-h-28::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 160, 255, 0.7);
}

/* 数据指标卡样式 */
.data-metrics {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 250px;
  background: rgba(8, 16, 32, 0.8);
  border: 1px solid rgba(0, 140, 255, 0.5);
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3), 0 0 20px rgba(0, 120, 255, 0.2);
  z-index: 10;
  overflow: hidden;
  backdrop-filter: blur(5px);
}

.metrics-title {
  font-size: 0.9rem;
  color: #00c0ff;
  text-shadow: 0 0 5px rgba(0, 180, 255, 0.5);
  padding: 0.5rem;
  background: rgba(10, 30, 60, 0.9);
  text-align: center;
  border-bottom: 1px solid rgba(0, 140, 255, 0.5);
}

.metrics-container {
  padding: 0.5rem;
}

.metric-item {
  margin-bottom: 0.8rem;
  position: relative;
}

.metric-name {
  font-size: 0.8rem;
  color: rgba(220, 240, 255, 0.8);
  margin-bottom: 0.2rem;
}

.metric-value {
  font-size: 1.2rem;
  color: #00e5ff;
  text-shadow: 0 0 8px rgba(0, 200, 255, 0.6);
  font-weight: 500;
  margin-bottom: 0.3rem;
  display: flex;
  align-items: baseline;
}

.unit {
  font-size: 0.7rem;
  color: rgba(0, 180, 255, 0.7);
  margin-left: 0.3rem;
}

.metric-chart {
  height: 6px;
  background-color: rgba(220, 240, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.chart-bar {
  height: 100%;
  background: linear-gradient(90deg, #0066cc, #00c0ff);
  border-radius: 3px;
  transition: width 0.8s ease-in-out;
}

.status-indicator {
  position: absolute;
  top: 0.1rem;
  right: 0;
  width: 0.8rem;
  height: 0.8rem;
  border-radius: 50%;
  background-color: #ff5555;
  box-shadow: 0 0 10px #ff5555;
  animation: pulse 2s infinite;
}

.status-normal {
  background-color: #00e060;
  box-shadow: 0 0 10px #00e060;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
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

/* 添加信息显示区样式 */
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

/* 添加指标卡标题装饰 */
.metrics-title-decoration {
  position: absolute;
  top: 0;
  right: 0;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 20px 20px 0;
  border-color: transparent #00a0ff transparent transparent;
}

/* 网格线叠加层 */
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

/* 缩放显示 */
.zoom-display {
  font-family: monospace;
}
</style> 