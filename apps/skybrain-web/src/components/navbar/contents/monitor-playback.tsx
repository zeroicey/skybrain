import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { DroneSelector } from '@/components/monitor/drone-selector'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

export default function MonitorPlaybackNav() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '')

  const selectedDroneId = searchParams.get('drone') || 'all'
  const selectedDate = searchParams.get('date') || ''

  // 防抖搜索
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams)
      if (searchInput) {
        params.set('search', searchInput)
      } else {
        params.delete('search')
      }
      navigate(`?${params.toString()}`, { replace: true })
    }, 300)

    return () => clearTimeout(timer)
  }, [searchInput])

  const handleDroneChange = (droneId: string) => {
    const params = new URLSearchParams(searchParams)
    if (droneId && droneId !== 'all') {
      params.set('drone', droneId)
    } else {
      params.delete('drone')
    }
    navigate(`?${params.toString()}`)
  }

  const handleDateChange = (date: string) => {
    const params = new URLSearchParams(searchParams)
    if (date) {
      params.set('date', date)
    } else {
      params.delete('date')
    }
    navigate(`?${params.toString()}`)
  }

  return (
    <div className="w-full flex items-center justify-between">
      <span className="text-xl">监控回放</span>
      <div className="flex items-center gap-4">
        <DroneSelector
          value={selectedDroneId === 'all' ? '' : selectedDroneId}
          onChange={handleDroneChange}
          placeholder="全部无人机"
          excludeOffline={false}
        />
        <Input
          type="date"
          value={selectedDate}
          onChange={(e) => handleDateChange(e.target.value)}
          className="w-[150px]"
        />
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索录像..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9 w-[200px]"
          />
        </div>
      </div>
    </div>
  )
}