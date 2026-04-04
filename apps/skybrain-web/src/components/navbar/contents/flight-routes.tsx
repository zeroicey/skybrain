import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router"

export default function FlightRoutesNav() {
  const navigate = useNavigate()

  return (
    <div className="w-full flex items-center justify-between">
      <span className="text-xl">航线管理</span>
      <div className="flex items-center gap-4">
        <Button onClick={() => navigate('/flight/routes/teach')}>
          示教录制
        </Button>
      </div>
    </div>
  )
}