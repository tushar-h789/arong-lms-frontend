'use client'

import React, { useMemo, useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  List,
  HelpCircle,
  Download,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  X,
  BookOpen,
  Wifi,
  WifiOff,
  ChevronDown,
  Video,
  LogIn,
} from 'lucide-react'
import type {
  CoursePlayerData,
  Lesson,
  Module,
  VideoLesson,
  SopLesson,
  TextLesson,
  PdfLesson,
  CourseResource,
} from '@/lib/course-player-data'
import {
  getFlatLessons,
  getLessonAt,
  getCoursePlayerData,
} from '@/lib/course-player-data'

const STORAGE_KEY = (courseId: string) => `course-player-${courseId}`

export type SavedProgress = {
  currentIndex: number
  videoWatchPercent: Record<string, number>
  sopStepIndex: Record<string, number>
  notesPerLesson: Record<string, string>
  lowBandwidth: boolean
}

function loadProgress(courseId: string): Partial<SavedProgress> | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY(courseId))
    return raw ? (JSON.parse(raw) as Partial<SavedProgress>) : null
  } catch {
    return null
  }
}

function saveProgress(courseId: string, data: SavedProgress) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY(courseId), JSON.stringify(data))
  } catch {
    // ignore
  }
}

// ----- Need Help dropdown -----
function NeedHelpDropdown({ onClose }: { onClose: () => void }) {
  const links = [
    { href: '/help#video', label: 'Video not playing', icon: Video },
    { href: '/help#download', label: "Can't download", icon: Download },
    { href: '/help#login', label: 'Login issue', icon: LogIn },
  ]
  return (
    <div className="absolute right-0 top-full z-50 mt-1 w-56 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 py-1 shadow-lg">
      <p className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
        Need help?
      </p>
      {links.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          onClick={onClose}
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Icon className="size-4 shrink-0" />
          {label}
        </Link>
      ))}
    </div>
  )
}

