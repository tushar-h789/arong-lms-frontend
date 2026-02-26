'use client'

import React from 'react'
import { useSidebar } from './SidebarContext'

export function MainContent({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebar()

  return (
    <main
      className={`
        fixed left-0 right-0 bottom-0
        overflow-y-auto bg-gray-50 dark:bg-gray-900/50
        transition-[left,top,background-color] duration-300 ease-in-out
        top-16
        sm:top-16
        ${collapsed ? 'md:left-[72px]' : 'md:left-64'}
      `}
    >
      <div className="p-6 min-h-full">{children}</div>
    </main>
  )
}
