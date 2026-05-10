---
name: deployment-docs-page
description: 单页部署文档页面 - Skybrain 智能无人机巡检系统
type: spec
created: 2026-04-20
---

# 部署文档页面规格

## 概述
- **类型**: 单页 HTML 文档
- **风格**: 技术手册风格（命令行、配置文件、代码片段）
- **部署方案**: Docker Compose

## 包含内容
1. 系统架构概述
2. 环境准备（硬件/软件依赖）
3. 前端部署（Nginx + 构建配置）
4. 后端 API 部署（Node.js + Prisma + PostgreSQL）
5. 模型服务部署
   - 训练环境（PyTorch + CUDA）
   - 推理服务（FastAPI + YOLO）
6. 视频推流服务
7. 数据流向说明
8. docker-compose.yml 完整示例
9. 快速启动指南
10. 常见问题排查

## 技术要求
- 纯 HTML + CSS（可少量 JS）
- 专业技术文档样式
- 代码高亮样式
- 响应式布局
