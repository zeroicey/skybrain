# 数据展示组件 (Display Components)

> 用于展示各类数据的组件

---

## 组件清单

| 序号 | 组件名称 | 说明 |
|------|----------|------|
| 1 | `StatCard` | 统计卡片（图标+数值+标题+趋势） |
| 2 | `DataTable` | 数据表格（排序、筛选、分页） |
| 3 | `TreeTable` | 树形表格 |
| 4 | `ListView` | 列表视图 |
| 5 | `CardList` | 卡片列表 |
| 6 | `DescriptionList` | 描述列表 |
| 7 | `Timeline` | 时间线 |
| 8 | `Progress` | 进度条 |
| 9 | `Badge` | 徽标 |
| 10 | `Tag` | 标签 |
| 11 | `Avatar` | 头像 |
| 12 | `Empty` | 空状态 |
| 13 | `Skeleton` | 骨架屏 |
| 14 | `Spin` | 加载中 |
| 15 | `Pagination` | 分页器 |

---

## 1. StatCard（统计卡片）

### 用途
展示单个统计指标

### 结构
```
┌─────────────────────────────────┐
│  📊 图标                        │
│                                 │
│  数值          ↑ 12%            │
│  标题                           │
│                                 │
└─────────────────────────────────┘
```

### Props
```typescript
interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  prefix?: React.ReactNode;
  suffix?: string;
  trend?: {
    value: number;      // 变化值
    direction: 'up' | 'down' | 'flat';
  };
  color?: string;
  loading?: boolean;
}
```

---

## 2. DataTable（数据表格）

### 用途
通用数据表格

### 结构
```
┌─────────────────────────────────────────────────────────────────┐
│  列1 ↑  │  列2  │  列3  │  列4  │  操作         [筛选] [导出] │
├─────────┼────────┼────────┼────────┼──────────────────────────┤
│  数据1  │ 数据2 │ 数据3 │ 数据4 │  [详情] [编辑] [删除]      │
│  数据1  │ 数据2 │ 数据3 │ 数据4 │  [详情] [编辑] [删除]      │
├─────────────────────────────────────────────────────────────────┤
│                                            < 1 2 3 4 5 >       │
└─────────────────────────────────────────────────────────────────┘
```

### Props
```typescript
interface DataTableProps<T = any> {
  columns: Column<T>[];
  dataSource: T[];
  rowKey?: string | ((record: T) => string);
  loading?: boolean;
  pagination?: PaginationConfig;
  sort?: SortConfig;
  filter?: FilterConfig;
  rowSelection?: RowSelectionConfig;
  onRow?: (record: T, index: number) => void;
  scroll?: { x?: number; y?: number };
}

interface Column<T> {
  title: string;
  dataIndex: keyof T;
  key?: string;
  width?: number;
  fixed?: 'left' | 'right';
  sorter?: boolean | ((a: T, b: T) => number);
  render?: (value: any, record: T, index: number) => React.ReactNode;
}
```

---

## 3. TreeTable（树形表格）

### 用途
展示具有层级关系的数据

### Props
```typescript
interface TreeTableProps<T = any> {
  columns: Column<T>[];
  dataSource: T[];
  rowKey: string;
  defaultExpandAll?: boolean;
  childrenColumnName?: string;
}
```

---

## 4. ListView（列表视图）

### 用途
通用列表展示

### Props
```typescript
interface ListViewProps<T = any> {
  dataSource: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  loading?: boolean;
  empty?: React.ReactNode;
}
```

---

## 5. CardList（卡片列表）

### 用途
卡片形式展示数据

### Props
```typescript
interface CardListProps<T = any> {
  dataSource: T[];
  renderCard: (item: T) => React.ReactNode;
  grid?: { gutter: number; column: number };
  loading?: boolean;
}
```

---

## 6. DescriptionList（描述列表）

### 用途
展示键值对形式的信息

### 结构
```
┌─────────────────────────────────────────┐
│  名称:                     值           │
│  名称:                     值           │
│  名称:                     值           │
└─────────────────────────────────────────┘
```

### Props
```typescript
interface DescriptionListProps {
  title?: string;
  column?: number;
  items: DescriptionItem[];
}

interface DescriptionItem {
  label: string;
  value: React.ReactNode;
  span?: number;
}
```

---

## 7. Timeline（时间线）

### 用途
展示时间顺序事件

### 结构
```
● 14:30 任务完成
│
● 14:20 无人机返航
│
● 14:10 开始执行任务
```

### Props
```typescript
interface TimelineProps {
  items: TimelineItem[];
  mode?: 'left' | 'right' | 'alternate';
}

interface TimelineItem {
  time?: string;
  title: string;
  description?: string;
  color?: 'blue' | 'red' | 'green' | 'gray';
}
```

---

## 8. Progress（进度条）

### 用途
展示进度百分比

### Props
```typescript
interface ProgressProps {
  percent: number;
  status?: 'normal' | 'success' | 'exception';
  strokeColor?: string;
  showInfo?: boolean;
  type?: 'line' | 'circle' | 'dashboard';
}
```

---

## 9. Badge（徽标）

### 用途
展示数量或状态标记

### Props
```typescript
interface BadgeProps {
  count?: number;
  dot?: boolean;
  status?: 'success' | 'processing' | 'default' | 'error' | 'warning';
  text?: string;
}
```

---

## 10. Tag（标签）

### 用途
展示标签或标记

### Props
```typescript
interface TagProps {
  children: React.ReactNode;
  color?: string;
  closable?: boolean;
  onClose?: () => void;
}
```

---

## 11. Avatar（头像）

### 用途
展示用户头像

### Props
```typescript
interface AvatarProps {
  src?: string;
  icon?: React.ReactNode;
  size?: number | 'small' | 'default' | 'large';
  shape?: 'circle' | 'square';
}
```

---

## 12. Empty（空状态）

### 用途
数据为空时展示

### Props
```typescript
interface EmptyProps {
  description?: string;
  image?: React.ReactNode;
}
```

---

## 13. Skeleton（骨架屏）

### 用途
加载中展示占位

### Props
```typescript
interface SkeletonProps {
  active?: boolean;
  avatar?: boolean;
  title?: boolean;
  paragraph?: boolean;
}
```

---

## 14. Spin（加载中）

### 用途
展示加载状态

### Props
```typescript
interface SpinProps {
  spinning?: boolean;
  tip?: string;
  size?: 'small' | 'default' | 'large';
}
```

---

## 15. Pagination（分页器）

### 用途
数据分页控制

### Props
```typescript
interface PaginationProps {
  current: number;
  pageSize: number;
  total: number;
  onChange?: (page: number, pageSize: number) => void;
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
}
```

---

*文档更新时间: 2026-03-14*