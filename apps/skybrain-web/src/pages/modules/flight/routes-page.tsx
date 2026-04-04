import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Search, Map, Clock, FileText } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

// 模拟航线数据
interface FlightRoute {
  id: string
  name: string
  description: string
  scene: 'canteen' | 'shop' | 'dormitory' | 'building' | 'gate'
  waypointCount: number
  totalDistance: number
  estimatedTime: number
  status: 'draft' | 'active' | 'archived'
  createdAt: string
  updatedAt: string
}

const mockRoutes: FlightRoute[] = [
  {
    id: '1',
    name: '食堂巡查路线A',
    description: '覆盖食堂一楼、二楼主要区域',
    scene: 'canteen',
    waypointCount: 12,
    totalDistance: 850,
    estimatedTime: 15,
    status: 'active',
    createdAt: '2026-03-15',
    updatedAt: '2026-03-20'
  },
  {
    id: '2',
    name: '宿舍楼巡逻路线',
    description: '宿舍楼外围及公共区域巡检',
    scene: 'dormitory',
    waypointCount: 20,
    totalDistance: 1200,
    estimatedTime: 25,
    status: 'active',
    createdAt: '2026-03-10',
    updatedAt: '2026-03-18'
  },
  {
    id: '3',
    name: '校门值守航线',
    description: '校门进出口及周边监控',
    scene: 'gate',
    waypointCount: 8,
    totalDistance: 500,
    estimatedTime: 10,
    status: 'draft',
    createdAt: '2026-04-01',
    updatedAt: '2026-04-01'
  },
  {
    id: '4',
    name: '商铺巡检路线',
    description: '商业街商铺外部巡检',
    scene: 'shop',
    waypointCount: 15,
    totalDistance: 950,
    estimatedTime: 18,
    status: 'active',
    createdAt: '2026-03-08',
    updatedAt: '2026-03-25'
  },
  {
    id: '5',
    name: '教学楼巡查路线',
    description: '教学楼楼层间巡检',
    scene: 'building',
    waypointCount: 25,
    totalDistance: 1500,
    estimatedTime: 30,
    status: 'archived',
    createdAt: '2026-02-20',
    updatedAt: '2026-03-01'
  }
]

const sceneMap = {
  canteen: { label: '食堂', color: 'bg-orange-500' },
  shop: { label: '商铺', color: 'bg-blue-500' },
  dormitory: { label: '宿舍', color: 'bg-green-500' },
  building: { label: '楼宇', color: 'bg-purple-500' },
  gate: { label: '校门', color: 'bg-red-500' }
}

const statusMap = {
  draft: { label: '草稿', variant: 'secondary' as const },
  active: { label: '启用中', variant: 'default' as const },
  archived: { label: '已归档', variant: 'outline' as const }
}

export default function RoutesPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [sceneFilter, setSceneFilter] = useState<string>('all')

  const filteredRoutes = mockRoutes.filter(route => {
    const matchesSearch = route.name.toLowerCase().includes(search.toLowerCase()) ||
      route.description.toLowerCase().includes(search.toLowerCase())
    const matchesScene = sceneFilter === 'all' || route.scene === sceneFilter
    return matchesSearch && matchesScene
  })

  const activeCount = mockRoutes.filter(r => r.status === 'active').length

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">航线总数</CardTitle>
            <Map className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockRoutes.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">启用中</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">草稿</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockRoutes.filter(r => r.status === 'draft').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">已归档</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockRoutes.filter(r => r.status === 'archived').length}</div>
          </CardContent>
        </Card>
      </div>

      {/* 搜索和筛选 */}
      <div className="flex gap-4">
        <select
          className="border border-input bg-background px-3 py-2 rounded-md text-sm"
          value={sceneFilter}
          onChange={(e) => setSceneFilter(e.target.value)}
        >
          <option value="all">全部场景</option>
          <option value="canteen">食堂</option>
          <option value="shop">商铺</option>
          <option value="dormitory">宿舍</option>
          <option value="building">楼宇</option>
          <option value="gate">校门</option>
        </select>
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索航线名称..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* 航线列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRoutes.map(route => {
          const sceneInfo = sceneMap[route.scene]
          const statusInfo = statusMap[route.status]
          return (
            <Card
              key={route.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate(`/flight/routes/${route.id}`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{route.name}</CardTitle>
                  <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{route.description}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${sceneInfo.color}`} />
                  <span className="text-sm">{sceneInfo.label}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">航点</span>
                    <div className="font-medium">{route.waypointCount}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">距离</span>
                    <div className="font-medium">{route.totalDistance}m</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">时长</span>
                    <div className="font-medium">{route.estimatedTime}min</div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  更新于 {route.updatedAt}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredRoutes.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          暂无航线数据
        </div>
      )}
    </div>
  )
}