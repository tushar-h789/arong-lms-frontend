'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSidebar } from './SidebarContext'
import { useLanguage } from './LanguageContext'

const ROLE_LABELS: Record<string, string> = {
  admin: 'Super Admin',
  instructor: 'Instructor',
  learner: 'Student',
  hr: 'Staff',
  org: 'Organization',
  auditor: 'Auditor',
  it: 'IT',
  manager: 'Manager',
}

import { SearchIcon, BellIcon, UserIcon, SettingsIcon, ChevronLeftIcon } from '@/icons'
import { MenuBarsIcon } from '@/icons/MenuBarsIcons'
import { getRoleFromPath } from '@/lib/dashboard-nav'
import { ThemeToggle } from '@/components/theme/ThemeToggle'

// Placeholder – replace with real user from auth context
const USER = { name: 'User Name', email: 'user@example.com' }

type NotificationItem = { id: string; title: string; message: string; read: boolean; time: string }

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  { id: '1', title: 'New assignment', message: 'You have a new assignment in Course A.', read: false, time: '2m ago' },
  { id: '2', title: 'Deadline reminder', message: 'Assignment due in 24 hours.', read: false, time: '1h ago' },
  { id: '3', title: 'Grade posted', message: 'Your grade for Quiz 2 is available.', read: true, time: '3h ago' },
]

function useClickOutside(ref: React.RefObject<HTMLElement | null>, onClose: () => void) {
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [ref, onClose])
}

