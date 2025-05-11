# ThingTwin

A lightweight, web-based toolkit for building IoT-powered digital twins using Vue3 and Three.js. It combines real-time device simulation, 2D/3D topology editing, and industrial protocol integration into one seamless workflow.

## Features

- **3D Visualization**: Create immersive digital twins with Three.js
- **Device Simulation**: Test and validate IoT systems without physical hardware
- **Protocol Support**: Connect to real devices via Modbus, MQTT, OPC UA
- **Topology Editor**: Design system architectures with intuitive visual tools
- **Data Dashboards**: Monitor performance with customizable visualizations
- **Time-series Analysis**: Track historical data and identify trends
- **Responsive Design**: Access from any device with a modern browser

## Tech Stack

- **Frontend**: Vue 3, TypeScript, Three.js, Tailwind CSS, ECharts
- **Backend**: Node.js, Express/NestJS, WebSockets
- **Database**: PostgreSQL (deployed on Vercel)
- **DevOps**: Vercel, GitHub Actions

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

## Vercel 部署

### 先决条件

- Vercel CLI
- Vercel 账户

### 部署步骤

1. 首先验证构建过程是否正常：

```bash
nvm use 16 && npm run vercel-build
```

2. 安装 Vercel CLI（如果尚未安装）：

```bash
nvm use 16 && npm install -g vercel
```

3. 登录到 Vercel：

```bash
vercel login
```

4. 部署到 Vercel：

```bash
vercel
```

5. 按照提示配置部署选项

## 项目结构

```
thingtwin/
├── api/                 # 后端 API 服务
│   └── index.js         # Express 应用和设备模拟
├── public/              # 静态资源
├── src/                 # 前端源代码
│   ├── assets/          # 静态资源
│   ├── components/      # Vue 组件
│   ├── router/          # Vue Router 配置
│   ├── stores/          # Pinia 状态管理
│   ├── views/           # 页面视图
│   ├── App.vue          # 主应用组件
│   └── main.ts          # 应用入口
├── .gitignore           # Git 忽略配置
├── index.html           # HTML 入口
├── package.json         # 项目依赖
├── tailwind.config.js   # Tailwind CSS 配置
├── tsconfig.json        # TypeScript 配置
├── vite.config.ts       # Vite 配置
└── vercel.json          # Vercel 部署配置
```

## Documentation

访问 [docs.thingtwin.io](https://docs.thingtwin.io) 获取完整文档。

## Contributing

欢迎贡献！请参阅 [CONTRIBUTING.md](CONTRIBUTING.md) 了解详情。

## License

[MIT](LICENSE) 