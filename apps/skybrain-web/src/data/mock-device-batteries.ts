import type { Battery } from '@/types/drone'

export const mockDeviceBatteries: Battery[] = [
  {
    id: 'battery-001',
    serialNumber: 'BT001',
    model: 'DJI Mavic 3 Pro 电池',
    capacity: 5000,
    电量: 85,
    cycleCount: 120,
    status: 'idle',
    health: 92,
    associatedDroneId: 'drone-001',
    associatedDroneName: '无人机-01'
  },
  {
    id: 'battery-002',
    serialNumber: 'BT002',
    model: 'DJI Mavic 3 Pro 电池',
    capacity: 5000,
    电量: 72,
    cycleCount: 180,
    status: 'discharging',
    health: 85,
    associatedDroneId: 'drone-002',
    associatedDroneName: '无人机-02'
  },
  {
    id: 'battery-003',
    serialNumber: 'BT003',
    model: 'DJI Mavic 3 Pro 电池',
    capacity: 5000,
    电量: 0,
    cycleCount: 450,
    status: 'idle',
    health: 45,
    associatedDroneId: 'drone-003',
    associatedDroneName: '无人机-03'
  },
  {
    id: 'battery-004',
    serialNumber: 'BT004',
    model: 'DJI Mini 4 Pro 电池',
    capacity: 3000,
    电量: 95,
    cycleCount: 45,
    status: 'charging',
    health: 98,
    associatedDroneId: 'drone-004',
    associatedDroneName: '无人机-04'
  },
  {
    id: 'battery-005',
    serialNumber: 'BT005',
    model: 'DJI Air 3 电池',
    capacity: 4000,
    电量: 60,
    cycleCount: 280,
    status: 'maintenance',
    health: 72
  },
  {
    id: 'battery-006',
    serialNumber: 'BT006',
    model: 'DJI Air 3 电池',
    capacity: 4000,
    电量: 88,
    cycleCount: 95,
    status: 'idle',
    health: 90,
    associatedDroneId: 'drone-006',
    associatedDroneName: '无人机-06'
  },
  {
    id: 'battery-007',
    serialNumber: 'BT007',
    model: 'DJI Mavic 3 Pro 电池',
    capacity: 5000,
    电量: 76,
    cycleCount: 210,
    status: 'idle',
    health: 88,
    associatedDroneId: 'drone-007',
    associatedDroneName: '无人机-07'
  },
  {
    id: 'battery-008',
    serialNumber: 'BT008',
    model: 'DJI Mini 4 Pro 电池',
    capacity: 3000,
    电量: 92,
    cycleCount: 25,
    status: 'idle',
    health: 99,
    associatedDroneId: 'drone-008',
    associatedDroneName: '无人机-08'
  },
  {
    id: 'battery-009',
    serialNumber: 'BT009',
    model: 'DJI Mavic 3 Pro 电池',
    capacity: 5000,
    电量: 100,
    cycleCount: 15,
    status: 'charging',
    health: 100
  },
  {
    id: 'battery-010',
    serialNumber: 'BT010',
    model: 'DJI Mavic 3 Pro 电池',
    capacity: 5000,
    电量: 100,
    cycleCount: 12,
    status: 'charging',
    health: 100
  },
  {
    id: 'battery-011',
    serialNumber: 'BT011',
    model: 'DJI Air 3 电池',
    capacity: 4000,
    电量: 100,
    cycleCount: 8,
    status: 'charging',
    health: 100
  },
  {
    id: 'battery-012',
    serialNumber: 'BT012',
    model: 'DJI Mini 4 Pro 电池',
    capacity: 3000,
    电量: 30,
    cycleCount: 320,
    status: 'maintenance',
    health: 55
  }
]