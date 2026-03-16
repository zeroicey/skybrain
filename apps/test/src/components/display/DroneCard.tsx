import { Card, Progress } from 'antd'
import type { Drone } from '../../types'

interface Props {
  drone: Drone
}

const statusConfig = {
  flying: { text: '飞行中', color: '#10B981' },
  idle: { text: '待机', color: '#6b7280' },
  charging: { text: '充电中', color: '#F59E0B' },
  warning: { text: '告警', color: '#EF4444' },
  offline: { text: '离线', color: '#374151' },
}

export default function DroneCard({ drone }: Props) {
  const status = statusConfig[drone.status]

  return (
    <Card
      size="small"
      style={{
        background: 'var(--color-bg-elevated)',
        borderColor: 'var(--color-border)',
        cursor: 'pointer',
        transition: 'all 0.2s',
      }}
      hoverable
      bodyStyle={{ padding: 12 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: status.color,
            boxShadow: drone.status === 'flying' ? `0 0 8px ${status.color}` : 'none',
          }}
        />
        <span style={{ color: 'var(--color-text-heading)', fontWeight: 500, fontSize: 13 }}>
          {drone.name}
        </span>
      </div>
      <Progress
        percent={drone.battery}
        size="small"
        strokeColor={
          drone.battery > 50 ? '#10B981' :
          drone.battery > 20 ? '#F59E0B' : '#EF4444'
        }
        trailColor="var(--color-border)"
        showInfo={false}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
        <span style={{ fontSize: 11, color: 'var(--color-text)' }}>电池</span>
        <span style={{ fontSize: 11, color: 'var(--color-text-heading)' }}>{drone.battery}%</span>
      </div>
    </Card>
  )
}