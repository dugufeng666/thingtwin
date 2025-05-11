<template>
  <div class="editor">
    <div class="flex h-[calc(100vh-8rem)]">
      <!-- Sidebar -->
      <div class="w-64 bg-background-light p-4 border-r border-gray-700 overflow-y-auto">
        <h2 class="text-xl font-semibold mb-4">Components</h2>
        
        <div class="space-y-2">
          <div 
            v-for="(component, index) in components" 
            :key="index"
            class="p-2 rounded cursor-pointer hover:bg-gray-700"
            draggable="true"
            @dragstart="onDragStart(component)"
          >
            {{ component.name }}
          </div>
        </div>

        <h2 class="text-xl font-semibold mt-6 mb-4">Properties</h2>
        <div v-if="selectedObject">
          <div class="space-y-3">
            <div class="space-y-1">
              <label class="text-sm text-gray-400">Name</label>
              <input v-model="selectedObject.name" class="input w-full" />
            </div>
            
            <div class="grid grid-cols-3 gap-2">
              <div class="space-y-1">
                <label class="text-sm text-gray-400">X</label>
                <input 
                  v-model.number="selectedObject.position.x" 
                  type="number" 
                  step="0.1"
                  class="input w-full" 
                  @change="updateObjectPosition"
                />
              </div>
              <div class="space-y-1">
                <label class="text-sm text-gray-400">Y</label>
                <input 
                  v-model.number="selectedObject.position.y" 
                  type="number" 
                  step="0.1"
                  class="input w-full" 
                  @change="updateObjectPosition"
                />
              </div>
              <div class="space-y-1">
                <label class="text-sm text-gray-400">Z</label>
                <input 
                  v-model.number="selectedObject.position.z" 
                  type="number" 
                  step="0.1"
                  class="input w-full" 
                  @change="updateObjectPosition"
                />
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-gray-500 italic">
          No object selected
        </div>
      </div>
      
      <!-- 3D Viewport -->
      <div class="flex-1 relative" ref="threeContainer">
        <canvas ref="threeCanvas" class="w-full h-full"></canvas>
        
        <!-- Toolbar -->
        <div class="absolute top-4 right-4 bg-background-light rounded shadow-lg p-2 flex space-x-2">
          <button class="btn btn-primary text-sm py-1" @click="saveScene">Save</button>
          <button class="btn btn-secondary text-sm py-1" @click="loadScene">Load</button>
          <button class="btn bg-red-500 hover:bg-red-700 text-white text-sm py-1" @click="clearScene">Clear</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// References
const threeContainer = ref<HTMLElement | null>(null)
const threeCanvas = ref<HTMLCanvasElement | null>(null)
const selectedObject = ref<any>(null)

// Available components
const components = ref([
  { name: 'Cube', type: 'cube' },
  { name: 'Sphere', type: 'sphere' },
  { name: 'Cylinder', type: 'cylinder' },
  { name: 'Light', type: 'light' },
  { name: 'Sensor', type: 'sensor' }
])

// Three.js variables
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let controls: OrbitControls
let raycaster: THREE.Raycaster
let mouse: THREE.Vector2

// Initialize Three.js scene
const initThree = () => {
  if (!threeCanvas.value || !threeContainer.value) return

  // Create scene
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x0F172A)

  // Create camera
  const width = threeContainer.value.clientWidth
  const height = threeContainer.value.clientHeight
  camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
  camera.position.z = 10

  // Create renderer
  renderer = new THREE.WebGLRenderer({
    canvas: threeCanvas.value,
    antialias: true
  })
  renderer.setSize(width, height)
  renderer.setPixelRatio(window.devicePixelRatio)

  // Add grid and axes helpers
  const gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x222222)
  scene.add(gridHelper)
  
  const axesHelper = new THREE.AxesHelper(5)
  scene.add(axesHelper)

  // Add ambient light
  const ambientLight = new THREE.AmbientLight(0x404040)
  scene.add(ambientLight)

  // Add directional light
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
  directionalLight.position.set(5, 10, 7.5)
  scene.add(directionalLight)

  // Setup controls
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.05

  // Setup raycaster for object selection
  raycaster = new THREE.Raycaster()
  mouse = new THREE.Vector2()

  // Add event listeners
  window.addEventListener('resize', onWindowResize)
  renderer.domElement.addEventListener('mousemove', onMouseMove)
  renderer.domElement.addEventListener('click', onMouseClick)
  renderer.domElement.addEventListener('dragover', onDragOver)
  renderer.domElement.addEventListener('drop', onDrop)

  // Start animation loop
  animate()
}

// Animation loop
const animate = () => {
  requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, camera)
}

// Handle window resize
const onWindowResize = () => {
  if (!threeContainer.value) return
  
  const width = threeContainer.value.clientWidth
  const height = threeContainer.value.clientHeight
  
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  
  renderer.setSize(width, height)
}

// Handle mouse move for raycasting
const onMouseMove = (event: MouseEvent) => {
  if (!threeContainer.value) return
  
  const rect = threeContainer.value.getBoundingClientRect()
  mouse.x = ((event.clientX - rect.left) / threeContainer.value.clientWidth) * 2 - 1
  mouse.y = -((event.clientY - rect.top) / threeContainer.value.clientHeight) * 2 + 1
}

