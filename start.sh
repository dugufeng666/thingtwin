#!/bin/bash

# 使用 NVM 设置 Node.js 版本
. ~/.nvm/nvm.sh
nvm use 16

# 启动后端服务
npm run api &
API_PID=$!

# 启动前端服务
npm run dev &
DEV_PID=$!

# 函数用于捕获 SIGINT (Ctrl+C) 信号
function cleanup {
  echo "正在关闭服务..."
  kill $API_PID
  kill $DEV_PID
  exit 0
}

# 注册信号处理器
trap cleanup SIGINT

# 等待进程
wait 