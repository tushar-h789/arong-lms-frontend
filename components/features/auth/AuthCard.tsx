import React from 'react'

interface AuthCardProps {
  children: React.ReactNode
  title: string
}

export function AuthCard({ children, title }: AuthCardProps) {
  return (
    <div className="group relative py-3 w-full sm:max-w-xl sm:w-[36rem] sm:mx-auto cursor-default">
      {/* Gradient background - animates on hover */}
      <div
        className="absolute inset-0 bg-primary shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl transition-all duration-500 ease-out group-hover:-rotate-3 group-hover:scale-105 group-hover:shadow-xl"
        aria-hidden
      />
      {/* White card - lifts and glows on hover */}
      <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20 min-h-[32rem] transition-all duration-300 ease-out group-hover:-translate-y-2 group-hover:shadow-2xl">
        <h1 className="text-2xl font-semibold mb-6">{title}</h1>
        {children}
      </div>
    </div>
  )
}
