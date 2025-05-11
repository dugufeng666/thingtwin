<template>
  <div class="editor-container">
    <div class="header-title">
      <span class="highlight">污水处理系统</span>数字孪生平台
      <div class="subtitle">Wastewater Treatment Digital Twin Platform</div>
    </div>
    
    <div class="toolbar bg-gray-800 p-2 flex items-center space-x-2">
      <div class="left-tools flex space-x-2">
        <button @click="onNew" class="btn bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded">
          新建
        </button>
        <button @click="onSave" class="btn bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded">
          保存
        </button>
        <button @click="onOpen" class="btn bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded">
          打开
        </button>
      </div>
      <div class="divider border-l border-gray-600 h-6 mx-2"></div>
      <div class="draw-tools flex space-x-2">
        <button @click="onPen" class="btn bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded" :class="{ 'bg-blue-600': activeTool === 'pen' }">
          线条
        </button>
        <button @click="onRect" class="btn bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded" :class="{ 'bg-blue-600': activeTool === 'rect' }">
          矩形
        </button>
        <button @click="onCircle" class="btn bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded" :class="{ 'bg-blue-600': activeTool === 'circle' }">
          圆形
        </button>
        <button @click="onText" class="btn bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded" :class="{ 'bg-blue-600': activeTool === 'text' }">
          文字
        </button>
      </div>
      <div class="divider border-l border-gray-600 h-6 mx-2"></div>
      <div class="view-tools flex space-x-2">
        <button @click="zoomIn" class="btn bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded">
          放大
        </button>
        <button @click="zoomOut" class="btn bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded">
          缩小
        </button>
        <button @click="resetZoom" class="btn bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded">
          重置
        </button>
      </div>
    </div>

    <div class="flex h-[calc(100vh-10rem)]">
      <!-- 组件库 -->
      <div class="component-panel w-60 bg-gray-800 overflow-y-auto p-4">
        <h3 class="text-white text-lg font-medium mb-4">污水处理组件</h3>
        
        <!-- 搜索框 -->
        <div class="mb-4">
          <input 
            type="text" 
            v-model="componentSearchQuery" 
            placeholder="搜索组件..." 
            class="w-full px-2 py-1 bg-gray-700 rounded border border-gray-600 text-white"
          />
        </div>
        
        <div class="grid grid-cols-2 gap-3">
          <div 
            v-for="(comp, index) in filteredWaterComponents" 
            :key="index"
            class="component cursor-pointer bg-gray-700 p-2 rounded flex flex-col items-center hover:bg-gray-600"
            draggable="true"
            @dragstart="onDragStart($event, comp)"
            @click="onComponentClick(comp)"
          >
            <img v-if="comp.image" :src="comp.image" :alt="comp.name" class="w-12 h-12 mb-2" draggable="false" />
            <div v-else class="w-12 h-12 mb-2 flex items-center justify-center component-preview" draggable="false">
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
            <span class="text-xs text-white text-center">{{ comp.name }}</span>
          </div>
        </div>

        <h3 class="text-white text-lg font-medium mt-6 mb-4">基础组件</h3>
        <div class="grid grid-cols-2 gap-3">
          <div 
            v-for="(comp, index) in basicComponents" 
            :key="index"
            class="component cursor-pointer bg-gray-700 p-2 rounded flex flex-col items-center hover:bg-gray-600"
            draggable="true"
            @dragstart="onDragStart($event, comp)"
            @click="onComponentClick(comp)"
          >
            <div class="w-12 h-12 mb-2 flex items-center justify-center" :class="comp.iconClass" draggable="false">
              <svg v-if="comp.type === 'rect'" class="w-8 h-8" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" fill="currentColor" fill-opacity="0.3" stroke="currentColor" stroke-width="2" />
              </svg>
              
              <svg v-else-if="comp.type === 'circle'" class="w-8 h-8" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" fill="currentColor" fill-opacity="0.3" stroke="currentColor" stroke-width="2" />
              </svg>
              
              <svg v-else-if="comp.type === 'text'" class="w-8 h-8" viewBox="0 0 24 24">
                <text x="12" y="16" text-anchor="middle" font-size="18" font-weight="bold" fill="currentColor">T</text>
              </svg>
              
              <svg v-else-if="comp.type === 'line'" class="w-8 h-8" viewBox="0 0 24 24">
                <line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" stroke-width="3" />
              </svg>
            </div>
            <span class="text-xs text-white text-center">{{ comp.name }}</span>
          </div>
        </div>
        
        <!-- 测试按钮区域 -->
        <div class="mt-6 border-t border-gray-700 pt-4">
          <h3 class="text-white text-lg font-medium mb-4">测试功能</h3>
          <div class="grid grid-cols-1 gap-2">
            <button 
              @click="addTestRect" 
              class="btn bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded text-sm"
            >
              添加测试矩形
            </button>
            <button 
              @click="addTestCircle" 
              class="btn bg-green-600 hover:bg-green-500 text-white px-3 py-2 rounded text-sm"
            >
              添加测试圆形
            </button>
            <button 
              @click="addTestPump" 
              class="btn bg-purple-600 hover:bg-purple-500 text-white px-3 py-2 rounded text-sm"
            >
              添加测试泵
            </button>
          </div>
        </div>
      </div>

      <!-- 编辑器画布 -->
      <div class="canvas-container flex-1 relative">
        <div id="meta2d" ref="container" class="meta2d-container w-full h-full"></div>
        <div class="absolute bottom-4 right-4 text-gray-400 text-sm">
          缩放: {{ Math.round(scale * 100) }}%
        </div>
        
        <!-- 实时数据指标卡 -->
        <div class="data-metrics">
          <div class="metrics-title">实时运行数据</div>
          <div class="metrics-container">
            <div class="metric-item">
              <div class="metric-name">进水流量</div>
              <div class="metric-value">{{ simulatedData.inletFlow }}<span class="unit">m³/h</span></div>
              <div class="metric-chart">
                <div class="chart-bar" :style="{ width: `${simulatedData.inletFlowPercent}%` }"></div>
              </div>
            </div>
            <div class="metric-item">
              <div class="metric-name">出水水质</div>
              <div class="metric-value">{{ simulatedData.outletQuality }}<span class="unit">mg/L</span></div>
              <div class="metric-chart">
                <div class="chart-bar" :style="{ width: `${simulatedData.outletQualityPercent}%` }"></div>
              </div>
            </div>
            <div class="metric-item">
              <div class="metric-name">曝气强度</div>
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

      <!-- 属性面板 -->
      <div class="property-panel w-64 bg-gray-800 overflow-y-auto p-4">
        <h3 class="text-white text-lg font-medium mb-4">属性</h3>
        <div v-if="selectedNode">
          <div class="mb-4">
            <label class="block text-gray-400 text-sm mb-1">名称</label>
            <input 
              v-model="selectedNode.name" 
              @change="updateNode"
              class="w-full px-2 py-1 bg-gray-700 rounded border border-gray-600 text-white"
            />
          </div>
          <div class="grid grid-cols-2 gap-2 mb-4">
            <div>
              <label class="block text-gray-400 text-sm mb-1">X坐标</label>
              <input 
                v-model.number="selectedNode.x" 
                @change="updateNode"
                type="number" 
                class="w-full px-2 py-1 bg-gray-700 rounded border border-gray-600 text-white"
              />
            </div>
            <div>
              <label class="block text-gray-400 text-sm mb-1">Y坐标</label>
              <input 
                v-model.number="selectedNode.y" 
                @change="updateNode"
                type="number" 
                class="w-full px-2 py-1 bg-gray-700 rounded border border-gray-600 text-white"
              />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-2 mb-4">
            <div>
              <label class="block text-gray-400 text-sm mb-1">宽度</label>
              <input 
                v-model.number="selectedNode.width" 
                @change="updateNode"
                type="number" 
                class="w-full px-2 py-1 bg-gray-700 rounded border border-gray-600 text-white"
              />
            </div>
            <div>
              <label class="block text-gray-400 text-sm mb-1">高度</label>
              <input 
                v-model.number="selectedNode.height" 
                @change="updateNode"
                type="number" 
                class="w-full px-2 py-1 bg-gray-700 rounded border border-gray-600 text-white"
              />
            </div>
          </div>

          <!-- 数据绑定区域 -->
          <div class="mb-4 border-t border-gray-700 pt-4">
            <h4 class="text-white text-md font-medium mb-3">数据绑定</h4>
            <div class="mb-3">
              <label class="block text-gray-400 text-sm mb-1">设备</label>
              <select 
                v-model="selectedNode.deviceId" 
                @change="updateNodeData"
                class="w-full px-2 py-1 bg-gray-700 rounded border border-gray-600 text-white"
              >
                <option value="">无</option>
                <option v-for="device in devices" :key="device.id" :value="device.id">
                  {{ device.name }}
                </option>
              </select>
            </div>
            <div v-if="selectedNode.deviceId">
              <label class="block text-gray-400 text-sm mb-1">数据点</label>
              <div v-if="deviceDataPoints.length > 0">
                <div v-for="(point, index) in deviceDataPoints" :key="index" class="flex items-center mb-1">
                  <input 
                    type="checkbox" 
                    :id="'dp-' + index" 
                    :value="point" 
                    v-model="selectedNode.dataPoints"
                    @change="updateNodeData"
                    class="mr-2"
                  />
                  <label :for="'dp-' + index" class="text-gray-300 text-sm">{{ point }}</label>
                </div>
              </div>
              <div v-else class="text-gray-500 text-sm">该设备没有可用数据点</div>
            </div>
          </div>

          <div class="flex justify-end mt-4">
            <button @click="deleteNode" class="btn bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded">
              删除
            </button>
          </div>
        </div>
        <div v-else-if="selectedLine">
          <div class="mb-4">
            <label class="block text-gray-400 text-sm mb-1">名称</label>
            <input 
              v-model="selectedLine.name" 
              @change="updateLine"
              class="w-full px-2 py-1 bg-gray-700 rounded border border-gray-600 text-white"
            />
          </div>
          <div class="mb-4">
            <label class="block text-gray-400 text-sm mb-1">线条颜色</label>
            <input 
              v-model="selectedLine.lineColor" 
              @change="updateLine"
              type="color" 
              class="w-full h-8 bg-gray-700 rounded border border-gray-600"
            />
          </div>
          <div class="mb-4">
            <label class="block text-gray-400 text-sm mb-1">线条宽度</label>
            <input 
              v-model.number="selectedLine.lineWidth" 
              @change="updateLine"
              type="number" 
              min="1" 
              max="10"
              class="w-full px-2 py-1 bg-gray-700 rounded border border-gray-600 text-white"
            />
          </div>
          <div class="flex justify-end mt-4">
            <button @click="deleteLine" class="btn bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded">
              删除
            </button>
          </div>
        </div>
        <div v-else class="text-gray-500 text-center py-10">
          未选中任何元素
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

