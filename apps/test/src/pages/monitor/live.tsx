import { useState } from 'react'
import { Row, Col, Card, Select, Button, Space, Typography, Slider, Tag, Tooltip } from 'antd'
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  StepForwardOutlined,
  StepBackwardOutlined,
  SoundOutlined,
  CameraOutlined,
  FullscreenOutlined,
  CloudUploadOutlined,
} from '@ant-design/icons'
import type { Drone } from '../../types'

const { Title, Text } = Typography

// Mock data
const mockDrones: Drone[] = [
  { id: '1', name: '无人机 #1', status: 'flying', battery: 85, location: { lat: 31.2304, lng: 121.4737 }, altitude: 50, speed: 12 },
  { id: '2', name: '无人机 #2', status: 'flying', battery: 92, location: { lat: 31.2324, lng: 121.4757 }, altitude: 45, speed: 10 },
  { id: '3', name: '无人机 #3', status: 'warning', battery: 20, location: { lat: 31.2284, lng: 121.4717 }, altitude: 30, speed: 0 },
]

export default function MonitorLivePage() {
  const [selectedDrone, setSelectedDrone] = useState('1')
  const [isPlaying, setIsPlaying] = useState(true)
  const [volume, setVolume] = useState(80)
  const [isRecording, setIsRecording] = useState(false)

  const currentDrone = mockDrones.find(d => d.id === selectedDrone) || mockDrones[0]

  return (
    <div className="fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={3} style={{ margin: 0, color: 'var(--color-text-heading)' }}>
            实时监控
          </Title>
          <Text style={{ color: 'var(--color-text)' }}>无人机实时图传、视频播放</Text>
        </div>
        <Space>
          <Select
            value={selectedDrone}
            onChange={setSelectedDrone}
            style={{ width: 160 }}
            options={mockDrones.map(d => ({
              value: d.id,
              label: (
                <Space>
                  <span>{d.name}</span>
                  <Tag color={d.status === 'flying' ? 'success' : 'warning'} style={{ marginLeft: 8 }}>
                    {d.status === 'flying' ? '飞行中' : '告警'}
                  </Tag>
                </Space>
              ),
            }))}
          />
          <Select
            defaultValue="hd"
            style={{ width: 100 }}
            options={[
              { value: 'sd', label: '流畅' },
              { value: 'hd', label: '高清' },
              { value: '4k', label: '4K' },
            ]}
          />
          <Tooltip title="全屏">
            <Button icon={<FullscreenOutlined />} />
          </Tooltip>
        </Space>
      </div>

      {/* Video Player */}
      <Card
        style={{
          background: '#000',
          borderColor: 'var(--color-border)',
          marginBottom: 16,
        }}
        bodyStyle={{ padding: 0 }}
      >
        <div
          style={{
            aspectRatio: '16/9',
            background: 'linear-gradient(135deg, #1a1a24 0%, #0a0a0f 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          {/* Simulated video feed */}
          <div style={{ textAlign: 'center', color: 'var(--color-text)' }}>
            <PlayCircleOutlined style={{ fontSize: 64, color: 'var(--color-primary)', opacity: 0.5 }} />
            <div style={{ marginTop: 16 }}>实时视频流</div>
            <div style={{ fontSize: 12, opacity: 0.5 }}>{currentDrone.name} - 图传信号正常</div>
          </div>

          {/* Recording indicator */}
          {isRecording && (
            <div
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: 'rgba(239, 68, 68, 0.9)',
                padding: '4px 12px',
                borderRadius: 4,
                color: '#fff',
                fontSize: 12,
              }}
            >
              <span style={{ animation: 'pulse 1s infinite' }}>●</span>
              录像中
            </div>
          )}

          {/* Quality indicator */}
          <div
            style={{
              position: 'absolute',
              top: 16,
              left: 16,
              background: 'rgba(0,0,0,0.6)',
              padding: '4px 8px',
              borderRadius: 4,
              fontSize: 11,
              color: '#10B981',
            }}
          >
            LIVE • 1080P
          </div>
        </div>
      </Card>

      {/* Playback Controls */}
      <Card
        style={{
          background: 'var(--color-bg-container)',
          borderColor: 'var(--color-border)',
          marginBottom: 16,
        }}
        bodyStyle={{ padding: '12px 16px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* Playback buttons */}
          <Space>
            <Button type="text" icon={<StepBackwardOutlined />} style={{ color: 'var(--color-text)' }} />
            <Button
              type="text"
              icon={isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
              onClick={() => setIsPlaying(!isPlaying)}
              style={{ color: 'var(--color-primary)', fontSize: 24 }}
            />
            <Button type="text" icon={<StepForwardOutlined />} style={{ color: 'var(--color-text)' }} />
          </Space>

          {/* Timeline */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 12, color: 'var(--color-text)', minWidth: 60 }}>00:00:00</span>
            <Slider
              defaultValue={0}
              style={{ flex: 1 }}
              styles={{
                track: { background: 'var(--color-primary)' },
                rail: { background: 'var(--color-border)' },
              }}
            />
            <span style={{ fontSize: 12, color: 'var(--color-text)', minWidth: 60 }}>00:00:00</span>
          </div>

          {/* Volume */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 120 }}>
            <Button type="text" icon={<SoundOutlined />} style={{ color: 'var(--color-text)' }} />
            <Slider
              value={volume}
              onChange={setVolume}
              style={{ width: 80 }}
              styles={{
                track: { background: 'var(--color-text)' },
                rail: { background: 'var(--color-border)' },
              }}
            />
          </div>

          {/* Actions */}
          <Space>
            <Tooltip title="截图">
              <Button icon={<CameraOutlined />} style={{ color: 'var(--color-text)' }} />
            </Tooltip>
            <Tooltip title="录像">
              <Button
                icon={<CloudUploadOutlined />}
                onClick={() => setIsRecording(!isRecording)}
                style={{ color: isRecording ? 'var(--color-error)' : 'var(--color-text)' }}
              />
            </Tooltip>
          </Space>
        </div>
      </Card>

      {/* Drone Info Panel */}
      <Row gutter={[16, 16]}>
        <Col xs={12} sm={6}>
          <Card
            size="small"
            style={{ background: 'var(--color-bg-container)', borderColor: 'var(--color-border)' }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: 'var(--color-text)', fontSize: 12 }}>高度</div>
              <div style={{ color: 'var(--color-text-heading)', fontSize: 24, fontWeight: 600 }}>
                {currentDrone.altitude}<span style={{ fontSize: 14 }}>m</span>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card
            size="small"
            style={{ background: 'var(--color-bg-container)', borderColor: 'var(--color-border)' }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: 'var(--color-text)', fontSize: 12 }}>速度</div>
              <div style={{ color: 'var(--color-text-heading)', fontSize: 24, fontWeight: 600 }}>
                {currentDrone.speed}<span style={{ fontSize: 14 }}>m/s</span>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card
            size="small"
            style={{ background: 'var(--color-bg-container)', borderColor: 'var(--color-border)' }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: 'var(--color-text)', fontSize: 12 }}>电池</div>
              <div style={{
                color: currentDrone.battery > 50 ? 'var(--color-success)' :
                       currentDrone.battery > 20 ? 'var(--color-warning)' : 'var(--color-error)',
                fontSize: 24,
                fontWeight: 600,
              }}>
                {currentDrone.battery}<span style={{ fontSize: 14 }}>%</span>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card
            size="small"
            style={{ background: 'var(--color-bg-container)', borderColor: 'var(--color-border)' }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: 'var(--color-text)', fontSize: 12 }}>位置</div>
              <div style={{ color: 'var(--color-text-heading)', fontSize: 14, fontWeight: 600 }}>
                教学楼A
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}