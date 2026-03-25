# 校园场景监控页面扩展设计

## 项目概述

基于现有的饭堂人流监控页面，扩展建设街道商铺、宿舍区域、教学楼、校门通行四个新场景的监控页面。

## 现有系统

- **饭堂人流监控** (`/scenes/canteen`) - 已实现
- 三列布局：左侧指标 | 中间视频+图表 | 右侧指标
- 使用 Recharts 图表库
- Zustand 状态管理
- shadcn/ui 组件库

## 新增场景

### 1. 街道商铺监控 (`/scenes/shops`)

**顶部导航**
- 商业街区选择（ dropdown）
- 商铺类型筛选（餐饮/零售/服务）
- 日期选择

**数据模型**
```typescript
interface ShopData {
  id: string
  name: string
  type: 'restaurant' | 'retail' | 'service'
  location: string
  capacity: number
}
```

**核心指标**
- 实时客流量
- 今日累计客流量
- 拥堵指数
- 热门时段
- 最热门商铺排名

### 2. 宿舍区域监控 (`/scenes/dormitory`)

**顶部导航**
- 宿舍楼选择
- 楼栋选择
- 性别筛选（男/女/混合）

**数据模型**
```typescript
interface DormitoryData {
  id: string
  name: string
  building: string
  floors: number
  capacity: number
  gender: 'male' | 'female' | 'mixed'
}
```

**核心指标**
- 当前在寝人数
- 离寝比例
- 晚归统计
- 归寝率
- 男生/女生/访客分布

### 3. 教学楼监控 (`/scenes/building`)

**顶部导航**
- 教学楼选择
- 楼层选择

**数据模型**
```typescript
interface BuildingData {
  id: string
  name: string
  floors: number
  classrooms: number
  capacity: number
}
```

**核心指标**
- 实时在场人数
- 教室使用率
- 高峰时段
- 空闲教室数
- 各区域分布（教室/走廊/厕所/休息区）

### 4. 校门通行监控 (`/scenes/gate`)

**顶部导航**
- 校门选择（东门/西门/南门/北门）
- 方向筛选（进/出）

**数据模型**
```typescript
interface GateData {
  id: string
  name: string
  location: string
  capacity: number
}
```

**核心指标**
- 实时进出人数
- 进/出比例
- 身份类型分布（学生/教职工/外来人员）
- 异常通行记录

## UI/UX 设计

### 统一布局

```
┌─────────────────────────────────────────────────────────────┐
│  顶部导航栏 (自定义，每场景不同)                               │
├─────────────┬─────────────────────────┬─────────────────────┤
│   左侧      │      中间               │    右侧             │
│  (280px)    │    (flex-1)             │   (240px)           │
│             │                         │                     │
│ • 拥堵指数   │  ┌─────────────────┐   │ • 实时人数          │
│ • 今日累计   │  │  实时视频监控   │   │ • 拥堵等级          │
│ • 区域人流   │  │   (16:9)        │   │ • 高峰时段          │
│ • 分布图表   │  └─────────────────┘   │ • 核心指标          │
│             │                         │ • 状态说明          │
│             │  ┌──────┬──────┐      │                     │
│             │  │趋势图│ 预测 │      │                     │
│             │  └──────┴──────┘      │                     │
└─────────────┴─────────────────────────┴─────────────────────┘
```

### 设计规范

- 颜色主题：与饭堂页面一致，使用蓝/紫/绿/黄/红五色
- 图表：Recharts AreaChart/LineChart/PieChart
- 组件：使用 shadcn/ui Badge, Button, Separator
- 视频：16:9 aspect-video 比例
- 实时更新：3秒间隔

## 文件结构

```
src/
├── data/
│   ├── mock-shops.ts        # 街道商铺 mock 数据
│   ├── mock-dormitories.ts  # 宿舍区域 mock 数据
│   ├── mock-buildings.ts   # 教学楼 mock 数据
│   └── mock-gates.ts       # 校门通行 mock 数据
├── stores/
│   ├── shop-store.ts        # 街道商铺 store
│   ├── dormitory-store.ts  # 宿舍区域 store
│   ├── building-store.ts   # 教学楼 store
│   └── gate-store.ts       # 校门通行 store
├── pages/modules/scene/
│   ├── shops-page.tsx      # 街道商铺页面
│   ├── dormitory-page.tsx  # 宿舍区域页面
│   ├── building-page.tsx   # 教学楼页面
│   └── gate-page.tsx      # 校门通行页面
└── components/navbar/contents/
    ├── shop.tsx            # 街道商铺导航
    ├── dormitory.tsx       # 宿舍区域导航
    ├── building.tsx        # 教学楼导航
    └── gate.tsx           # 校门通行导航
```

## 路由配置

```typescript
{
  path: "scenes",
  children: [
    { path: "canteen", Component: CanteenPage },
    { path: "shops", Component: ShopsPage },
    { path: "dormitory", Component: DormitoryPage },
    { path: "building", Component: BuildingPage },
    { path: "gate", Component: GatePage },
  ]
}
```

## 实现顺序

1. 创建 mock 数据文件
2. 创建 Zustand store
3. 创建 navbar content 组件
4. 创建页面组件（复用 canteen-page 布局结构）
5. 添加路由配置
6. 更新 sidebar（添加菜单项）

## 验收标准

- [ ] 四个新场景页面都能正常访问
- [ ] 布局与饭堂页面保持一致（三列）
- [ ] 每个场景有独特的顶部导航
- [ ] 视频区域正常显示（16:9）
- [ ] 图表数据正确展示
- [ ] 实时数据定时更新（3秒）
- [ ] 页面切换流畅