<template>
  <div class="min-h-screen">
    <header class="bg-background-light shadow-md">
      <nav class="container mx-auto px-4 py-3 flex justify-between items-center">
        <div class="flex items-center">
          <div class="text-2xl font-bold text-primary">ThingTwin</div>
        </div>
        <div class="flex space-x-4">
          <router-link to="/" class="text-gray-300 hover:text-primary">首页</router-link>
          <router-link to="/editor" class="text-gray-300 hover:text-primary">组态设计</router-link>
          <router-link to="/meta2d" class="text-gray-300 hover:text-primary">Meta2D编辑器</router-link>
          <router-link to="/templates" class="text-gray-300 hover:text-primary">模板库</router-link>
        </div>
      </nav>
    </header>
    
    <main class="container mx-auto px-4 py-6">
      <router-view />
    </main>
    
    <footer class="bg-background-light mt-auto py-4">
      <div class="container mx-auto px-4 text-center text-gray-500">
        &copy; {{ new Date().getFullYear() }} ThingTwin. All rights reserved.
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
// App component logic
</script> 