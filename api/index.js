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

// 添加API状态检查端点
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '0.1.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Mock database for devices
let devices = [
  { 
    id: 'DEV-001', 
    name: 'Temperature Sensor', 
    type: 'Sensor', 
    status: 'Online', 
    location: 'Production Line 1',
    lastConnection: new Date(),
    protocol: 'MQTT',
    ipAddress: '192.168.1.101',
    port: 1883,
    data: {
      temperature: 25.5,
      humidity: 48.2
    }
  },
  { 
    id: 'DEV-002', 
    name: 'Pressure Valve', 
    type: 'Actuator', 
    status: 'Maintenance', 
    location: 'Boiler Room',
    lastConnection: new Date(),
    protocol: 'Modbus',
    ipAddress: '192.168.1.102',
    port: 502,
    data: {
      pressure: 78.3,
      position: 'open',
      flowRate: 120.5
    }
  },
  { 
    id: 'DEV-003', 
    name: 'Flow Meter', 
    type: 'Sensor', 
    status: 'Online', 
    location: 'Cooling System',
    lastConnection: new Date(),
    protocol: 'OPC-UA',
    ipAddress: '192.168.1.103',
    port: 4840,
    data: {
      flowRate: 25.2,
      temperature: 18.7
    }
  },
  { 
    id: 'DEV-004', 
    name: 'Conveyor Motor', 
    type: 'Motor', 
    status: 'Online', 
    location: 'Production Line 2',
    lastConnection: new Date(),
    protocol: 'Modbus',
    ipAddress: '192.168.1.104',
    port: 502,
    data: {
      speed: 60,
      temperature: 42.3,
      vibration: 0.5
    }
  },
  { 
    id: 'DEV-005', 
    name: 'Tank Level', 
    type: 'Sensor', 
    status: 'Offline', 
    location: 'Storage Area',
    lastConnection: new Date(Date.now() - 3600000), // 1 hour ago
    protocol: 'MQTT',
    ipAddress: '192.168.1.105',
    port: 1883,
    data: {
      level: 87.5,
      pressure: 32.1
    }
  }
];

// Mock time-series data storage
const timeSeriesData = {};

// Routes
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
    id: req.body.id || `DEV-${Math.floor(1000 + Math.random() * 9000)}`,
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
    id: req.params.id // Ensure ID doesn't change
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

