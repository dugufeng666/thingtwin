const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

// Create Express app
const app = express();
const port = process.env.PORT || 3001;

// Create HTTP server
const server = http.createServer(app);

// Create Socket.IO server
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// API状态检查端点
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '0.1.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// 污水处理厂设备模拟数据
let devices = [
  { 
    id: 'WTP-001', 
    name: '进水泵站', 
    type: '泵', 
    status: 'Online', 
    location: '进水区',
    lastConnection: new Date(),
    protocol: 'Modbus',
    ipAddress: '192.168.1.101',
    port: 502,
    data: {
      flow: 120.5,
      level: 65.3,
      status: 'running',
      power: 45.2,
      vibration: 0.2,
      temperature: 28.4
    }
  },
  { 
    id: 'WTP-002', 
    name: '格栅除渣机', 
    type: '机械设备', 
    status: 'Online', 
    location: '预处理区',
    lastConnection: new Date(),
    protocol: 'MQTT',
    ipAddress: '192.168.1.102',
    port: 1883,
    data: {
      status: 'running',
      power: 15.7,
      blockage: 12.3,
      load: 37.8,
      temperature: 32.1
    }
  },
  { 
    id: 'WTP-003', 
    name: '初沉池', 
    type: '沉淀池', 
    status: 'Online', 
    location: '预处理区',
    lastConnection: new Date(),
    protocol: 'OPC-UA',
    ipAddress: '192.168.1.103',
    port: 4840,
    data: {
      level: 82.4,
      tss: 245.6,
      flow: 115.2,
      turbidity: 68.5,
      sludgeLevel: 12.3
    }
  },
  { 
    id: 'WTP-004', 
    name: '曝气池', 
    type: '曝气池', 
    status: 'Online', 
    location: '生化处理区',
    lastConnection: new Date(),
    protocol: 'Modbus',
    ipAddress: '192.168.1.104',
    port: 502,
    data: {
      oxygen: 3.8,
      temperature: 26.5,
      ph: 7.2,
      cod: 210.5,
      mlss: 3450,
      flow: 112.8
    }
  },
  { 
    id: 'WTP-005', 
    name: '二沉池', 
    type: '沉淀池', 
    status: 'Online', 
    location: '生化处理区',
    lastConnection: new Date(),
    protocol: 'MQTT',
    ipAddress: '192.168.1.105',
    port: 1883,
    data: {
      level: 78.5,
      tss: 28.7,
      flow: 109.6,
      turbidity: 15.3,
      sludgeLevel: 9.8
    }
  },
  { 
    id: 'WTP-006', 
    name: '过滤器', 
    type: '过滤设备', 
    status: 'Online', 
    location: '深度处理区',
    lastConnection: new Date(),
    protocol: 'Modbus',
    ipAddress: '192.168.1.106',
    port: 502,
    data: {
      pressure: 32.5,
      flow: 105.8,
      turbidity: 6.2,
      headLoss: 16.5,
      backwashStatus: 'standby'
    }
  },
  { 
    id: 'WTP-007', 
    name: '消毒系统', 
    type: '消毒设备', 
    status: 'Online', 
    location: '出水区',
    lastConnection: new Date(),
    protocol: 'OPC-UA',
    ipAddress: '192.168.1.107',
    port: 4840,
    data: {
      chlorine: 0.8,
      flow: 104.2,
      ph: 6.9,
      contactTime: 28.5,
      turbidity: 4.1
    }
  },
  { 
    id: 'WTP-008', 
    name: '出水阀', 
    type: '阀门', 
    status: 'Online', 
    location: '出水区',
    lastConnection: new Date(),
    protocol: 'Modbus',
    ipAddress: '192.168.1.108',
    port: 502,
    data: {
      position: 85.7,
      flow: 103.5,
      pressure: 28.3,
      status: 'open'
    }
  }
];

// 时序数据存储
const timeSeriesData = {};

// 路由
app.get('/api/devices', (req, res) => {
  res.json(devices);
});

app.get('/api/devices/:id', (req, res) => {
  const device = devices.find(d => d.id === req.params.id);
  if (!device) {
    return res.status(404).json({ error: 'Device not found' });
  }
  res.json(device);
});

app.post('/api/devices', (req, res) => {
  const newDevice = {
    ...req.body,
    id: req.body.id || `WTP-${Math.floor(1000 + Math.random() * 9000)}`,
    lastConnection: new Date(),
    data: req.body.data || {}
  };
  
  devices.push(newDevice);
  res.status(201).json(newDevice);
});

