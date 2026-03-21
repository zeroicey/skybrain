import { useState } from "react"

interface ScheduleCalendarProps {
  scheduledTasks: Array<{
    id: string
    taskName: string
    time: string
    dayOfWeek?: number[]
    enabled: boolean
  }>
}

const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']

export function ScheduleCalendar({ scheduledTasks }: ScheduleCalendarProps) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null)

  // 简化：显示当周的日期
  const today = new Date()
  const weekStart = new Date(today)
  weekStart.setDate(today.getDate() - today.getDay() + 1)

  const getTasksForDay = (dayIndex: number) => {
    return scheduledTasks.filter(task => {
      if (!task.enabled) return false
      if (!task.dayOfWeek) return dayIndex === today.getDay() - 1
      return task.dayOfWeek.includes(dayIndex)
    })
  }

  return (
    <div className="grid grid-cols-7 gap-2">
      {days.map((day, index) => {
        const dayTasks = getTasksForDay(index)
        return (
          <div
            key={index}
            className={`p-3 border rounded-lg min-h-[100px] ${
              selectedDay === index ? 'border-primary bg-primary/5' : ''
            }`}
            onClick={() => setSelectedDay(index)}
          >
            <div className="font-medium text-sm mb-2">{day}</div>
            <div className="space-y-1">
              {dayTasks.map(task => (
                <div
                  key={task.id}
                  className="text-xs p-1 bg-primary/10 rounded truncate"
                  title={task.taskName}
                >
                  {task.time} {task.taskName}
                </div>
              ))}
              {dayTasks.length === 0 && (
                <div className="text-xs text-muted-foreground">-</div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}