// ----- Top bar -----
function TopBar({
  course,
  currentIndex,
  totalLessons,
  onOpenList,
  lowBandwidth,
  onLowBandwidthToggle,
  showHelpDropdown,
  onHelpDropdownToggle,
}: {
  course: CoursePlayerData
  currentIndex: number
  totalLessons: number
  onOpenList: () => void
  lowBandwidth: boolean
  onLowBandwidthToggle: () => void
  showHelpDropdown: boolean
  onHelpDropdownToggle: () => void
}) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-2 border-b border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-3 safe-area-inset-top">
      <div className="flex min-w-0 items-center gap-2">
        <Link
          href="/dashboard/learner/my-learning"
          className="flex shrink-0 items-center justify-center rounded-lg p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Back to My Learning"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
            {course.shortTitle}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Lesson {currentIndex + 1} / {totalLessons}
          </p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={onLowBandwidthToggle}
          className={`flex items-center justify-center rounded-lg p-2 ${lowBandwidth ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
          title={lowBandwidth ? 'Low bandwidth mode on' : 'Low bandwidth mode off'}
          aria-label={lowBandwidth ? 'Low bandwidth on' : 'Low bandwidth off'}
        >
          {lowBandwidth ? <WifiOff className="size-5" /> : <Wifi className="size-5" />}
        </button>
        <button
          type="button"
          onClick={onOpenList}
          className="flex items-center justify-center rounded-lg p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Lesson list"
        >
          <List className="size-5" />
        </button>
        <div className="relative">
          <button
            type="button"
            onClick={onHelpDropdownToggle}
            className="flex items-center justify-center gap-0.5 rounded-lg p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Need help?"
            aria-expanded={showHelpDropdown}
          >
            <HelpCircle className="size-5" />
            <ChevronDown className={`size-4 transition-transform ${showHelpDropdown ? 'rotate-180' : ''}`} />
          </button>
          {showHelpDropdown && (
            <>
              <div className="fixed inset-0 z-40" onClick={onHelpDropdownToggle} aria-hidden />
              <NeedHelpDropdown onClose={onHelpDropdownToggle} />
            </>
          )}
        </div>
      </div>
    </header>
  )
}

// ----- Lesson content by type -----
function VideoLessonView({
  lesson,
  watchPercent,
  onWatchProgress,
  savedLabel,
  lowBandwidth,
}: {
  lesson: VideoLesson
  watchPercent: number
  onWatchProgress: (p: number) => void
  savedLabel?: boolean
  lowBandwidth?: boolean
}) {
  return (
    <div className="space-y-4">
      <div className="aspect-video w-full overflow-hidden rounded-xl bg-gray-900 dark:bg-gray-950">
        <div className="flex h-full items-center justify-center text-gray-500 dark:text-gray-500">
          <div className="text-center">
            <p className="text-sm">Video player</p>
            <p className="mt-1 text-xs">
              {lowBandwidth ? 'Lower quality • saves data' : '(Auto quality • low bandwidth friendly)'}
            </p>
            <button
              type="button"
              onClick={() => onWatchProgress(Math.min(100, watchPercent + 25))}
              className="mt-3 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
            >
              Simulate watch progress ({watchPercent}%)
            </button>
          </div>
        </div>
      </div>
      {savedLabel && (
        <p className="text-xs text-emerald-600 dark:text-emerald-400">Watch progress saved</p>
      )}
      {lesson.keyPoints.length > 0 && (
        <div className="rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 p-3">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Key points</p>
          <ul className="mt-1 space-y-1 text-sm text-gray-700 dark:text-gray-300">
            {lesson.keyPoints.map((p, i) => (
              <li key={i}>• {p}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function SopLessonView({
  lesson,
  currentStep,
  onNextStep,
  lowBandwidth,
}: {
  lesson: SopLesson
  currentStep: number
  onNextStep: () => void
  lowBandwidth?: boolean
}) {
  const step = lesson.steps[currentStep]
  const isLast = currentStep >= lesson.steps.length - 1
  return (
    <div className="space-y-4">
      {lowBandwidth && (
        <p className="text-xs text-amber-600 dark:text-amber-400">Compressed view (low bandwidth)</p>
      )}
      <div className="rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 overflow-hidden">
        <div className={`aspect-4/3 flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 ${lowBandwidth ? 'max-h-48' : ''}`}>
          <span className="text-sm">Step {currentStep + 1} image</span>
        </div>
        <div className="p-4">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Step {currentStep + 1}</p>
          <p className="mt-1 text-base font-medium text-gray-900 dark:text-gray-100">{step.instruction}</p>
        </div>
      </div>
      {!isLast && (
        <button
          type="button"
          onClick={onNextStep}
          className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white hover:bg-primary-hover flex items-center justify-center gap-2"
        >
          Next step <ChevronRight className="size-4" />
        </button>
      )}
      <div className="flex gap-1 justify-center">
        {lesson.steps.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 w-6 rounded-full ${i === currentStep ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`}
            aria-hidden
          />
        ))}
      </div>
    </div>
  )
}

