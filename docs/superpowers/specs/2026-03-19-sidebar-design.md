# Sidebar 设计文档

> 创建时间: 2026-03-19

## 1. 概述

实现 SkyBrain Web 应用的侧边栏导航，使用 shadcn/ui Sidebar 组件，支持折叠到图标模式。

## 2. 项目上下文

- **项目路径**: `/home/oicey/projects/skybrain/apps/skybrain-web`
- **包管理器**: bun
- **技术栈**: React 19 + Vite + Tailwind CSS 4 + shadcn/ui
- **图标库**: lucide-react

## 3. UI/UX 设计

### 3.1 布局结构

```
┌─────────────────────────────────────────────────────┐
│ [☰] SkyBrain                              │ ← Header
├────────┬────────────────────────────────────────────┤
│        │                                            │
│  图标  │           主内容区域                        │
│  菜单  │                                            │
│        │                                            │
│  仪表盘│                                            │
│  监控  │                                            │
│  任务  │                                            │
│  安保  │                                            │
│  设备  │                                            │
│  飞行  │                                            │
│  分析  │                                            │
│  设置  │                                            │
│  AI    │                                            │
│        │                                            │
└────────┴────────────────────────────────────────────┘
```

### 3.2 组件结构

| 组件 | 路径 | 职责 |
|------|------|------|
| SidebarProvider | App.tsx | 提供侧边栏状态上下文 |
| AppSidebar | components/app-sidebar.tsx | 菜单配置和渲染 |
| SidebarTrigger | Header 区域 | 展开/折叠触发器 |

### 3.3 菜单层级

| 分组 | 路由前缀 | 子菜单 |
|------|----------|--------|
| 仪表盘 | /dashboard | 仪表盘, 安保态势, 飞行态势 |
| 实时监控 | /monitor | 视频监控, 监控回放, 多路监控 |
| 任务管理 | /tasks | 任务列表, 任务创建, 定时任务, 任务日志 |
| 校园安保 | /security | 周界巡逻, 入侵告警, 应急响应 |
| 设备管理 | /devices | 无人机列表, 机库管理, 电池管理, 维护记录 |
| 飞行管理 | /flight | 航线管理, 禁飞管理, 实时监控, 飞行记录 |
| 数据分析 | /analytics | 数据大屏, 运营报表 |
| 系统设置 | /settings | 用户管理, 角色权限, 操作日志, 系统配置 |
| AI 交互 | /ai | 语音控制, 智能问答, 自然语言任务创建 |

### 3.4 交互行为

- **默认状态**: 折叠（图标模式），`defaultOpen={false}`
- **折叠模式**: 仅显示图标，文字隐藏
- **展开模式**: 显示图标 + 文字
- **触发器**: 侧边栏顶部汉堡菜单按钮，点击切换状态

## 4. 功能需求

### 4.1 核心功能
- [ ] 安装 shadcn/ui sidebar 组件
- [ ] 配置 SidebarProvider，defaultOpen=false
- [ ] 创建 AppSidebar 组件，包含完整菜单结构
- [ ] 实现多级菜单（SidebarMenu + Collapsible）
- [ ] 集成 React Router 导航链接

### 4.2 菜单项配置
- 9 个导航分组
- 约 30+ 个菜单/子菜单项
- 每个菜单项包含：title, icon, url

### 4.3 图标映射

| 菜单 | 图标 |
|------|------|
| 仪表盘 | LayoutDashboard |
| 实时监控 | Video |
| 任务管理 | ListTodo |
| 校园安保 | Shield |
| 设备管理 | Drone |
| 飞行管理 | Plane |
| 数据分析 | BarChart |
| 系统设置 | Settings |
| AI 交互 | Bot |

## 5. 实现步骤

### Step 1: 安装依赖
```bash
bunx shadcn@latest add sidebar
```

### Step 2: 添加样式变量
在 `index.css` 中添加 sidebar 相关的 CSS 变量

### Step 3: 创建 AppSidebar
创建 `components/app-sidebar.tsx`，配置完整菜单结构

### Step 4: 修改 App.tsx
在根组件中添加 SidebarProvider 和 AppSidebar

### Step 5: 验证
- 确认侧边栏默认折叠
- 确认点击可以展开/折叠
- 确认菜单链接正确

## 6. 验收标准

- [ ] 侧边栏默认折叠，只显示图标
- [ ] 点击触发器可以展开/折叠
- [ ] 展开时显示图标 + 文字
- [ ] 折叠时只显示图标
- [ ] 9 个导航分组全部显示
- [ ] 子菜单可以展开/收起
- [ ] 菜单链接正确（指向对应路由）