// Get time-series data for a device
app.get('/api/devices/:id/timeseries', (req, res) => {
  const deviceId = req.params.id;
  const { metric, timeRange } = req.query;
  
  if (!timeSeriesData[deviceId] || !timeSeriesData[deviceId][metric]) {
    return res.status(404).json({ error: 'Time-series data not found' });
  }
  
  // Filter data by time range
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

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('Client connected');
  
  // Send initial device data
  socket.emit('deviceList', devices);
  
  // Handle device subscription
  socket.on('subscribeToDevice', (deviceId) => {
    console.log(`Client subscribed to device: ${deviceId}`);
    socket.join(deviceId);
  });
  
  // Handle device unsubscription
  socket.on('unsubscribeFromDevice', (deviceId) => {
    console.log(`Client unsubscribed from device: ${deviceId}`);
    socket.leave(deviceId);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Simulate device data updates
function simulateDeviceData() {
  devices.forEach(device => {
    if (device.status === 'Online') {
      // Update last connection time
      device.lastConnection = new Date();
      
      // Update device-specific data
      if (device.type === 'Sensor') {
        if (device.name.includes('Temperature')) {
          device.data.temperature = Math.round((device.data.temperature + (Math.random() * 2 - 1)) * 10) / 10;
          device.data.humidity = Math.round((device.data.humidity + (Math.random() * 4 - 2)) * 10) / 10;
          
          // Store time-series data
          if (!timeSeriesData[device.id]) {
            timeSeriesData[device.id] = {};
          }
          
          if (!timeSeriesData[device.id].temperature) {
            timeSeriesData[device.id].temperature = [];
          }
          
          if (!timeSeriesData[device.id].humidity) {
            timeSeriesData[device.id].humidity = [];
          }
          
          timeSeriesData[device.id].temperature.push({
            timestamp: new Date(),
            value: device.data.temperature
          });
          
          timeSeriesData[device.id].humidity.push({
            timestamp: new Date(),
            value: device.data.humidity
          });
          
          // Keep only last 1000 points
          if (timeSeriesData[device.id].temperature.length > 1000) {
            timeSeriesData[device.id].temperature.shift();
          }
          
          if (timeSeriesData[device.id].humidity.length > 1000) {
            timeSeriesData[device.id].humidity.shift();
          }
        } else if (device.name.includes('Flow')) {
          device.data.flowRate = Math.round((device.data.flowRate + (Math.random() * 2 - 1)) * 10) / 10;
          device.data.temperature = Math.round((device.data.temperature + (Math.random() * 0.5 - 0.25)) * 10) / 10;
          
          // Store time-series data
          if (!timeSeriesData[device.id]) {
            timeSeriesData[device.id] = {};
          }
          
          if (!timeSeriesData[device.id].flowRate) {
            timeSeriesData[device.id].flowRate = [];
          }
          
          timeSeriesData[device.id].flowRate.push({
            timestamp: new Date(),
            value: device.data.flowRate
          });
          
          // Keep only last 1000 points
          if (timeSeriesData[device.id].flowRate.length > 1000) {
            timeSeriesData[device.id].flowRate.shift();
          }
        } else if (device.name.includes('Tank')) {
          // Tank level doesn't change that often
          if (Math.random() < 0.3) {
            device.data.level = Math.round((device.data.level + (Math.random() * 0.2 - 0.1)) * 10) / 10;
            device.data.level = Math.max(0, Math.min(100, device.data.level));
          }
          
          // Store time-series data
          if (!timeSeriesData[device.id]) {
            timeSeriesData[device.id] = {};
          }
          
          if (!timeSeriesData[device.id].level) {
            timeSeriesData[device.id].level = [];
          }
          
          timeSeriesData[device.id].level.push({
            timestamp: new Date(),
            value: device.data.level
          });
          
          // Keep only last 1000 points
          if (timeSeriesData[device.id].level.length > 1000) {
            timeSeriesData[device.id].level.shift();
          }
        }
      } else if (device.type === 'Motor') {
        // Motors don't vary that much
        if (Math.random() < 0.2) {
          device.data.speed = Math.max(0, Math.min(100, device.data.speed + (Math.random() * 2 - 1)));
        }
        device.data.temperature = Math.round((device.data.temperature + (Math.random() * 0.4 - 0.2)) * 10) / 10;
        device.data.vibration = Math.max(0, Math.min(10, device.data.vibration + (Math.random() * 0.2 - 0.1)));
        
        // Store time-series data
        if (!timeSeriesData[device.id]) {
          timeSeriesData[device.id] = {};
        }
        
        if (!timeSeriesData[device.id].temperature) {
          timeSeriesData[device.id].temperature = [];
        }
        
        timeSeriesData[device.id].temperature.push({
          timestamp: new Date(),
          value: device.data.temperature
        });
        
        // Keep only last 1000 points
        if (timeSeriesData[device.id].temperature.length > 1000) {
          timeSeriesData[device.id].temperature.shift();
        }
      } else if (device.type === 'Actuator') {
        // Actuator state changes
        if (Math.random() < 0.05) {
          device.data.position = device.data.position === 'open' ? 'closed' : 'open';
        }
        device.data.pressure = Math.round((device.data.pressure + (Math.random() * 3 - 1.5)) * 10) / 10;
        
        // Store time-series data
        if (!timeSeriesData[device.id]) {
          timeSeriesData[device.id] = {};
        }
        
        if (!timeSeriesData[device.id].pressure) {
          timeSeriesData[device.id].pressure = [];
        }
        
        timeSeriesData[device.id].pressure.push({
          timestamp: new Date(),
          value: device.data.pressure
        });
        
        // Keep only last 1000 points
        if (timeSeriesData[device.id].pressure.length > 1000) {
          timeSeriesData[device.id].pressure.shift();
        }
      }
      
      // Emit device update to subscribers
      io.to(device.id).emit('deviceUpdate', device);
    }
  });
  
  // Emit all devices update
  io.emit('deviceList', devices);
}

// Start simulation
const simulationInterval = setInterval(simulateDeviceData, 2000);

// Start server
server.listen(port, () => {
  console.log(`ThingTwin API server running on port ${port}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  clearInterval(simulationInterval);
  server.close(() => {
    console.log('Server shut down');
  });
});

// Export for Vercel serverless function
module.exports = app; 