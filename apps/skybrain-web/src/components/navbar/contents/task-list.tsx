import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router"

export default function TaskListNav() {
  const navigate = useNavigate()

  return (
    <div className="w-full flex items-center justify-between">
      <span className="text-xl">任务列表</span>
      <div className="flex items-center gap-4">
        <Button onClick={() => navigate('/tasks/create')}>
          新建任务
        </Button>
      </div>
    </div>
  )
}