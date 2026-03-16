# 告警组件 (Alert Components)

> 用于告警展示和处理的组件

---

## 组件清单

| 序号 | 组件名称 | 说明 |
|------|----------|------|
| 1 | `AlertList` | 告警列表 |
| 2 | `AlertCard` | 告警卡片 |
| 3 | `AlertDetail` | 告警详情弹窗 |
| 4 | `AlertFilter` | 告警筛选器 |
| 5 | `AlertSound` | 告警声音控制 |

---

## 组件说明

### AlertList
- 告警列表组件
- 支持：滚动加载、状态筛选、批量操作
- Props: `alerts`, `onItemClick`, `onBatchAction`

### AlertCard
- 单条告警卡片
- 包含：告警类型图标、严重程度、位置、时间、操作按钮
- Props: `alert`, `onProcess`, `onTrack`

### AlertDetail
- 告警详情弹窗
- 包含：详细信息、图片/视频、地图位置、处理记录
- Props: `alertId`, `visible`, `onClose`

### AlertFilter
- 告警筛选器
- 支持：严重程度、类型、区域、时间范围
- Props: `filters`, `onChange`

### AlertSound
- 告警声音控制
- 支持：开关、音量调节、声音选择
- Props: `enabled`, `volume`, `soundType`

---

*文档更新时间: 2026-03-14*