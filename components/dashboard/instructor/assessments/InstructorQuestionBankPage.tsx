'use client'

import React, { useState, useMemo } from 'react'
import {
  getInstructorQuestionBank,
  SCOPE_OPTIONS,
  TOPIC_LABELS,
  CRAFT_LABELS,
  DIFFICULTY_LABELS,
  QUESTION_TYPE_LABELS,
  QUESTION_TYPES,
  QUESTION_TOPICS,
  CRAFT_TAGS,
  DIFFICULTIES,
  type InstructorQuestionItem,
  type QuestionScope,
  type QuestionTopic,
  type CraftTag,
  type Difficulty,
  type QuestionType,
} from '@/lib/instructor-assessments-data'
import { AssessmentsTabs } from './AssessmentsTabs'
import { Search, Plus, CheckCircle2, Clock, Image as ImageIcon, MoreVertical } from 'lucide-react'

export default function InstructorQuestionBankPage() {
  const [scope, setScope] = useState<QuestionScope>('own')
  const [search, setSearch] = useState('')
  const [topicFilter, setTopicFilter] = useState<QuestionTopic | ''>('')
  const [craftFilter, setCraftFilter] = useState<CraftTag | ''>('')
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | ''>('')
  const [typeFilter, setTypeFilter] = useState<QuestionType | ''>('')
  const [showFilters, setShowFilters] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [menuRowId, setMenuRowId] = useState<string | null>(null)

  const list = useMemo(
    () =>
      getInstructorQuestionBank({
        scope,
        search,
        topic: topicFilter,
        craft: craftFilter,
        difficulty: difficultyFilter,
        type: typeFilter,
      }),
    [scope, search, topicFilter, craftFilter, difficultyFilter, typeFilter]
  )

  const activeFilterCount = [topicFilter, craftFilter, difficultyFilter, typeFilter].filter(Boolean).length

  return (
    <div className="min-w-0 space-y-4 overflow-x-hidden">
      <AssessmentsTabs />
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Question Bank</h1>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
            Create and manage questions (MCQ, True/False, Short, Image-based MCQ). Use own or approved global questions. Submit for approval for standardization.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-transparent bg-primary px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90"
        >
          <Plus className="size-4" />
          Add question
        </button>
      </div>

      {/* Scope: Own | Global */}
      <div className="flex gap-1 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-1">
        {SCOPE_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => setScope(opt.id)}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              scope === opt.id
                ? 'bg-primary text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Search + filters */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-3 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <input
              type="search"
              placeholder="Search by title or body..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-1.5 pl-9 pr-3 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`rounded-lg border px-3 py-1.5 text-sm font-medium ${
              showFilters || activeFilterCount > 0
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </button>
        </div>
        {showFilters && (
          <div className="mt-3 grid gap-2 border-t border-gray-200 dark:border-gray-600 pt-3 sm:grid-cols-2 lg:grid-cols-4">
            <FilterSelect
              label="Topic"
              value={topicFilter}
              options={['', ...QUESTION_TOPICS]}
              labels={['All', ...QUESTION_TOPICS.map((t) => TOPIC_LABELS[t])]}
              onChange={(v) => setTopicFilter((v || '') as QuestionTopic | '')}
            />
            <FilterSelect
              label="Craft"
              value={craftFilter}
              options={['', ...CRAFT_TAGS]}
              labels={['All', ...CRAFT_TAGS.map((c) => CRAFT_LABELS[c])]}
              onChange={(v) => setCraftFilter((v || '') as CraftTag | '')}
            />
            <FilterSelect
              label="Difficulty"
              value={difficultyFilter}
              options={['', ...DIFFICULTIES]}
              labels={['All', ...DIFFICULTIES.map((d) => DIFFICULTY_LABELS[d])]}
              onChange={(v) => setDifficultyFilter((v || '') as Difficulty | '')}
            />
            <FilterSelect
              label="Type"
              value={typeFilter}
              options={['', ...QUESTION_TYPES]}
              labels={['All', ...QUESTION_TYPES.map((t) => QUESTION_TYPE_LABELS[t])]}
              onChange={(v) => setTypeFilter((v || '') as QuestionType | '')}
            />
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50">
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Question</th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Type</th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Topics / Craft</th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Difficulty</th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Status</th>
                <th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {list.map((q) => (
                <QuestionRowComponent
                  key={q.id}
                  question={q}
                  menuOpen={menuRowId === q.id}
                  onToggleMenu={() => setMenuRowId(menuRowId === q.id ? null : q.id)}
                />
              ))}
            </tbody>
          </table>
        </div>
        {list.length === 0 && (
          <div className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">No questions match your filters.</div>
        )}
      </div>

      {addOpen && (
        <div className="rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Add question</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            MCQ, True/False, Short Answer, Image-based MCQ (SOP). Tags: Safety, Quality, SOP, Craft. Optional: Submit for approval.
          </p>
          <div className="mt-4 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
              <select className="w-full max-w-xs rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100">
                {QUESTION_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {QUESTION_TYPE_LABELS[t]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
              <input
                type="text"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                placeholder="Question title"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Body (English)</label>
              <textarea
                rows={2}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                placeholder="Question text"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Image URL (for Image-based MCQ — SOP)</label>
              <input
                type="text"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                placeholder="/assets/... or URL"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Topics:</span>
              {QUESTION_TOPICS.map((t) => (
                <label
                  key={t}
                  className="flex cursor-pointer items-center gap-1 rounded border border-gray-300 dark:border-gray-600 px-2 py-1 text-sm text-gray-700 dark:text-gray-300"
                >
                  <input type="checkbox" className="rounded text-primary" />
                  {TOPIC_LABELS[t]}
                </label>
              ))}
            </div>
            <div className="flex gap-4">
              <select className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100">
                <option value="">Craft</option>
                {CRAFT_TAGS.map((c) => (
                  <option key={c} value={c}>
                    {CRAFT_LABELS[c]}
                  </option>
                ))}
              </select>
              <select className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100">
                {DIFFICULTIES.map((d) => (
                  <option key={d} value={d}>
                    {DIFFICULTY_LABELS[d]}
                  </option>
                ))}
              </select>
            </div>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <input type="checkbox" className="rounded text-primary" />
              Submit for approval (optional)
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setAddOpen(false)}
                className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button type="button" className="rounded-lg border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90">
                Save question
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function FilterSelect({
  label,
  value,
  options,
  labels,
  onChange,
}: {
  label: string
  value: string
  options: string[]
  labels: string[]
  onChange: (v: string) => void
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      >
        {options.map((o, i) => (
          <option key={o || '_'} value={o}>
            {labels[i] ?? 'All'}
          </option>
        ))}
      </select>
    </div>
  )
}

function QuestionRowComponent({
  question,
  menuOpen,
  onToggleMenu,
}: {
  question: InstructorQuestionItem
  menuOpen: boolean
  onToggleMenu: () => void
}) {
  const showBodyBn = question.bodyBn && question.bodyBn !== question.body
  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
      <td className="px-3 py-2">
        <div className="flex items-center gap-2">
          {question.type === 'image_mcq' && question.imageUrl && (
            <div
              className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700"
              title="Image-based question"
            >
              <ImageIcon className="size-4 text-gray-400 dark:text-gray-500" aria-hidden />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <span className="font-medium text-gray-900 dark:text-gray-100">{question.title}</span>
            <p className="line-clamp-1 text-sm text-gray-600 dark:text-gray-400">{question.body}</p>
            {showBodyBn && <p className="line-clamp-1 text-xs text-gray-500 dark:text-gray-400">{question.bodyBn}</p>}
          </div>
        </div>
      </td>
      <td className="px-3 py-2">
        <span className="inline-flex items-center gap-1 rounded bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary">
          {question.type === 'image_mcq' && <ImageIcon className="size-3" />}
          {QUESTION_TYPE_LABELS[question.type]}
        </span>
      </td>
      <td className="px-3 py-2">
        <div className="flex flex-wrap gap-1">
          {question.topics.map((t) => (
            <span key={t} className="rounded bg-gray-100 dark:bg-gray-600 px-1.5 py-0.5 text-xs text-gray-700 dark:text-gray-300">
              {TOPIC_LABELS[t]}
            </span>
          ))}
          <span className="rounded bg-slate-100 dark:bg-slate-600/50 px-1.5 py-0.5 text-xs text-slate-700 dark:text-slate-300">
            {CRAFT_LABELS[question.craft]}
          </span>
        </div>
      </td>
      <td className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400">{DIFFICULTY_LABELS[question.difficulty]}</td>
      <td className="px-3 py-2">
        {question.approved ? (
          <span className="inline-flex items-center gap-1 rounded bg-emerald-100 dark:bg-emerald-900/30 px-1.5 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="size-3.5" /> Approved
          </span>
        ) : question.approvalStatus === 'pending' ? (
          <span className="inline-flex items-center gap-1 rounded bg-amber-100 dark:bg-amber-900/30 px-1.5 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-400">
            <Clock className="size-3.5" /> Pending
          </span>
        ) : (
          <span className="text-xs text-gray-500 dark:text-gray-400">Draft</span>
        )}
      </td>
      <td className="relative px-3 py-2 text-right">
        <div className="relative flex justify-end">
          <button
            type="button"
            onClick={onToggleMenu}
            className="rounded p-1 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600"
            aria-expanded={menuOpen}
          >
            <MoreVertical className="size-4" />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" aria-hidden onClick={onToggleMenu} />
              <div className="absolute right-0 top-full z-20 mt-1 w-48 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 py-1 shadow-lg">
                <button
                  type="button"
                  className="block w-full px-3 py-1.5 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Edit
                </button>
                {!question.approved && question.scope === 'own' && (
                  <button
                    type="button"
                    className="block w-full px-3 py-1.5 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Submit for approval
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </td>
    </tr>
  )
}
