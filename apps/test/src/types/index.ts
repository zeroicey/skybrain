export interface Location {
  lat: number
  lng: number
}

export interface Drone {
  id: string
  name: string
  status: 'flying' | 'idle' | 'charging' | 'warning' | 'offline'
  battery: number
  location: Location
  altitude: number
  speed: number
}

export interface Alert {
  id: string
  type: 'info' | 'warning' | 'error'
  title: string
  detail?: string
  location?: string
  time: string
  status: 'pending' | 'resolved'
}

export interface Task {
  id: string
  name: string
  type: 'patrol' | 'inspection' | 'delivery' | 'rescue'
  status: 'pending' | 'running' | 'completed' | 'failed'
  droneId?: string
  startTime?: string
  endTime?: string
  progress: number
}