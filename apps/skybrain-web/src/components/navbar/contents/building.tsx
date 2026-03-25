import { Calendar } from 'lucide-react'
import { useBuildingStore } from '@/stores/building-store'
import { buildings } from '@/data/mock-buildings'

export default function BuildingNav() {
  const { selectedBuildingId, selectedDate, setSelectedBuilding, setSelectedDate, refreshAllData } = useBuildingStore()

  return (
    <div className="w-full flex items-center justify-between">
      <span className="text-xl">教学楼监控</span>
      <div className="flex items-center gap-4">
        <select
          value={selectedBuildingId}
          onChange={(e) => setSelectedBuilding(e.target.value)}
          className="px-3 py-1.5 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {buildings.map((building) => (
            <option key={building.id} value={building.id}>
              {building.name}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-1.5 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <button
          onClick={() => refreshAllData()}
          className="px-4 py-1.5 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90 transition-colors"
        >
          查询
        </button>
      </div>
    </div>
  )
}