// meta2d实例
let meta2d = null;
const container = ref(null);
const scale = ref(1);
const activeTool = ref('');

// 选中的元素
const selectedNode = ref(null);
const selectedLine = ref(null);

// 设备列表
const devices = ref([]);

// 搜索功能
const componentSearchQuery = ref('');

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

// 污水处理组件列表
const waterComponents = ref([]);

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
    name: '矩形',
    iconClass: 'bg-blue-800 text-blue-200',
    width: 100,
    height: 80,
    data: {
      name: 'rect',
      text: '',
      width: 100,
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
      borderRadius: 0.5,
      ellipse: {
        fill: 'rgba(16, 185, 129, 0.3)',
        strokeWidth: 2,
        stroke: '#10B981'
      }
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

// 初始化编辑器
onMounted(async () => {
  console.log('初始化Meta2d编辑器...');
  
  // 注册污水处理组件图标
  registerWastewaterIcons();
  
  // 初始化组件库
  initComponents();
  
  // 初始化meta2d
  meta2d = new Meta2d('meta2d');
  console.log('Meta2d实例创建成功:', meta2d);
  
  // 注册事件
  meta2d.on('active', onElementSelected);
  meta2d.on('inactive', () => {
    selectedNode.value = null;
    selectedLine.value = null;
  });
  meta2d.on('scale', onScale);
  console.log('Meta2d事件注册完成');
  
  // 初始化画布
  initCanvas();
  console.log('画布初始化完成');
  
  // 可以在这里注册库：
  meta2d.register(wastewaterComponents());
  
  // 加载设备数据
  await fetchDevices();
  
  // 从本地存储加载
  loadFromStorage();
  
  // 测试添加一个元素
  console.log('测试添加元素...');
  setTimeout(() => {
    console.log('尝试添加测试矩形');
    try {
      const node = meta2d.addNode({
        name: '测试矩形',
        x: 200,
        y: 200,
        width: 100,
        height: 80,
        rect: {
          fill: 'rgba(255, 0, 0, 0.3)',
          strokeWidth: 2,
          stroke: '#ff0000'
        }
      });
      console.log('测试矩形添加结果:', node);
      meta2d.render();
    } catch (error) {
      console.error('添加测试元素失败:', error);
    }
  }, 2000);
  
  // 启动数据模拟
  dataUpdateTimer = setInterval(updateSimulatedData, 3000);
});

// 从本地存储加载
const loadFromStorage = () => {
  try {
    const savedData = localStorage.getItem('meta2d-wastewater');
    if (savedData) {
      meta2d.open(JSON.parse(savedData));
      console.log('从本地存储加载数据成功');
    }
  } catch (error) {
    console.error('从本地存储加载数据失败:', error);
  }
};

// 初始化画布
const initCanvas = () => {
  meta2d.setOptions({
    grid: true,
    gridColor: '#282828',
    gridSize: 20,
    rule: true,
    ruleColor: '#888',
    dragToPanning: false,
    disableTranslate: false, 
    disableScale: false,
    disableRotate: false,
    alwaysAnchor: false,
    autoAnchor: true,
    autoScrollByCursor: true,
    scrolling: {
      enable: true
    }
  });
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

// 元素拖拽开始
const onDragStart = (e, comp) => {
  console.log('拖拽开始，组件:', comp.name, '类型:', comp.type);
  
  // 设置拖拽效果
  e.dataTransfer.effectAllowed = 'copy';
  
  try {
    // 使用官方的数据格式：Meta2d
    const compData = comp.data || {
      name: comp.name,
      width: comp.width,
      height: comp.height
    };
    
    const compStr = JSON.stringify(compData);
    console.log('序列化组件数据:', compStr);
    e.dataTransfer.setData('Meta2d', compStr);
  } catch (error) {
    console.error('设置拖拽数据失败:', error);
  }
};

// 组件点击添加
const onComponentClick = (comp) => {
  console.log('组件点击:', comp.name);
  
  // 支持单击添加图元
  if (comp.data && meta2d) {
    meta2d.canvas.addCaches = [comp.data];
  }
};

// 画布事件处理
const onElementSelected = (nodes, lines) => {
  console.log('元素选中事件:', nodes, lines);
  
  if (nodes && nodes.length === 1) {
    selectedNode.value = { ...nodes[0] };
    selectedLine.value = null;
  } else if (lines && lines.length === 1) {
    selectedLine.value = { ...lines[0] };
    selectedNode.value = null;
  } else {
    selectedNode.value = null;
    selectedLine.value = null;
  }
};

// 缩放事件处理
const onScale = ({ scale: newScale }) => {
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

  meta2d.updateLine({
    id: selectedLine.value.id,
    name: selectedLine.value.name,
    lineColor: selectedLine.value.lineColor,
    lineWidth: selectedLine.value.lineWidth
  });
  
  meta2d.render();
};

// 删除节点
const deleteNode = () => {
  if (!selectedNode.value || !meta2d) return;
  meta2d.delete([selectedNode.value.id]);
  selectedNode.value = null;
};

// 删除线条
const deleteLine = () => {
  if (!selectedLine.value || !meta2d) return;
  meta2d.delete([selectedLine.value.id]);
  selectedLine.value = null;
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
  const data = meta2d.data();
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
    meta2d.destroy();
  }
  
  // 清除定时器
  if (dataUpdateTimer) {
    clearInterval(dataUpdateTimer);
  }
});
</script>

