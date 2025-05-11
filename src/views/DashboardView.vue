<template>
  <div class="dashboard">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">污水处理系统实时监控</h1>
      <div class="flex items-center gap-2">
        <span class="text-gray-400">数据刷新:</span>
        <span class="text-green-500 flex items-center">
          <span class="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
          实时更新
        </span>
      </div>
    </div>

    <!-- 状态概览 -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="card p-4 flex items-center">
        <div class="w-12 h-12 rounded-full bg-blue-900 flex items-center justify-center text-blue-200 mr-4">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
          </svg>
        </div>
        <div>
          <div class="text-gray-400 text-sm">处理量</div>
          <div class="text-2xl font-semibold">{{ processedWater }} m³/h</div>
        </div>
      </div>
      
      <div class="card p-4 flex items-center">
        <div class="w-12 h-12 rounded-full bg-green-900 flex items-center justify-center text-green-200 mr-4">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <div>
          <div class="text-gray-400 text-sm">出水水质</div>
          <div class="text-2xl font-semibold">{{ waterQualityStatus }}</div>
        </div>
      </div>
      
      <div class="card p-4 flex items-center">
        <div class="w-12 h-12 rounded-full bg-yellow-900 flex items-center justify-center text-yellow-200 mr-4">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
        </div>
        <div>
          <div class="text-gray-400 text-sm">能耗</div>
          <div class="text-2xl font-semibold">{{ energyConsumption }} kWh</div>
        </div>
      </div>
      
      <div class="card p-4 flex items-center">
        <div class="w-12 h-12 rounded-full bg-red-900 flex items-center justify-center text-red-200 mr-4">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
        </div>
        <div>
          <div class="text-gray-400 text-sm">告警数量</div>
          <div class="text-2xl font-semibold">{{ alarmCount }}</div>
        </div>
      </div>
    </div>
    
    <!-- 工艺流程图 -->
    <div class="card mb-6">
      <div class="p-4 border-b border-gray-700">
        <h2 class="text-xl font-semibold">工艺流程</h2>
      </div>
      <div class="p-4 overflow-auto">
        <div class="process-diagram min-w-[800px] h-[400px] relative">
          <!-- 进水 -->
          <div class="absolute left-[50px] top-[170px] flex items-center">
            <div class="w-[80px] h-[60px] bg-blue-800 rounded flex items-center justify-center text-white">
              进水口
            </div>
            <div class="h-[10px] w-[40px] bg-blue-600"></div>
          </div>
          
          <!-- 格栅 -->
          <div class="absolute left-[170px] top-[150px] flex flex-col items-center">
            <div class="text-xs text-gray-400 mb-1">格栅除渣</div>
            <div class="w-[80px] h-[80px] bg-gray-700 rounded flex items-center justify-center relative">
              <div class="absolute w-full">
                <div class="w-full flex justify-between px-2">
                  <div class="w-[2px] h-[60px] bg-gray-500"></div>
                  <div class="w-[2px] h-[60px] bg-gray-500"></div>
                  <div class="w-[2px] h-[60px] bg-gray-500"></div>
                  <div class="w-[2px] h-[60px] bg-gray-500"></div>
                  <div class="w-[2px] h-[60px] bg-gray-500"></div>
                </div>
              </div>
            </div>
            <div class="mt-1 text-sm" :class="deviceStatus['WTP-002'].statusClass">{{ deviceStatus['WTP-002'].status }}</div>
          </div>
          
          <!-- 初沉池 -->
          <div class="absolute left-[300px] top-[150px] flex flex-col items-center">
            <div class="text-xs text-gray-400 mb-1">初沉池</div>
            <div class="w-[100px] h-[80px] bg-gray-600 rounded-lg flex items-center justify-center relative overflow-hidden">
              <div class="absolute bottom-0 left-0 right-0 bg-blue-700" :style="{height: deviceStatus['WTP-003'].levelHeight}"></div>
              <div class="absolute w-full h-full flex items-center justify-center text-white text-sm">
                {{ deviceStatus['WTP-003'].level }}%
              </div>
            </div>
            <div class="mt-1 text-sm" :class="deviceStatus['WTP-003'].statusClass">{{ deviceStatus['WTP-003'].status }}</div>
          </div>
          
          <!-- 曝气池 -->
          <div class="absolute left-[450px] top-[130px] flex flex-col items-center">
            <div class="text-xs text-gray-400 mb-1">曝气池</div>
            <div class="w-[120px] h-[120px] bg-blue-900 rounded-lg flex items-center justify-center relative overflow-hidden">
              <div class="absolute bottom-0 left-0 right-0 bg-blue-700" :style="{height: '80%'}"></div>
              <div class="absolute w-full h-full">
                <div v-for="i in 10" :key="i" class="absolute bg-white rounded-full" :style="{
                  width: `${4 + Math.random() * 6}px`,
                  height: `${4 + Math.random() * 6}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${40 + Math.random() * 50}%`,
                  animationDuration: `${1 + Math.random() * 3}s`,
                  animationDelay: `${Math.random() * 2}s`
                }"></div>
              </div>
              <div class="absolute top-2 right-2 bg-green-800 text-green-100 text-xs py-1 px-2 rounded">
                DO: {{ deviceStatus['WTP-004'].oxygen }} mg/L
              </div>
            </div>
            <div class="mt-1 text-sm" :class="deviceStatus['WTP-004'].statusClass">{{ deviceStatus['WTP-004'].status }}</div>
          </div>
          
          <!-- 二沉池 -->
          <div class="absolute left-[620px] top-[150px] flex flex-col items-center">
            <div class="text-xs text-gray-400 mb-1">二沉池</div>
            <div class="w-[100px] h-[80px] bg-gray-600 rounded-lg flex items-center justify-center relative overflow-hidden">
              <div class="absolute bottom-0 left-0 right-0 bg-blue-600" :style="{height: deviceStatus['WTP-005'].levelHeight}"></div>
              <div class="absolute w-full h-full flex items-center justify-center text-white text-sm">
                {{ deviceStatus['WTP-005'].level }}%
              </div>
            </div>
            <div class="mt-1 text-sm" :class="deviceStatus['WTP-005'].statusClass">{{ deviceStatus['WTP-005'].status }}</div>
          </div>
          
          <!-- 消毒池 -->
          <div class="absolute left-[770px] top-[150px] flex flex-col items-center">
            <div class="text-xs text-gray-400 mb-1">消毒池</div>
            <div class="w-[100px] h-[80px] bg-green-900 rounded-lg flex items-center justify-center relative overflow-hidden">
              <div class="absolute bottom-0 left-0 right-0 bg-green-700" :style="{height: '70%'}"></div>
              <div class="absolute top-2 right-2 bg-green-800 text-green-100 text-xs py-1 px-2 rounded">
                Cl: {{ deviceStatus['WTP-007'].chlorine }} mg/L
              </div>
            </div>
            <div class="mt-1 text-sm" :class="deviceStatus['WTP-007'].statusClass">{{ deviceStatus['WTP-007'].status }}</div>
          </div>
          
          <!-- 出水 -->
          <div class="absolute right-[50px] top-[170px] flex items-center">
            <div class="h-[10px] w-[40px] bg-blue-500"></div>
            <div class="w-[80px] h-[60px] bg-blue-700 rounded flex items-center justify-center text-white">
              出水
            </div>
          </div>
          
          <!-- 连接线 -->
          <svg class="absolute top-0 left-0 w-full h-full">
            <path d="M170 180 L250 180" stroke="#3B82F6" stroke-width="4"></path>
            <path d="M350 180 L400 180" stroke="#3B82F6" stroke-width="4"></path>
            <path d="M570 180 L620 180" stroke="#3B82F6" stroke-width="4"></path>
            <path d="M720 180 L770 180" stroke="#3B82F6" stroke-width="4"></path>
            <path d="M870 180 L920 180" stroke="#3B82F6" stroke-width="4"></path>
          </svg>
        </div>
      </div>
    </div>
    
    <!-- 告警列表 -->
    <div class="card mb-6">
      <div class="p-4 border-b border-gray-700 flex justify-between items-center">
        <h2 class="text-xl font-semibold">告警信息</h2>
        <button class="btn btn-primary py-1">查看全部</button>
      </div>
      <div class="p-0">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="bg-gray-800">
                <th class="p-4 text-left">时间</th>
                <th class="p-4 text-left">设备</th>
                <th class="p-4 text-left">类型</th>
                <th class="p-4 text-left">描述</th>
                <th class="p-4 text-left">值</th>
                <th class="p-4 text-left">阈值</th>
                <th class="p-4 text-left">状态</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="alarm in alarms" :key="alarm.id" class="border-t border-gray-700 hover:bg-gray-800">
                <td class="p-4">{{ formatTime(alarm.timestamp) }}</td>
                <td class="p-4">{{ alarm.deviceName }}</td>
                <td class="p-4">
                  <span :class="{
                    'bg-red-900 text-red-200': alarm.type === 'High',
                    'bg-yellow-900 text-yellow-200': alarm.type === 'Medium',
                    'bg-blue-900 text-blue-200': alarm.type === 'Low'
                  }" class="px-2 py-1 rounded text-xs">
                    {{ alarm.type }}
                  </span>
                </td>
                <td class="p-4">{{ alarm.description }}</td>
                <td class="p-4">{{ alarm.value }}</td>
                <td class="p-4">{{ alarm.threshold }}</td>
                <td class="p-4">
                  <span class="bg-red-900 text-red-200 px-2 py-1 rounded text-xs">
                    {{ alarm.status }}
                  </span>
                </td>
              </tr>
              <tr v-if="alarms.length === 0">
                <td colspan="7" class="p-4 text-center text-gray-500">暂无告警信息</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    
    <!-- 设备状态 -->
    <div class="card">
      <div class="p-4 border-b border-gray-700">
        <h2 class="text-xl font-semibold">设备状态</h2>
      </div>
      <div class="p-0">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="bg-gray-800">
                <th class="p-4 text-left">设备ID</th>
                <th class="p-4 text-left">名称</th>
                <th class="p-4 text-left">类型</th>
                <th class="p-4 text-left">位置</th>
                <th class="p-4 text-left">状态</th>
                <th class="p-4 text-left">最后通信</th>
                <th class="p-4 text-left">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="device in devices" :key="device.id" class="border-t border-gray-700 hover:bg-gray-800">
                <td class="p-4">{{ device.id }}</td>
                <td class="p-4">{{ device.name }}</td>
                <td class="p-4">{{ device.type }}</td>
                <td class="p-4">{{ device.location }}</td>
                <td class="p-4">
                  <span :class="{
                    'bg-green-900 text-green-200': device.status === 'Online',
                    'bg-red-900 text-red-200': device.status === 'Offline',
                    'bg-yellow-900 text-yellow-200': device.status === 'Maintenance'
                  }" class="px-2 py-1 rounded text-xs">
                    {{ device.status }}
                  </span>
                </td>
                <td class="p-4">{{ formatTime(device.lastConnection) }}</td>
                <td class="p-4">
                  <button class="text-blue-500 hover:text-blue-400 mr-2">详情</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import axios from 'axios';

