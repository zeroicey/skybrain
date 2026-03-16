import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from 'antd'
import AppSider from './components/layout/AppSider'
import DashboardPage from './pages/dashboard'
import MonitorLivePage from './pages/monitor/live'

const { Content } = Layout

function App() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AppSider />
      <Layout>
        <Content style={{ padding: '24px', background: 'var(--color-bg)' }}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/monitor/live" element={<MonitorLivePage />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  )
}

export default App