app.put('/api/devices/:id', (req, res) => {
  const index = devices.findIndex(d => d.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Device not found' });
  }
  
  devices[index] = {
    ...devices[index],
    ...req.body,
    id: req.params.id // 确保ID不变
  };
  
  res.json(devices[index]);
});

app.delete('/api/devices/:id', (req, res) => {
  const index = devices.findIndex(d => d.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Device not found' });
  }
  
  const deletedDevice = devices[index];
  devices = devices.filter(d => d.id !== req.params.id);
  
  res.json(deletedDevice);
});

// 获取设备的时序数据
app.get('/api/devices/:id/timeseries', (req, res) => {
  const deviceId = req.params.id;
  const { metric, timeRange } = req.query;
  
  if (!timeSeriesData[deviceId] || !timeSeriesData[deviceId][metric]) {
    return res.status(404).json({ error: 'Time-series data not found' });
  }
  
  // 按时间范围过滤数据
  let hoursToLookBack = 24;
  if (timeRange === '1h') hoursToLookBack = 1;
  if (timeRange === '7d') hoursToLookBack = 168;
  if (timeRange === '30d') hoursToLookBack = 720;
  
  const cutoffTime = new Date(Date.now() - hoursToLookBack * 60 * 60 * 1000);
  const filteredData = timeSeriesData[deviceId][metric].filter(point => 
    new Date(point.timestamp) >= cutoffTime
  );
  
  res.json(filteredData);
});

// 实时告警API
app.get('/api/alarms', (req, res) => {
  // 生成模拟告警数据
  const alarms = [
    {
      id: 'ALM-001',
      deviceId: 'WTP-004',
      deviceName: '曝气池',
      type: 'High',
      description: '溶解氧过低',
      value: 1.2,
      threshold: 2.0,
      status: 'Active',
      timestamp: new Date(Date.now() - 35 * 60 * 1000) // 35分钟前
    },
    {
      id: 'ALM-002',
      deviceId: 'WTP-006',
      deviceName: '过滤器',
      type: 'Medium',
      description: '压差过高',
      value: 45.7,
      threshold: 40.0,
      status: 'Active',
      timestamp: new Date(Date.now() - 120 * 60 * 1000) // 2小时前
    },
    {
      id: 'ALM-003',
      deviceId: 'WTP-007',
      deviceName: '消毒系统',
      type: 'Low',
      description: '余氯略低',
      value: 0.3,
      threshold: 0.5,
      status: 'Active',
      timestamp: new Date(Date.now() - 15 * 60 * 1000) // 15分钟前
    }
  ];
  
  res.json(alarms);
});

// Socket.IO连接处理
io.on('connection', (socket) => {
  console.log('客户端已连接');
  
  // 发送初始设备数据
  socket.emit('deviceList', devices);
  
  // 处理设备订阅
  socket.on('subscribeToDevice', (deviceId) => {
    console.log(`客户端订阅了设备: ${deviceId}`);
    socket.join(deviceId);
  });
  
  // 处理设备取消订阅
  socket.on('unsubscribeFromDevice', (deviceId) => {
    console.log(`客户端取消订阅设备: ${deviceId}`);
    socket.leave(deviceId);
  });
  
  socket.on('disconnect', () => {
    console.log('客户端已断开连接');
  });
});

