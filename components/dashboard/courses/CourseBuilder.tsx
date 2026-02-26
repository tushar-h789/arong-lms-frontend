'use client'

import React, { useState, useCallback } from 'react'
import Link from 'next/link'
import {
  ChevronLeft,
  LayoutDashboard,
  ListOrdered,
  FileText,
  ClipboardCheck,
  Settings,
  Send,
  Image as ImageIcon,
  Mic,
  FileDown,
  GripVertical,
  Plus,
  Trash2,
} from 'lucide-react'
import { COURSE_TYPE_LABELS, type CourseType } from '@/lib/courses-data'
import {
  createDefaultBuilderState,
  defaultLessonContent,
  AUDIENCE_OPTIONS,
  SKILL_CATEGORY_OPTIONS,
  DIFFICULTY_OPTIONS,
  type CourseBuilderState,
  type OverviewForm,
  type CurriculumModule,
  type CurriculumLesson,
  type LessonContentForm,
  type AssessmentsForm,
  type RulesForm,
  type PublishForm,
} from '@/lib/course-builder-data'

const TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'curriculum', label: 'Curriculum', icon: ListOrdered },
  { id: 'lesson', label: 'Lesson Editor', icon: FileText },
  { id: 'assessments', label: 'Assessments', icon: ClipboardCheck },
  { id: 'rules', label: 'Rules', icon: Settings },
  { id: 'publish', label: 'Publish', icon: Send },
] as const

type TabId = (typeof TABS)[number]['id']

export function CourseBuilder({ courseId }: { courseId: string | null }) {
  const isNew = courseId === null || courseId === 'new'
  const [activeTab, setActiveTab] = useState<TabId>('overview')
  const [state, setState] = useState<CourseBuilderState>(createDefaultBuilderState())
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null)

  const updateOverview = useCallback((patch: Partial<OverviewForm>) => {
    setState((s) => ({ ...s, overview: { ...s.overview, ...patch } }))
  }, [])
  const updateCurriculum = useCallback((patch: Partial<CourseBuilderState['curriculum']>) => {
    setState((s) => ({ ...s, curriculum: { ...s.curriculum, ...patch } }))
  }, [])
  const updateLessonContent = useCallback((lessonId: string, patch: Partial<LessonContentForm>) => {
    setState((s) => ({
      ...s,
      lessonContents: {
        ...s.lessonContents,
        [lessonId]: { ...defaultLessonContent, ...s.lessonContents[lessonId], ...patch },
      },
    }))
  }, [])
  const updateAssessments = useCallback((patch: Partial<AssessmentsForm>) => {
    setState((s) => ({ ...s, assessments: { ...s.assessments, ...patch } }))
  }, [])
  const updateRules = useCallback((patch: Partial<RulesForm>) => {
    setState((s) => ({ ...s, rules: { ...s.rules, ...patch } }))
  }, [])
  const updatePublish = useCallback((patch: Partial<PublishForm>) => {
    setState((s) => ({ ...s, publish: { ...s.publish, ...patch } }))
  }, [])

  const allLessons = state.curriculum.modules.flatMap((m) => m.lessons)
  const selectedLesson = selectedLessonId ? allLessons.find((l) => l.id === selectedLessonId) : null
  const lessonContent = selectedLessonId ? state.lessonContents[selectedLessonId] ?? defaultLessonContent : null

  return (
    <div className="min-w-0 space-y-6 overflow-x-hidden">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            href={isNew ? '/dashboard/admin/courses' : `/dashboard/admin/courses/${courseId}`}
            className="rounded-lg p-1.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200"
            aria-label="Back"
          >
            <ChevronLeft className="size-5" />
          </Link>
          <div>
            <h1 className="wrap-break-word text-2xl font-bold text-gray-900 dark:text-gray-100">
              {isNew ? 'Create course' : 'Edit course'}
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Overview, curriculum, lessons, assessments, rules, publish
            </p>
          </div>
        </div>
      </div>

      {/* Tab list */}
      <div className="border-b border-gray-200 dark:border-gray-600">
        <nav className="-mb-px flex flex-wrap gap-1 overflow-x-auto" aria-label="Tabs">
          {TABS.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
              >
                <Icon className="size-4" />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab panels */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-6 shadow-sm">
        {activeTab === 'overview' && (
          <OverviewTab form={state.overview} onChange={updateOverview} />
        )}
        {activeTab === 'curriculum' && (
          <CurriculumTab
            modules={state.curriculum.modules}
            onChange={updateCurriculum}
            onSelectLesson={setSelectedLessonId}
            selectedLessonId={selectedLessonId}
          />
        )}
        {activeTab === 'lesson' && (
          <LessonEditorTab
            allLessons={allLessons}
            selectedLessonId={selectedLessonId}
            onSelectLesson={setSelectedLessonId}
            content={lessonContent}
            onUpdate={selectedLessonId ? (patch) => updateLessonContent(selectedLessonId, patch) : undefined}
          />
        )}
        {activeTab === 'assessments' && (
          <AssessmentsTab form={state.assessments} onChange={updateAssessments} />
        )}
        {activeTab === 'rules' && (
          <RulesTab form={state.rules} onChange={updateRules} />
        )}
        {activeTab === 'publish' && (
          <PublishTab form={state.publish} onChange={updatePublish} isNew={isNew} />
        )}
      </div>
    </div>
  )
}