<style scoped>
.meta2d-container {
  background-color: #001e3e; /* 更深邃的蓝色背景 */
  background-image: 
    linear-gradient(rgba(0, 204, 255, 0.07) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 204, 255, 0.07) 1px, transparent 1px);
  background-size: 20px 20px;
  box-shadow: inset 0 0 80px rgba(0, 150, 255, 0.15);
  border: 1px solid rgba(0, 204, 255, 0.2);
  position: relative;
  overflow: hidden;
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
    rgba(0, 204, 255, 0.2), 
    rgba(0, 204, 255, 0.4), 
    rgba(0, 204, 255, 0.2));
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
  height: 100%;
  background-color: #001428; /* 更深的蓝色作为容器背景 */
}

.toolbar {
  user-select: none;
  background-color: #001a33 !important; /* 不同的蓝色 */
  border-bottom: 1px solid rgba(0, 204, 255, 0.3);
}

/* 解决Safari拖放问题 */
[draggable] {
  -webkit-user-drag: element;
}

/* 头部标题样式，类似于图片上的标题 */
.header-title {
  color: #00ccff;
  text-shadow: 0 0 15px rgba(0, 204, 255, 0.8);
  font-size: 1.8rem;
  font-weight: bold;
  text-align: center;
  padding: 0.8rem 0;
  width: 100%;
  background: linear-gradient(to right, rgba(0, 20, 40, 0.5), rgba(0, 60, 120, 0.7), rgba(0, 20, 40, 0.5));
  letter-spacing: 1px;
  border-bottom: 1px solid rgba(0, 204, 255, 0.3);
}

