# skybrain

> skybrain 项目

## 简介

这是一个基于 OpenClaw 的无人机智能巡航系统，用于自动巡检、监控和任务执行。

## 功能特性

- **实时巡航**：无人机按预设路径自动飞行
- **图像识别**：AI 分析摄像头画面，识别目标
- **任务调度**：根据时间和需求自动分配巡航任务
- **异常检测**：自动识别异常情况（障碍物、信号丢失等）
- **数据记录**：巡航结果自动存储到数据库
- **OpenClaw 集成**：通过 OpenClaw AI 助手进行智能决策

## 系统架构

```
Drone System
├── OpenClaw Gateway
├── Task Scheduler
├── AI Vision Module
├── Database Layer
└── Hardware Interface
```

## 技术栈

- **后端**：Node.js + Express
- **AI 模型**：OpenClaw（支持多模型，如智谱、火山引擎）
- **数据存储**：SQLite / PostgreSQL
- **硬件接口**：MAVLink SDK

## 开发计划

### 第一阶段：核心功能
- [ ] OpenClaw Gateway 集成
- [ ] 任务调度系统
- [ ] AI 视觉识别模块
- [ ] 基础巡航功能

### 第二阶段：智能升级
- [ ] 路径优化算法
- [ ] 异常自动上报
- [ ] 历史数据分析

### 第三阶段：部署测试
- [ ] 本地测试环境
- [ ] 硬件模拟
- [ ] 端到端联调

---

## 文件结构

```
~/projects/drone-intelligent-patrol-system/
├── README.md                # 项目说明
├── tasks.md                # 任务追踪
├── architecture.md          # 系统架构
├── ai-vision-module.md     # AI 视觉模块
├── scheduler.md            # 任务调度器
└── database-schema.md        # 数据库结构
```

---

## 参考资料

- OpenClaw 文档：https://docs.openclaw.ai
- MAVLink SDK：https://www.mavlink.com/
- AI 模型：智谱 / 火山引擎

---

*Created by Serene (宁序) on 2026-03-13* 🌊