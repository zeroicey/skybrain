# 无人机控制组件 (Drone Control Components)

> 用于无人机展示和控制的组件

---

## 组件清单

| 序号 | 组件名称 | 说明 |
|------|----------|------|
| 1 | `DroneCard` | 无人机卡片（状态、电池） |
| 2 | `DroneControl` | 无人机控制面板 |
| 3 | `BatteryIndicator` | 电池电量指示器 |
| 4 | `FlightStatus` | 飞行状态显示 |
| 5 | `TakeoffButton` | 一键起飞按钮 |
| 6 | `ReturnButton` | 一键返航按钮 |
| 7 | `EmergencyButton` | 紧急停止按钮 |
| 8 | `Joystick` | 虚拟摇杆（手动控制） |
| 9 | `GimbalControl` | 云台控制面板 |

---

## 组件说明

### DroneCard
- 无人机状态卡片
- 展示：名称、状态图标、电池电量、飞行时长、位置
- Props: `drone`, `onClick`, `onControl`

### DroneControl
- 无人机控制面板
- 包含：起飞、降落、返航、悬停等按钮
- Props: `droneId`, `status`, `onCommand`

### BatteryIndicator
- 电池电量指示器
- 支持：百分比显示、颜色预警（绿/黄/红）
- Props: `level`, `showPercent`, `colored`

### FlightStatus
- 飞行状态显示
- 展示：高度、速度、距离、方向
- Props: `altitude`, `speed`, `distance`, `heading`

### TakeoffButton
- 一键起飞按钮
- 支持：权限检查、状态校验
- Props: `droneId`, `disabled`, `onClick`

### ReturnButton
- 一键返航按钮
- Props: `droneId`, `disabled`, `onClick`

### EmergencyButton
- 紧急停止按钮（红色醒目）
- Props: `droneId`, `onClick`, `confirm`

### Joystick
- 虚拟摇杆组件
- 支持：方向控制、力度调节
- Props: `onMove`, `onRelease`, `size`

### GimbalControl
- 云台控制面板
- 支持：旋转、变焦、俯仰控制
- Props: `rotation`, `tilt`, `zoom`, `onChange`

---

*文档更新时间: 2026-03-14*