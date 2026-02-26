'use client'

import React, { useCallback, useState } from 'react'
import Link from 'next/link'
import {
  ChevronLeft,
  LayoutDashboard,
  ListOrdered,
  Lock,
  UserPlus,
  BarChart3,
  BookOpen,
  Plus,
  Trash2,
} from 'lucide-react'
import {
  defaultOverview,
  defaultSteps,
  defaultUnlock,
  defaultAssignment,
  type OverviewForm,
  type PathStep,
  type UnlockForm,
  type AssignmentForm,
} from '@/lib/path-builder-data'
import { TARGET_CRAFT_LABELS } from '@/lib/paths-data'
import { COURSES } from '@/lib/courses-data'
import { COURSE_TYPE_LABELS } from '@/lib/courses-data'

const TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'steps', label: 'Courses List', icon: ListOrdered },
  { id: 'unlock', label: 'Unlock Rules', icon: Lock },
  { id: 'assignment', label: 'Assignment', icon: UserPlus },
  { id: 'progress', label: 'Progress & Insights', icon: BarChart3 },
] as const

type TabId = (typeof TABS)[number]['id']

export function PathBuilder({ pathId }: { pathId: string | null }) {
  const isNew = pathId === null || pathId === 'new'
  const [activeTab, setActiveTab] = useState<TabId>('overview')
  const [overview, setOverview] = useState<OverviewForm>(defaultOverview)
  const [steps, setSteps] = useState(defaultSteps)
  const [unlock, setUnlock] = useState<UnlockForm>(defaultUnlock)
  const [assignment, setAssignment] = useState<AssignmentForm>(defaultAssignment)

  const mergeOverview = useCallback((patch: Partial<OverviewForm>) => {
    setOverview((prev) => ({ ...prev, ...patch }))
  }, [])
  const mergeUnlock = useCallback((patch: Partial<UnlockForm>) => {
    setUnlock((prev) => ({ ...prev, ...patch }))
  }, [])
  const mergeAssignment = useCallback((patch: Partial<AssignmentForm>) => {
    setAssignment((prev) => ({ ...prev, ...patch }))
  }, [])

  const addStepFromCourse = (courseId: string, title: string) => {
    const id = `step-${Date.now()}`
    setSteps((s) => ({
      ...s,
      steps: [
        ...s.steps,
        { id, order: s.steps.length, title, stepType: 'course' as const, mandatory: true, groupLabel: '', courseId },
      ],
    }))
  }

  const updateStep = (stepId: string, patch: Partial<PathStep>) => {
    setSteps((s) => ({ ...s, steps: s.steps.map((st) => (st.id === stepId ? { ...st, ...patch } : st)) }))
  }

  const removeStep = (stepId: string) => {
    setSteps((s) => {
      const next = s.steps.filter((st) => st.id !== stepId)
      return { ...s, steps: next.map((st, i) => ({ ...st, order: i })) }
    })
  }

  return (
    <div className="min-w-0 space-y-6 overflow-x-hidden">
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/admin/paths"
          className="rounded-lg p-1.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Back"
        >
          <ChevronLeft className="size-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{isNew ? 'Create path' : 'Edit path'}</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Overview, steps, unlock rules, assignment, progress</p>
        </div>
      </div>

      <nav className="-mb-px flex flex-wrap gap-1 border-b border-gray-200 dark:border-gray-600">
        {TABS.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
            >
              <Icon className="size-4" />
              {tab.label}
            </button>
          )
        })}
      </nav>

      <div className="rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-6 shadow-sm">
        {activeTab === 'overview' && <OverviewTab form={overview} onChange={mergeOverview} />}
        {activeTab === 'steps' && (
          <StepsTab steps={steps.steps} onUpdate={updateStep} onRemove={removeStep} onAddFromCourse={addStepFromCourse} />
        )}
        {activeTab === 'unlock' && <UnlockRulesTab form={unlock} onChange={mergeUnlock} steps={steps.steps} />}
        {activeTab === 'assignment' && <AssignmentTab form={assignment} onChange={mergeAssignment} />}
        {activeTab === 'progress' && <ProgressInsightsTab pathId={pathId} pathName={overview.pathName} />}

        <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-gray-200 dark:border-gray-600 pt-6">
          <button
            type="button"
            className="rounded-lg border border-transparent bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-primary/90"
          >
            {isNew ? 'Create path' : 'Save changes'}
          </button>
          <button
            type="button"
            className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            Save draft
          </button>
          <Link
            href="/dashboard/admin/paths"
            className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            Cancel
          </Link>
        </div>
      </div>
    </div>
  )
}

