import type { Hangar } from '@/types/drone'

export const mockDeviceHangars: Hangar[] = [
  {
    id: 'hangar-001',
    name: '机库1',
    location: '教学楼A楼顶',
    droneSlots: [
      { id: 'slot-001', droneId: 'drone-001', droneName: '无人机-01', status: 'standby', battery: 85 },
      { id: 'slot-002', droneId: 'drone-004', droneName: '无人机-04', status: 'charging', battery: 95 },
      { id: 'slot-003', droneId: 'drone-007', droneName: '无人机-07', status: 'standby', battery: 76 },
      { id: 'slot-004', status: 'empty' }
    ],
    status: 'normal',
    temperature: 25,
    humidity: 60
  },
  {
    id: 'hangar-002',
    name: '机库2',
    location: '行政楼楼顶',
    droneSlots: [
      { id: 'slot-005', droneId: 'drone-003', droneName: '无人机-03', status: 'standby', battery: 0 },
      { id: 'slot-006', droneId: 'drone-008', droneName: '无人机-08', status: 'standby', battery: 92 },
      { id: 'slot-007', status: 'empty' },
      { id: 'slot-008', status: 'empty' }
    ],
    status: 'normal',
    temperature: 23,
    humidity: 55
  },
  {
    id: 'hangar-003',
    name: '机库3',
    location: '体育馆楼顶',
    droneSlots: [
      { id: 'slot-009', droneId: 'drone-006', droneName: '无人机-06', status: 'standby', battery: 88 },
      { id: 'slot-010', status: 'empty' }
    ],
    status: 'normal',
    temperature: 24,
    humidity: 58
  },
  {
    id: 'hangar-004',
    name: '维修车间',
    location: '后勤楼一层',
    droneSlots: [
      { id: 'slot-011', droneId: 'drone-005', droneName: '无人机-05', status: 'standby', battery: 60 }
    ],
    status: 'maintenance',
    temperature: 22,
    humidity: 50
  }
]