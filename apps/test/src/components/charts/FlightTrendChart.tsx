import ReactECharts from 'echarts-for-react'

interface FlightData {
  time: string
  value: number
}

interface Props {
  data: FlightData[]
}

export default function FlightTrendChart({ data }: Props) {
  const option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#1a1a24',
      borderColor: '#2a2a3a',
      textStyle: { color: '#f0f0f5' },
    },
    grid: {
      left: 40,
      right: 20,
      top: 20,
      bottom: 30,
    },
    xAxis: {
      type: 'category',
      data: data.map(d => d.time),
      axisLine: { lineStyle: { color: '#2a2a3a' } },
      axisLabel: { color: '#6b7280', fontSize: 11 },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisLabel: { color: '#6b7280', fontSize: 11 },
      splitLine: { lineStyle: { color: '#2a2a3a', type: 'dashed' } },
    },
    series: [
      {
        data: data.map(d => d.value),
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: {
          color: '#6366F1',
          width: 3,
        },
        itemStyle: {
          color: '#6366F1',
          borderColor: '#fff',
          borderWidth: 2,
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(99, 102, 241, 0.3)' },
              { offset: 1, color: 'rgba(99, 102, 241, 0.05)' },
            ],
          },
        },
      },
    ],
  }

  return <ReactECharts option={option} style={{ height: 200 }} />
}