function TextLessonView({ lesson }: { lesson: TextLesson }) {
  return (
    <div className="space-y-4">
      <div className="prose prose-sm dark:prose-invert max-w-none text-gray-900 dark:text-gray-100 text-base leading-relaxed">
        <p className="whitespace-pre-wrap">{lesson.content}</p>
      </div>
      {lesson.keyPoints.length > 0 && (
        <div className="rounded-lg border-2 border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/20 p-4">
          <p className="text-xs font-semibold text-amber-800 dark:text-amber-200 uppercase tracking-wide">Key points</p>
          <ul className="mt-2 space-y-1 text-sm text-amber-900 dark:text-amber-100">
            {lesson.keyPoints.map((p, i) => (
              <li key={i}>• {p}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function PdfLessonView({ lesson }: { lesson: PdfLesson }) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 p-6 text-center">
        <FileText className="mx-auto size-12 text-gray-400 dark:text-gray-500" />
        <p className="mt-2 font-medium text-gray-900 dark:text-gray-100">{lesson.fileName}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">In-app preview when available</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <a
          href={lesson.fileUrl}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white hover:bg-primary-hover"
        >
          Open
        </a>
        <a
          href={lesson.fileUrl}
          download
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <Download className="size-4" /> Download
        </a>
      </div>
    </div>
  )
}

// ----- Resources panel (desktop sidebar / mobile bottom sheet) -----
function ResourcesPanel({
  resources,
  isOpen,
  onClose,
}: {
  resources: CourseResource[]
  isOpen: boolean
  onClose: () => void
}) {
  const jobAids = resources.filter((r) => r.isJobAid)
  const rest = resources.filter((r) => !r.isJobAid)
  if (!isOpen) return null
  return (
    <>
      <div
        className="fixed inset-0 z-30 bg-black/40 md:hidden"
        onClick={onClose}
        aria-hidden
      />
      <aside
        className="fixed bottom-0 left-0 right-0 z-40 max-h-[70vh] overflow-auto rounded-t-2xl border-t border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-lg md:static md:max-h-none md:rounded-none md:border-t-0 md:shadow-none md:w-64 md:shrink-0"
        aria-label="Resources"
      >
        <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-3 md:py-2">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Resources</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 md:hidden"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="p-3 space-y-3">
          {jobAids.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Job Aid / Checklist</p>
              <ul className="space-y-2">
                {jobAids.map((r) => (
                  <li key={r.id}>
                    <a
                      href={r.url}
                      className="flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-600 p-2 text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <FileText className="size-4 shrink-0" />
                      {r.title}
                    </a>
                    <a href={r.url} download className="mt-1 inline-flex items-center gap-1 text-xs text-primary hover:underline">
                      <Download className="size-3" /> Download
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {rest.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Downloads</p>
              <ul className="space-y-2">
                {rest.map((r) => (
                  <li key={r.id}>
                    <a
                      href={r.url}
                      className="flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-600 p-2 text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      {r.type === 'pdf' ? <FileText className="size-4 shrink-0" /> : <ImageIcon className="size-4 shrink-0" />}
                      {r.title}
                    </a>
                    <a href={r.url} download className="mt-1 inline-flex items-center gap-1 text-xs text-primary hover:underline">
                      <Download className="size-3" /> Download
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}

// ----- Lesson list drawer -----
function LessonListDrawer({
  flatLessons,
  currentIndex,
  completedSet,
  isOpen,
  onClose,
  onSelectLesson,
}: {
  flatLessons: { lesson: Lesson; module: Module; globalIndex: number }[]
  currentIndex: number
  completedSet: Set<string>
  isOpen: boolean
  onClose: () => void
  onSelectLesson: (index: number) => void
}) {
  if (!isOpen) return null
  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} aria-hidden />
      <div className="fixed left-0 top-0 bottom-0 z-50 w-full max-w-sm overflow-auto bg-white dark:bg-gray-800 shadow-xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-3">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100">Lessons</h2>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700" aria-label="Close">
            <X className="size-5" />
          </button>
        </div>
        <nav className="p-3">
          {flatLessons.map(({ lesson, module, globalIndex }, i) => {
            const showModule = i === 0 || flatLessons[i - 1].module.title !== module.title
            const isCurrent = globalIndex === currentIndex
            const completed = lesson.completed || completedSet.has(lesson.id)
            return (
              <div key={lesson.id}>
                {showModule && (
                  <p className="mt-3 first:mt-0 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{module.title}</p>
                )}
                <button
                  type="button"
                  onClick={() => { onSelectLesson(globalIndex); onClose() }}
                  className={`mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm ${isCurrent ? 'bg-primary/15 text-primary font-medium' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                >
                  {completed && <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />}
                  <span className="flex-1 truncate">{lesson.title}</span>
                  <ChevronRight className="size-4 shrink-0 text-gray-400" />
                </button>
              </div>
            )
          })}
        </nav>
      </div>
    </>
  )
}

const BADGE_TEASER_AT_COUNT = 3 // e.g. "1 more lesson to get 'Consistency' badge" when next milestone at 3
const COMPLETION_TOAST_MS = 4000

// ----- Main CoursePlayer -----
export default function CoursePlayer({ courseId }: { courseId: string }) {
  const course = getCoursePlayerData(courseId)
  const flatLessons = useMemo(() => (course ? getFlatLessons(course) : []), [course])
  const totalLessons = flatLessons.length

  const savedInitial = useMemo(
    () => (typeof window !== 'undefined' ? loadProgress(courseId) : null),
    [courseId]
  )
  const [currentIndex, setCurrentIndex] = useState(() => savedInitial?.currentIndex ?? 0)
  const [completedSet, setCompletedSet] = useState<Set<string>>(() => new Set())
  const [videoWatchPercent, setVideoWatchPercent] = useState<Record<string, number>>(() => savedInitial?.videoWatchPercent ?? {})
  const [sopStepIndex, setSopStepIndex] = useState<Record<string, number>>(() => savedInitial?.sopStepIndex ?? {})
  const [resourcesOpen, setResourcesOpen] = useState(false)
  const [listDrawerOpen, setListDrawerOpen] = useState(false)
  const [note, setNote] = useState('')
  const [notesPerLesson, setNotesPerLesson] = useState<Record<string, string>>(() => savedInitial?.notesPerLesson ?? {})
  const [lowBandwidth, setLowBandwidth] = useState(() => savedInitial?.lowBandwidth ?? false)
  const [helpDropdownOpen, setHelpDropdownOpen] = useState(false)
  const [completionToast, setCompletionToast] = useState<{ message: string; badgeTeaser?: string } | null>(null)

  // Autosave progress to localStorage
  useEffect(() => {
    if (!course) return
    saveProgress(courseId, {
      currentIndex,
      videoWatchPercent,
      sopStepIndex,
      notesPerLesson,
      lowBandwidth,
    })
  }, [course, courseId, currentIndex, videoWatchPercent, sopStepIndex, notesPerLesson, lowBandwidth])

  const current = course ? getLessonAt(course, Math.min(currentIndex, totalLessons - 1)) : null
  const currentLesson = current?.lesson
  const isVideo = currentLesson?.type === 'video'
  const isSop = currentLesson?.type === 'sop'
  const videoLesson = isVideo ? (currentLesson as VideoLesson) : null
  const sopLesson = isSop ? (currentLesson as SopLesson) : null
  const minWatch = videoLesson?.minWatchPercent ?? 80
  const watchPercent = currentLesson && isVideo ? (videoWatchPercent[currentLesson.id] ?? 0) : 0
  const canMarkComplete = isVideo ? watchPercent >= minWatch : true
  const currentSopStep = currentLesson && isSop ? (sopStepIndex[currentLesson.id] ?? 0) : 0
  const currentNote = currentLesson ? (notesPerLesson[currentLesson.id] ?? note) : note

  const handleMarkComplete = useCallback(() => {
    if (!currentLesson || !canMarkComplete) return
    const newCount = completedSet.size + 1
    const nextMilestone = Math.ceil(newCount / BADGE_TEASER_AT_COUNT) * BADGE_TEASER_AT_COUNT
    const lessonsToBadge = nextMilestone - newCount
    setCompletedSet((prev) => new Set(prev).add(currentLesson.id))
    setCompletionToast({
      message: 'Good job! 1 lesson done today ✅',
      badgeTeaser:
        lessonsToBadge === 1
          ? "1 more lesson to get 'Consistency' badge"
          : lessonsToBadge > 0 && lessonsToBadge <= 2
            ? `${lessonsToBadge} more lessons to get 'Consistency' badge`
            : undefined,
    })
    setTimeout(() => setCompletionToast(null), COMPLETION_TOAST_MS)
    if (currentIndex < totalLessons - 1) setCurrentIndex((i) => i + 1)
  }, [currentLesson, canMarkComplete, completedSet.size, currentIndex, totalLessons])

  const isCompleted = currentLesson ? completedSet.has(currentLesson.id) : false

  if (!course) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center p-4">
        <p className="text-gray-500 dark:text-gray-400">Course not found.</p>
        <Link href="/dashboard/learner/my-learning" className="ml-2 text-primary hover:underline">Back to My Learning</Link>
      </div>
    )
  }

  return (
    <div className="flex min-h-[80vh] flex-col bg-gray-50 dark:bg-gray-900 md:flex-row">
      <TopBar
        course={course}
        currentIndex={currentIndex}
        totalLessons={totalLessons}
        onOpenList={() => setListDrawerOpen(true)}
        lowBandwidth={lowBandwidth}
        onLowBandwidthToggle={() => setLowBandwidth((v) => !v)}
        showHelpDropdown={helpDropdownOpen}
        onHelpDropdownToggle={() => setHelpDropdownOpen((v) => !v)}
      />

      <main className="flex-1 min-h-0 p-4 pb-24 md:pb-6 overflow-y-auto">
        <div className="mx-auto max-w-2xl">
          {!current ? (
            <div className="rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-6 text-center">
              <p className="text-gray-500 dark:text-gray-400">No lessons in this course yet.</p>
              <Link href="/dashboard/learner/my-learning" className="mt-3 inline-block text-sm font-medium text-primary hover:underline">Back to My Learning</Link>
            </div>
          ) : current && (
            <>
              <h1 className="mb-4 text-lg font-bold text-gray-900 dark:text-gray-100 md:text-xl">
                {currentLesson!.title}
              </h1>

              {currentLesson!.type === 'video' && videoLesson && (
                <VideoLessonView
                  lesson={videoLesson}
                  watchPercent={watchPercent}
                  onWatchProgress={(p) => currentLesson && setVideoWatchPercent((prev) => ({ ...prev, [currentLesson.id]: p }))}
                  savedLabel
                  lowBandwidth={lowBandwidth}
                />
              )}
              {currentLesson!.type === 'sop' && sopLesson && (
                <SopLessonView
                  lesson={sopLesson}
                  currentStep={currentSopStep}
                  onNextStep={() => currentLesson && setSopStepIndex((prev) => ({ ...prev, [currentLesson.id]: Math.min((prev[currentLesson.id] ?? 0) + 1, sopLesson.steps.length - 1) }))}
                  lowBandwidth={lowBandwidth}
                />
              )}
              {currentLesson!.type === 'text' && (
                <TextLessonView lesson={currentLesson as TextLesson} />
              )}
              {currentLesson!.type === 'pdf' && (
                <PdfLessonView lesson={currentLesson as PdfLesson} />
              )}

              {/* Notes (optional) */}
              <div className="mt-6">
                <label htmlFor="lesson-note" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Note (optional)
                </label>
                <textarea
                  id="lesson-note"
                  rows={2}
                  value={currentNote}
                  onChange={(e) => {
                    const v = e.target.value
                    setNote(v)
                    if (currentLesson) setNotesPerLesson((prev) => ({ ...prev, [currentLesson.id]: v }))
                  }}
                  placeholder="1–2 lines for this lesson..."
                  className="mt-1 w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Prev / Next */}
              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                  disabled={currentIndex === 0}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <ChevronLeft className="size-5" /> Previous
                </button>
                <button
                  type="button"
                  onClick={() => setListDrawerOpen(true)}
                  className="flex items-center justify-center rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-3 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                  aria-label="Lesson list"
                >
                  <List className="size-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentIndex((i) => Math.min(totalLessons - 1, i + 1))}
                  disabled={currentIndex >= totalLessons - 1}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Next <ChevronRight className="size-5" />
                </button>
              </div>

              {/* Mark complete */}
              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleMarkComplete}
                  disabled={!canMarkComplete || isCompleted}
                  className="w-full rounded-xl bg-primary py-3.5 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
                >
                  {isCompleted ? (
                    <> <CheckCircle2 className="size-5" /> Completed </>

                  ) : (
                    <> <CheckCircle2 className="size-5" /> Mark as complete </>
                  )}
                </button>
                {isVideo && !isCompleted && watchPercent < minWatch && (
                  <p className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
                    Watch at least {minWatch}% to mark complete
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </main>

      {/* Resources: desktop sidebar always visible; mobile = button + sheet */}
      <div className="hidden md:block md:w-64 md:shrink-0 md:border-l md:border-gray-200 md:dark:border-gray-600">
        <ResourcesPanel resources={course.resources} isOpen={true} onClose={() => { }} />
      </div>
      <div className="fixed bottom-4 right-4 z-10 md:hidden">
        <button
          type="button"
          onClick={() => setResourcesOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-lg hover:bg-primary-hover"
        >
          <BookOpen className="size-4" /> Resources
        </button>
      </div>
      {resourcesOpen && (
        <div className="fixed inset-0 z-30 md:hidden">
          <ResourcesPanel resources={course.resources} isOpen={true} onClose={() => setResourcesOpen(false)} />
        </div>
      )}

      <LessonListDrawer
        flatLessons={flatLessons}
        currentIndex={currentIndex}
        completedSet={completedSet}
        isOpen={listDrawerOpen}
        onClose={() => setListDrawerOpen(false)}
        onSelectLesson={setCurrentIndex}
      />

      {/* Completion toast (subtle gamification) */}
      {completionToast && (
        <div className="fixed bottom-20 left-4 right-4 z-50 mx-auto max-w-md rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/30 px-4 py-3 shadow-lg md:bottom-6">
          <p className="font-medium text-emerald-800 dark:text-emerald-200">{completionToast.message}</p>
          {completionToast.badgeTeaser && (
            <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">{completionToast.badgeTeaser}</p>
          )}
        </div>
      )}
    </div>
  )
}
