'use client'

import React from 'react'
import { SidebarProvider, useSidebar } from './SidebarContext'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { MainContent } from './MainContent'
import { LanguageProvider } from './LanguageContext'

function MobileToggleBar() {
  const { toggleMobile } = useSidebar()
  return (
    <button
      type="button"
      onClick={toggleMobile}
      className="fixed left-0 top-1/2 z-50 -translate-y-1/2 md:hidden"
      aria-label="Open sidebar"
    >
      <div className="flex h-16 w-3 items-center justify-center rounded-r-lg bg-primary/90 shadow-lg transition-all hover:bg-primary hover:w-4">
        <div className="h-8 w-1 rounded-full bg-white/80" />
      </div>
    </button>
  )
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <LanguageProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-background">
          <Sidebar />
          <MobileToggleBar />
          <Header />
          <MainContent>{children}</MainContent>
        </div>
      </LanguageProvider>
    </SidebarProvider>
  )
}

