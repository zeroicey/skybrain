import type { Drone } from '@/types/drone'

export const mockDrones: Drone[] = [
    {
        id: '1',
        name: '无人机-01',
        status: 'online',
        battery: 85,
        altitude: 120,
        streamUrl: '/videos/sample1.mp4'
    },
    {
        id: '2',
        name: '无人机-02',
        status: 'online',
        battery: 72,
        altitude: 95,
        streamUrl: '/videos/sample2.mp4'
    },
    {
        id: '3',
        name: '无人机-03',
        status: 'warning',
        battery: 45,
        altitude: 80,
        streamUrl: '/videos/sample3.mp4'
    },
    {
        id: '4',
        name: '无人机-04',
        status: 'online',
        battery: 90,
        altitude: 110,
        streamUrl: '/videos/sample4.mp4'
    },
    {
        id: '5',
        name: '无人机-05',
        status: 'online',
        battery: 68,
        altitude: 97,
        streamUrl: '/videos/sample4.mp4'
    },
    {
        id: '6',
        name: '无人机-06',
        status: 'online',
        battery: 68,
        altitude: 105,
        streamUrl: '/videos/sample6.mp4'
    },
    {
        id: '7',
        name: '无人机-07',
        status: 'online',
        battery: 55,
        altitude: 88,
        streamUrl: '/videos/sample7.mp4'
    },
    {
        id: '8',
        name: '无人机-08',
        status: 'warning',
        battery: 30,
        altitude: 75,
        streamUrl: '/videos/sample8.mp4'
    },
    {
        id: '9',
        name: '无人机-09',
        status: 'online',
        battery: 92,
        altitude: 115,
        streamUrl: '/videos/sample9.mp4'
    },
    // 真实无人机 - Jetson 实时视频流
    {
        id: '10',
        name: '无人机-10',
        status: 'online',
        battery: 100,
        altitude: 50,
        streamUrl: 'http://10.66.0.5:5000',
        isMjpg: true
    }
]
