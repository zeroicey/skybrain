# 图表组件 (Chart Components)

> 用于数据可视化展示的图表组件

---

## 组件清单

| 序号 | 组件名称 | 说明 |
|------|----------|------|
| 1 | `LineChart` | 折线图 |
| 2 | `AreaChart` | 面积图 |
| 3 | `BarChart` | 柱状图 |
| 4 | `PieChart` | 饼图 |
| 5 | `RadarChart` | 雷达图 |
| 6 | `GaugeChart` | 仪表盘 |
| 7 | `HeatMap` | 热力图 |
| 8 | `MapChart` | 地图（航线、区域展示） |

---

## 1. LineChart（折线图）

### 用途
展示数据趋势变化

### 结构
```
  100 ┤        ╭─────╮
   80 ┤    ╭───╯     ╰───
   60 ┤────╯
   40 ┤
   20 ┤
    0 ┼───────────────────
       1月  2月  3月  4月
```

### Props
```typescript
interface LineChartProps {
  data: SeriesData[];
  xAxis: AxisConfig;
  yAxis?: AxisConfig;
  legend?: LegendConfig;
  tooltip?: TooltipConfig;
  grid?: GridConfig;
  animation?: boolean;
  height?: number;
}

interface SeriesData {
  name: string;
  data: number[];
  color?: string;
}
```

---

## 2. AreaChart（面积图）

### 用途
展示数据趋势和总量

### Props
```typescript
interface AreaChartProps extends LineChartProps {
  areaStyle?: AreaStyleConfig;
}
```

---

## 3. BarChart（柱状图）

### 用途
展示分类数据对比

### 结构
```
  100 ┤  ████
   80 ┤  ████  ████
   60 ┤  ████  ████
   40 ┤  ████  ████
   20 ┤  ████  ████
    0 ┼──────────────────
        任务A  任务B
```

### Props
```typescript
interface BarChartProps {
  data: SeriesData[];
  xAxis: AxisConfig;
  yAxis?: AxisConfig;
  layout?: 'horizontal' | 'vertical';
  stacked?: boolean;
}
```

---

## 4. PieChart（饼图）

### 用途
展示数据占比

### 结构
```
     ╭───────╮
   ╭─╯ A:30%  ╰─╮
  ╱    B:25%    ╲
  │    C:20%    │
  ╲    D:15%    ╱
   ╰─╮ E:10%   ╭╯
     ╰─────────╯
```

### Props
```typescript
interface PieChartProps {
  data: PieData[];
  radius?: number | [number, number];
  center?: [number, number];
  label?: LabelConfig;
  tooltip?: TooltipConfig;
  legend?: LegendConfig;
  roseType?: boolean;
}

interface PieData {
  name: string;
  value: number;
  color?: string;
}
```

---

## 5. RadarChart（雷达图）

### 用途
展示多维度数据

### Props
```typescript
interface RadarChartProps {
  indicator: Indicator[];
  data: RadarSeriesData[];
  radius?: number;
}
```

---

## 6. GaugeChart（仪表盘）

### 用途
展示百分比或进度

### Props
```typescript
interface GaugeChartProps {
  value: number;
  min?: number;
  max?: number;
  title?: string;
  color?: string;
  gaugeStyle?: GaugeStyleConfig;
}
```

---

## 7. HeatMap（热力图）

### 用途
展示密集度或热度分布

### Props
```typescript
interface HeatMapProps {
  data: HeatMapData[];
  xAxis: string[];
  yAxis: string[];
  visualMap?: VisualMapConfig;
}
```

---

## 8. MapChart（地图）

### 用途
展示地理信息、航线、区域

### Props
```typescript
interface MapChartProps {
  center?: [number, number];
  zoom?: number;
  markers?: MapMarker[];
  routes?: MapRoute[];
  polygons?: MapPolygon[];
  onMarkerClick?: (marker: MapMarker) => void;
  onRouteClick?: (route: MapRoute) => void;
}
```

---

*文档更新时间: 2026-03-14*