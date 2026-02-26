'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
  ArrowLeft,
  BookOpen,
  FileText,
  Send,
  Users,
  BarChart3,
  MessageSquare,
  GripVertical,
  Image as ImageIcon,
  Video,
  FileCheck,
  Eye,
  Calendar,
  Megaphone,
} from 'lucide-react'
import { COURSES } from '@/lib/courses-data'

const TABS = [
  { id: 'curriculum', label: 'Curriculum', icon: GripVertical },
  { id: 'content', label: 'Lessons & Content', icon: FileText },
  { id: 'publish', label: 'Publish Updates', icon: Send },
  { id: 'learners', label: 'Learners', icon: Users },
  { id: 'insights', label: 'Course Insights', icon: BarChart3 },
  { id: 'communication', label: 'Communication', icon: MessageSquare },
] as const

type TabId = (typeof TABS)[number]['id']

function TabContent({ tabId, courseId }: { tabId: TabId; courseId: string }) {
  switch (tabId) {
    case 'curriculum':
      return (
        <div className="rounded-2xl border border-gray-200/80 bg-white p-6 dark:border-gray-600 dark:bg-gray-800">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Curriculum</h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Update module/lesson order (drag-drop), add/remove lessons, mark as mandatory/optional.
          </p>
          <p className="mt-4 text-xs text-gray-400 dark:text-gray-500">Coming soon: drag-drop editor</p>
        </div>
      )
    case 'content':
      return (
        <div className="rounded-2xl border border-gray-200/80 bg-white p-6 dark:border-gray-600 dark:bg-gray-800">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Lessons & Content</h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Upload/replace assets: video, images, PDF, PPT. Add Job Aid/Checklist. Low bandwidth note.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-xs dark:bg-gray-700">
              <Video className="size-3.5" /> Video
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-xs dark:bg-gray-700">
              <ImageIcon className="size-3.5" /> Images
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-xs dark:bg-gray-700">
              <FileCheck className="size-3.5" /> Job Aid
            </span>
          </div>
        </div>
      )
    case 'publish':
      return (
        <div className="rounded-2xl border border-gray-200/80 bg-white p-6 dark:border-gray-600 dark:bg-gray-800">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Publish Updates</h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Publish changes, schedule publish, add change notes (&quot;What changed?&quot;), preview as learner.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover">
              <Send className="size-4" /> Publish
            </button>
            <button type="button" className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200">
              <Calendar className="size-4" /> Schedule
            </button>
            <Link href="#" className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200">
              <Eye className="size-4" /> Preview as learner
            </Link>
          </div>
        </div>
      )
    case 'learners':
      return (
        <div className="rounded-2xl border border-gray-200/80 bg-white p-6 dark:border-gray-600 dark:bg-gray-800">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Learners</h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Enrolled/assigned list. Filter by center/group, progress (in progress, overdue, completed). Export, send reminder.
          </p>
          <Link
            href={`/dashboard/instructor/insights?course=${courseId}`}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover"
          >
            <Users className="size-4" /> View learner list
          </Link>
        </div>
      )
    case 'insights':
      return (
        <div className="rounded-2xl border border-gray-200/80 bg-white p-6 dark:border-gray-600 dark:bg-gray-800">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Course Insights</h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Completion %, drop-off lesson, average time spent, quiz avg score, center-wise comparison.
          </p>
          <Link
            href={`/dashboard/instructor/insights?course=${courseId}`}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover"
          >
            <BarChart3 className="size-4" /> Open Insights
          </Link>
        </div>
      )
    case 'communication':
      return (
        <div className="rounded-2xl border border-gray-200/80 bg-white p-6 dark:border-gray-600 dark:bg-gray-800">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Communication</h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Course announcements, Q&A threads (course scope).
          </p>
          <Link
            href={`/dashboard/instructor/communication?course=${courseId}`}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover"
          >
            <Megaphone className="size-4" /> Open Communication
          </Link>
        </div>
      )
    default:
      return null
  }
}

export default function CourseWorkspacePage({ courseId }: { courseId: string }) {
  const searchParams = useSearchParams()
  const tabParam = searchParams.get('tab') as TabId | null
  const initialTab = tabParam && TABS.some((t) => t.id === tabParam) ? tabParam : 'curriculum'
  const [tab, setTab] = useState<TabId>(initialTab)
  const course = COURSES.find((c) => c.id === courseId)
  const courseTitle = course?.title ?? 'Course'
  const effectiveCourseId = course?.id ?? courseId

  useEffect(() => {
    if (tabParam && TABS.some((t) => t.id === tabParam)) {
      queueMicrotask(() => setTab(tabParam))
    }
  }, [tabParam])

  if (!course) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
        <p className="text-gray-500 dark:text-gray-400">Course not found.</p>
        <Link href="/dashboard/instructor/my-courses" className="text-primary hover:underline">
          Back to My Courses
        </Link>
      </div>
    )
  }

  return (
    <div className="w-full space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/dashboard/instructor/my-courses"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-primary dark:text-gray-400"
          >
            <ArrowLeft className="size-4" /> My Courses
          </Link>
          <h1 className="mt-2 flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
            <BookOpen className="size-7 text-primary" />
            {courseTitle}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Course workspace — curriculum, content, learners, insights, communication.
          </p>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex flex-wrap gap-1 overflow-x-auto">
          {TABS.map((t) => {
            const Icon = t.icon
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${tab === t.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
              >
                <Icon className="size-4" />
                {t.label}
              </button>
            )
          })}
        </nav>
      </div>

      <TabContent tabId={tab} courseId={effectiveCourseId} />
    </div>
  )
}
