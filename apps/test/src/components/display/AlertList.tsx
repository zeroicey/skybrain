import { List, Tag } from 'antd'
import { WarningOutlined, InfoCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import type { Alert } from '../../types'

interface Props {
  alerts: Alert[]
}

const typeConfig = {
  info: { color: '#6366F1', icon: <InfoCircleOutlined /> },
  warning: { color: '#F59E0B', icon: <WarningOutlined /> },
  error: { color: '#EF4444', icon: <CloseCircleOutlined /> },
}

const statusConfig = {
  pending: { text: '待处理', color: 'warning' as const },
  resolved: { text: '已处理', color: 'success' as const },
}

export default function AlertList({ alerts }: Props) {
  return (
    <List
      itemLayout="horizontal"
      dataSource={alerts}
      renderItem={(alert) => {
        const config = typeConfig[alert.type]
        const status = statusConfig[alert.status]
        return (
          <List.Item style={{ padding: '12px 0', borderBottom: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: 12 }}>
              <div style={{ color: config.color, fontSize: 18 }}>
                {config.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: 'var(--color-text-heading)', fontWeight: 500 }}>
                    {alert.title}
                  </span>
                  <Tag color={status.color} style={{ fontSize: 11 }}>{status.text}</Tag>
                </div>
                <div style={{ fontSize: 12, color: 'var(--color-text)', marginTop: 2 }}>
                  {alert.detail || alert.location} • {alert.time}
                </div>
              </div>
            </div>
          </List.Item>
        )
      }}
    />
  )
}