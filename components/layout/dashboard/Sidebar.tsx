'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import { useSidebar } from './SidebarContext'
import { NAV_ITEMS, getRoleFromPath } from '@/lib/dashboard-nav'
import { LogOutIcon } from '@/icons'
import logo from '@/public/images/logo.png'

const DASHBOARD_HOME: Record<string, string> = {
  admin: '/dashboard/admin',
  auditor: '/dashboard/auditor',
  hr: '/dashboard/hr',
  instructor: '/dashboard/instructor',
  it: '/dashboard/it',
  learner: '/dashboard/learner',
  manager: '/dashboard/manager',
  org: '/dashboard/admin/org',
}

export function Sidebar() {
  const pathname = usePathname()
  const { collapsed, mobileOpen, closeMobile } = useSidebar()
  const role = getRoleFromPath(pathname)
  const items = NAV_ITEMS[role]
  const homeHref = DASHBOARD_HOME[role] ?? '/dashboard/admin'
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  // Close mobile sidebar when navigating (sm only; md+ sidebar is always visible)
  const handleLinkClick = () => {
    if (window.innerWidth < 768) {
      closeMobile()
    }
  }

  const toggleDropdown = (label: string) => {
    setOpenDropdown((prev) => (prev === label ? null : label))
  }

  return (
    <>
      {/* Mobile overlay - visible when sidebar is open on sm only */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={closeMobile}
          aria-hidden="true"
        />
      )}
      <aside
        className={`
          fixed left-0 top-0 z-40 h-screen
          flex flex-col
          bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700
          transition-all duration-300 ease-in-out
          ${collapsed ? 'w-[72px]' : 'w-64'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
      >
        {/* Logo at top */}
        <div
          className={`
          shrink-0 flex items-center 
          justify-center border-b border-gray-100 dark:border-gray-700
          bg-linear-to-r from-orange-50 via-white to-orange-100
          dark:from-gray-800 dark:via-gray-900 dark:to-gray-800
          shadow-sm
          transition-all duration-300 ease-in-out
          ${collapsed ? 'h-16 px-2' : 'h-24 min-h-24 px-6'}
        `}
        >
          <Link
            href={homeHref}
            onClick={handleLinkClick}
            className={`
            flex items-center gap-3 overflow-hidden
            ${collapsed ? '' : 'pl-1'}
            group
          `}
          >
            <span
              className={`
              rounded-full bg-white/70 shadow-md ring-2 ring-primary/20
              flex items-center justify-center
              transition-all duration-200
              ${collapsed ? 'size-10' : 'size-14'}
              border-2 border-primary/20
            `}
            >
              <Image
                src={logo}
                alt="Aarong LMS"
                width={collapsed ? 40 : 56}
                height={collapsed ? 40 : 56}
                className={`
                transition-all duration-300
                ${collapsed ? 'scale-100' : 'scale-110'}
              `}
                priority
              />
            </span>
            {!collapsed && (
              <span
                className="
                font-extrabold text-xl tracking-tight text-primary
                ml-2 whitespace-nowrap
                group-hover:text-primary-hover transition-colors duration-200
                drop-shadow-md
                animate-fadein
              "
                style={{ animationDelay: '0.15s', animationDuration: '0.7s' }}
              >
                Aarong LMS
              </span>
            )}
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3">
          <ul className="space-y-1">
            {items.map((item) => {
              const hasChildren = item.children && item.children.length > 0
              const isActive = hasChildren
                ? pathname.startsWith(item.href) || item.children!.some((c) => pathname === c.href || pathname.startsWith(c.href + '/'))
                : pathname === item.href
              const isDropdownOpen = openDropdown === item.label

              if (hasChildren && !collapsed) {
                return (
                  <li key={item.href}>
                    <button
                      type="button"
                      onClick={() => toggleDropdown(item.label)}
                      className={`
                        flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5
                        text-sm font-medium
                        transition-colors duration-200
                        ${isActive ? 'bg-primary text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}
                      `}
                    >
                      <span className="flex min-w-0 items-center gap-3">
                        <span className="shrink-0 flex items-center justify-center w-5 h-5 [&_svg]:size-5">
                          {item.icon}
                        </span>
                        <span className="truncate whitespace-nowrap">{item.label}</span>
                      </span>
                      <ChevronDown
                        className={`size-4 shrink-0 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {isDropdownOpen && (
                      <ul className="mt-1 ml-4 space-y-0.5 border-l-2 border-gray-200 dark:border-gray-600 pl-3">
                        {item.children!.map((child) => {
                          const isChildActive = pathname === child.href
                          return (
                            <li key={child.href}>
                              <Link
                                href={child.href}
                                onClick={handleLinkClick}
                                className={`
                                  block rounded-md px-2 py-1.5 text-sm
                                  transition-colors duration-200
                                  ${isChildActive
                                    ? 'font-medium text-primary'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'}
                                `}
                              >
                                {child.label}
                              </Link>
                            </li>
                          )
                        })}
                      </ul>
                    )}
                  </li>
                )
              }

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={handleLinkClick}
                    className={`
                      flex items-center gap-3 rounded-lg px-3 py-2.5
                      text-sm font-medium
                      transition-colors duration-200
                      ${isActive ? 'bg-primary text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}
                      ${collapsed ? 'justify-center px-2' : ''}
                    `}
                    title={collapsed ? item.label : undefined}
                  >
                    <span className="shrink-0 flex items-center justify-center w-5 h-5 [&_svg]:size-5">
                      {item.icon}
                    </span>
                    {!collapsed && (
                      <span className="truncate whitespace-nowrap transition-opacity duration-200">
                        {item.label}
                      </span>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Logout at bottom */}
        <div className="shrink-0 border-t border-gray-200 dark:border-gray-700 p-3">
          <Link
            href="/login"
            onClick={handleLinkClick}
            className={`
            flex items-center gap-3 rounded-lg px-3 py-2.5
            text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400
            transition-colors duration-200
            ${collapsed ? 'justify-center px-2' : ''}
          `}
            title={collapsed ? 'Logout' : undefined}
          >
            <span className="shrink-0 flex items-center justify-center w-5 h-5 [&_svg]:size-5">
              <LogOutIcon />
            </span>
            {!collapsed && <span>Logout</span>}
          </Link>
        </div>
      </aside>
    </>
  )
}
