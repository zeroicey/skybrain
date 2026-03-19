import { LayoutGrid, Grid3X3, Square } from 'lucide-react'
import type { LayoutMode } from '@/types/drone'
import { Segmented } from '@/components/ui/segmented'

interface LayoutSwitcherProps {
  value: LayoutMode
  onChange: (value: LayoutMode) => void
}

const options = [
  { value: '1x2', label: '1x2', icon: Square },
  { value: '2x2', label: '2x2', icon: LayoutGrid },
  { value: '3x3', label: '3x3', icon: Grid3X3 },
] as const

export function LayoutSwitcher({ value, onChange }: LayoutSwitcherProps) {
  return (
    <Segmented
      options={options}
      value={value}
      onValueChange={(val) => onChange(val as LayoutMode)}
    />
  )
}