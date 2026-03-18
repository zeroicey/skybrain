# Sidebar-07 Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 实现 SkyBrain Web 侧边栏导航，支持折叠到图标模式

**Architecture:** 使用 shadcn/ui Sidebar 组件，通过 SidebarProvider 提供状态，创建 AppSidebar 组件包含完整导航菜单结构

**Tech Stack:** React 19 + Vite + Tailwind CSS 4 + shadcn/ui + lucide-react

---

## File Structure

| 文件 | 操作 | 职责 |
|------|------|------|
| src/components/ui/sidebar.tsx | 创建 | shadcn/ui Sidebar 组件 |
| src/components/ui/sidebar.css | 创建 | Sidebar 样式文件 |
| src/components/app-sidebar.tsx | 创建 | 应用侧边栏（菜单配置） |
| src/App.tsx | 修改 | 添加 SidebarProvider 和 AppSidebar |
| src/index.css | 修改 | 添加 sidebar CSS 变量 |

---

## Chunk 1: 安装 shadcn Sidebar 组件

- [ ] **Step 1: 安装 sidebar 组件**

```bash
cd /home/oicey/projects/skybrain/apps/skybrain-web
bunx shadcn@latest add sidebar
```

- [ ] **Step 2: 验证安装结果**

检查 `src/components/ui/` 目录下是否生成了 sidebar.tsx 文件

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/sidebar.tsx src/components/ui/sidebar.css
git commit -m "feat: add shadcn sidebar component"
```

---

## Chunk 2: 配置 CSS 变量

- [ ] **Step 1: 添加 sidebar 样式变量**

在 `src/index.css` 中添加：

```css
@layer base {
  :root {
    --sidebar-background: 0 0% 98%;
    --sidebar-foreground: 240 5.3% 26.1%;
    --sidebar-primary: 240 5.9% 10%;
    --sidebar-primary-foreground: 0 0% 98%;
    --sidebar-accent: 240 4.8% 95.9%;
    --sidebar-accent-foreground: 240 5.9% 10%;
    --sidebar-border: 220 13% 91%;
    --sidebar-ring: 217.2 91.2% 59.8%;
  }

  .dark {
    --sidebar-background: 240 5.9% 10%;
    --sidebar-foreground: 240 4.8% 95.9%;
    --sidebar-primary: 0 0% 98%;
    --sidebar-primary-foreground: 240 5.9% 10%;
    --sidebar-accent: 240 3.7% 15.9%;
    --sidebar-accent-foreground: 240 4.8% 95.9%;
    --sidebar-border: 240 3.7% 15.9%;
    --sidebar-ring: 217.2 91.2% 59.8%;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/index.css
git commit -m "feat: add sidebar CSS variables"
```

---

## Chunk 3: 创建 AppSidebar 组件

- [ ] **Step 1: 创建 AppSidebar 组件**

创建文件 `src/components/app-sidebar.tsx`：

```tsx
import * as React from "react"
import { Home, Video, ListTodo, Shield, Plane, BarChart, Settings, Bot, ChevronDown, Users, User, Clock, Battery, Warehouse, Map, Ban, FileText, Mic, MessageSquare, FileEdit, Eye, Play, Grid3X3, Plus, Calendar, AlertTriangle, Siren, Drone, Gauge, Truck, ClipboardList, Zap, SunMedium, Moon, Sun, Cloud, CloudRain, Wind, Thermometer } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Link, useLocation } from "react-router"

// 菜单数据结构
const navItems = [
  {
    title: "仪表盘",
    url: "/dashboard",
    icon: Home,
    items: [
      { title: "仪表盘", url: "/dashboard", icon: Home },
      { title: "安保态势", url: "/dashboard/security", icon: Shield },
      { title: "飞行态势", url: "/dashboard/flight", icon: Plane },
    ],
  },
  {
    title: "实时监控",
    url: "/monitor",
    icon: Video,
    items: [
      { title: "视频监控", url: "/monitor/live", icon: Eye },
      { title: "监控回放", url: "/monitor/playback", icon: Play },
      { title: "多路监控", url: "/monitor/multi", icon: Grid3X3 },
    ],
  },
  {
    title: "任务管理",
    url: "/tasks",
    icon: ListTodo,
    items: [
      { title: "任务列表", url: "/tasks", icon: ListTodo },
      { title: "任务创建", url: "/tasks/create", icon: Plus },
      { title: "定时任务", url: "/tasks/schedule", icon: Calendar },
      { title: "任务日志", url: "/tasks/logs", icon: FileText },
    ],
  },
  {
    title: "校园安保",
    url: "/security",
    icon: Shield,
    items: [
      { title: "周界巡逻", url: "/security/patrol", icon: AlertTriangle },
      { title: "入侵告警", url: "/security/intrusion", icon: Siren },
      { title: "应急响应", url: "/security/emergency", icon: Zap },
    ],
  },
  {
    title: "设备管理",
    url: "/devices",
    icon: Drone,
    items: [
      { title: "无人机列表", url: "/devices/drones", icon: Drone },
      { title: "机库管理", url: "/devices/hangars", icon: Warehouse },
      { title: "电池管理", url: "/devices/batteries", icon: Battery },
      { title: "维护记录", url: "/devices/maintenance", icon: ClipboardList },
    ],
  },
  {
    title: "飞行管理",
    url: "/flight",
    icon: Plane,
    items: [
      { title: "航线管理", url: "/flight/routes", icon: Map },
      { title: "禁飞管理", url: "/flight/no-fly", icon: Ban },
      { title: "实时监控", url: "/flight/monitor", icon: Gauge },
      { title: "飞行记录", url: "/flight/records", icon: FileText },
    ],
  },
  {
    title: "数据分析",
    url: "/analytics",
    icon: BarChart,
    items: [
      { title: "数据大屏", url: "/analytics/overview", icon: BarChart },
      { title: "运营报表", url: "/analytics/reports", icon: FileText },
    ],
  },
  {
    title: "系统设置",
    url: "/settings",
    icon: Settings,
    items: [
      { title: "用户管理", url: "/settings/users", icon: Users },
      { title: "角色权限", url: "/settings/roles", icon: User },
      { title: "操作日志", url: "/settings/logs", icon: Clock },
      { title: "系统配置", url: "/settings/config", icon: Settings },
    ],
  },
  {
    title: "AI 交互",
    url: "/ai",
    icon: Bot,
    items: [
      { title: "语音控制", url: "/ai/voice", icon: Mic },
      { title: "智能问答", url: "/ai/chat", icon: MessageSquare },
      { title: "自然语言任务", url: "/ai/task-create", icon: FileEdit },
    ],
  },
]

export function AppSidebar() {
  const location = useLocation()

  return (
    <Sidebar collapsible="icon">
      {/* Logo 区域 */}
      <SidebarGroup>
        <SidebarGroupLabel className="font-bold text-lg">
          🦅 SkyBrain
        </SidebarGroupLabel>
      </SidebarGroup>

      <SidebarContent>
        {navItems.map((item, index) => (
          <Collapsible
            key={item.title}
            defaultOpen={false}
            className="group/collapsible"
          >
            <SidebarGroup>
              <SidebarGroupLabel asChild>
                <CollapsibleTrigger className="flex w-full items-center justify-between px-2 py-1 text-sm font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md transition-colors">
                  <span className="flex items-center gap-2">
                    <item.icon className="h-4 w-4" />
                    <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                  </span>
                  <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180 group-data-[collapsible=icon]:hidden" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {item.items.map((subItem) => (
                      <SidebarMenuItem key={subItem.title}>
                        <SidebarMenuButton
                          asChild
                          isActive={location.pathname === subItem.url}
                        >
                          <Link to={subItem.url} className="flex items-center gap-2">
                            <subItem.icon className="h-4 w-4" />
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs text-muted-foreground">
            v1.0.0
          </SidebarGroupLabel>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  )
}
```

- [ ] **Step 2: 检查是否需要添加 react-router 依赖**

```bash
cd /home/oicey/projects/skybrain/apps/skybrain-web
cat package.json | grep react-router
```

如果未安装，添加依赖：

```bash
bun add react-router-dom
```

- [ ] **Step 3: Commit**

```bash
git add src/components/app-sidebar.tsx
git commit -m "feat: create AppSidebar component with navigation menu"
```

---

## Chunk 4: 修改 App.tsx

- [ ] **Step 1: 查看现有 App.tsx 内容**

读取 `src/App.tsx` 了解当前结构

- [ ] **Step 2: 修改 App.tsx**

```tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

function App() {
  return (
    <BrowserRouter>
      <SidebarProvider defaultOpen={false}>
        <div className="flex min-h-screen">
          <AppSidebar />
          <main className="flex-1 flex flex-col">
            <div className="p-4 border-b">
              <SidebarTrigger />
            </div>
            <div className="flex-1 p-6">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                {/* 其他路由占位 */}
              </Routes>
            </div>
          </main>
        </div>
      </SidebarProvider>
    </BrowserRouter>
  )
}

// 临时 Dashboard 页面占位
function DashboardPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold">仪表盘</h1>
      <p>欢迎使用 SkyBrain 智能无人机巡检系统</p>
    </div>
  )
}

export default App
```

- [ ] **Step 3: Commit**

```bash
git add src/App.tsx
git commit -m "feat: integrate SidebarProvider and AppSidebar in App"
```

---

## Chunk 5: 验证实现

- [ ] **Step 1: 启动开发服务器**

```bash
cd /home/oicey/projects/skybrain/apps/skybrain-web
bun run dev
```

- [ ] **Step 2: 验证侧边栏功能**

在浏览器中打开 http://localhost:5173

检查：
- [ ] 侧边栏默认折叠，只显示图标
- [ ] 点击触发器可以展开/折叠
- [ ] 展开时显示图标 + 文字
- [ ] 9 个导航分组全部显示
- [ ] 子菜单可以展开/收起

- [ ] **Step 3: 最终 Commit**

```bash
git add .
git commit -m "feat: complete sidebar-07 implementation"
```

---

## 验收标准

- [ ] 侧边栏默认折叠，只显示图标
- [ ] 点击触发器可以展开/折叠
- [ ] 展开时显示图标 + 文字
- [ ] 折叠时只显示图标
- [ ] 9 个导航分组全部显示
- [ ] 子菜单可以展开/收起
- [ ] 菜单链接正确（指向对应路由）