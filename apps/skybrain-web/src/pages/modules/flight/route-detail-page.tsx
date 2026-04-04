import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { ArrowLeft, Map, Clock, FileText, Play, Edit, Trash2, Download, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

// 模拟航线详情数据
interface FlightRouteDetail {
  id: string
  name: string
  description: string
  scene: 'canteen' | 'shop' | 'dormitory' | 'building' | 'gate'
  waypoints: Array<{
    id: number
    name: string
    x: number
    y: number
    z: number
    action: 'hover' | 'photo' | 'video' | 'none'
    hoverTime: number
  }>
  totalDistance: number
  estimatedTime: number
  maxAltitude: number
  speed: number
  status: 'draft' | 'active' | 'archived'
  createdAt: string
  updatedAt: string
  creator: string
  flightCount: number
}

const mockRouteDetail: FlightRouteDetail = {
  id: '1',
  name: '食堂巡查路线A',
  description: '覆盖食堂一楼、二楼主要区域，包括就餐区、厨房周边、消防通道等',
  scene: 'canteen',
  waypoints: [
    { id: 1, name: '起点', x: 0, y: 0, z: 10, action: 'none', hoverTime: 0 },
    { id: 2, name: '就餐区A', x: 15, y: 20, z: 12, action: 'photo', hoverTime: 5 },
    { id: 3, name: '就餐区B', x: 30, y: 15, z: 12, action: 'photo', hoverTime: 5 },
    { id: 4, name: '厨房入口', x: 45, y: 25, z: 15, action: 'photo', hoverTime: 8 },
    { id: 5, name: '消防通道', x: 50, y: 40, z: 10, action: 'hover', hoverTime: 10 },
    { id: 6, name: '二楼走廊', x: 35, y: 50, z: 12, action: 'photo', hoverTime: 5 },
    { id: 7, name: '二楼就餐区', x: 20, y: 45, z: 12, action: 'photo', hoverTime: 5 },
    { id: 8, name: '安全出口', x: 5, y: 35, z: 10, action: 'hover', hoverTime: 8 },
    { id: 9, name: '返回点', x: 0, y: 0, z: 10, action: 'none', hoverTime: 0 },
  ],
  totalDistance: 850,
  estimatedTime: 15,
  maxAltitude: 20,
  speed: 5,
  status: 'active',
  createdAt: '2026-03-15',
  updatedAt: '2026-03-20',
  creator: '管理员',
  flightCount: 42
}

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

const actionMap = {
  hover: { label: '悬停', color: 'text-yellow-500' },
  photo: { label: '拍照', color: 'text-blue-500' },
  video: { label: '录像', color: 'text-red-500' },
  none: { label: '经过', color: 'text-muted-foreground' }
}

export default function RouteDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [route, setRoute] = useState<FlightRouteDetail | null>(null)

  useEffect(() => {
    // 模拟从 store 获取数据
    // 实际项目中应该从 store 或 API 获取
    if (id) {
      setRoute(mockRouteDetail)
    }
  }, [id])

  if (!route) {
    return (
      <div className="container mx-auto p-6">
        <p>航线不存在</p>
        <Button onClick={() => navigate('/flight/routes')}>返回列表</Button>
      </div>
    )
  }

  const sceneInfo = sceneMap[route.scene]
  const statusInfo = statusMap[route.status]

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* 顶部导航 */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/flight/routes')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          {route.name}
          <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
        </h1>
        <div className="ml-auto flex gap-2">
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            编辑
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            导出
          </Button>
          <Button variant="outline">
            <Share2 className="h-4 w-4 mr-2" />
            分享
          </Button>
          <Button>
            <Play className="h-4 w-4 mr-2" />
            执行任务
          </Button>
        </div>
      </div>

      {/* 基本信息 */}
      <Card>
        <CardHeader>
          <CardTitle>航线信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{route.description}</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${sceneInfo.color}`} />
              <span>{sceneInfo.label}</span>
            </div>
            <span className="text-muted-foreground">|</span>
            <span>创建者: {route.creator}</span>
            <span className="text-muted-foreground">|</span>
            <span>已执行 {route.flightCount} 次</span>
            <span className="text-muted-foreground">|</span>
            <span>更新于 {route.updatedAt}</span>
          </div>
        </CardContent>
      </Card>

      {/* 统计和地图 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 统计卡片 */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Map className="h-4 w-4" />
                航线概览
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">航点数量</span>
                <span className="font-medium">{route.waypoints.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">总距离</span>
                <span className="font-medium">{route.totalDistance}m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">预计时长</span>
                <span className="font-medium">{route.estimatedTime}分钟</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">最大高度</span>
                <span className="font-medium">{route.maxAltitude}m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">飞行速度</span>
                <span className="font-medium">{route.speed}m/s</span>
              </div>
            </CardContent>
          </Card>

          {/* 快速操作 */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">快速操作</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full justify-start" variant="ghost">
                <Play className="h-4 w-4 mr-2" />
                开始执行
              </Button>
              <Button className="w-full justify-start" variant="ghost">
                <FileText className="h-4 w-4 mr-2" />
                查看执行记录
              </Button>
              <Button className="w-full justify-start" variant="ghost">
                <Clock className="h-4 w-4 mr-2" />
                添加到调度
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* 模拟地图显示 */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>航线预览</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center relative">
              {/* 航线绘制 */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                {/* 连接线 */}
                <polyline
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  strokeDasharray="2,1"
                  points={route.waypoints.map(wp =>
                    `${(wp.x / 55) * 80 + 10},${(wp.y / 55) * 80 + 10}`
                  ).join(' ')}
                  className="text-primary"
                />
                {/* 航点标记 */}
                {route.waypoints.map((wp, index) => (
                  <g key={wp.id}>
                    <circle
                      cx={(wp.x / 55) * 80 + 10}
                      cy={(wp.y / 55) * 80 + 10}
                      r="2"
                      fill={index === 0 ? '#22c55e' : index === route.waypoints.length - 1 ? '#ef4444' : '#3b82f6'}
                    />
                    <text
                      x={(wp.x / 55) * 80 + 10 + 3}
                      y={(wp.y / 55) * 80 + 10 + 3}
                      fontSize="3"
                      fill="currentColor"
                      className="text-muted-foreground"
                    >
                      {wp.id}
                    </text>
                  </g>
                ))}
              </svg>

              <div className="text-center text-muted-foreground">
                <Map className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>2D 航线预览（开发中）</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 航点列表 */}
      <Card>
        <CardHeader>
          <CardTitle>航点详情 ({route.waypoints.length} 个)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">序号</th>
                  <th className="text-left py-3 px-4">航点名称</th>
                  <th className="text-left py-3 px-4">坐标 (X, Y, Z)</th>
                  <th className="text-left py-3 px-4">动作</th>
                  <th className="text-left py-3 px-4">悬停时间</th>
                </tr>
              </thead>
              <tbody>
                {route.waypoints.map((wp, index) => {
                  const actionInfo = actionMap[wp.action]
                  return (
                    <tr key={wp.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {index === 0 && <Badge variant="default" className="text-xs">起点</Badge>}
                          {index === route.waypoints.length - 1 && <Badge variant="destructive" className="text-xs">终点</Badge>}
                          {index !== 0 && index !== route.waypoints.length - 1 && <span className="text-muted-foreground">{wp.id}</span>}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium">{wp.name}</td>
                      <td className="py-3 px-4 font-mono text-sm">
                        ({wp.x}, {wp.y}, {wp.z})
                      </td>
                      <td className="py-3 px-4">
                        <span className={actionInfo.color}>{actionInfo.label}</span>
                      </td>
                      <td className="py-3 px-4">{wp.hoverTime > 0 ? `${wp.hoverTime}s` : '-'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 危险操作 */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">危险区域</CardTitle>
        </CardHeader>
        <CardContent>
          <Button variant="destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            删除航线
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}