import { useEffect, useState } from 'react'
import { RefreshCw } from 'lucide-react'

export default function DashboardNav() {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const handleRefresh = () => {
    // 刷新页面重新加载
    window.location.reload()
  }

  return (
    <div className="w-full flex items-center justify-between">
      <div className="flex items-center gap-3">
        <img src="/logo.svg" alt="SkyBrain" className="h-6 w-6" />
        <div>
          <h1 className="text-xl font-bold">SkyBrain 终端</h1>
          <p className="text-xs text-zinc-400">智能无人机管理系统</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="text-xs text-zinc-400">
            {currentTime.toLocaleDateString('zh-CN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
          <div className="text-sm font-mono">
            {currentTime.toLocaleTimeString('zh-CN', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })}
          </div>
        </div>
        <button
          className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
          onClick={handleRefresh}
        >
          <RefreshCw className="h-4 w-4 text-zinc-400" />
        </button>
      </div>
    </div>
  )
}