// Handle mouse click for object selection
const onMouseClick = () => {
  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObjects(scene.children, true)
  
  if (intersects.length > 0) {
    const object = intersects[0].object
    
    // Only select meshes (not helpers)
    if (object instanceof THREE.Mesh && 
        !(object.parent instanceof THREE.AxesHelper) && 
        !(object.parent instanceof THREE.GridHelper)) {
      selectedObject.value = {
        name: object.name || 'Object',
        position: {
          x: object.position.x,
          y: object.position.y,
          z: object.position.z
        },
        threeObject: object
      }
    }
  } else {
    selectedObject.value = null
  }
}

// Handle drag start
const onDragStart = (component: any) => {
  event?.dataTransfer?.setData('component', JSON.stringify(component))
}

// Handle drag over
const onDragOver = (event: DragEvent) => {
  event.preventDefault()
}

// Handle drop
const onDrop = (event: DragEvent) => {
  event.preventDefault()
  
  const componentData = event.dataTransfer?.getData('component')
  if (!componentData) return
  
  const component = JSON.parse(componentData)
  
  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObjects(scene.children)
  
  let position
  if (intersects.length > 0) {
    position = intersects[0].point
  } else {
    position = new THREE.Vector3(0, 0, 0)
  }
  
  addComponent(component, position)
}

// Add a component to the scene
const addComponent = (component: any, position: THREE.Vector3) => {
  let object
  
  switch (component.type) {
    case 'cube':
      const geometry = new THREE.BoxGeometry(1, 1, 1)
      const material = new THREE.MeshStandardMaterial({ color: 0x3B82F6 })
      object = new THREE.Mesh(geometry, material)
      break
    
    case 'sphere':
      const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32)
      const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0x10B981 })
      object = new THREE.Mesh(sphereGeometry, sphereMaterial)
      break
    
    case 'cylinder':
      const cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32)
      const cylinderMaterial = new THREE.MeshStandardMaterial({ color: 0xF59E0B })
      object = new THREE.Mesh(cylinderGeometry, cylinderMaterial)
      break
    
    case 'light':
      object = new THREE.PointLight(0xffffff, 1, 10)
      const lightSphere = new THREE.SphereGeometry(0.2, 16, 16)
      const lightMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 })
      const lightMesh = new THREE.Mesh(lightSphere, lightMaterial)
      object.add(lightMesh)
      break
    
    case 'sensor':
      const sensorGeometry = new THREE.ConeGeometry(0.3, 0.6, 32)
      const sensorMaterial = new THREE.MeshStandardMaterial({ color: 0xEF4444 })
      object = new THREE.Mesh(sensorGeometry, sensorMaterial)
      break
    
    default:
      return
  }
  
  object.position.copy(position)
  object.name = `${component.name}_${Date.now()}`
  scene.add(object)
}

// Update object position
const updateObjectPosition = () => {
  if (!selectedObject.value || !selectedObject.value.threeObject) return
  
  const obj = selectedObject.value.threeObject
  obj.position.set(
    selectedObject.value.position.x,
    selectedObject.value.position.y,
    selectedObject.value.position.z
  )
}

// Save scene to localStorage
const saveScene = () => {
  const sceneObjects = scene.children
    .filter(obj => obj instanceof THREE.Mesh && 
            !(obj.parent instanceof THREE.AxesHelper) && 
            !(obj.parent instanceof THREE.GridHelper))
    .map(obj => {
      return {
        name: obj.name,
        type: obj.name.split('_')[0].toLowerCase(),
        position: {
          x: obj.position.x,
          y: obj.position.y,
          z: obj.position.z
        }
      }
    })
  
  localStorage.setItem('thingTwinScene', JSON.stringify(sceneObjects))
  alert('Scene saved!')
}

// Load scene from localStorage
const loadScene = () => {
  const savedScene = localStorage.getItem('thingTwinScene')
  if (!savedScene) {
    alert('No saved scene found!')
    return
  }
  
  // Clear current scene (except helpers)
  clearScene()
  
  // Load saved objects
  const sceneObjects = JSON.parse(savedScene)
  sceneObjects.forEach((obj: any) => {
    const component = { name: obj.type.charAt(0).toUpperCase() + obj.type.slice(1), type: obj.type }
    const position = new THREE.Vector3(obj.position.x, obj.position.y, obj.position.z)
    addComponent(component, position)
  })
}

// Clear scene
const clearScene = () => {
  const objectsToRemove = []
  
  scene.traverse(obj => {
    if (obj instanceof THREE.Mesh && 
        !(obj.parent instanceof THREE.AxesHelper) && 
        !(obj.parent instanceof THREE.GridHelper)) {
      objectsToRemove.push(obj)
    }
  })
  
  objectsToRemove.forEach(obj => {
    scene.remove(obj)
  })
  
  selectedObject.value = null
}

// Lifecycle hooks
onMounted(() => {
  initThree()
})

onUnmounted(() => {
  window.removeEventListener('resize', onWindowResize)
  if (renderer) {
    renderer.domElement.removeEventListener('mousemove', onMouseMove)
    renderer.domElement.removeEventListener('click', onMouseClick)
    renderer.domElement.removeEventListener('dragover', onDragOver)
    renderer.domElement.removeEventListener('drop', onDrop)
    
    // Dispose resources
    renderer.dispose()
  }
})
</script> 