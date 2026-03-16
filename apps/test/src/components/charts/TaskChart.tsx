import ReactECharts from 'echarts-for-react'

interface TaskStat {
  name: string
  value: number
  color: string
}

interface Props {
  data: TaskStat[]
}

export default function TaskChart({ data }: Props) {
  const option = {
    tooltip: {
      trigger: 'item',
      backgroundColor: '#1a1a24',
      borderColor: '#2a2a3a',
      textStyle: { color: '#f0f0f5' },
    },
    series: [
      {
        type: 'pie',
        radius: ['50%', '70%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 4,
          borderColor: '#12121a',
          borderWidth: 2,
        },
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 18,
            fontWeight: 'bold',
            color: '#f0f0f5',
          },
        },
        labelLine: { show: false },
        data: data.map(item => ({
          value: item.value,
          name: item.name,
          itemStyle: { color: item.color },
        })),
      },
    ],
    legend: {
      show: false,
    },
  }

  const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <div style={{ position: 'relative', height: 200 }}>
      <ReactECharts option={option} style={{ height: '100%' }} />
      <div
        style={{
          position: 'absolute',
          top: '55%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--color-text-heading)' }}>
          {total}
        </div>
        <div style={{ fontSize: 12, color: 'var(--color-text)' }}>任务总数</div>
      </div>
    </div>
  )
}