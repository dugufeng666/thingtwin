<template>
  <div class="dashboard">
    <h1 class="text-2xl font-bold mb-6">IoT Dashboard</h1>
    
    <div class="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
      <!-- Summary Cards -->
      <div class="card flex items-center p-4">
        <div class="p-3 rounded-full bg-blue-500 bg-opacity-20 mr-4">
          <svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path>
          </svg>
        </div>
        <div>
          <p class="text-sm text-gray-400">Active Devices</p>
          <p class="text-lg font-semibold">{{ deviceStats.active }}</p>
        </div>
      </div>
      
      <div class="card flex items-center p-4">
        <div class="p-3 rounded-full bg-green-500 bg-opacity-20 mr-4">
          <svg class="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
        </div>
        <div>
          <p class="text-sm text-gray-400">Data Points</p>
          <p class="text-lg font-semibold">{{ deviceStats.dataPoints }}</p>
        </div>
      </div>
      
      <div class="card flex items-center p-4">
        <div class="p-3 rounded-full bg-yellow-500 bg-opacity-20 mr-4">
          <svg class="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <div>
          <p class="text-sm text-gray-400">Uptime</p>
          <p class="text-lg font-semibold">{{ deviceStats.uptime }}</p>
        </div>
      </div>
      
      <div class="card flex items-center p-4">
        <div class="p-3 rounded-full bg-red-500 bg-opacity-20 mr-4">
          <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
        </div>
        <div>
          <p class="text-sm text-gray-400">Alerts</p>
          <p class="text-lg font-semibold">{{ deviceStats.alerts }}</p>
        </div>
      </div>
    </div>
    
    <div class="grid gap-6 mb-8 md:grid-cols-2">
      <!-- Line Chart -->
      <div class="card p-4">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold">Temperature Readings</h3>
          <div class="flex space-x-2">
            <button @click="updateChartData" class="btn btn-primary text-xs py-1 px-2">Refresh</button>
            <select v-model="timeRange" class="input text-xs py-1" @change="updateChartData">
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
          </div>
        </div>
        <div class="chart-container h-64 w-full"></div>
      </div>
      
      <!-- Bar Chart -->
      <div class="card p-4">
        <h3 class="text-lg font-semibold mb-4">Device Activity</h3>
        <div class="chart-container h-64 w-full"></div>
      </div>
    </div>
    
    <div class="grid gap-6 mb-8 md:grid-cols-3">
      <!-- Pie Chart -->
      <div class="card p-4">
        <h3 class="text-lg font-semibold mb-4">Device Status</h3>
        <div class="chart-container h-64 w-full"></div>
      </div>
      
      <!-- Gauge Chart -->
      <div class="card p-4">
        <h3 class="text-lg font-semibold mb-4">System Load</h3>
        <div class="chart-container h-64 w-full"></div>
      </div>
      
      <!-- Latest Alerts -->
      <div class="card p-4">
        <h3 class="text-lg font-semibold mb-4">Recent Alerts</h3>
        <div class="overflow-y-auto h-64">
          <div v-for="(alert, index) in alerts" :key="index" class="border-b border-gray-700 py-2 last:border-b-0">
            <div class="flex items-center">
              <div :class="`w-2 h-2 rounded-full mr-2 ${alert.level === 'critical' ? 'bg-red-500' : alert.level === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'}`"></div>
              <p class="text-sm font-medium">{{ alert.message }}</p>
            </div>
            <p class="text-xs text-gray-400 mt-1">{{ alert.time }}</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Device Table -->
    <div class="card p-4">
      <h3 class="text-lg font-semibold mb-4">Connected Devices</h3>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="text-left text-gray-400 border-b border-gray-700">
              <th class="pb-3 pl-2">Device ID</th>
              <th class="pb-3">Name</th>
              <th class="pb-3">Type</th>
              <th class="pb-3">Status</th>
              <th class="pb-3">Last Reading</th>
              <th class="pb-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(device, index) in devices" :key="index" class="border-b border-gray-700 hover:bg-gray-800">
              <td class="py-3 pl-2">{{ device.id }}</td>
              <td class="py-3">{{ device.name }}</td>
              <td class="py-3">{{ device.type }}</td>
              <td class="py-3">
                <span :class="`px-2 py-1 text-xs rounded-full ${device.status === 'Online' ? 'bg-green-900 text-green-300' : device.status === 'Offline' ? 'bg-red-900 text-red-300' : 'bg-yellow-900 text-yellow-300'}`">
                  {{ device.status }}
                </span>
              </td>
              <td class="py-3">{{ device.lastReading }}</td>
              <td class="py-3">
                <button class="text-primary hover:text-primary-light mr-2">View</button>
                <button class="text-red-500 hover:text-red-400">Reset</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'

// Device statistics
const deviceStats = reactive({
  active: 42,
  dataPoints: '23.5K',
  uptime: '99.8%',
  alerts: 3
})

// Time range for charts
const timeRange = ref('24h')

// Mock alerts data
const alerts = ref([
  { level: 'critical', message: 'Temperature sensor #3 exceeds threshold', time: '2 mins ago' },
  { level: 'warning', message: 'Pressure drop detected in line 2', time: '15 mins ago' },
  { level: 'info', message: 'Device #45 reconnected after maintenance', time: '32 mins ago' },
  { level: 'warning', message: 'Battery low on sensor #18', time: '1 hour ago' },
  { level: 'critical', message: 'Connection lost to production line', time: '2 hours ago' }
])

// Mock devices data
const devices = ref([
  { id: 'DEV-001', name: 'Temperature Sensor', type: 'Sensor', status: 'Online', lastReading: '32.5°C / 2m ago' },
  { id: 'DEV-002', name: 'Pressure Valve', type: 'Actuator', status: 'Maintenance', lastReading: '78 psi / 15m ago' },
  { id: 'DEV-003', name: 'Flow Meter', type: 'Sensor', status: 'Online', lastReading: '25 L/s / 3m ago' },
  { id: 'DEV-004', name: 'Conveyor Motor', type: 'Motor', status: 'Online', lastReading: '60 Hz / 1m ago' },
  { id: 'DEV-005', name: 'Tank Level', type: 'Sensor', status: 'Offline', lastReading: '87% / 1h ago' }
])

// Update chart data (would be implemented with ECharts)
const updateChartData = () => {
  // This function would update the ECharts instances with new data
  console.log('Updating chart data with time range:', timeRange.value)
}

onMounted(() => {
  // Initialize ECharts instances here
  updateChartData()
})
</script> 