// 模拟设备数据更新
function simulateDeviceData() {
  devices.forEach(device => {
    if (device.status === 'Online') {
      // 更新最后连接时间
      device.lastConnection = new Date();
      
      // 更新设备特定数据
      // 进水泵站
      if (device.id === 'WTP-001') {
        device.data.flow = Math.round((device.data.flow + (Math.random() * 10 - 5)) * 10) / 10;
        device.data.level = Math.round((device.data.level + (Math.random() * 2 - 1)) * 10) / 10;
        device.data.power = Math.round((device.data.power + (Math.random() * 3 - 1.5)) * 10) / 10;
        device.data.temperature = Math.round((device.data.temperature + (Math.random() * 1 - 0.5)) * 10) / 10;
      }
      // 格栅除渣机
      else if (device.id === 'WTP-002') {
        device.data.blockage = Math.round((device.data.blockage + (Math.random() * 2 - 0.5)) * 10) / 10;
        device.data.load = Math.round((device.data.load + (Math.random() * 5 - 2.5)) * 10) / 10;
        device.data.temperature = Math.round((device.data.temperature + (Math.random() * 1 - 0.5)) * 10) / 10;
      }
      // 初沉池
      else if (device.id === 'WTP-003') {
        device.data.level = Math.round((device.data.level + (Math.random() * 2 - 1)) * 10) / 10;
        device.data.tss = Math.round((device.data.tss + (Math.random() * 20 - 10)) * 10) / 10;
        device.data.flow = Math.round((device.data.flow + (Math.random() * 5 - 2.5)) * 10) / 10;
        device.data.turbidity = Math.round((device.data.turbidity + (Math.random() * 5 - 2.5)) * 10) / 10;
        device.data.sludgeLevel = Math.round((device.data.sludgeLevel + (Math.random() * 0.5 - 0.25)) * 10) / 10;
      }
      // 曝气池
      else if (device.id === 'WTP-004') {
        device.data.oxygen = Math.round((device.data.oxygen + (Math.random() * 0.4 - 0.2)) * 10) / 10;
        device.data.temperature = Math.round((device.data.temperature + (Math.random() * 0.5 - 0.25)) * 10) / 10;
        device.data.ph = Math.round((device.data.ph + (Math.random() * 0.2 - 0.1)) * 10) / 10;
        device.data.cod = Math.round((device.data.cod + (Math.random() * 15 - 7.5)) * 10) / 10;
        device.data.mlss = Math.round(device.data.mlss + (Math.random() * 100 - 50));
        device.data.flow = Math.round((device.data.flow + (Math.random() * 5 - 2.5)) * 10) / 10;
      }
      // 二沉池
      else if (device.id === 'WTP-005') {
        device.data.level = Math.round((device.data.level + (Math.random() * 2 - 1)) * 10) / 10;
        device.data.tss = Math.round((device.data.tss + (Math.random() * 3 - 1.5)) * 10) / 10;
        device.data.flow = Math.round((device.data.flow + (Math.random() * 5 - 2.5)) * 10) / 10;
        device.data.turbidity = Math.round((device.data.turbidity + (Math.random() * 2 - 1)) * 10) / 10;
        device.data.sludgeLevel = Math.round((device.data.sludgeLevel + (Math.random() * 0.4 - 0.2)) * 10) / 10;
      }
      // 过滤器
      else if (device.id === 'WTP-006') {
        device.data.pressure = Math.round((device.data.pressure + (Math.random() * 2 - 1)) * 10) / 10;
        device.data.flow = Math.round((device.data.flow + (Math.random() * 5 - 2.5)) * 10) / 10;
        device.data.turbidity = Math.round((device.data.turbidity + (Math.random() * 1 - 0.5)) * 10) / 10;
        device.data.headLoss = Math.round((device.data.headLoss + (Math.random() * 1 - 0.3)) * 10) / 10;
      }
      // 消毒系统
      else if (device.id === 'WTP-007') {
        device.data.chlorine = Math.round((device.data.chlorine + (Math.random() * 0.2 - 0.1)) * 10) / 10;
        device.data.flow = Math.round((device.data.flow + (Math.random() * 5 - 2.5)) * 10) / 10;
        device.data.ph = Math.round((device.data.ph + (Math.random() * 0.2 - 0.1)) * 10) / 10;
        device.data.contactTime = Math.round((device.data.contactTime + (Math.random() * 2 - 1)) * 10) / 10;
        device.data.turbidity = Math.round((device.data.turbidity + (Math.random() * 0.5 - 0.25)) * 10) / 10;
      }
      // 出水阀
      else if (device.id === 'WTP-008') {
        device.data.position = Math.round((device.data.position + (Math.random() * 2 - 1)) * 10) / 10;
        device.data.flow = Math.round((device.data.flow + (Math.random() * 5 - 2.5)) * 10) / 10;
        device.data.pressure = Math.round((device.data.pressure + (Math.random() * 1.5 - 0.75)) * 10) / 10;
      }
      
      // 存储时序数据
      if (!timeSeriesData[device.id]) {
        timeSeriesData[device.id] = {};
      }
      
      // 为每个数据点存储时序数据
      Object.keys(device.data).forEach(key => {
        if (!timeSeriesData[device.id][key]) {
          timeSeriesData[device.id][key] = [];
        }
        
        timeSeriesData[device.id][key].push({
          timestamp: new Date(),
          value: device.data[key]
        });
        
        // 限制存储的时序数据点数量(保留最近24小时的数据)
        if (timeSeriesData[device.id][key].length > 288) { // 5分钟一个点，24小时共288个点
          timeSeriesData[device.id][key].shift();
        }
      });
      
      // 向订阅该设备的客户端发送更新
      io.to(device.id).emit('deviceUpdate', device);
    }
  });
}

// 每5秒更新一次数据
setInterval(simulateDeviceData, 5000);

// 启动服务器
server.listen(port, () => {
  console.log(`污水处理监控API服务已启动，端口: ${port}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Server shut down');
  });
});

// Export for Vercel serverless function
module.exports = app; 