// 模拟数据
const processedWater = ref(104.2);
const waterQualityStatus = ref('合格');
const energyConsumption = ref(285.7);
const alarmCount = ref(3);

// 设备状态数据
const deviceStatus = reactive({
  'WTP-001': { status: '正常', statusClass: 'text-green-500', level: 65 },
  'WTP-002': { status: '正常', statusClass: 'text-green-500' },
  'WTP-003': { status: '正常', statusClass: 'text-green-500', level: 82, levelHeight: '82%' },
  'WTP-004': { status: '告警', statusClass: 'text-red-500', oxygen: 1.2 },
  'WTP-005': { status: '正常', statusClass: 'text-green-500', level: 78, levelHeight: '78%' },
  'WTP-006': { status: '告警', statusClass: 'text-red-500' },
  'WTP-007': { status: '告警', statusClass: 'text-yellow-500', chlorine: 0.3 },
  'WTP-008': { status: '正常', statusClass: 'text-green-500' },
});

// 设备列表
const devices = ref([]);

// 告警列表
const alarms = ref([]);

// 获取设备列表
const fetchDevices = async () => {
  try {
    const response = await axios.get('/api/devices');
    devices.value = response.data;
  } catch (error) {
    console.error('获取设备列表失败:', error);
  }
};

// 获取告警信息
const fetchAlarms = async () => {
  try {
    const response = await axios.get('/api/alarms');
    alarms.value = response.data;
    alarmCount.value = response.data.length;
  } catch (error) {
    console.error('获取告警信息失败:', error);
  }
};

