<template>
  <div class="home">
    <div class="hero py-12 bg-gradient-to-br from-background to-background-light rounded-lg shadow-xl mb-12">
      <div class="text-center">
        <h1 class="text-4xl md:text-6xl font-bold text-primary mb-4">ThingTwin</h1>
        <p class="text-xl mb-8 text-gray-300 max-w-3xl mx-auto">
          A lightweight, web-based toolkit for building IoT-powered digital twins using Vue3 and Three.js
        </p>
        <div class="flex flex-wrap justify-center gap-4">
          <router-link to="/editor" class="btn btn-primary">Try 3D Editor</router-link>
          <router-link to="/dashboard" class="btn btn-secondary">View Demo Dashboard</router-link>
        </div>
      </div>
    </div>

    <div class="grid md:grid-cols-3 gap-8 mb-12">
      <div class="card">
        <div class="text-primary text-3xl mb-4">🌐</div>
        <h3 class="text-xl font-semibold mb-2">3D Visualization</h3>
        <p class="text-gray-400">
          Create immersive digital twins with Three.js and visualize your IoT devices in real-time.
        </p>
      </div>
      
      <div class="card">
        <div class="text-primary text-3xl mb-4">📊</div>
        <h3 class="text-xl font-semibold mb-2">Data Dashboards</h3>
        <p class="text-gray-400">
          Monitor performance with customizable visualizations and real-time data.
        </p>
      </div>
      
      <div class="card">
        <div class="text-primary text-3xl mb-4">🔌</div>
        <h3 class="text-xl font-semibold mb-2">Protocol Support</h3>
        <p class="text-gray-400">
          Connect to real devices via Modbus, MQTT, OPC UA and other industrial protocols.
        </p>
      </div>
    </div>

    <div class="card mb-12">
      <h2 class="text-2xl font-bold mb-4">Getting Started</h2>
      <div class="bg-gray-900 rounded p-4 font-mono text-sm overflow-x-auto">
        <pre>
# Clone the repository
git clone https://github.com/yourusername/thingtwin.git

# Install dependencies
npm install

# Start development server
npm run dev</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Home view logic
</script> 