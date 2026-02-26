/**
 * My Progress (Self Performance Tracking) — summary, course/path progress, score history.
 * Replace with API later.
 */

import { getCompletedAttempts, type CompletedAttempt } from '@/lib/learner-assessments-data'
import { MY_LEARNING_ITEMS } from '@/lib/my-learning-data'
import { LEARNER_DASHBOARD, BADGE_SET, type BadgeId } from '@/lib/learner-dashboard-data'

// --- Summary (Section A) ---
export interface ProgressSummary {
  overallCompletionPercent: number
  completedCoursesCount: number
  inProgressCount: number
  certificatesCount: number
  lessonsThisWeek: number
}

export function getProgressSummary(): ProgressSummary {
  const items = MY_LEARNING_ITEMS
  const courses = items.filter((i) => i.type === 'course')
  const completed = courses.filter((i) => i.status === 'completed').length
  const inProgress = courses.filter((i) => i.status === 'in_progress').length
  const total = courses.length || 1
  const overallPercent = Math.round(
    courses.reduce((sum, c) => sum + c.progress, 0) / total
  )
  return {
    overallCompletionPercent: overallPercent,
    completedCoursesCount: completed,
    inProgressCount: inProgress,
    certificatesCount: LEARNER_DASHBOARD.certificates.total,
    lessonsThisWeek: LEARNER_DASHBOARD.myProgress.lessonsThisWeek,
  }
}

// --- Course Progress (Section B) ---
export interface CourseProgressItem {
  id: string
  title: string
  progress: number
  lessonsDone: number
  lessonsTotal: number
  lastActivityDate: string // e.g. "Feb 24" or "Today"
  lastActivityRaw: string | null
  href: string
  status: 'in_progress' | 'completed' | 'assigned' | 'overdue'
}

function progressToLessons(progress: number, totalDefault = 10): { done: number; total: number } {
  const total = totalDefault
  const done = Math.round((progress / 100) * total)
  return { done: Math.min(done, total), total }
}

export function getCourseProgressList(): CourseProgressItem[] {
  return MY_LEARNING_ITEMS.filter((i) => i.type === 'course').map((item) => {
    const { done, total } = progressToLessons(item.progress)
    const lastActivity = item.lastOpenedAt
      ? formatLastActivity(item.lastOpenedAt)
      : '—'
    return {
      id: item.id,
      title: item.title,
      progress: item.progress,
      lessonsDone: done,
      lessonsTotal: total,
      lastActivityDate: typeof lastActivity === 'string' ? lastActivity : lastActivity.display,
      lastActivityRaw: item.lastOpenedAt,
      href: item.href,
      status: item.status,
    }
  })
}

function formatLastActivity(iso: string): { display: string; sortKey: string } {
  const d = new Date(iso)
  const now = new Date()
  const today = now.toDateString()
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  if (d.toDateString() === today) return { display: 'Today', sortKey: iso }
  if (d.toDateString() === yesterday.toDateString()) return { display: 'Yesterday', sortKey: iso }
  const mon = d.toLocaleDateString('en-US', { month: 'short' })
  const day = d.getDate()
  return { display: `${mon} ${day}`, sortKey: iso }
}

// --- Path Progress (Section C) ---
export interface PathProgressItem {
  id: string
  title: string
  currentStep: number
  totalSteps: number
  nextStepName: string
  bottleneckHint: string | null
  href: string
}

export function getPathProgressList(): PathProgressItem[] {
  const paths = MY_LEARNING_ITEMS.filter((i) => i.type === 'path')
  const totalStepsDefault = 5
  return paths.map((item) => {
    const step = Math.max(1, Math.round((item.progress / 100) * totalStepsDefault) || 0)
    const currentStep = item.status === 'completed' ? totalStepsDefault : Math.min(step, totalStepsDefault)
    return {
      id: item.id,
      title: item.title,
      currentStep,
      totalSteps: totalStepsDefault,
      nextStepName: item.nextStep,
      bottleneckHint: item.status === 'assigned' && item.dueDateRaw ? 'Start soon to meet your deadline' : null,
      href: item.href,
    }
  })
}

// --- Score History (Section D) ---
export interface ScoreHistoryItem {
  quizName: string
  coursePathName: string
  score: number
  passFail: 'pass' | 'fail'
  date: string
  attemptId: string
}

export function getScoreHistory(max = 5): ScoreHistoryItem[] {
  const completed = getCompletedAttempts()
  return completed
    .slice(0, max)
    .map((a: CompletedAttempt) => ({
      quizName: a.quizName,
      coursePathName: a.coursePathName,
      score: a.score,
      passFail: a.passFail,
      date: a.completedAt,
      attemptId: a.attemptId,
    }))
}

// --- Badges (gamification strip) ---
export interface BadgeTeaserProgress {
  badgeId: BadgeId
  badgeLabel: string
  badgeIcon: string
  message: string
}

export function getEarnedBadgesTop3(): Array<{ id: BadgeId; label: string; icon: string }> {
  const earned = LEARNER_DASHBOARD.badgesEarned
  return earned.slice(0, 3).map((id) => {
    const b = BADGE_SET.find((x) => x.id === id)
    return b ? { id: b.id, label: b.label, icon: b.icon } : { id, label: id, icon: '🏅' }
  })
}

export function getNextBadgeTeaser(): BadgeTeaserProgress | null {
  const teaser = LEARNER_DASHBOARD.lockedBadgeTeaser
  if (!teaser) return null
  const b = BADGE_SET.find((x) => x.id === teaser.badgeId)
  return {
    badgeId: teaser.badgeId,
    badgeLabel: b?.label ?? teaser.badgeId,
    badgeIcon: b?.icon ?? '🏅',
    message: teaser.message,
  }
}