function OverviewTab({
  form,
  onChange,
}: {
  form: OverviewForm
  onChange: (patch: Partial<OverviewForm>) => void
}) {
  const toggleTag = (tag: CourseType) => {
    const next = form.tags.includes(tag) ? form.tags.filter((t) => t !== tag) : [...form.tags, tag]
    onChange({ tags: next })
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Overview</h2>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => onChange({ title: e.target.value })}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="Course title"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Short description</label>
        <textarea
          value={form.shortDescriptionBn}
          onChange={(e) => onChange({ shortDescriptionBn: e.target.value })}
          rows={3}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="Short description"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Thumbnail</label>
        <input
          type="url"
          value={form.thumbnailUrl}
          onChange={(e) => onChange({ thumbnailUrl: e.target.value })}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="Image URL"
        />
        {form.thumbnailUrl && (
          <div className="mt-2 aspect-video max-w-xs overflow-hidden rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
            <img src={form.thumbnailUrl} alt="Thumbnail" className="h-full w-full object-cover" />
          </div>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Tags (SOP / Quality / Safety)</label>
        <div className="flex flex-wrap gap-2">
          {(Object.entries(COURSE_TYPE_LABELS) as [CourseType, string][]).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => toggleTag(value)}
              className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${form.tags.includes(value)
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Audience type</label>
        <select
          value={form.audienceType}
          onChange={(e) => onChange({ audienceType: e.target.value as OverviewForm['audienceType'] })}
          className="w-full max-w-xs rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        >
          {AUDIENCE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Skill category</label>
          <select
            value={form.skillCategory}
            onChange={(e) => onChange({ skillCategory: e.target.value as OverviewForm['skillCategory'] })}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {SKILL_CATEGORY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Weaving / Embroidery / Dyeing / Finishing</p>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Difficulty level</label>
          <select
            value={form.difficultyLevel}
            onChange={(e) => onChange({ difficultyLevel: e.target.value as OverviewForm['difficultyLevel'] })}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {DIFFICULTY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Estimated time (minutes)</label>
        <input
          type="number"
          min={1}
          value={form.estimatedMinutes === '' ? '' : form.estimatedMinutes}
          onChange={(e) => onChange({ estimatedMinutes: e.target.value === '' ? '' : Number(e.target.value) })}
          className="w-full max-w-[140px] rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="e.g. 45"
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Helpful for artisans — estimated time</p>
      </div>
    </div>
  )
}

function CurriculumTab({
  modules,
  onChange,
  onSelectLesson,
  selectedLessonId,
}: {
  modules: CurriculumModule[]
  onChange: (patch: { modules: CurriculumModule[] }) => void
  onSelectLesson: (id: string | null) => void
  selectedLessonId: string | null
}) {
  const addModule = () => {
    const id = `mod-${Date.now()}`
    onChange({
      modules: [...modules, { id, title: 'New module', order: modules.length, lessons: [] }],
    })
  }

  const updateModule = (moduleId: string, patch: Partial<CurriculumModule>) => {
    onChange({
      modules: modules.map((m) => (m.id === moduleId ? { ...m, ...patch } : m)),
    })
  }

  const removeModule = (moduleId: string) => {
    onChange({ modules: modules.filter((m) => m.id !== moduleId) })
    if (selectedLessonId && modules.some((m) => m.lessons.some((l) => l.id === selectedLessonId))) {
      const mod = modules.find((m) => m.id === moduleId)
      if (mod?.lessons.some((l) => l.id === selectedLessonId)) onSelectLesson(null)
    }
  }

  const addLesson = (moduleId: string) => {
    const mod = modules.find((m) => m.id === moduleId)
    if (!mod) return
    const id = `les-${Date.now()}`
    const newLesson: CurriculumLesson = {
      id,
      title: 'New lesson',
      order: mod.lessons.length,
      required: true,
      isMicroLesson: false,
      durationMinutes: 2,
    }
    updateModule(moduleId, {
      lessons: [...mod.lessons, newLesson],
    })
  }

  const updateLesson = (moduleId: string, lessonId: string, patch: Partial<CurriculumLesson>) => {
    const mod = modules.find((m) => m.id === moduleId)
    if (!mod) return
    updateModule(moduleId, {
      lessons: mod.lessons.map((l) => (l.id === lessonId ? { ...l, ...patch } : l)),
    })
  }

  const removeLesson = (moduleId: string, lessonId: string) => {
    const mod = modules.find((m) => m.id === moduleId)
    if (!mod) return
    updateModule(moduleId, { lessons: mod.lessons.filter((l) => l.id !== lessonId) })
    if (selectedLessonId === lessonId) onSelectLesson(null)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Curriculum (Modules & Lessons)</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">Drag-drop order, required vs optional, micro-lessons (1–3 min) — best for artisans.</p>

      <div className="space-y-4">
        {modules.map((mod) => (
          <div
            key={mod.id}
            className="rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-700/30 p-4"
          >
            <div className="flex items-center gap-2">
              <GripVertical className="size-4 text-gray-400 dark:text-gray-500" aria-hidden />
              <input
                type="text"
                value={mod.title}
                onChange={(e) => updateModule(mod.id, { title: e.target.value })}
                className="flex-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm font-medium text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Module title"
              />
              <button
                type="button"
                onClick={() => removeModule(mod.id)}
                className="rounded p-1.5 text-gray-400 dark:text-gray-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"
                aria-label="Remove module"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
            <ul className="mt-3 space-y-2 pl-6">
              {mod.lessons
                .sort((a, b) => a.order - b.order)
                .map((les) => (
                  <li key={les.id} className="flex flex-wrap items-center gap-2 rounded border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700/50 p-2">
                    <GripVertical className="size-4 shrink-0 text-gray-400 dark:text-gray-500" aria-hidden />
                    <input
                      type="text"
                      value={les.title}
                      onChange={(e) => updateLesson(mod.id, les.id, { title: e.target.value })}
                      className="min-w-[120px] flex-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-2 py-1.5 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="Lesson title"
                    />
                    <label className="flex items-center gap-1.5 text-xs text-gray-700 dark:text-gray-300">
                      <input
                        type="checkbox"
                        checked={les.required}
                        onChange={(e) => updateLesson(mod.id, les.id, { required: e.target.checked })}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      Required
                    </label>
                    <label className="flex items-center gap-1.5 text-xs text-gray-700 dark:text-gray-300" title="Micro-lesson (1–3 min)">
                      <input
                        type="checkbox"
                        checked={les.isMicroLesson}
                        onChange={(e) => updateLesson(mod.id, les.id, { isMicroLesson: e.target.checked })}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      Micro (1–3 min)
                    </label>
                    {les.isMicroLesson && (
                      <input
                        type="number"
                        min={1}
                        max={3}
                        value={les.durationMinutes}
                        onChange={(e) => updateLesson(mod.id, les.id, { durationMinutes: Number(e.target.value) })}
                        className="w-14 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-2 py-1 text-xs text-gray-900 dark:text-gray-100"
                        title="Duration (minutes)"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => onSelectLesson(les.id)}
                      className="rounded px-2 py-1 text-xs text-primary hover:bg-primary/10"
                    >
                      Edit content
                    </button>
                    <button
                      type="button"
                      onClick={() => removeLesson(mod.id, les.id)}
                      className="rounded p-1 text-gray-400 dark:text-gray-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"
                      aria-label="Remove lesson"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </li>
                ))}
            </ul>
            <button
              type="button"
              onClick={() => addLesson(mod.id)}
              className="mt-2 flex items-center gap-1.5 rounded border border-dashed border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <Plus className="size-4" />
              Add lesson
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addModule}
          className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 py-4 text-sm font-medium text-gray-600 dark:text-gray-400 hover:border-primary hover:bg-primary/5 hover:text-primary"
        >
          <Plus className="size-4" />
          Add module
        </button>
      </div>
    </div>
  )
}

function LessonEditorTab({
  allLessons,
  selectedLessonId,
  onSelectLesson,
  content,
  onUpdate,
}: {
  allLessons: CurriculumLesson[]
  selectedLessonId: string | null
  onSelectLesson: (id: string | null) => void
  content: LessonContentForm | null
  onUpdate: ((patch: Partial<LessonContentForm>) => void) | undefined
}) {
  if (allLessons.length === 0) {
    return (
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Add modules and lessons in the Curriculum tab first, then select a lesson to edit its content here.
      </p>
    )
  }
  if (!selectedLessonId || !content || !onUpdate) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">Select a lesson to edit content (text, assets, SOP steps, voice-over, job-aid).</p>
        <ul className="space-y-2">
          {allLessons.map((les) => (
            <li key={les.id}>
              <button
                type="button"
                onClick={() => onSelectLesson(les.id)}
                className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                {les.title}
              </button>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Lesson content</h2>
        <select
          value={selectedLessonId}
          onChange={(e) => onSelectLesson(e.target.value || null)}
          className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        >
          {allLessons.map((l) => (
            <option key={l.id} value={l.id}>{l.title}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Video / PDF / PPT / Image upload (URLs)</label>
        <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Add asset URLs; step-by-step images below for SOP style.</p>
        <textarea
          value={content.assets.map((a) => a.url).join('\n')}
          onChange={(e) =>
            onUpdate({
              assets: e.target.value
                .split('\n')
                .filter(Boolean)
                .map((url, i) => ({ id: `a-${i}`, type: 'video' as const, url, name: '' })),
            })
          }
          rows={3}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="One URL per line"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Resource links</label>
        <input
          type="text"
          value={content.resourceLinks.map((l) => `${l.label}|${l.url}`).join(', ')}
          onChange={(e) => {
            const pairs = e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
            onUpdate({
              resourceLinks: pairs.map((p) => {
                const [label, url] = p.split('|')
                return { label: label?.trim() || 'Link', url: url?.trim() || p }
              }),
            })
          }}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="Label | URL, Label | URL"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Notes / Key points</label>
        <textarea
          value={content.notesKeyPoints}
          onChange={(e) => onUpdate({ notesKeyPoints: e.target.value })}
          rows={4}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="Key points for this lesson"
        />
      </div>

      <div className="rounded-lg border border-primary/30 dark:border-primary/40 bg-primary/5 dark:bg-primary/10 p-4">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
          <ImageIcon className="size-4 text-primary" />
          Step-by-step image lesson (SOP style)
        </h3>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">One image URL per line for artisan-friendly SOP.</p>
        <textarea
          value={content.stepByStepImageUrls.join('\n')}
          onChange={(e) => onUpdate({ stepByStepImageUrls: e.target.value.split('\n').filter(Boolean) })}
          rows={3}
          className="mt-2 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="Image URL per step (one per line)"
        />
      </div>

      <div>
        <label className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          <Mic className="size-4 text-primary" />
          Voice-over / audio note (e.g. voice guidance)
        </label>
        <input
          type="url"
          value={content.voiceOverUrl}
          onChange={(e) => onUpdate({ voiceOverUrl: e.target.value })}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="Audio URL for voice guidance"
        />
      </div>

      <div>
        <label className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          <FileDown className="size-4 text-primary" />
          Downloadable job-aid (1-page PDF) — checklist / to-do
        </label>
        <input
          type="url"
          value={content.jobAidPdfUrl}
          onChange={(e) => onUpdate({ jobAidPdfUrl: e.target.value })}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="PDF URL for checklist / to-do"
        />
      </div>
    </div>
  )
}

function AssessmentsTab({ form, onChange }: { form: AssessmentsForm; onChange: (patch: Partial<AssessmentsForm>) => void }) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Assessments</h2>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Attach quiz (ID or link)</label>
        <input
          type="text"
          value={form.quizId}
          onChange={(e) => onChange({ quizId: e.target.value })}
          className="w-full max-w-md rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="Quiz ID or URL"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Pass marks (%)</label>
          <input
            type="number"
            min={0}
            max={100}
            value={form.passMarks}
            onChange={(e) => onChange({ passMarks: Number(e.target.value) })}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Attempts</label>
          <input
            type="number"
            min={1}
            value={form.maxAttempts}
            onChange={(e) => onChange({ maxAttempts: Number(e.target.value) })}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Feedback rules</label>
        <textarea
          value={form.feedbackRules}
          onChange={(e) => onChange({ feedbackRules: e.target.value })}
          rows={3}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="When to show feedback, per attempt, etc."
        />
      </div>

      <div className="rounded-lg border border-amber-200 dark:border-amber-700/50 bg-amber-50/50 dark:bg-amber-900/20 p-4">
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={form.practicalChecklistEvaluation}
            onChange={(e) => onChange({ practicalChecklistEvaluation: e.target.checked })}
            className="rounded border-gray-300 dark:border-gray-500 text-primary focus:ring-primary"
          />
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Practical checklist evaluation (Trainer tick-box)</span>
        </label>
        <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">Optional but great for hands-on assessment by trainer.</p>
      </div>
    </div>
  )
}

function RulesTab({ form, onChange }: { form: RulesForm; onChange: (patch: Partial<RulesForm>) => void }) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Rules</h2>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Completion criteria</label>
        <textarea
          value={form.completionCriteria}
          onChange={(e) => onChange({ completionCriteria: e.target.value })}
          rows={2}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="What counts as completed"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Prerequisites (course IDs)</label>
        <input
          type="text"
          value={form.prerequisiteCourseIds.join(', ')}
          onChange={(e) =>
            onChange({
              prerequisiteCourseIds: e.target.value
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean),
            })
          }
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="c1, c2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Attempts & retake policy</label>
        <textarea
          value={form.retakePolicy}
          onChange={(e) => onChange({ retakePolicy: e.target.value })}
          rows={2}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="Retake rules"
        />
      </div>

      <div className="space-y-4 rounded-lg border border-primary/30 dark:border-primary/40 bg-primary/5 dark:bg-primary/10 p-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Aarong reality</h3>
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={form.attendanceRequired}
            onChange={(e) => onChange({ attendanceRequired: e.target.checked })}
            className="rounded border-gray-300 dark:border-gray-500 text-primary focus:ring-primary"
          />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Attendance required</span>
        </label>
        <p className="text-xs text-gray-600 dark:text-gray-400">If physical/live class attendance is mandatory</p>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Minimum watch % (video)</label>
          <input
            type="number"
            min={0}
            max={100}
            value={form.minimumWatchPercent}
            onChange={(e) => onChange({ minimumWatchPercent: Number(e.target.value) })}
            className="w-full max-w-[120px] rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">Course not complete until video is fully watched</p>
        </div>
      </div>
    </div>
  )
}

function PublishTab({
  form,
  onChange,
  isNew,
}: {
  form: PublishForm
  onChange: (patch: Partial<PublishForm>) => void
  isNew: boolean
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Publish</h2>

      <div>
        <button
          type="button"
          className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
        >
          Preview
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Schedule start</label>
          <input
            type="datetime-local"
            value={form.scheduleStart ? form.scheduleStart.slice(0, 16) : ''}
            onChange={(e) => onChange({ scheduleStart: e.target.value ? new Date(e.target.value).toISOString() : '' })}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Schedule end</label>
          <input
            type="datetime-local"
            value={form.scheduleEnd ? form.scheduleEnd.slice(0, 16) : ''}
            onChange={(e) => onChange({ scheduleEnd: e.target.value ? new Date(e.target.value).toISOString() : '' })}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Publish permissions</label>
        <input
          type="text"
          value={form.publishPermissions}
          onChange={(e) => onChange({ publishPermissions: e.target.value })}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="Who can publish / approve"
        />
      </div>

      <div className="rounded-lg border border-amber-200 dark:border-amber-700/50 bg-amber-50/50 dark:bg-amber-900/20 p-4">
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Version note (What changed)</label>
        <textarea
          value={form.versionNote}
          onChange={(e) => onChange({ versionNote: e.target.value })}
          rows={3}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="What changed (so old learners are not confused)"
        />
        <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">When SOP changes, old learners will not be confused</p>
      </div>

      <div className="flex gap-2 border-t border-gray-200 dark:border-gray-600 pt-4">
        <button
          type="button"
          className="rounded-lg border border-transparent bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary/90"
        >
          {isNew ? 'Create & save draft' : 'Save changes'}
        </button>
        <button
          type="button"
          className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
        >
          Publish
        </button>
      </div>
    </div>
  )
}
