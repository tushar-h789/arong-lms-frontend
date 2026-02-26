'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Library, ListPlus, BarChart3 } from 'lucide-react'

const TABS = [
  { id: 'question-bank', label: 'Question Bank', href: '/dashboard/instructor/assessments/question-bank', icon: Library },
  { id: 'quiz-builder', label: 'Quiz Builder', href: '/dashboard/instructor/assessments/quiz-builder', icon: ListPlus },
  { id: 'attempts', label: 'Attempts & Results', href: '/dashboard/instructor/assessments/attempts', icon: BarChart3 },
] as const

export function AssessmentsTabs() {
  const pathname = usePathname()
  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <nav className="-mb-px flex flex-wrap gap-1 overflow-x-auto">
        {TABS.map((t) => {
          const Icon = t.icon
          const isActive = pathname === t.href || pathname.startsWith(t.href + '/')
          return (
            <Link
              key={t.id}
              href={t.href}
              className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <Icon className="size-4" />
              {t.label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