// 获取实时数据
const fetchRealTimeData = async () => {
  try {
    // 这里将使用设备特定的数据更新页面状态
    // 在实际应用中，我们会调用API获取这些数据
    // 现在使用模拟数据来模拟效果
    processedWater.value = parseFloat((100 + Math.random() * 10).toFixed(1));
    energyConsumption.value = parseFloat((280 + Math.random() * 15).toFixed(1));
    
    // 模拟设备数据变化
    deviceStatus['WTP-003'].level = Math.round(80 + Math.random() * 5);
    deviceStatus['WTP-003'].levelHeight = `${deviceStatus['WTP-003'].level}%`;
    
    deviceStatus['WTP-004'].oxygen = parseFloat((1 + Math.random() * 0.5).toFixed(1));
    
    deviceStatus['WTP-005'].level = Math.round(75 + Math.random() * 5);
    deviceStatus['WTP-005'].levelHeight = `${deviceStatus['WTP-005'].level}%`;
    
    deviceStatus['WTP-007'].chlorine = parseFloat((0.3 + Math.random() * 0.2).toFixed(1));
  } catch (error) {
    console.error('获取实时数据失败:', error);
  }
};

// 格式化时间
const formatTime = (timestamp) => {
  if (!timestamp) return '-';
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${padZero(date.getMonth() + 1)}-${padZero(date.getDate())} ${padZero(date.getHours())}:${padZero(date.getMinutes())}:${padZero(date.getSeconds())}`;
};

// 补零
const padZero = (num) => {
  return num < 10 ? `0${num}` : num;
};

// 页面加载时获取数据
onMounted(() => {
  fetchDevices();
  fetchAlarms();
  fetchRealTimeData();
  
  // 设置定时器，每5秒更新一次实时数据
  const timer = setInterval(fetchRealTimeData, 5000);
  
  // 组件卸载时清除定时器
  onUnmounted(() => {
    clearInterval(timer);
  });
});
</script>

<style scoped>
/* 曝气池气泡动画 */
.absolute.bg-white {
  animation: bubble 2s infinite ease-in-out;
}

@keyframes bubble {
  0% {
    transform: translateY(0) scale(1);
    opacity: 0.7;
  }
  100% {
    transform: translateY(-30px) scale(0.5);
    opacity: 0;
  }
}
</style> 