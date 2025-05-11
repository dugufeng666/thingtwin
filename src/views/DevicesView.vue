<template>
  <div class="devices">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Device Management</h1>
      <button class="btn btn-primary flex items-center" @click="openAddDeviceModal">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        Add Device
      </button>
    </div>
    
    <!-- Filters and Search -->
    <div class="card p-4 mb-6">
      <div class="flex flex-wrap gap-4">
        <div class="flex-1 min-w-[200px]">
          <label class="block text-sm text-gray-400 mb-1">Search</label>
          <div class="relative">
            <input 
              v-model="searchTerm" 
              type="text" 
              placeholder="Search by name, ID, or type..." 
              class="input w-full pl-10"
            >
            <svg class="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>
        
        <div>
          <label class="block text-sm text-gray-400 mb-1">Status</label>
          <select v-model="statusFilter" class="input w-full">
            <option value="">All Status</option>
            <option value="Online">Online</option>
            <option value="Offline">Offline</option>
            <option value="Maintenance">Maintenance</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm text-gray-400 mb-1">Type</label>
          <select v-model="typeFilter" class="input w-full">
            <option value="">All Types</option>
            <option value="Sensor">Sensor</option>
            <option value="Actuator">Actuator</option>
            <option value="Motor">Motor</option>
            <option value="Controller">Controller</option>
          </select>
        </div>
        
        <div class="flex items-end">
          <button @click="resetFilters" class="btn bg-gray-700 hover:bg-gray-600 text-white">
            Reset Filters
          </button>
        </div>
      </div>
    </div>
    
    <!-- Device List -->
    <div class="card p-4 mb-6">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="text-left text-gray-400 border-b border-gray-700">
              <th class="pb-3 pl-4">
                <input 
                  type="checkbox" 
                  class="form-checkbox h-4 w-4 rounded bg-background-light border-gray-600"
                  v-model="selectAll"
                  @change="toggleSelectAll"
                >
              </th>
              <th class="pb-3">Device ID</th>
              <th class="pb-3">Name</th>
              <th class="pb-3">Type</th>
              <th class="pb-3">Status</th>
              <th class="pb-3">Location</th>
              <th class="pb-3">Last Connection</th>
              <th class="pb-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="device in filteredDevices" 
              :key="device.id" 
              class="border-b border-gray-700 hover:bg-gray-800"
            >
              <td class="py-3 pl-4">
                <input 
                  type="checkbox" 
                  class="form-checkbox h-4 w-4 rounded bg-background-light border-gray-600"
                  v-model="device.selected"
                >
              </td>
              <td class="py-3">{{ device.id }}</td>
              <td class="py-3 font-medium">{{ device.name }}</td>
              <td class="py-3">{{ device.type }}</td>
              <td class="py-3">
                <span :class="`px-2 py-1 text-xs rounded-full ${
                  device.status === 'Online' ? 'bg-green-900 text-green-300' : 
                  device.status === 'Offline' ? 'bg-red-900 text-red-300' : 
                  'bg-yellow-900 text-yellow-300'
                }`">
                  {{ device.status }}
                </span>
              </td>
              <td class="py-3">{{ device.location }}</td>
              <td class="py-3 text-gray-400">{{ device.lastConnection }}</td>
              <td class="py-3">
                <div class="flex space-x-2">
                  <button @click="editDevice(device)" class="text-primary hover:text-primary-light">
                    Edit
                  </button>
                  <button @click="viewDevice(device)" class="text-accent hover:text-accent-light">
                    View
                  </button>
                  <button @click="openDeleteConfirmation(device)" class="text-red-500 hover:text-red-400">
                    Delete
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredDevices.length === 0">
              <td colspan="8" class="py-4 text-center text-gray-400">
                No devices found with the current filters
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination -->
      <div class="flex justify-between items-center mt-4">
        <div class="text-sm text-gray-400">
          Showing {{ filteredDevices.length }} of {{ devices.length }} devices
        </div>
        <div class="flex space-x-2">
          <button class="btn bg-gray-700 hover:bg-gray-600 text-white disabled:opacity-50" :disabled="currentPage === 1">
            Previous
          </button>
          <button class="btn bg-gray-700 hover:bg-gray-600 text-white disabled:opacity-50" :disabled="currentPage === totalPages">
            Next
          </button>
        </div>
      </div>
    </div>
    
    <!-- Bulk Actions Card -->
    <div v-if="selectedDevices.length > 0" class="card p-4 mb-6">
      <div class="flex justify-between items-center">
        <div class="text-sm">
          <span class="font-medium">{{ selectedDevices.length }}</span> devices selected
        </div>
        <div class="flex space-x-2">
          <button class="btn bg-gray-700 hover:bg-gray-600 text-white">Restart</button>
          <button class="btn bg-gray-700 hover:bg-gray-600 text-white">Maintenance</button>
          <button class="btn bg-red-600 hover:bg-red-700 text-white">Delete</button>
        </div>
      </div>
    </div>
    
    <!-- Device Details Modal (placeholder) -->
    <div v-if="showDeviceModal" class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div class="card w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center p-4 border-b border-gray-700">
          <h3 class="text-xl font-bold">{{ modalMode === 'add' ? 'Add New Device' : 'Edit Device' }}</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-white">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div class="p-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm text-gray-400 mb-1">Device Name</label>
              <input v-model="editingDevice.name" type="text" class="input w-full" placeholder="Enter device name">
            </div>
            
            <div>
              <label class="block text-sm text-gray-400 mb-1">Device ID</label>
              <input 
                v-model="editingDevice.id" 
                type="text" 
                class="input w-full" 
                placeholder="Enter device ID"
                :disabled="modalMode === 'edit'"
              >
            </div>
            
            <div>
              <label class="block text-sm text-gray-400 mb-1">Type</label>
              <select v-model="editingDevice.type" class="input w-full">
                <option value="Sensor">Sensor</option>
                <option value="Actuator">Actuator</option>
                <option value="Motor">Motor</option>
                <option value="Controller">Controller</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm text-gray-400 mb-1">Status</label>
              <select v-model="editingDevice.status" class="input w-full">
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm text-gray-400 mb-1">Location</label>
              <input v-model="editingDevice.location" type="text" class="input w-full" placeholder="Enter location">
            </div>
            
            <div>
              <label class="block text-sm text-gray-400 mb-1">Protocol</label>
              <select v-model="editingDevice.protocol" class="input w-full">
                <option value="MQTT">MQTT</option>
                <option value="Modbus">Modbus</option>
                <option value="OPC-UA">OPC-UA</option>
                <option value="HTTP">HTTP</option>
              </select>
            </div>
          </div>
          
          <div class="border-t border-gray-700 pt-4 mt-4">
            <h4 class="text-lg font-medium mb-3">Connection Settings</h4>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm text-gray-400 mb-1">IP Address / Hostname</label>
                <input v-model="editingDevice.ipAddress" type="text" class="input w-full" placeholder="Enter IP or hostname">
              </div>
              
              <div>
                <label class="block text-sm text-gray-400 mb-1">Port</label>
                <input v-model="editingDevice.port" type="number" class="input w-full" placeholder="Enter port">
              </div>
            </div>
          </div>
          
          <div class="flex justify-end space-x-3 mt-6">
            <button @click="closeModal" class="btn bg-gray-700 hover:bg-gray-600 text-white">
              Cancel
            </button>
            <button @click="saveDevice" class="btn btn-primary">
              {{ modalMode === 'add' ? 'Add Device' : 'Save Changes' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div class="card w-full max-w-md">
        <div class="p-4">
          <h3 class="text-xl font-bold mb-4">Confirm Delete</h3>
          <p class="mb-6">Are you sure you want to delete the device "{{ deviceToDelete?.name }}"? This action cannot be undone.</p>
          
          <div class="flex justify-end space-x-3">
            <button @click="closeDeleteModal" class="btn bg-gray-700 hover:bg-gray-600 text-white">
              Cancel
            </button>
            <button @click="deleteDevice" class="btn bg-red-600 hover:bg-red-700 text-white">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'

// Device management state
const devices = ref([
  { 
    id: 'DEV-001', 
    name: 'Temperature Sensor', 
    type: 'Sensor', 
    status: 'Online', 
    location: 'Production Line 1',
    lastConnection: '2 minutes ago',
    protocol: 'MQTT',
    ipAddress: '192.168.1.101',
    port: 1883,
    selected: false
  },
  { 
    id: 'DEV-002', 
    name: 'Pressure Valve', 
    type: 'Actuator', 
    status: 'Maintenance', 
    location: 'Boiler Room',
    lastConnection: '15 minutes ago',
    protocol: 'Modbus',
    ipAddress: '192.168.1.102',
    port: 502,
    selected: false
  },
  { 
    id: 'DEV-003', 
    name: 'Flow Meter', 
    type: 'Sensor', 
    status: 'Online', 
    location: 'Cooling System',
    lastConnection: '3 minutes ago',
    protocol: 'OPC-UA',
    ipAddress: '192.168.1.103',
    port: 4840,
    selected: false
  },
  { 
    id: 'DEV-004', 
    name: 'Conveyor Motor', 
    type: 'Motor', 
    status: 'Online', 
    location: 'Production Line 2',
    lastConnection: '1 minute ago',
    protocol: 'Modbus',
    ipAddress: '192.168.1.104',
    port: 502,
    selected: false
  },
  { 
    id: 'DEV-005', 
    name: 'Tank Level', 
    type: 'Sensor', 
    status: 'Offline', 
    location: 'Storage Area',
    lastConnection: '1 hour ago',
    protocol: 'MQTT',
    ipAddress: '192.168.1.105',
    port: 1883,
    selected: false
  }
])

// Filters
const searchTerm = ref('')
const statusFilter = ref('')
const typeFilter = ref('')
const currentPage = ref(1)
const perPage = ref(10)

// Modals
const showDeviceModal = ref(false)
const showDeleteModal = ref(false)
const modalMode = ref('add')
const deviceToDelete = ref(null)
const editingDevice = reactive({
  id: '',
  name: '',
  type: 'Sensor',
  status: 'Online',
  location: '',
  protocol: 'MQTT',
  ipAddress: '',
  port: 1883
})

// Computed
const selectAll = ref(false)
const filteredDevices = computed(() => {
  return devices.value.filter(device => {
    const matchesSearch = searchTerm.value === '' || 
      device.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      device.id.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      device.type.toLowerCase().includes(searchTerm.value.toLowerCase())
    
    const matchesStatus = statusFilter.value === '' || device.status === statusFilter.value
    const matchesType = typeFilter.value === '' || device.type === typeFilter.value
    
    return matchesSearch && matchesStatus && matchesType
  })
})

const selectedDevices = computed(() => {
  return devices.value.filter(device => device.selected)
})

const totalPages = computed(() => {
  return Math.ceil(filteredDevices.value.length / perPage.value)
})

// Methods
const toggleSelectAll = () => {
  devices.value.forEach(device => {
    device.selected = selectAll.value
  })
}

const resetFilters = () => {
  searchTerm.value = ''
  statusFilter.value = ''
  typeFilter.value = ''
}

const openAddDeviceModal = () => {
  modalMode.value = 'add'
  Object.assign(editingDevice, {
    id: `DEV-${Math.floor(1000 + Math.random() * 9000)}`,
    name: '',
    type: 'Sensor',
    status: 'Online',
    location: '',
    protocol: 'MQTT',
    ipAddress: '',
    port: 1883
  })
  showDeviceModal.value = true
}

const editDevice = (device) => {
  modalMode.value = 'edit'
  Object.assign(editingDevice, device)
  showDeviceModal.value = true
}

const viewDevice = (device) => {
  // In a real app, this would navigate to a device detail page
  alert(`Viewing device: ${device.name}`)
}

const saveDevice = () => {
  if (modalMode.value === 'add') {
    // In a real app, this would send an API request to create the device
    devices.value.push({
      ...editingDevice,
      lastConnection: 'Just now',
      selected: false
    })
  } else {
    // In a real app, this would send an API request to update the device
    const index = devices.value.findIndex(d => d.id === editingDevice.id)
    if (index !== -1) {
      devices.value[index] = {
        ...devices.value[index],
        ...editingDevice
      }
    }
  }
  closeModal()
}

const openDeleteConfirmation = (device) => {
  deviceToDelete.value = device
  showDeleteModal.value = true
}

const deleteDevice = () => {
  // In a real app, this would send an API request to delete the device
  if (deviceToDelete.value) {
    devices.value = devices.value.filter(d => d.id !== deviceToDelete.value.id)
  }
  closeDeleteModal()
}

const closeModal = () => {
  showDeviceModal.value = false
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  deviceToDelete.value = null
}
</script> 