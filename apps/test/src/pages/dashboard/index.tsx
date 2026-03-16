import { Row, Col, Card, Select, Button, Space, Statistic, Typography } from 'antd'
import {
  ReloadOutlined,
  RobotOutlined,
  FileTextOutlined,
  WarningOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons'
import DroneMap from '../../components/map/DroneMap'
import TaskChart from '../../components/charts/TaskChart'
import FlightTrendChart from '../../components/charts/FlightTrendChart'
import AlertList from '../../components/display/AlertList'
import DroneCard from '../../components/display/DroneCard'
import type { Drone, Alert } from '../../types'

const { Title, Text } = Typography

// Mock data
const mockDrones: Drone[] = [
  { id: '1', name: '无人机 #1', status: 'flying', battery: 85, location: { lat: 31.2304, lng: 121.4737 }, altitude: 50, speed: 12 },
  { id: '2', name: '无人机 #2', status: 'flying', battery: 92, location: { lat: 31.2324, lng: 121.4757 }, altitude: 45, speed: 10 },
  { id: '3', name: '无人机 #3', status: 'warning', battery: 20, location: { lat: 31.2284, lng: 121.4717 }, altitude: 30, speed: 0 },
  { id: '4', name: '无人机 #4', status: 'idle', battery: 100, location: { lat: 31.2264, lng: 121.4697 }, altitude: 0, speed: 0 },
  { id: '5', name: '无人机 #5', status: 'flying', battery: 78, location: { lat: 31.2344, lng: 121.4777 }, altitude: 55, speed: 14 },
  { id: '6', name: '无人机 #6', status: 'flying', battery: 88, location: { lat: 31.2364, lng: 121.4797 }, altitude: 40, speed: 11 },
  { id: '7', name: '无人机 #7', status: 'warning', battery: 45, location: { lat: 31.2244, lng: 121.4677 }, altitude: 0, speed: 0 },
]

const mockAlerts: Alert[] = [
  { id: '1', type: 'warning', title: '入侵告警', location: '校门东侧', time: '10:32', status: 'pending' },
  { id: '2', type: 'error', title: '电池低电量', detail: '无人机 #3', time: '10:28', status: 'pending' },
  { id: '3', type: 'info', title: '任务完成', detail: '无人机 #1 - 日常巡逻', time: '10:15', status: 'resolved' },
  { id: '4', type: 'warning', title: '信号弱', detail: '无人机 #4', time: '09:55', status: 'pending' },
]

const mockTaskStats = [
  { name: '已完成', value: 12, color: '#10B981' },
  { name: '执行中', value: 8, color: '#6366F1' },
  { name: '失败', value: 3, color: '#EF4444' },
]

const mockFlightTrend = [
  { time: '06:00', value: 12 },
  { time: '08:00', value: 28 },
  { time: '10:00', value: 45 },
  { time: '12:00', value: 32 },
  { time: '14:00', value: 56 },
  { time: '16:00', value: 78 },
  { time: '18:00', value: 65 },
]

export default function DashboardPage() {
  const stats = {
    dronesOnline: mockDrones.filter(d => d.status !== 'offline').length,
    tasksRunning: 3,
    alertsPending: mockAlerts.filter(a => a.status === 'pending').length,
    flightMinutesToday: 156,
  }

  return (
    <div className="fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={3} style={{ margin: 0, color: 'var(--color-text-heading)' }}>
            总览仪表盘
          </Title>
          <Text style={{ color: 'var(--color-text)' }}>系统关键指标、告警概览、飞行状态</Text>
        </div>
        <Space>
          <Select
            defaultValue="today"
            style={{ width: 120 }}
            options={[
              { value: 'today', label: '今日' },
              { value: 'week', label: '本周' },
              { value: 'month', label: '本月' },
            ]}
          />
          <Button icon={<ReloadOutlined />}>刷新</Button>
        </Space>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ background: 'var(--color-bg-container)', borderColor: 'var(--color-border)' }}>
            <Statistic
              title={<span style={{ color: 'var(--color-text)' }}>无人机在线</span>}
              value={stats.dronesOnline}
              suffix={`/ ${mockDrones.length}`}
              prefix={<RobotOutlined style={{ color: 'var(--color-primary)' }} />}
              valueStyle={{ color: 'var(--color-text-heading)' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ background: 'var(--color-bg-container)', borderColor: 'var(--color-border)' }}>
            <Statistic
              title={<span style={{ color: 'var(--color-text)' }}>任务执行中</span>}
              value={stats.tasksRunning}
              prefix={<FileTextOutlined style={{ color: '#818CF8' }} />}
              valueStyle={{ color: 'var(--color-text-heading)' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ background: 'var(--color-bg-container)', borderColor: 'var(--color-border)' }}>
            <Statistic
              title={<span style={{ color: 'var(--color-text)' }}>待处理告警</span>}
              value={stats.alertsPending}
              prefix={<WarningOutlined style={{ color: 'var(--color-warning)' }} />}
              valueStyle={{ color: 'var(--color-warning)' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ background: 'var(--color-bg-container)', borderColor: 'var(--color-border)' }}>
            <Statistic
              title={<span style={{ color: 'var(--color-text)' }}>今日飞行时长</span>}
              value={stats.flightMinutesToday}
              prefix={<ClockCircleOutlined style={{ color: 'var(--color-success)' }} />}
              suffix={<><span style={{ marginLeft: 8 }}>min</span><span style={{ fontSize: 14, color: 'var(--color-text)', marginLeft: 8 }}>+12%</span></>}
              valueStyle={{ color: 'var(--color-text-heading)' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Map and Task Chart */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={14}>
          <Card
            title={<span style={{ color: 'var(--color-text-heading)' }}>无人机实时位置</span>}
            style={{ background: 'var(--color-bg-container)', borderColor: 'var(--color-border)' }}
          >
            <DroneMap drones={mockDrones} />
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card
            title={<span style={{ color: 'var(--color-text-heading)' }}>今日任务统计</span>}
            style={{ background: 'var(--color-bg-container)', borderColor: 'var(--color-border)' }}
          >
            <TaskChart data={mockTaskStats} />
          </Card>
        </Col>
      </Row>

      {/* Alert List and Flight Trend */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card
            title={<span style={{ color: 'var(--color-text-heading)' }}>最近告警</span>}
            style={{ background: 'var(--color-bg-container)', borderColor: 'var(--color-border)' }}
          >
            <AlertList alerts={mockAlerts} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            title={<span style={{ color: 'var(--color-text-heading)' }}>飞行时长趋势</span>}
            style={{ background: 'var(--color-bg-container)', borderColor: 'var(--color-border)' }}
          >
            <FlightTrendChart data={mockFlightTrend} />
          </Card>
        </Col>
      </Row>

      {/* Drone Status Grid */}
      <Card
        title={<span style={{ color: 'var(--color-text-heading)' }}>设备状态概览</span>}
        style={{ background: 'var(--color-bg-container)', borderColor: 'var(--color-border)' }}
      >
        <Row gutter={[16, 16]}>
          {mockDrones.map(drone => (
            <Col xs={12} sm={8} md={6} lg={4} key={drone.id}>
              <DroneCard drone={drone} />
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  )
}