function OverviewTab({ form, onChange }: { form: OverviewForm; onChange: (p: Partial<OverviewForm>) => void }) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Overview</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">Clean metadata so HR/Admin quickly see what each path is.</p>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Path name</label>
        <input
          type="text"
          value={form.pathName}
          onChange={(e) => onChange({ pathName: e.target.value })}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="Path name"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Short description</label>
        <textarea
          value={form.shortDescription}
          onChange={(e) => onChange({ shortDescription: e.target.value })}
          rows={3}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="Brief description"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Target audience</label>
          <select
            value={form.targetAudience}
            onChange={(e) => onChange({ targetAudience: e.target.value as OverviewForm['targetAudience'] })}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="artisan">Artisan</option>
            <option value="staff">Staff</option>
            <option value="trainer">Trainer</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Skill category + level</label>
          <div className="flex gap-2">
            <select
              value={form.skillCategory}
              onChange={(e) => onChange({ skillCategory: e.target.value })}
              className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {Object.entries(TARGET_CRAFT_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
            <select
              value={form.level}
              onChange={(e) => onChange({ level: Number(e.target.value) as 1 | 2 | 3 })}
              className="w-24 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value={1}>Level 1</option>
              <option value={2}>Level 2</option>
              <option value={3}>Level 3</option>
            </select>
          </div>
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Estimated total time (minutes)</label>
        <input
          type="number"
          min={0}
          value={form.estimatedTotalMinutes === '' ? '' : form.estimatedTotalMinutes}
          onChange={(e) => onChange({ estimatedTotalMinutes: e.target.value === '' ? '' : Number(e.target.value) })}
          className="w-full max-w-[140px] rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="e.g. 120"
        />
      </div>
      <label className="flex cursor-pointer items-center gap-2">
        <input
          type="checkbox"
          checked={form.completionCertificate}
          onChange={(e) => onChange({ completionCertificate: e.target.checked })}
          className="rounded border-gray-300 text-primary focus:ring-primary"
        />
        <span className="text-sm text-gray-700 dark:text-gray-300">Completion certificate (optional)</span>
      </label>
    </div>
  )
}

