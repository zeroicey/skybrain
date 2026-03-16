import { Layout, Menu } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  DashboardOutlined,
  VideoCameraOutlined,
  AlertOutlined,
  SettingOutlined,
  RobotOutlined,
} from '@ant-design/icons'

const { Sider } = Layout

const menuItems = [
  {
    key: '/dashboard',
    icon: <DashboardOutlined />,
    label: '仪表盘',
  },
  {
    key: '/monitor/live',
    icon: <VideoCameraOutlined />,
    label: '实时监控',
  },
  {
    key: '/tasks',
    icon: <RobotOutlined />,
    label: '任务管理',
  },
  {
    key: '/security',
    icon: <AlertOutlined />,
    label: '校园安保',
  },
  {
    key: '/settings',
    icon: <SettingOutlined />,
    label: '系统设置',
  },
]

export default function AppSider() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <Sider
      width={220}
      style={{
        background: 'var(--color-bg-container)',
        borderRight: '1px solid var(--color-border)',
      }}
    >
      <div
        style={{
          padding: '20px 16px',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background: 'linear-gradient(135deg, var(--color-primary), #818CF8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
          }}
        >
          🚁
        </div>
        <div>
          <div style={{ color: 'var(--color-text-heading)', fontWeight: 600, fontSize: 16 }}>
            SkyBrain
          </div>
          <div style={{ color: 'var(--color-text)', fontSize: 11, opacity: 0.7 }}>
            无人机智能巡检
          </div>
        </div>
      </div>
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        style={{
          background: 'transparent',
          borderRight: 'none',
          marginTop: 8,
        }}
        items={menuItems}
        onClick={({ key }) => navigate(key)}
      />
    </Sider>
  )
}