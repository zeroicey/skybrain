import { Calendar } from 'lucide-react'
import { useCanteenStore } from '@/stores/canteen-store'
import { canteens } from '@/data/mock-canteens'

export default function CanteenNav() {
  const { selectedCanteenId, selectedDate, setSelectedCanteen, setSelectedDate, refreshAllData } =
    useCanteenStore()

  const selectedCanteenName = canteens.find((c) => c.id === selectedCanteenId)?.name || '选择饭堂'

  return (
    <div className="w-full flex items-center justify-between">
      <span className="text-xl">饭堂人流监控</span>
      <div className="flex items-center gap-4">
        {/* 饭堂选择 */}
        <select
          value={selectedCanteenId}
          onChange={(e) => setSelectedCanteen(e.target.value)}
          className="px-3 py-1.5 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {canteens.map((canteen) => (
            <option key={canteen.id} value={canteen.id}>
              {canteen.name}
            </option>
          ))}
        </select>

        {/* 日期选择 */}
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-1.5 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* 查询按钮 */}
        <button
          onClick={() => {
            refreshAllData()
          }}
          className="px-4 py-1.5 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90 transition-colors"
        >
          查询
        </button>
      </div>
    </div>
  )
}