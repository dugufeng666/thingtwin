<template>
  <div class="home">
    <div class="hero py-12 bg-gradient-to-br from-background to-background-light rounded-lg shadow-xl mb-12">
      <div class="text-center">
        <h1 class="text-4xl md:text-6xl font-bold text-primary mb-4">ThingTwin</h1>
        <p class="text-xl mb-8 text-gray-300 max-w-3xl mx-auto">
          轻量级、开源的工业组态与数字孪生平台，通过直观的拖拽式编辑器构建工业监控大屏
        </p>
        <div class="flex flex-wrap justify-center gap-4">
          <router-link to="/editor" class="btn-cta">
            <span class="btn-text">进入组态设计</span>
            <span class="btn-icon">→</span>
          </router-link>
          <router-link to="/templates" class="btn btn-secondary">浏览模板</router-link>
        </div>
      </div>
    </div>

    <div class="grid md:grid-cols-3 gap-8 mb-12">
      <div class="card">
        <div class="text-primary text-3xl mb-4">🔌</div>
        <h3 class="text-xl font-semibold mb-2">组态编辑器</h3>
        <p class="text-gray-400">
          强大而直观的拖拽式编辑器，支持自定义工业组件和设备符号，轻松构建数字孪生监控界面。
        </p>
      </div>
      
      <div class="card">
        <div class="text-primary text-3xl mb-4">📊</div>
        <h3 class="text-xl font-semibold mb-2">数据可视化</h3>
        <p class="text-gray-400">
          丰富的数据图表和显示组件，实时监控设备运行状态，支持各类工业现场的实时数据展示。
        </p>
      </div>
      
      <div class="card">
        <div class="text-primary text-3xl mb-4">🔄</div>
        <h3 class="text-xl font-semibold mb-2">协议集成</h3>
        <p class="text-gray-400">
          支持 Modbus、MQTT、OPC UA 等工业协议，轻松连接各种工业设备，实现数据采集与监控。
        </p>
      </div>
    </div>

    <div class="card p-0 overflow-hidden mb-12">
      <div class="bg-gray-900 p-6">
        <h2 class="text-2xl font-bold mb-4">应用场景</h2>
        <div class="grid md:grid-cols-2 gap-6">
          <div class="bg-background-light rounded-lg p-4">
            <h3 class="text-lg font-medium mb-2">工业自动化</h3>
            <ul class="list-disc list-inside text-gray-400 space-y-1">
              <li>生产线监控与控制</li>
              <li>设备运行状态监测</li>
              <li>能源管理与优化</li>
            </ul>
          </div>
          <div class="bg-background-light rounded-lg p-4">
            <h3 class="text-lg font-medium mb-2">水处理系统</h3>
            <ul class="list-disc list-inside text-gray-400 space-y-1">
              <li>污水处理厂工艺监控</li>
              <li>水质参数实时展示</li>
              <li>工艺流程可视化</li>
            </ul>
          </div>
          <div class="bg-background-light rounded-lg p-4">
            <h3 class="text-lg font-medium mb-2">能源管理</h3>
            <ul class="list-disc list-inside text-gray-400 space-y-1">
              <li>变电站运行监控</li>
              <li>电力设备状态监测</li>
              <li>电力负荷分析</li>
            </ul>
          </div>
          <div class="bg-background-light rounded-lg p-4">
            <h3 class="text-lg font-medium mb-2">智能建筑</h3>
            <ul class="list-disc list-inside text-gray-400 space-y-1">
              <li>楼宇自控系统监控</li>
              <li>空调、照明系统管理</li>
              <li>能耗分析与优化</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="card mb-12">
      <h2 class="text-2xl font-bold mb-4">快速开始</h2>
      <div class="bg-gray-900 rounded p-4 font-mono text-sm overflow-x-auto">
        <pre>
# 克隆仓库
git clone https://github.com/yourusername/thingtwin.git

# 安装依赖
cd thingtwin
npm install

# 启动开发服务器
npm run dev</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Home view logic
</script>

<style scoped>
.btn-cta {
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #0066cc, #00a0ff);
  color: white;
  font-weight: bold;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 0 15px rgba(0, 160, 255, 0.5);
  animation: pulse 2s infinite;
}

.btn-cta::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: all 0.5s;
}

.btn-cta:hover {
  transform: translateY(-3px);
  box-shadow: 0 0 25px rgba(0, 180, 255, 0.7);
}

.btn-cta:hover::before {
  left: 100%;
  transition: 0.7s;
}

.btn-text {
  font-size: 1.1rem;
  margin-right: 0.5rem;
}

.btn-icon {
  font-size: 1.2rem;
  transition: transform 0.3s ease;
}

.btn-cta:hover .btn-icon {
  transform: translateX(4px);
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 15px rgba(0, 160, 255, 0.5);
  }
  50% {
    box-shadow: 0 0 20px rgba(0, 180, 255, 0.8);
  }
  100% {
    box-shadow: 0 0 15px rgba(0, 160, 255, 0.5);
  }
}
</style> 