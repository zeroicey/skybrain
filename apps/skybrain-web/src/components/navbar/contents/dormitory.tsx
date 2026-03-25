import { Calendar } from 'lucide-react'
import { useDormitoryStore } from '@/stores/dormitory-store'
import { dormitories } from '@/data/mock-dormitories'

export default function DormitoryNav() {
  const { selectedDormitoryId, selectedDate, setSelectedDormitory, setSelectedDate, refreshAllData } = useDormitoryStore()

  return (
    <div className="w-full flex items-center justify-between">
      <span className="text-xl">宿舍区域监控</span>
      <div className="flex items-center gap-4">
        <select
          value={selectedDormitoryId}
          onChange={(e) => setSelectedDormitory(e.target.value)}
          className="px-3 py-1.5 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {dormitories.map((dorm) => (
            <option key={dorm.id} value={dorm.id}>
              {dorm.building} - {dorm.name}
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