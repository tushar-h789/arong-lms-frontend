'use client'

import React, { useState } from 'react'
import {
  QUIZ_PRESETS,
  FEEDBACK_WHEN_OPTIONS,
  QUIZ_LANGUAGE_MODES,
  DEFAULT_QUIZ_SETTINGS,
  type QuizSettings,
  type BuildMode,
  type FeedbackWhen,
  type QuizLanguageMode,
} from '@/lib/quiz-builder-data'
import { QUESTIONS, TOPIC_LABELS, DIFFICULTY_LABELS, QUESTION_TOPICS, DIFFICULTIES } from '@/lib/question-bank-data'
import { ListPlus, Shuffle, Clock, RotateCcw, Percent, Calendar, MessageSquare, Eye, Lock, Languages } from 'lucide-react'

export function QuizBuilder() {
  const [buildMode, setBuildMode] = useState<BuildMode>('manual')
  const [settings, setSettings] = useState<QuizSettings>({ ...DEFAULT_QUIZ_SETTINGS })
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<Set<string>>(new Set())

  const updateSettings = (patch: Partial<QuizSettings>) => {
    setSettings((s) => ({ ...s, ...patch }))
    if (patch.preset && patch.preset !== 'custom') {
      const preset = QUIZ_PRESETS.find((p) => p.id === patch.preset)
      if (preset) setSettings((s) => ({ ...s, questionCount: preset.questionCount }))
    }
  }

  const toggleQuestion = (id: string) => {
    setSelectedQuestionIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="min-w-0 space-y-4 overflow-x-hidden">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Quiz Builder</h1>
        <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
          Create quiz or test from Question Bank. Set rules, time limit, feedback, and language mode for artisans.
        </p>
      </div>

      {/* Build mode */}
      <section className="rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-4 shadow-sm">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
          <ListPlus className="size-4" />
          Build mode
        </h2>
        <div className="flex flex-wrap gap-4">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name="buildMode"
              checked={buildMode === 'manual'}
              onChange={() => setBuildMode('manual')}
              className="text-primary"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Manual select questions</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name="buildMode"
              checked={buildMode === 'auto'}
              onChange={() => setBuildMode('auto')}
              className="text-primary"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Auto-generate by topic + difficulty</span>
          </label>
        </div>
        {buildMode === 'auto' && (
          <div className="mt-3 flex flex-wrap gap-4">
            <div>
              <span className="text-xs text-gray-500 dark:text-gray-400">Topics</span>
              <div className="mt-1 flex flex-wrap gap-1">
                {QUESTION_TOPICS.map((t) => (
                  <label key={t} className="flex items-center gap-1 rounded border border-gray-300 dark:border-gray-600 px-2 py-1 text-xs text-gray-700 dark:text-gray-300">
                    <input type="checkbox" className="rounded text-primary" />
                    {TOPIC_LABELS[t]}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <span className="text-xs text-gray-500 dark:text-gray-400">Difficulty</span>
              <div className="mt-1 flex flex-wrap gap-1">
                {DIFFICULTIES.map((d) => (
                  <label key={d} className="flex items-center gap-1 rounded border border-gray-300 dark:border-gray-600 px-2 py-1 text-xs text-gray-700 dark:text-gray-300">
                    <input type="checkbox" className="rounded text-primary" />
                    {DIFFICULTY_LABELS[d]}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Preset + question count */}
      <section className="rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">Preset (Aarong)</h2>
        <div className="flex flex-wrap gap-3">
          {QUIZ_PRESETS.map((p) => (
            <label
              key={p.id}
              className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm ${settings.preset === p.id ? 'border-primary bg-primary/5 dark:bg-primary/10 text-primary' : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
            >
              <input
                type="radio"
                name="preset"
                checked={settings.preset === p.id}
                onChange={() => updateSettings({ preset: p.id, questionCount: p.questionCount })}
                className="sr-only"
              />
              {p.label}
            </label>
          ))}
        </div>
        {settings.preset === 'custom' && (
          <div className="mt-3">
            <label className="text-xs text-gray-500 dark:text-gray-400">Number of questions</label>
            <input
              type="number"
              min={1}
              max={50}
              value={settings.questionCount || ''}
              onChange={(e) => updateSettings({ questionCount: Number(e.target.value) || 0 })}
              className="ml-2 w-20 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-2 py-1 text-sm text-gray-900 dark:text-gray-100"
            />
          </div>
        )}
      </section>

      {/* Manual question picker */}
      {buildMode === 'manual' && (
        <section className="rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-4 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">Select questions ({selectedQuestionIds.size} selected)</h2>
          <div className="max-h-48 overflow-y-auto rounded border border-gray-200 dark:border-gray-600">
            <table className="min-w-full text-sm">
              <thead className="sticky top-0 bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="w-8 px-2 py-1.5 text-left text-xs text-gray-500 dark:text-gray-400">Select</th>
                  <th className="px-2 py-1.5 text-left text-xs text-gray-500 dark:text-gray-400">Title</th>
                  <th className="px-2 py-1.5 text-left text-xs text-gray-500 dark:text-gray-400">Type</th>
                  <th className="px-2 py-1.5 text-left text-xs text-gray-500 dark:text-gray-400">Topic</th>
                </tr>
              </thead>
              <tbody>
                {QUESTIONS.filter((q) => !q.deprecated).map((q) => (
                  <tr key={q.id} className="border-t border-gray-100 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-2 py-1.5">
                      <input
                        type="checkbox"
                        checked={selectedQuestionIds.has(q.id)}
                        onChange={() => toggleQuestion(q.id)}
                        className="rounded text-primary"
                      />
                    </td>
                    <td className="px-2 py-1.5 font-medium text-gray-900 dark:text-gray-100">{q.title}</td>
                    <td className="px-2 py-1.5 text-gray-600 dark:text-gray-400">{q.type}</td>
                    <td className="px-2 py-1.5 text-gray-600 dark:text-gray-400">{q.topics.map((t) => TOPIC_LABELS[t]).join(', ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Settings: time, randomize, attempts, pass score, window */}
      <section className="rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-4 shadow-sm">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
          <Clock className="size-4" />
          Settings
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="mb-1 block text-xs text-gray-500 dark:text-gray-400">Time limit (minutes)</label>
            <input
              type="number"
              min={0}
              placeholder="No limit"
              value={settings.timeLimitMinutes ?? ''}
              onChange={(e) => updateSettings({ timeLimitMinutes: e.target.value ? Number(e.target.value) : null })}
              className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-1.5 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-500 dark:text-gray-400">Attempts</label>
            <input
              type="number"
              min={1}
              value={settings.attemptsCount}
              onChange={(e) => updateSettings({ attemptsCount: Number(e.target.value) || 1 })}
              className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-1.5 text-sm text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-500 dark:text-gray-400">Pass score (%)</label>
            <input
              type="number"
              min={0}
              max={100}
              value={settings.passScorePercent}
              onChange={(e) => updateSettings({ passScorePercent: Number(e.target.value) || 0 })}
              className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-1.5 text-sm text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={settings.randomizeQuestions}
              onChange={(e) => updateSettings({ randomizeQuestions: e.target.checked })}
              className="rounded text-primary"
            />
            <Shuffle className="size-4 text-gray-500 dark:text-gray-400" />
            Randomize questions
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={settings.randomizeOptions}
              onChange={(e) => updateSettings({ randomizeOptions: e.target.checked })}
              className="rounded text-primary"
            />
            Randomize options
          </label>
        </div>
        <div className="mt-3 flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="size-4 text-gray-500 dark:text-gray-400" />
            <label className="text-xs text-gray-500 dark:text-gray-400">Open at</label>
            <input
              type="datetime-local"
              value={settings.openAt ?? ''}
              onChange={(e) => updateSettings({ openAt: e.target.value || null })}
              className="rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-2 py-1 text-sm text-gray-900 dark:text-gray-100"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500 dark:text-gray-400">Close at</label>
            <input
              type="datetime-local"
              value={settings.closeAt ?? ''}
              onChange={(e) => updateSettings({ closeAt: e.target.value || null })}
              className="rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-2 py-1 text-sm text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>
      </section>

      {/* Feedback rules */}
      <section className="rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-4 shadow-sm">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
          <MessageSquare className="size-4" />
          Feedback rules
        </h2>
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs text-gray-500 dark:text-gray-400">When to show feedback</label>
            <select
              value={settings.feedbackWhen}
              onChange={(e) => updateSettings({ feedbackWhen: e.target.value as FeedbackWhen })}
              className="w-full max-w-xs rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-1.5 text-sm text-gray-900 dark:text-gray-100"
            >
              {FEEDBACK_WHEN_OPTIONS.map((o) => (
                <option key={o.id} value={o.id}>{o.label}</option>
              ))}
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={settings.showCorrectAnswers}
              onChange={(e) => updateSettings({ showCorrectAnswers: e.target.checked })}
              className="rounded text-primary"
            />
            <Eye className="size-4 text-gray-500 dark:text-gray-400" />
            Show correct answers
          </label>
        </div>
      </section>

      {/* Anti-cheat */}
      <section className="rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-4 shadow-sm">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
          <Lock className="size-4" />
          Anti-cheat (optional)
        </h2>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={settings.oneQuestionAtATime}
              onChange={(e) => updateSettings({ oneQuestionAtATime: e.target.checked })}
              className="rounded text-primary"
            />
            One question at a time
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={settings.disableBackNavigation}
              onChange={(e) => updateSettings({ disableBackNavigation: e.target.checked })}
              className="rounded text-primary"
            />
            Disable back navigation
          </label>
        </div>
      </section>

      {/* Language mode — Aarong: artisan-friendly */}
      <section className="rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-4 shadow-sm">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
          <Languages className="size-4" />
          Language mode (for artisans)
        </h2>
        <select
          value={settings.languageMode}
          onChange={(e) => updateSettings({ languageMode: e.target.value as QuizLanguageMode })}
          className="w-full max-w-xs rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-1.5 text-sm text-gray-900 dark:text-gray-100"
        >
          {QUIZ_LANGUAGE_MODES.map((o) => (
            <option key={o.id} value={o.id}>{o.label}</option>
          ))}
        </select>
      </section>

      <div className="flex gap-2">
        <button type="button" className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
          Save draft
        </button>
        <button type="button" className="rounded-lg border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90">
          Create quiz
        </button>
      </div>
    </div>
  )
}
