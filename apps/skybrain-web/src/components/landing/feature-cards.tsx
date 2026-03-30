import React from "react"
import type { LucideIcon } from "lucide-react"

interface FeatureCard {
  icon: LucideIcon
  title: string
  description: string
}

interface FeatureCardsProps {
  cards: FeatureCard[]
}

export function FeatureCards({ cards }: FeatureCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <div
            key={index}
            className="bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/50"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-[#7ddf7d]/20 rounded-lg">
                <Icon className="w-5 h-5 text-[#1a2e1a]" />
              </div>
              <h4 className="text-sm font-semibold text-[#1a2e1a]">{card.title}</h4>
            </div>
            <p className="text-xs text-[#3d5c3d]">{card.description}</p>
          </div>
        )
      })}
    </div>
  )
}