'use client'

import React, { useState, useMemo } from 'react'
import { USERS, type UserRow } from '@/lib/users-data'
import { COURSES } from '@/lib/courses-data'
import { PATHS } from '@/lib/paths-data'
import {
  TARGET_TYPE_LABELS,
  CRAFT_OPTIONS,
  ROLE_OPTIONS,
  CENTER_OPTIONS,
  GROUP_OPTIONS,
  MOCK_ALREADY_ASSIGNED,
  type AssignTargetType,
  type AssignContentType,
  type ReminderDays,
} from '@/lib/assign-training-data'
import { Users, Calendar, Bell, FileText, Shield, Eye, AlertTriangle, CheckCircle } from 'lucide-react'

const REMINDER_OPTIONS: ReminderDays[] = [7, 3, 1]

export function AssignTraining() {
  const [contentType, setContentType] = useState<AssignContentType>('course')
  const [contentId, setContentId] = useState('')
  const [targetType, setTargetType] = useState<AssignTargetType>('center')
  const [targetValue, setTargetValue] = useState('')
  const [individualUserIds, setIndividualUserIds] = useState<string[]>([])
  const [dueDate, setDueDate] = useState('')
  const [reminderDays, setReminderDays] = useState<ReminderDays[]>([])
  const [enrollmentStart, setEnrollmentStart] = useState('')
  const [enrollmentEnd, setEnrollmentEnd] = useState('')
  const [mandatory, setMandatory] = useState(true)
  const [notesInstructions, setNotesInstructions] = useState('')
  const [completionCriteriaOverride, setCompletionCriteriaOverride] = useState('')
  const [minimumScoreRequired, setMinimumScoreRequired] = useState(70)
  const [attendanceRequired, setAttendanceRequired] = useState(false)
  const [watchPercentRequired, setWatchPercentRequired] = useState(0)
  const [confirmed, setConfirmed] = useState(false)

  const contentOptions = contentType === 'course'
    ? COURSES.filter((c) => c.status === 'published').map((c) => ({ id: c.id, name: c.title }))
    : PATHS.filter((p) => p.status === 'active').map((p) => ({ id: p.id, name: p.name }))
  const selectedContentName = contentId ? contentOptions.find((o) => o.id === contentId)?.name : ''

  const affectedUsers = useMemo(() => {
    let list: UserRow[] = USERS.filter((u) => u.status === 'active')
    if (targetType === 'individual') {
      const ids = individualUserIds.length ? individualUserIds : (targetValue ? targetValue.split(',').map((s) => s.trim()).filter(Boolean) : [])
      list = list.filter((u) => ids.includes(u.id))
    } else if (targetType === 'center' && targetValue) {
      list = list.filter((u) => u.center === targetValue)
    } else if (targetType === 'group' && targetValue) {
      list = list.filter((u) => u.group === targetValue)
    } else if (targetType === 'role' && targetValue) {
      list = list.filter((u) => u.role === targetValue)
    } else if (targetType === 'craft' && targetValue) {
      list = list.filter((u) => u.skillCategory === targetValue)
    } else if (targetType === 'department' || targetType === 'location') {
      if (targetValue) list = list.filter((u) => u.center === targetValue || u.group === targetValue)
    }
    return list
  }, [targetType, targetValue, individualUserIds])

  const duplicateCount = useMemo(
    () => affectedUsers.filter((u) => MOCK_ALREADY_ASSIGNED.has(u.id)).length,
    [affectedUsers]
  )
  const hasDuplicates = duplicateCount > 0

  const handleConfirm = () => {
    setConfirmed(true)
  }

  return (
    <div className="min-w-0 space-y-8 overflow-x-hidden">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Assign Training (Create Assignment)</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Deploy course or path at scale. Target by individual, group, center, role or craft. Set due date, rules and confirm.
        </p>
      </div>

      {/* A) Assign Target */}
      <section className="rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-6 shadow-sm">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          <Users className="size-5 text-primary" />
          A) Assign Target (who to assign)
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Aarong: center/craft-based assign reduces hassle.</p>

        <div className="mt-4 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Assign content</label>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="contentType"
                  checked={contentType === 'course'}
                  onChange={() => { setContentType('course'); setContentId('') }}
                  className="text-primary focus:ring-primary"
                />
                <span className="text-gray-700 dark:text-gray-300">Course</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="contentType"
                  checked={contentType === 'path'}
                  onChange={() => { setContentType('path'); setContentId('') }}
                  className="text-primary focus:ring-primary"
                />
                <span className="text-gray-700 dark:text-gray-300">Path</span>
              </label>
            </div>
            <select
              value={contentId}
              onChange={(e) => setContentId(e.target.value)}
              className="mt-2 w-full max-w-md rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">Select {contentType}</option>
              {contentOptions.map((o) => (
                <option key={o.id} value={o.id}>{o.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Target type</label>
            <div className="flex flex-wrap gap-2">
              {(Object.entries(TARGET_TYPE_LABELS) as [AssignTargetType, string][]).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => { setTargetType(value); setTargetValue(''); setIndividualUserIds([]) }}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${targetType === value ? 'border-primary bg-primary/10 text-primary' : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {targetType === 'individual' && (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Select users (or paste IDs comma-separated)</label>
              <select
                multiple
                value={individualUserIds}
                onChange={(e) => setIndividualUserIds(Array.from(e.target.selectedOptions, (o) => o.value))}
                className="w-full max-w-md rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                size={5}
              >
                {USERS.filter((u) => u.status === 'active').map((u) => (
                  <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                ))}
              </select>
            </div>
          )}

          {targetType === 'center' && (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Center</label>
              <select
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value)}
                className="w-full max-w-md rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">Select center</option>
                {CENTER_OPTIONS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          )}

          {targetType === 'group' && (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Group</label>
              <select
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value)}
                className="w-full max-w-md rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">Select group</option>
                {GROUP_OPTIONS.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          )}

          {targetType === 'role' && (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
              <select
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value)}
                className="w-full max-w-md rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">Select role</option>
                {ROLE_OPTIONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          )}

          {targetType === 'craft' && (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Craft</label>
              <select
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value)}
                className="w-full max-w-md rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">Select craft</option>
                {CRAFT_OPTIONS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          )}

          {(targetType === 'department' || targetType === 'location') && (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">{targetType === 'department' ? 'Department' : 'Location'}</label>
              <input
                type="text"
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value)}
                className="w-full max-w-md rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder={targetType === 'department' ? 'Department name' : 'Location / center'}
              />
            </div>
          )}
        </div>
      </section>

      {/* B) Assignment Details */}
      <section className="rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-6 shadow-sm">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          <Calendar className="size-5 text-primary" />
          B) Assignment Details
        </h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Due date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Reminders (before due)</label>
            <div className="flex flex-wrap gap-2">
              {REMINDER_OPTIONS.map((d) => (
                <label key={d} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={reminderDays.includes(d)}
                    onChange={(e) =>
                      setReminderDays((prev) => (e.target.checked ? [...prev, d] : prev.filter((x) => x !== d)))
                    }
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{d} day{d > 1 ? 's' : ''} before</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Enrollment window start (optional)</label>
            <input
              type="datetime-local"
              value={enrollmentStart}
              onChange={(e) => setEnrollmentStart(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Enrollment window end (optional)</label>
            <input
              type="datetime-local"
              value={enrollmentEnd}
              onChange={(e) => setEnrollmentEnd(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={mandatory}
              onChange={(e) => setMandatory(e.target.checked)}
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Mandatory assignment</span>
          </label>
        </div>

        <div className="mt-4">
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Notes / instructions (short note)</label>
          <textarea
            value={notesInstructions}
            onChange={(e) => setNotesInstructions(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Short instructions for assignees"
          />
        </div>
      </section>

      {/* C) Rules */}
      <section className="rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-6 shadow-sm">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          <Shield className="size-5 text-primary" />
          C) Rules
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Completion override, min score, attendance, watch %.</p>

        <div className="mt-4 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Completion criteria override (optional)</label>
            <textarea
              value={completionCriteriaOverride}
              onChange={(e) => setCompletionCriteriaOverride(e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Override default completion rules if needed"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Minimum score required (%) — if assessment included</label>
            <input
              type="number"
              min={0}
              max={100}
              value={minimumScoreRequired}
              onChange={(e) => setMinimumScoreRequired(Number(e.target.value))}
              className="w-full max-w-[120px] rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={attendanceRequired}
              onChange={(e) => setAttendanceRequired(e.target.checked)}
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Attendance required (if live class)</span>
          </label>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Watch % required — for video training</label>
            <input
              type="number"
              min={0}
              max={100}
              value={watchPercentRequired}
              onChange={(e) => setWatchPercentRequired(Number(e.target.value))}
              className="w-full max-w-[120px] rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
      </section>

      {/* D) Preview & Confirm */}
      <section className="rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-6 shadow-sm">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          <Eye className="size-5 text-primary" />
          D) Preview & Confirm
        </h2>

        <div className="mt-4 space-y-4">
          <div className="rounded-lg bg-gray-50 dark:bg-gray-700/50 p-4">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">How many users will be affected</p>
            <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">{affectedUsers.length} users</p>
            {selectedContentName && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Assigning: <span className="font-medium text-gray-700 dark:text-gray-300">{selectedContentName}</span>
              </p>
            )}
          </div>

          {hasDuplicates && (
            <div className="flex items-start gap-3 rounded-lg border border-amber-200 dark:border-amber-700/50 bg-amber-50 dark:bg-amber-900/20 p-4">
              <AlertTriangle className="size-5 shrink-0 text-amber-600 dark:text-amber-400" />
              <div>
                <p className="font-medium text-amber-900 dark:text-amber-200">Duplicate detection</p>
                <p className="mt-1 text-sm text-amber-800 dark:text-amber-300">
                  {duplicateCount} user(s) already have this assignment. They can be skipped or re-assigned (due date updated).
                </p>
              </div>
            </div>
          )}

          {confirmed ? (
            <div className="flex items-center gap-3 rounded-lg border border-green-200 dark:border-green-700/50 bg-green-50 dark:bg-green-900/20 p-4">
              <CheckCircle className="size-5 text-green-600 dark:text-green-400" />
              <p className="font-medium text-green-900 dark:text-green-200">Assignment created successfully.</p>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleConfirm}
              className="rounded-lg border border-transparent bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-primary/90"
            >
              Confirm assignment
            </button>
          )}
        </div>
      </section>
    </div>
  )
}
