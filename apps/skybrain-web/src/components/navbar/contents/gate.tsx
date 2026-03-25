import { Calendar } from 'lucide-react'
import { useGateStore } from '@/stores/gate-store'
import { gates } from '@/data/mock-gates'

export default function GateNav() {
  const { selectedGateId, selectedDate, setSelectedGate, setSelectedDate, refreshAllData } = useGateStore()

  return (
    <div className="w-full flex items-center justify-between">
      <span className="text-xl">校门通行监控</span>
      <div className="flex items-center gap-4">
        <select
          value={selectedGateId}
          onChange={(e) => setSelectedGate(e.target.value)}
          className="px-3 py-1.5 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {gates.map((gate) => (
            <option key={gate.id} value={gate.id}>
              {gate.name}
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