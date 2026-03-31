import type { MaintenanceRecord } from '@/types/drone'

export const mockDeviceMaintenance: MaintenanceRecord[] = [
  {
    id: 'maint-001',
    date: '2026-03-28',
    deviceType: 'drone',
    deviceId: 'drone-005',
    deviceName: '无人机-05',
    type: 'repair',
    status: 'in_progress',
    executor: '张三',
    notes: '更换电机轴承'
  },
  {
    id: 'maint-002',
    date: '2026-03-25',
    deviceType: 'drone',
    deviceId: 'drone-001',
    deviceName: '无人机-01',
    type: 'routine',
    status: 'completed',
    executor: '李四',
    notes: '例行检查，更换螺旋桨'
  },
  {
    id: 'maint-003',
    date: '2026-03-20',
    deviceType: 'battery',
    deviceId: 'battery-005',
    deviceName: 'BT005',
    type: 'inspection',
    status: 'completed',
    executor: '王五',
    notes: '电池健康度检测'
  },
  {
    id: 'maint-004',
    date: '2026-03-15',
    deviceType: 'hangar',
    deviceId: 'hangar-001',
    deviceName: '机库1',
    type: 'inspection',
    status: 'completed',
    executor: '赵六',
    notes: '环境监控设备校准'
  },
  {
    id: 'maint-005',
    date: '2026-03-10',
    deviceType: 'drone',
    deviceId: 'drone-004',
    deviceName: '无人机-04',
    type: 'routine',
    status: 'completed',
    executor: '李四',
    notes: '例行检查，固件升级'
  },
  {
    id: 'maint-006',
    date: '2026-03-05',
    deviceType: 'drone',
    deviceId: 'drone-006',
    deviceName: '无人机-06',
    type: 'upgrade',
    status: 'completed',
    executor: '张三',
    notes: '升级到最新固件版本'
  },
  {
    id: 'maint-007',
    date: '2026-03-01',
    deviceType: 'battery',
    deviceId: 'battery-003',
    deviceName: 'BT003',
    type: 'repair',
    status: 'pending',
    executor: '王五',
    notes: '电池严重老化，需要更换'
  },
  {
    id: 'maint-008',
    date: '2026-02-28',
    deviceType: 'drone',
    deviceId: 'drone-002',
    deviceName: '无人机-02',
    type: 'routine',
    status: 'completed',
    executor: '李四',
    notes: '例行检查'
  },
  {
    id: 'maint-009',
    date: '2026-02-25',
    deviceType: 'camera',
    deviceId: 'camera-001',
    deviceName: '摄像头-01',
    type: 'inspection',
    status: 'completed',
    executor: '赵六',
    notes: '镜头清洁，云台校准'
  },
  {
    id: 'maint-010',
    date: '2026-02-20',
    deviceType: 'drone',
    deviceId: 'drone-007',
    deviceName: '无人机-07',
    type: 'routine',
    status: 'completed',
    executor: '张三',
    notes: '例行检查，传感器校准'
  }
]