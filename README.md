# ThingTwin - 污水处理系统数字孪生平台

一个轻量级、基于Web的污水处理系统数字孪生平台，使用Vue3构建，专注于污水处理工艺监控和数据可视化。它提供了类似SCADA的功能，允许用户通过拖拽组件来构建污水处理厂的工艺流程数字孪生大屏。

## 在线演示

访问 [ThingTwin在线演示](https://thingtwin.vercel.app) 查看最新部署版本。

## 功能特点

- **2D组态编辑器**：提供直观的拖拽式编辑器，支持构建污水处理工艺流程图和监控画面
- **自定义组件库**：内置多种污水处理专用组件（泵、阀门、管道、曝气池、沉淀池等）
- **设备连接**：支持连接到现实世界的污水处理设备，通过工业协议(Modbus, MQTT, OPC UA)
- **数据可视化**：实时监控和展示水质参数（pH值、溶解氧、COD、余氯等）
- **告警管理**：支持多级告警，实时监测异常工况
- **历史数据**：存储和查询历史数据，支持趋势分析
- **响应式设计**：适配各种显示设备，从控制室大屏到移动端设备

## 污水处理监控场景

本平台特别适合以下污水处理场景的监控：

- **城市污水处理厂**：完整的进水、预处理、生化处理、二沉、深度处理、消毒出水流程监控
- **工业废水处理**：针对不同工业废水特性的处理工艺监控
- **农村小型污水站**：简化版的污水处理系统实时监控
- **水质在线监测**：入河排污口、水环境质量监测点的在线监控

## 技术栈

- **前端**：Vue 3, TypeScript, Konva.js (2D绘图), Element Plus
- **后端**：Node.js, Express, WebSockets
- **数据协议**：支持Modbus TCP/RTU, MQTT, OPC UA
- **图表库**：内置ECharts实现各类水质参数图表
- **部署**：支持Vercel快速部署

## 本地开发

### 先决条件

- Node.js 16+ (推荐使用 NVM 进行管理)
- NPM 7+

### 安装依赖

```bash
# 切换到 Node.js v16
nvm use 16

# 安装依赖
npm install
```

### 启动开发服务器

你可以使用以下两种方式之一启动开发环境：

**方式一：使用启动脚本同时启动前端和后端**

```bash
# 执行启动脚本
./start.sh
```

**方式二：分别启动前端和后端**

```bash
# 启动后端服务 (API)
nvm use 16 && npm run api

# 在另一个终端中启动前端服务
nvm use 16 && npm run dev
```

### 构建生产版本

```bash
# 构建前端应用
nvm use 16 && npm run build
```

## 项目结构

```
thingtwin/
├── api/                 # 后端 API 服务
│   └── index.js         # Express 应用和污水处理设备模拟
├── public/              # 静态资源
│   ├── components/      # 污水处理组件库和图标
│   │   └── symbols/     # SVG组件（泵、阀门、管道等）
│   └── templates/       # 预设模板（不同工艺流程的模板）
├── src/                 # 前端源代码
│   ├── assets/          # 静态资源
│   ├── components/      # Vue 组件
│   ├── editor/          # 组态编辑器核心功能
│   ├── router/          # Vue Router 配置
│   ├── store/           # Pinia 状态管理
│   ├── views/           # 页面视图
│   │   ├── EditorView.vue    # 组态编辑器
│   │   ├── DashboardView.vue # 运行监控大屏
│   │   └── TemplatesView.vue # 模板库
│   ├── App.vue          # 主应用组件
│   └── main.ts          # 应用入口
├── .gitignore           # Git 忽略配置
├── index.html           # HTML 入口
├── package.json         # 项目依赖
├── tsconfig.json        # TypeScript 配置
├── vite.config.ts       # Vite 配置
└── vercel.json          # Vercel 部署配置
```

## 参考项目

本项目参考了优秀的开源工业组态项目：
- [Meta2d.js](https://github.com/le5le-com/meta2d.js) - 实时数据响应和交互的2D引擎

## 许可证

[MIT](LICENSE) 