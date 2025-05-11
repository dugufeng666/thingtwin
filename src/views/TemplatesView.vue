<template>
  <div class="templates">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">模板库</h1>
      <button class="btn btn-primary flex items-center">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        新建模板
      </button>
    </div>
    
    <!-- 筛选器 -->
    <div class="card p-4 mb-6">
      <div class="flex flex-wrap gap-4">
        <div class="flex-1 min-w-[200px]">
          <label class="block text-sm text-gray-400 mb-1">搜索</label>
          <div class="relative">
            <input 
              v-model="searchTerm" 
              type="text" 
              placeholder="搜索模板名称或描述..." 
              class="input w-full pl-10"
            >
            <svg class="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>
        
        <div>
          <label class="block text-sm text-gray-400 mb-1">分类</label>
          <select v-model="categoryFilter" class="input w-full">
            <option value="">全部分类</option>
            <option value="industrial">工业流程</option>
            <option value="water">水处理</option>
            <option value="energy">能源管理</option>
          </select>
        </div>
        
        <div class="flex items-end">
          <button @click="resetFilters" class="btn bg-gray-700 hover:bg-gray-600 text-white">
            重置筛选
          </button>
        </div>
      </div>
    </div>
    
    <!-- 模板网格 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <div 
        v-for="template in filteredTemplates" 
        :key="template.id" 
        class="card p-0 overflow-hidden hover:shadow-lg transition-shadow duration-200"
      >
        <div class="relative">
          <img :src="template.thumbnail" alt="Template thumbnail" class="w-full h-40 object-cover">
          <div class="absolute top-2 right-2">
            <span class="px-2 py-1 text-xs rounded-full bg-blue-900 text-blue-300">
              {{ template.category }}
            </span>
          </div>
        </div>
        <div class="p-4">
          <h3 class="text-lg font-semibold mb-1">{{ template.name }}</h3>
          <p class="text-gray-400 text-sm mb-3 line-clamp-2">{{ template.description }}</p>
          <div class="flex justify-between items-center">
            <span class="text-xs text-gray-500">{{ template.createdAt }}</span>
            <button @click="useTemplate(template)" class="btn btn-primary py-1 px-3 text-sm">使用</button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 空状态 -->
    <div v-if="filteredTemplates.length === 0" class="card p-8 text-center">
      <svg class="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <h3 class="text-xl font-medium mb-2">未找到模板</h3>
      <p class="text-gray-500">尝试调整筛选条件或创建新模板</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 筛选器
const searchTerm = ref('')
const categoryFilter = ref('')

// 模板数据
const templates = ref([
  {
    id: '1',
    name: '污水处理厂监控',
    description: '标准污水处理流程监控模板，包含进水、沉淀、曝气、消毒等工艺环节，适用于城市污水处理厂的实时监控。',
    thumbnail: '/templates/wastewater.jpg',
    category: '水处理',
    createdAt: '2023-05-15'
  },
  {
    id: '2',
    name: '变电站监控',
    description: '电力变电站综合监控面板，包含主变压器、断路器、隔离开关等设备状态监测和数据采集。',
    thumbnail: '/templates/substation.jpg',
    category: '能源管理',
    createdAt: '2023-06-22'
  },
  {
    id: '3',
    name: '智能工厂生产线',
    description: '智能工厂生产线实时监控面板，包含生产设备状态、产量统计、能耗分析等功能。',
    thumbnail: '/templates/factory.jpg',
    category: '工业流程',
    createdAt: '2023-07-10'
  },
  {
    id: '4',
    name: '锅炉房监控',
    description: '锅炉房综合监控面板，实时监测锅炉运行参数、蒸汽压力、温度等关键指标。',
    thumbnail: '/templates/boiler.jpg',
    category: '能源管理',
    createdAt: '2023-08-05'
  },
  {
    id: '5',
    name: '自来水厂监控',
    description: '自来水处理厂工艺流程监控面板，包含取水、混凝、沉淀、过滤、消毒等环节的实时监测。',
    thumbnail: '/templates/waterplant.jpg',
    category: '水处理',
    createdAt: '2023-09-15'
  },
  {
    id: '6',
    name: '污水处理系统完整流程',
    description: '城市污水处理厂完整工艺流程，包括预处理、初沉、生化处理、二沉、过滤、消毒等全流程监控大屏。',
    thumbnail: '/templates/wastewater-full.jpg',
    category: '水处理',
    createdAt: '2023-11-20'
  }
])

// 筛选模板
const filteredTemplates = computed(() => {
  return templates.value.filter(template => {
    const matchesSearch = searchTerm.value === '' || 
      template.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.value.toLowerCase())
    
    const matchesCategory = categoryFilter.value === '' || 
      template.category.toLowerCase().includes(categoryFilter.value.toLowerCase())
    
    return matchesSearch && matchesCategory
  })
})

// 重置筛选器
const resetFilters = () => {
  searchTerm.value = ''
  categoryFilter.value = ''
}

// 使用模板
const useTemplate = (template: any) => {
  // 这里应该加载模板数据并跳转到编辑器
  console.log(`使用模板: ${template.name}`)
  router.push({ 
    path: '/editor',
    query: { templateId: template.id }
  })
}
</script> 