import { MapPin } from 'lucide-react'

interface SuggestedRouteProps {
  routeName: string
  onSelect?: (_routeId: string) => void
}

export function SuggestedRoute({ routeName, onSelect: _onSelect }: SuggestedRouteProps) {
  return (
    <div className="flex items-center gap-2 py-2">
      <MapPin className="h-4 w-4 text-blue-500" />
      <span className="text-sm">
        <span className="text-muted-foreground">建议航线: </span>
        <span className="font-medium">{routeName}</span>
      </span>
    </div>
  )
}