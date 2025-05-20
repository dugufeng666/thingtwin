import { createApp } from 'vue';
import './style.css';
import './assets/icons.css';  // 添加图标样式
import App from './App.vue';

import router from './router';
import TDesign from 'tdesign-vue-next';
import { registerGraphics } from './components/Editor/registerDeviceIcons';

const app = createApp(App);

// 加载基础服务
app.use(router).use(TDesign);
// end

// Register all graphics
registerGraphics();

app.mount('#app');
