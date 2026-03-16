# 地图组件 (Map Components)

> 用于地图展示和交互的组件

---

## 组件清单

| 序号 | 组件名称 | 说明 |
|------|----------|------|
| 1 | `MapView` | 基础地图组件 |
| 2 | `RouteEditor` | 航线编辑器（地图标注） |
| 3 | `NoFlyZoneEditor` | 禁飞区域编辑器 |
| 4 | `PatrolRoute` | 巡逻路线显示 |
| 5 | `DroneMarker` | 无人机位置标记 |
| 6 | `HeatMapOverlay` | 热力图覆盖层 |

---

## 组件说明

### MapView
- 基础地图组件，支持 Leaflet/Mapbox GL/高德地图
- 支持：缩放、平移、标记、绘制
- Props: `center`, `zoom`, `markers`, `routes`, `onClick`

### RouteEditor
- 航线编辑器，用于在地图上绘制航线
- 支持：添加航点、拖拽调整、属性配置
- Props: `waypoints`, `onChange`, `readOnly`

### NoFlyZoneEditor
- 禁飞区域编辑器，用于绘制禁飞区域
- 支持：圆形、多边形区域绘制
- Props: `zones`, `onChange`, `editable`

### PatrolRoute
- 巡逻路线显示组件
- 支持：路线绘制、动画效果
- Props: `route`, `color`, `animated`

### DroneMarker
- 无人机位置标记
- 支持：状态颜色、方向指示、信息弹窗
- Props: `position`, `status`, `heading`, `info`

### HeatMapOverlay
- 热力图覆盖层，用于人流/污染分布展示
- 支持：渐变色、数值显示
- Props: `data`, `radius`, `gradient`

---

*文档更新时间: 2026-03-14*