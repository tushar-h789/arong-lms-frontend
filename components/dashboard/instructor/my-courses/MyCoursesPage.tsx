'use client'

import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  BookOpen,
  Search,
  Users,
  BarChart3,
  Megaphone,
  ChevronRight,
  LayoutGrid,
  Filter,
} from 'lucide-react'
import {
  getInstructorCourseList,
  CRAFT_LABELS,
  SORT_OPTIONS,
  type InstructorCourseItem,
  type MyCoursesSort,
  type CraftFilter,
} from '@/lib/instructor-my-courses-data'
import { type CourseStatus } from '@/lib/courses-data'

const STATUS_OPTIONS: { value: CourseStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
]

const CATEGORY_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'Safety', label: 'Safety' },
  { value: 'SOP', label: 'SOP' },
  { value: 'Skill', label: 'Skill' },
  { value: 'Quality', label: 'Quality' },
  { value: 'Compliance', label: 'Compliance' },
]

const CRAFT_OPTIONS: { value: CraftFilter | 'all'; label: string }[] = [
  { value: 'all', label: 'All crafts' },
  ...(Object.entries(CRAFT_LABELS).map(([k, v]) => ({ value: k as CraftFilter, label: v }))),
]

function CourseCard({ course }: { course: InstructorCourseItem }) {
  const statusClass =
    course.status === 'published'
      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
      : course.status === 'draft'
        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.06)] transition-all duration-200 hover:shadow-md dark:border-gray-600 dark:bg-gray-800 dark:hover:shadow-lg">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">{course.title}</h3>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusClass}`}>
              {course.status}
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{course.category}</p>
          <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-500 dark:text-gray-400">
            <span>{course.activeLearners} active</span>
            <span>{course.completionPercent}% completion</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/dashboard/instructor/my-courses/${course.id}`}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover"
          >
            Open workspace <ChevronRight className="size-3.5" />
          </Link>
          <Link
            href={`/dashboard/instructor/my-courses/${course.id}?tab=learners`}
            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            <Users className="size-4" /> Learners
          </Link>
          <Link
            href={`/dashboard/instructor/insights?course=${course.id}`}
            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            <BarChart3 className="size-4" /> Insights
          </Link>
          <Link
            href={`/dashboard/instructor/communication?course=${course.id}`}
            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            <Megaphone className="size-4" /> Announce
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function MyCoursesPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<CourseStatus | 'all'>('all')
  const [category, setCategory] = useState<string>('all')
  const [craft, setCraft] = useState<CraftFilter | 'all'>('all')
  const [sort, setSort] = useState<MyCoursesSort>('recently_updated')

  const list = useMemo(
    () => getInstructorCourseList({ search, status, category, craft: craft === 'all' ? 'all' : craft, sort }),
    [search, status, category, craft, sort]
  )

  return (
    <div className="w-full space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 sm:text-3xl">My Courses</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your courses, view learners, and post announcements.
        </p>
      </header>

      {/* Search + Filters + Sort */}
      <div className="flex flex-col gap-4 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm dark:border-gray-600 dark:bg-gray-800 sm:p-5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="Search by course name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            <Filter className="size-3.5" /> Filters
          </span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as CourseStatus | 'all')}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
          >
            {CATEGORY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <select
            value={craft}
            onChange={(e) => setCraft(e.target.value as CraftFilter | 'all')}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
          >
            {CRAFT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as MyCoursesSort)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Course list */}
      <section>
        <div className="flex items-center justify-between gap-4 pb-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
            <LayoutGrid className="mr-1.5 inline size-4" />
            Courses ({list.length})
          </h2>
        </div>
        <div className="space-y-4">
          {list.length === 0 ? (
            <div className="rounded-2xl border border-gray-200/80 bg-white py-16 text-center text-sm text-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400">
              No courses match your filters.
            </div>
          ) : (
            list.map((course) => <CourseCard key={course.id} course={course} />)
          )}
        </div>
      </section>
    </div>
  )
}
