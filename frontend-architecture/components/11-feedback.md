# 反馈组件 (Feedback Components)

> 用于用户反馈和状态提示的组件

---

## 组件清单

| 序号 | 组件名称 | 说明 |
|------|----------|------|
| 1 | `Loading` | 加载状态 |
| 2 | `Progress` | 进度指示 |
| 3 | `Message` | 全局消息提示 |
| 4 | `Modal` | 模态框 |
| 5 | `Drawer` | 抽屉 |
| 6 | `Confirm` | 确认对话框 |
| 7 | `Toast` | 轻提示 |
| 8 | `Notification` | 通知提醒 |
| 9 | `Result` | 结果展示 |
| 10 | `Popconfirm` |气泡确认框 |

---

## 组件说明

### Loading
- 加载中状态显示
- 支持：图标加载、文字加载、全屏加载
- Props: `tip`, `size`, `fullscreen`

### Progress
- 进度条/圈
- 支持：线性、圆形、仪表盘
- Props: `percent`, `status`, `type`

### Message
- 全局消息提示
- 支持：成功、警告、错误、信息
- Methods: `success()`, `error()`, `warning()`, `info()`

### Modal
- 模态对话框
- 支持：标题、内容、footer、尺寸
- Props: `open`, `title`, `content`, `onOk`, `onCancel`

### Drawer
- 抽屉侧滑面板
- 支持：左侧/右侧弹出、可拖拽
- Props: `open`, `placement`, `width`, `onClose`

### Confirm
- 确认对话框
- 支持：图标、自定义内容
- Methods: `confirm()`

### Toast
- 轻提示（自动消失）
- Props: `message`, `duration`, `type`

### Notification
- 通知提醒
- 支持：右上角弹出、点击关闭
- Methods: `open()`, `close()`

### Result
- 结果展示页面
- 包含：图标、标题、描述、额外操作
- Props: `status`, `title`, `description`, `extra`

### Popconfirm
- 气泡确认框
- 支持：点击显示、确认/取消回调
- Props: `title`, `onConfirm`, `onCancel`

---

*文档更新时间: 2026-03-14*