import React from "react"

interface InfoCardProps {
  title?: string
  description?: string
  children?: React.ReactNode
  className?: string
}

export function InfoCard({ title, description, children, className = "" }: InfoCardProps) {
  return (
    <div className={`bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/50 ${className}`}>
      {title && <h3 className="text-2xl font-bold text-[#1a2e1a] mb-3">{title}</h3>}
      {description && <p className="text-[#3d5c3d] text-lg leading-relaxed">{description}</p>}
      {children}
    </div>
  )
}