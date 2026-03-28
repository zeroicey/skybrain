# 视频推流路由动态分配设计

**Date:** 2026-03-28
**Project:** videopusher
**Status:** Approved

## 背景

现有的 videopusher 硬编码了 channel_01、channel_02 两个固定路由，需要改为动态扫描 videos 目录并自动分配路由。

## 需求

- 5个场景：饭堂(canteen)、街道(street)、宿舍(dormitory)、教学楼(building)、校门(gate)
- 根目录 videos/ 下的视频按字母排序，依次映射到 /channel/1、/channel/2、/channel/3...
- 各场景子目录下的视频按字母排序，依次映射到 /channel/{场景名}/1、/channel/{场景名}/2...
- 前端随机生成数字即可获取对应视频

## 实现方案

### 数据结构

```go
type Channel struct {
    Path     string // 视频文件路径
    Output   string // 输出目录 (如 "1", "canteen/1")
}
```

### 扫描逻辑

1. 扫描根目录 `videos/`，过滤视频文件，按文件名排序，分配编号
2. 扫描各场景子目录 `videos/{场景名}/`，同上处理

### 路由映射示例

```
videos/foo.mp4      → /channel/1
videos/bar.mp4      → /channel/2
videos/canteen/aaa.mp4 → /channel/canteen/1
videos/canteen/bbb.mp4 → /channel/canteen/2
```

## 实现任务

1. 新增 `scanVideos()` 函数扫描目录
2. 修改 `startStream()` 支持动态 channel 名
3. 修改 main() 动态启动所有 channel
4. 添加日志输出各 channel 映射关系