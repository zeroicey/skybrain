import React from "react"

interface FeatureItem {
  text: string
}

interface FeatureListProps {
  items: FeatureItem[]
  className?: string
}

export function FeatureList({ items, className = "" }: FeatureListProps) {
  return (
    <ul className={`text-[#3d5c3d] space-y-2 ${className}`}>
      {items.map((item, index) => (
        <li key={index}>• {item.text}</li>
      ))}
    </ul>
  )
}