/* 标题强调样式 */
.header-title .highlight {
  color: #00f7ff;
  text-shadow: 0 0 20px rgba(0, 247, 255, 0.9);
}

/* 英文副标题 */
.header-title .subtitle {
  font-size: 0.9rem;
  color: rgba(0, 204, 255, 0.7);
  margin-top: 0.2rem;
  font-weight: normal;
  letter-spacing: 1.5px;
}

/* 组件面板样式 */
.component-panel {
  background-color: rgba(0, 20, 40, 0.85) !important;
  border-right: 1px solid rgba(0, 204, 255, 0.3);
  box-shadow: 5px 0 15px rgba(0, 0, 0, 0.2);
}

/* 属性面板样式 */
.property-panel {
  background-color: rgba(0, 20, 40, 0.85) !important;
  border-left: 1px solid rgba(0, 204, 255, 0.3);
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.2);
}

/* 组件项样式 */
.component {
  border: 1px solid rgba(0, 204, 255, 0.4) !important;
  background-color: rgba(0, 30, 60, 0.5) !important;
  transition: all 0.2s ease;
}
.component:hover {
  border-color: #00ccff !important; 
  background-color: rgba(0, 42, 84, 0.7) !important;
  box-shadow: 0 0 10px rgba(0, 204, 255, 0.5);
  transform: translateY(-2px);
}

