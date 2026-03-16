# 业务组件 (Business Components)

> 特定业务场景下的复合组件

---

## 组件清单

| 序号 | 组件名称 | 说明 |
|------|----------|------|
| 1 | `PeopleCounter` | 人流统计组件 |
| 2 | `AirQualityPanel` | 空气质量面板 |
| 3 | `WeatherWidget` | 天气小部件 |
| 4 | `DeviceStatusPanel` | 设备状态面板 |
| 5 | `TaskProgress` | 任务进度组件 |
| 6 | `RoutePreview` | 航线预览组件 |
| 7 | `DeliveryTracker` | 配送追踪组件 |
| 8 | `EventCard` | 活动卡片 |
| 9 | `InspectionReport` | 巡检报告 |
| 10 | `DefectCard` | 缺陷卡片 |
| 11 | `EmergencyPanel` | 应急面板 |
| 12 | `MaintenanceRecord` | 维护记录 |

---

## 组件说明

### PeopleCounter
- 人流统计组件
- 展示：当前人数、变化趋势、预警阈值
- Props: `count`, `trend`, `threshold`, `onAlert`

### AirQualityPanel
- 空气质量面板
- 展示：AQI、PM2.5、PM10、等级
- Props: `data`, `aqiLevel`, `showDetail`

### WeatherWidget
- 天气小部件
- 展示：温度、天气状况、湿度、风力
- Props: `weather`, `size`

### DeviceStatusPanel
- 设备状态面板
- 展示：在线数、离线数、告警数
- Props: `devices`, `alerts`

### TaskProgress
- 任务进度组件
- 展示：执行进度、时间、预估完成
- Props: `status`, `progress`, `startTime`, `endTime`

### RoutePreview
- 航线预览组件
- 展示：航线形状、航点数量、预计时长
- Props: `route`, `showWaypoints`

### DeliveryTracker
- 配送追踪组件
- 展示：配送轨迹、当前位置、预计到达
- Props: `order`, `track`, `status`

### EventCard
- 活动保障卡片
- 展示：活动名称、时间、地点、保障状态
- Props: `event`, `onStartSupport`

### InspectionReport
- 巡检报告组件
- 展示：巡检结果、发现问题、照片
- Props: `report`, `onViewDetail`

### DefectCard
- 缺陷卡片
- 展示：缺陷位置、类型、严重程度、状态
- Props: `defect`, `onProcess`

### EmergencyPanel
- 应急响应面板
- 展示：可用无人机、快速操作
- Props: `drones`, `onQuickAction`

### MaintenanceRecord
- 维护记录
- 展示：维护内容、时间、执行人
- Props: `records`, `onAdd`

---

*文档更新时间: 2026-03-14*