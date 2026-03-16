# 导航组件 (Navigation Components)

> 提供页面导航和菜单功能的组件

---

## 组件清单

| 序号 | 组件名称 | 说明 |
|------|----------|------|
| 1 | `TopNav` | 顶部导航栏（Logo、搜索、通知、用户） |
| 2 | `SideMenu` | 侧边栏菜单 |
| 3 | `Breadcrumb` | 面包屑导航 |
| 4 | `TabNav` | 标签页导航 |
| 5 | `GoBack` | 返回按钮 |

---

## 1. TopNav（顶部导航栏）

### 用途
应用顶部全局导航

### 结构
```
┌─────────────────────────────────────────────────────────────────┐
│ Logo │ 系统名称 │              │ 🔍 搜索 │ 🔔 通知(5) │ 👤 用户 │
└─────────────────────────────────────────────────────────────────┘
```

### Props
```typescript
interface TopNavProps {
  logo?: React.ReactNode;
  title?: string;
  collapsed?: boolean;
  onMenuClick?: () => void;
  onSearch?: (keyword: string) => void;
  notificationCount?: number;
  userInfo?: {
    name: string;
    avatar?: string;
    role: string;
  };
  onUserClick?: () => void;
}
```

### 子组件
- `GlobalSearch` - 全局搜索框
- `NotificationBell` - 通知铃铛
- `UserMenu` - 用户下拉菜单

---

## 2. SideMenu（侧边栏菜单）

### 用途
应用侧边栏导航菜单

### 结构
```
┌───────────────────────────┐
│ ◉ 仪表盘                  │
│ ◉ 实时监控                │
│   ▼ 任务管理              │
│     ├─ 任务列表           │
│     ├─ 定时任务           │
│     └─ 任务日志           │
│ ◉ 校园安保                │
│   ...                     │
└───────────────────────────┘
```

### Props
```typescript
interface SideMenuProps {
  menuItems: MenuItem[];
  selectedKeys?: string[];
  collapsed?: boolean;
  onMenuSelect?: (key: string) => void;
}

interface MenuItem {
  key: string;
  title: string;
  icon?: React.ReactNode;
  path?: string;
  children?: MenuItem[];
  permission?: string;
}
```

### 特性
- 支持多级菜单
- 支持图标
- 支持权限控制
- 可折叠

---

## 3. Breadcrumb（面包屑）

### 用途
显示当前页面路径

### 结构
```
仪表盘 / 任务管理 / 任务列表
```

### Props
```typescript
interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: string;
}

interface BreadcrumbItem {
  title: string;
  path?: string;
}
```

---

## 4. TabNav（标签页导航）

### 用途
多标签页切换

### 结构
```
┌─────────────────────────────────────────────────────────────────┐
│ 任务列表 ✕ │ 任务详情 ✕ │ 新建任务 ✕ │                    +  │
└─────────────────────────────────────────────────────────────────┘
```

### Props
```typescript
interface TabNavProps {
  tabs: TabItem[];
  activeKey?: string;
  onChange?: (key: string) => void;
  onClose?: (key: string) => void;
  editable?: boolean;
}

interface TabItem {
  key: string;
  title: string;
  closable?: boolean;
}
```

---

## 5. GoBack（返回按钮）

### 用途
返回上一页或指定页面

### 结构
```
← 返回
```

### Props
```typescript
interface GoBackProps {
  to?: string;           // 返回路径，默认 -1
  text?: string;         // 按钮文字
  onClick?: () => void;  // 点击回调
}
```

---

*文档更新时间: 2026-03-14*