export function Header() {
  const pathname = usePathname()
  const { collapsed, mobileOpen, toggle, toggleMobile } = useSidebar()
  const role = getRoleFromPath(pathname)
  const roleLabel = ROLE_LABELS[role] ?? 'Dashboard'

  const [avatarOpen, setAvatarOpen] = useState(false)
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS)
  const avatarRef = useRef<HTMLDivElement>(null)
  const notificationRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  useClickOutside(avatarRef, () => setAvatarOpen(false))
  useClickOutside(notificationRef, () => setNotificationOpen(false))
  useClickOutside(searchRef, () => {
    setSearchOpen(false)
    setSearchQuery('')
  })

  useEffect(() => {
    if (searchOpen) {
      searchInputRef.current?.focus()
    }
  }, [searchOpen])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const q = searchQuery.trim()
    if (q) {
      // TODO: wire to real search (e.g. router.push(`/search?q=${q}`) or API)
      console.log('Search:', q)
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const { language, toggleLanguage } = useLanguage()
  const isBangla = language === 'bn'

  return (
    <>
      <header
        className={`
          fixed top-0 right-0 z-30 h-16
          flex items-center justify-between
          bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700
          transition-[left,background-color,border-color] duration-300 ease-in-out
          left-0
          ${collapsed ? 'md:left-[72px]' : 'md:left-64'}
        `}
      >
        <div className="flex items-center gap-1 pl-2">
          {/* Mobile menu button - visible on sm only, hidden from md+ */}
          <button
            type="button"
            onClick={toggleMobile}
            className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100 transition-colors cursor-pointer"
            aria-label="Toggle sidebar"
          >
            <MenuBarsIcon />
          </button>
          {/* Desktop collapse button - hidden on sm, visible from md+ */}
          <button
            type="button"
            onClick={toggle}
            className="hidden md:flex p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100 transition-colors cursor-pointer"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <MenuBarsIcon className={`transition-transform duration-300 shrink-0  size-5`} />
          </button>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{roleLabel} Dashboard</span>
        </div>

        <div className="flex items-center gap-2 pr-2 sm:pr-6">
          {/* Search - Mobile: icon only, Desktop: inline search */}
          <div className="relative flex items-center shrink-0" ref={searchRef}>
            {searchOpen ? (
              // Desktop inline search
              <form onSubmit={handleSearch} className="hidden sm:flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg pl-3 pr-2 py-1.5 min-w-[280px]">
                <SearchIcon className="shrink-0 text-gray-500 dark:text-gray-400 size-5" />
                <input
                  ref={searchInputRef}
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Escape' && (setSearchOpen(false), setSearchQuery(''))}
                  placeholder="Search..."
                  className="flex-1 min-w-0 bg-transparent border-0 py-1 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-0"
                  autoComplete="off"
                />
                <button
                  type="button"
                  onClick={() => (setSearchOpen(false), setSearchQuery(''))}
                  className="p-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-gray-700 dark:hover:text-gray-200 transition-colors cursor-pointer"
                  aria-label="Close search"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200 transition-colors cursor-pointer shrink-0 sm:p-2.5"
                aria-label="Search"
              >
                <SearchIcon className="size-4 sm:size-5" />
              </button>
            )}
          </div>

          {/* Language switch: OFF = EN, ON = BN */}
          <div className="flex items-center gap-2">
            <span className={`text-xs font-medium ${!isBangla ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400 dark:text-gray-500'}`}>EN</span>
            <button
              type="button"
              role="switch"
              aria-checked={isBangla}
              aria-label="Language: EN when off, BN when on"
              onClick={toggleLanguage}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${isBangla ? 'bg-primary' : 'bg-gray-200'}`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ${isBangla ? 'translate-x-5' : 'translate-x-0.5'}`}
                aria-hidden
              />
            </button>
            <span className={`text-xs font-medium ${isBangla ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400 dark:text-gray-500'}`}>BN</span>
          </div>

          <ThemeToggle />

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              type="button"
              onClick={() => setNotificationOpen((o) => !o)}
              className="relative p-2.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200 transition-colors cursor-pointer"
              aria-label="Notifications"
            >
              <BellIcon />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-primary text-white text-xs font-medium">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            {notificationOpen && (
              <div className="fixed left-4 right-4 top-18 z-50 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-lg overflow-hidden sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-2 sm:w-80">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                  <span className="font-semibold text-gray-900 dark:text-gray-100">Notifications</span>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={markAllAsRead}
                      className="text-xs font-medium text-primary hover:text-primary-hover cursor-pointer"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">No notifications</p>
                  ) : (
                    notifications.map((n) => (
                      <button
                        key={n.id}
                        type="button"
                        onClick={() => markAsRead(n.id)}
                        className={`w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-50 dark:border-gray-700 last:border-0 transition-colors ${!n.read ? 'bg-primary/5 dark:bg-primary/10' : ''} cursor-pointer`}
                      >
                        <p className="font-medium text-sm text-gray-900 dark:text-gray-100">{n.title}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 line-clamp-2">{n.message}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{n.time}</p>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Avatar dropdown */}
          <div className="relative" ref={avatarRef}>
            <button
              type="button"
              onClick={() => setAvatarOpen((o) => !o)}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white hover:opacity-90 transition-opacity shrink-0 cursor-pointer"
              aria-label="User menu"
            >
              <UserIcon />
            </button>
            {avatarOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-lg z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                  <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">{USER.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{USER.email}</p>
                </div>
                <div className="py-1">
                  <Link
                    href="/profile"
                    onClick={() => setAvatarOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    <UserIcon />
                    Profile
                  </Link>
                  <Link
                    href="/profile/settings"
                    onClick={() => setAvatarOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    <SettingsIcon size={18} />
                    Settings
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Search Bar - Fixed below header when open */}
      {searchOpen && (
        <div className="fixed top-16 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm sm:hidden">
          <form onSubmit={handleSearch} className="flex items-center gap-2 px-4 py-3">
            <SearchIcon className="shrink-0 text-gray-500 dark:text-gray-400 size-5" />
            <input
              ref={searchInputRef}
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Escape' && (setSearchOpen(false), setSearchQuery(''))}
              placeholder="Search..."
              className="flex-1 min-w-0 bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary border-0"
              autoComplete="off"
            />
            <button
              type="button"
              onClick={() => (setSearchOpen(false), setSearchQuery(''))}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200 transition-colors cursor-pointer shrink-0"
              aria-label="Close search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  )
}