/* 按钮样式 */
.btn {
  background-color: rgba(0, 42, 84, 0.7) !important;
  border: 1px solid rgba(0, 204, 255, 0.4);
  transition: all 0.2s ease;
}
.btn:hover {
  background-color: rgba(0, 60, 120, 0.8) !important;
  border-color: #00ccff;
  box-shadow: 0 0 8px rgba(0, 204, 255, 0.4);
}

/* 添加缩放指示器样式 */
.canvas-container .absolute {
  background-color: rgba(0, 30, 60, 0.6);
  padding: 4px 10px;
  border-radius: 4px;
  border: 1px solid rgba(0, 204, 255, 0.3);
  color: #00ccff;
  font-weight: 500;
}

/* 表单控件样式统一 */
input, select {
  background-color: rgba(0, 30, 60, 0.5) !important;
  border: 1px solid rgba(0, 204, 255, 0.4) !important;
  color: #e6f7ff !important;
  transition: all 0.2s ease;
}

input:focus, select:focus {
  border-color: #00ccff !important;
  box-shadow: 0 0 0 2px rgba(0, 204, 255, 0.2) !important;
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
input[type="text"]::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

/* 滚动条样式 */
.component-panel::-webkit-scrollbar {
  width: 6px;
}

.component-panel::-webkit-scrollbar-track {
  background: rgba(0, 20, 40, 0.5);
}

.component-panel::-webkit-scrollbar-thumb {
  background: rgba(0, 204, 255, 0.5);
  border-radius: 3px;
}

.component-panel::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 204, 255, 0.7);
}

/* 数据指标卡样式 */
.data-metrics {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 280px;
  background: rgba(0, 20, 40, 0.8);
  border: 1px solid rgba(0, 204, 255, 0.4);
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 10;
  overflow: hidden;
}

.metrics-title {
  font-size: 0.9rem;
  color: #00ccff;
  text-shadow: 0 0 5px rgba(0, 204, 255, 0.5);
  padding: 0.5rem;
  background: rgba(0, 30, 60, 0.9);
  text-align: center;
  border-bottom: 1px solid rgba(0, 204, 255, 0.4);
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
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 0.2rem;
}

.metric-value {
  font-size: 1.2rem;
  color: #00f7ff;
  text-shadow: 0 0 8px rgba(0, 247, 255, 0.6);
  font-weight: 500;
  margin-bottom: 0.3rem;
  display: flex;
  align-items: baseline;
}

.unit {
  font-size: 0.7rem;
  color: rgba(0, 204, 255, 0.7);
  margin-left: 0.3rem;
}

.metric-chart {
  height: 6px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.chart-bar {
  height: 100%;
  background: linear-gradient(90deg, #0088cc, #00ccff);
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
  background-color: #ff3333;
  box-shadow: 0 0 10px #ff3333;
  animation: pulse 2s infinite;
}

.status-normal {
  background-color: #00cc66;
  box-shadow: 0 0 10px #00cc66;
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
</style> 