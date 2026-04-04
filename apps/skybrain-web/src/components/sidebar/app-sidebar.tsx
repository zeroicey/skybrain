import { Home, Video, ListTodo, Plane, Settings, Bot, Users, User, Clock, Battery, Warehouse, Map, FileText, Mic, MessageSquare, FileEdit, Eye, Play, Grid3X3, Plus, Calendar, Drone, ClipboardList, TrendingUp, Utensils, Building2, GraduationCap, DoorOpen, UsersRound } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Link, useLocation } from "react-router"
import { ModeToggle } from "@/components/mode-toggle"

// 菜单数据结构
const navItems = [
  {
    title: "仪表盘",
    url: "/dashboard",
    icon: Home,
    items: [
      { title: "仪表盘", url: "/dashboard", icon: Home },
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
    title: "场景分析",
    url: "/scenes",
    icon: TrendingUp,
    items: [
      { title: "饭堂人流", url: "/scenes/canteen", icon: Utensils },
      { title: "街道商铺", url: "/scenes/shops", icon: Building2 },
      { title: "宿舍区域", url: "/scenes/dormitory", icon: UsersRound },
      { title: "教学楼", url: "/scenes/building", icon: GraduationCap },
      { title: "校门通行", url: "/scenes/gate", icon: DoorOpen },
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
  // {
  //   title: "校园安保",
  //   url: "/security",
  //   icon: Shield,
  //   items: [
  //     { title: "周界巡逻", url: "/security/patrol", icon: AlertTriangle },
  //     { title: "入侵告警", url: "/security/intrusion", icon: Siren },
  //     { title: "应急响应", url: "/security/emergency", icon: Settings },
  //   ],
  // },
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
      // { title: "禁飞管理", url: "/flight/no-fly", icon: Ban },
      // { title: "实时监控", url: "/flight/monitor", icon: Gauge },
      { title: "飞行记录", url: "/flight/records", icon: FileText },
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
      {/* Logo 区域 - 使用 SidebarHeader 确保在顶部 */}
      <SidebarHeader className="py-4">
        <Link to="/" className="flex flex-col items-center px-2 w-full group-data-[collapsible=icon]:py-2">
          <img src="/logo.svg" alt="SkyBrain" className="h-10 w-10 shrink-0 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8" />
          <span className="font-bold text-lg mt-1 group-data-[collapsible=icon]:hidden">SkyBrain</span>
          <span className="text-xs text-zinc-500 group-data-[collapsible=icon]:hidden">智能无人机管理系统</span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {navItems.map((item) => (
          <SidebarGroup key={item.title}>
            {item.title !== "仪表盘" && (
              <SidebarGroupLabel className="px-2 py-1 text-xs font-medium text-muted-foreground">
                <item.icon className="h-3 w-3 inline mr-1" />
                <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((subItem) => (
                  <SidebarMenuItem key={subItem.url}>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === subItem.url}
                    >
                      <Link to={subItem.url} className="flex items-center gap-2">
                        <subItem.icon className="h-4 w-4" />
                        <span className="group-data-[collapsible=icon]:hidden">{subItem.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="mt-auto">
        <div className="flex items-center justify-center px-2 py-2 w-full">
          <div className="text-xs text-muted-foreground">
            v1.0.0
          </div>
          <div className="group-data-[collapsible=icon]:hidden absolute right-2">
            <ModeToggle />
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}