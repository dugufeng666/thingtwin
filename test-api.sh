#!/bin/bash

# 使用 NVM 设置 Node.js 版本
. ~/.nvm/nvm.sh
nvm use 16

# 定义API URL
API_URL="http://localhost:3001/api/health"

echo "测试 API 健康状态..."
curl -s $API_URL | jq .

echo ""
echo "测试设备列表..."
curl -s http://localhost:3001/api/devices | jq . 