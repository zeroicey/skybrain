import { useState, useEffect } from 'react'

export interface ChannelInfo {
  id: string
  name: string
  scene: string
}

const API_BASE_URL = 'http://192.168.5.150:8889'

export function useVideoChannels() {
  const [channels, setChannels] = useState<ChannelInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchChannels() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/channels`)
        const data = await response.json()
        setChannels(data.channels || [])
      } catch (err) {
        setError('获取视频列表失败')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchChannels()
  }, [])

  // 获取指定场景的 channel
  const getChannelsByScene = (scene: string) => {
    return channels.filter((ch) => ch.scene === scene)
  }

  // 随机选择一个 channel
  const getRandomChannel = (scene?: string) => {
    const filtered = scene ? getChannelsByScene(scene) : channels
    if (filtered.length === 0) return null
    const randomIndex = Math.floor(Math.random() * filtered.length)
    return filtered[randomIndex]
  }

  // Fisher-Yates 洗牌算法
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  // 随机打乱并返回前 n 个
  const getRandomChannels = (count: number) => {
    const shuffled = shuffleArray(channels)
    return shuffled.slice(0, count)
  }

  return {
    channels,
    loading,
    error,
    getChannelsByScene,
    getRandomChannel,
    getRandomChannels,
  }
}

// 获取视频流 URL
export function getStreamUrl(channelId: string): string {
  return `${API_BASE_URL}/${channelId}/index.m3u8`
}