function StepsTab({
  steps,
  onUpdate,
  onRemove,
  onAddFromCourse,
}: {
  steps: PathStep[]
  onUpdate: (id: string, patch: Partial<PathStep>) => void
  onRemove: (id: string) => void
  onAddFromCourse: (courseId: string, title: string) => void
}) {
  const stepsInOrder = [...steps].sort((a, b) => a.order - b.order)
  const courseIdsInPath = new Set(stepsInOrder.map((s) => s.courseId).filter(Boolean))

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Steps (Curriculum)</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Add courses to this path in the order learners should complete them. Select from the full course list below.
        </p>
      </div>

      {/* Current path steps */}
      <div>
        <h3 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">Courses in this path ({stepsInOrder.length})</h3>
        {stepsInOrder.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-800/50 py-8 text-center">
            <BookOpen className="mx-auto size-10 text-gray-400 dark:text-gray-500" />
            <p className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-400">No courses added yet</p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Add courses from the list below to build the curriculum.</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {stepsInOrder.map((step, index) => (
              <li
                key={step.id}
                className="flex items-center gap-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-700/30 px-4 py-3"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {index + 1}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-gray-900 dark:text-gray-100">{step.title}</span>
                <label className="flex shrink-0 items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                  <input
                    type="checkbox"
                    checked={step.mandatory}
                    onChange={(e) => onUpdate(step.id, { mandatory: e.target.checked })}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  Mandatory
                </label>
                <button
                  type="button"
                  onClick={() => onRemove(step.id)}
                  className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                  aria-label="Remove from path"
                >
                  <Trash2 className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Full course list */}
      <div>
        <h3 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">All courses — add to path</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {COURSES.map((course) => {
            const inPath = courseIdsInPath.has(course.id)
            return (
              <div
                key={course.id}
                className="rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-gray-900 dark:text-gray-100">{course.title}</p>
                    <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                      {COURSE_TYPE_LABELS[course.courseType]} · {course.category}
                    </p>
                    <span
                      className={`mt-1.5 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${course.status === 'published'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
                        : course.status === 'draft'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                        }`}
                    >
                      {course.status}
                    </span>
                  </div>
                  <button
                    type="button"
                    disabled={inPath}
                    onClick={() => !inPath && onAddFromCourse(course.id, course.title)}
                    className={`shrink-0 inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${inPath
                      ? 'cursor-not-allowed bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                      : 'bg-primary/10 text-primary hover:bg-primary/20 dark:hover:bg-primary/20'
                      }`}
                  >
                    {inPath ? (
                      'In path'
                    ) : (
                      <>
                        <Plus className="size-3.5" />
                        Add to path
                      </>
                    )}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function UnlockRulesTab({
  form,
  onChange,
  steps,
}: {
  form: UnlockForm
  onChange: (p: Partial<UnlockForm>) => void
  steps: PathStep[]
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Unlock Rules (Sequence Logic)</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Locked sequence (complete step 1 then step 2). Optional steps unlocked anytime. Branching: e.g. If score &lt; 60% → Remedial step. Deadline per step optional.
      </p>
      <label className="flex cursor-pointer items-center gap-2">
        <input
          type="checkbox"
          checked={form.dueDatePerStep}
          onChange={(e) => onChange({ dueDatePerStep: e.target.checked })}
          className="rounded border-gray-300 text-primary focus:ring-primary"
        />
        <span className="text-sm text-gray-700 dark:text-gray-300">Due date per step (optional)</span>
      </label>
      <div className="rounded-lg border border-amber-200 dark:border-amber-700/50 bg-amber-50/50 dark:bg-amber-900/20 p-4">
        <p className="text-sm text-amber-800 dark:text-amber-300">
          Locked sequence: steps are unlocked in order by default. Optional steps can be marked in Steps tab. For branching (e.g. remedial if score &lt; 60%), add rules per step in a future rule editor.
        </p>
      </div>
      {steps.length > 0 && (
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {steps.length} step(s). Sequence order = unlock order unless optional.
        </p>
      )}
    </div>
  )
}

function AssignmentTab({ form, onChange }: { form: AssignmentForm; onChange: (p: Partial<AssignmentForm>) => void }) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Assignment (Deploy Path)</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Assign to individual, center/group/department. Due date, reminders, enrollment window. Aarong: assign by craft, by location cluster.
      </p>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Assign to (e.g. Center, Group, Craft)</label>
        <input
          type="text"
          value={form.targets.map((t) => `${t.type}:${t.value}`).join(', ')}
          onChange={(e) => {
            const pairs = e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
            onChange({
              targets: pairs.map((p) => {
                const [type, value] = p.split(':').map((s) => s?.trim())
                return { type: (type || 'center') as AssignmentForm['targets'][0]['type'], value: value || p }
              }),
            })
          }}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="center:Dhaka HQ, craft:weaving, location_cluster:Rajshahi"
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Assign by craft (weaving/embroidery/dyeing/finishing) or location cluster (e.g. Rajshahi, Jamalpur, Thakurgaon)</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Due date</label>
          <input
            type="date"
            value={form.dueDate}
            onChange={(e) => onChange({ dueDate: e.target.value })}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Reminders</label>
          <input
            type="text"
            value={form.reminders}
            onChange={(e) => onChange({ reminders: e.target.value })}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="e.g. 7 days before, 1 day before"
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Enrollment window start</label>
          <input
            type="datetime-local"
            value={form.enrollmentStart}
            onChange={(e) => onChange({ enrollmentStart: e.target.value })}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Enrollment window end</label>
          <input
            type="datetime-local"
            value={form.enrollmentEnd}
            onChange={(e) => onChange({ enrollmentEnd: e.target.value })}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>
      <label className="flex cursor-pointer items-center gap-2">
        <input
          type="checkbox"
          checked={form.autoAssignOnUserCreation}
          onChange={(e) => onChange({ autoAssignOnUserCreation: e.target.checked })}
          className="rounded border-gray-300 text-primary focus:ring-primary"
        />
        <span className="text-sm text-gray-700 dark:text-gray-300">Auto-assign on user creation (optional)</span>
      </label>
    </div>
  )
}

function ProgressInsightsTab({ pathId, pathName }: { pathId: string | null; pathName: string }) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Progress & Insights (Path Analytics)</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Completion funnel, bottleneck step, avg time per step, center-wise comparison, top/low performers. Essential to see if the path is working.
      </p>
      <div className="rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-700/50 p-6">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {pathName || 'This path'}: full analytics (completion funnel, bottleneck step, center-wise, top/low performers) are available in Reports after the path is saved and has enrollments.
        </p>
        <Link
          href="/dashboard/admin/reports/learning-paths"
          className="mt-4 inline-flex items-center gap-2 rounded-lg border border-primary bg-primary/5 dark:bg-primary/10 px-4 py-2.5 text-sm font-medium text-primary hover:bg-primary/10 dark:hover:bg-primary/20"
        >
          <BarChart3 className="size-4" />
          Open Learning Paths report
        </Link>
      </div>
    </div>
  )
}
