# 前端架构文档

> 本目录包含基于需求文档 `requirements.md` 生成的前端完整架构

---

## 目录结构

```
frontend-architecture/
├── README.md                      # 本文件 - 总览
│
├── pages/                         # 页面模块
│   ├── 01-dashboard.md           # 仪表盘
│   ├── 02-monitor.md             # 实时监控
│   ├── 03-tasks.md               # 任务管理
│   ├── 04-security.md            # 校园安保
│   ├── 05-inspection.md          # 设施巡检
│   ├── 06-events.md              # 活动保障
│   ├── 07-environment.md         # 环境监测
│   ├── 08-logistics.md           # 物流配送
│   ├── 09-rescue.md              # 搜索救援
│   ├── 10-devices.md             # 设备管理
│   ├── 11-flight.md              # 飞行管理
│   ├── 12-analytics.md           # 数据分析
│   ├── 13-settings.md            # 系统设置
│   └── 14-ai.md                  # AI交互
│
└── components/                    # 组件清单
    ├── 01-layout.md              # 布局组件
    ├── 02-navigation.md          # 导航组件
    ├── 03-display.md             # 数据展示组件
    ├── 04-charts.md              # 图表组件
    ├── 05-forms.md               # 表单组件
    ├── 06-map.md                 # 地图组件
    ├── 07-monitor.md             # 监控组件
    ├── 08-alert.md               # 告警组件
    ├── 09-drone.md               # 无人机控制组件
    ├── 10-ai.md                  # AI交互组件
    ├── 11-feedback.md            # 反馈组件
    └── 12-business.md            # 业务组件
```

---

## 快速导航

### 页面模块 (14个)

| 序号 | 模块 | 文件 | 页面数量 |
|------|------|------|----------|
| 1 | 仪表盘 | `pages/01-dashboard.md` | 3 |
| 2 | 实时监控 | `pages/02-monitor.md` | 4 |
| 3 | 任务管理 | `pages/03-tasks.md` | 6 |
| 4 | 校园安保 | `pages/04-security.md` | 6 |
| 5 | 设施巡检 | `pages/05-inspection.md` | 5 |
| 6 | 活动保障 | `pages/06-events.md` | 5 |
| 7 | 环境监测 | `pages/07-environment.md` | 4 |
| 8 | 物流配送 | `pages/08-logistics.md` | 5 |
| 9 | 搜索救援 | `pages/09-rescue.md` | 4 |
| 10 | 设备管理 | `pages/10-devices.md` | 6 |
| 11 | 飞行管理 | `pages/11-flight.md` | 6 |
| 12 | 数据分析 | `pages/12-analytics.md` | 5 |
| 13 | 系统设置 | `pages/13-settings.md` | 5 |
| 14 | AI交互 | `pages/14-ai.md` | 3 |

**总计：62个页面**

### 组件分类 (12类)

| 序号 | 分类 | 文件 | 组件数量 |
|------|------|------|----------|
| 1 | 布局组件 | `components/01-layout.md` | 5 |
| 2 | 导航组件 | `components/02-navigation.md` | 5 |
| 3 | 数据展示 | `components/03-display.md` | 15 |
| 4 | 图表组件 | `components/04-charts.md` | 8 |
| 5 | 表单组件 | `components/05-forms.md` | 10 |
| 6 | 地图组件 | `components/06-map.md` | 6 |
| 7 | 监控组件 | `components/07-monitor.md` | 6 |
| 8 | 告警组件 | `components/08-alert.md` | 5 |
| 9 | 无人机控制 | `components/09-drone.md` | 9 |
| 10 | AI交互 | `components/10-ai.md` | 4 |
| 11 | 反馈组件 | `components/11-feedback.md` | 10 |
| 12 | 业务组件 | `components/12-business.md` | 12 |

**总计：95个组件**

---

## 需求模块与页面映射

| 需求文档模块 | 页面模块 | 文件 |
|--------------|----------|------|
| 校园安保 | 校园安保 | `pages/04-security.md` |
| 设施巡检 | 设施巡检 | `pages/05-inspection.md` |
| 活动保障 | 活动保障 | `pages/06-events.md` |
| 环境监测 | 环境监测 | `pages/07-environment.md` |
| 物流配送 | 物流配送 | `pages/08-logistics.md` |
| 搜索救援 | 搜索救援 | `pages/09-rescue.md` |
| 设备管理 | 设备管理 | `pages/10-devices.md` |
| 飞行管理 | 飞行管理 | `pages/11-flight.md` |
| 数据分析 | 数据分析 | `pages/12-analytics.md` |
| 系统设置 | 系统设置 | `pages/13-settings.md` |
| AI能力 | AI交互 | `pages/14-ai.md` |

---

## 技术栈

| 类别 | 推荐技术 |
|------|----------|
| 框架 | React 18+ / Vue 3 |
| 路由 | React Router 6 / Vue Router 4 |
| 状态管理 | Redux Toolkit / Pinia |
| UI组件库 | Ant Design 5 / Element Plus |
| 地图 | Leaflet / Mapbox GL / 高德地图 JS API |
| 图表 | ECharts 5 |
| 视频播放 | Video.js / flv.js / hls.js |
| 表单 | React Hook Form / FormKit |
| 拖拽 | dnd-kit / vue-draggable-plus |
| 国际化 | i18next / vue-i18n |
| 构建工具 | Vite |

---

## 响应式设计

| 断点 | 宽度 | 布局 |
|------|------|------|
| Mobile | < 768px | 侧边栏变为抽屉，单列布局 |
| Tablet | 768px - 1024px | 侧边栏可折叠，2列布局 |
| Desktop | 1024px - 1440px | 标准布局，3列内容 |
| Wide | > 1440px | 宽屏布局，信息面板展开 |

---

*最后更新: 2026-03-14*