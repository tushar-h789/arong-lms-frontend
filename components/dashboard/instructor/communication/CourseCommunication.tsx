'use client'

import React, { useState, useMemo } from 'react'
import {
  Megaphone,
  MessageSquare,
  Video,
  Plus,
  Pin,
  Calendar,
  Image as ImageIcon,
  FileText,
  Mic,
  Send,
  Lock,
  Trash2,
  Link2,
  Users,
  Download,
  Film,
  BookOpen,
} from 'lucide-react'
import {
  getCourseAnnouncements,
  getCourseQAThreads,
  getCourseLiveSessions,
  COURSE_ANNOUNCEMENT_AUDIENCE_OPTIONS,
  QA_TAGS,
  QA_STATUSES,
  LIVE_SESSION_PLATFORMS,
  LIVE_SESSION_TARGET_OPTIONS,
  COMMUNICATION_CENTERS,
  COMMUNICATION_GROUPS,
  type CourseAnnouncementRow,
  type CourseQAThreadRow,
  type CourseLiveSessionRow,
  type CourseAnnouncementAudience,
  type QAThreadTag,
  type QAThreadStatus,
} from '@/lib/instructor-communication-data'

const CARD_BASE =
  'rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm'
const INPUT_BASE =
  'rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'

type TabId = 'announcements' | 'qa' | 'live'

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: 'announcements', label: 'Course Announcements', icon: Megaphone },
  { id: 'qa', label: 'Q&A / Forum', icon: MessageSquare },
  { id: 'live', label: 'Live Session Schedule', icon: Video },
]

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function CourseCommunication({
  courseId,
  courseTitle,
}: {
  courseId: string
  courseTitle: string
}) {
  const [tab, setTab] = useState<TabId>('announcements')

  // Tab 1: Announcements
  const announcements = useMemo(() => getCourseAnnouncements(courseId), [courseId])
  const [announcementOpen, setAnnouncementOpen] = useState(false)
  const [announceTitle, setAnnounceTitle] = useState('')
  const [announceBody, setAnnounceBody] = useState('')
  const [announceAudience, setAnnounceAudience] = useState<CourseAnnouncementAudience>('all_enrolled')
  const [announceCenter, setAnnounceCenter] = useState('')
  const [announceGroup, setAnnounceGroup] = useState('')
  const [announceSchedule, setAnnounceSchedule] = useState('')
  const [announcePin, setAnnouncePin] = useState(false)
  const [announceAttachImage, setAnnounceAttachImage] = useState('')
  const [announceAttachPdf, setAnnounceAttachPdf] = useState('')

  // Tab 2: Q&A
  const allThreads = useMemo(() => getCourseQAThreads(courseId), [courseId])
  const unansweredThreads = useMemo(() => getCourseQAThreads(courseId, { unansweredOnly: true }), [courseId])
  const [qaTagFilter, setQATagFilter] = useState<QAThreadTag | ''>('')
  const [qaStatusFilter, setQAStatusFilter] = useState<QAThreadStatus | ''>('')
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [replyPinBest, setReplyPinBest] = useState(false)

  const filteredThreads = useMemo(() => {
    let list = allThreads
    if (qaTagFilter) list = list.filter((t) => t.tag === qaTagFilter)
    if (qaStatusFilter) list = list.filter((t) => t.status === qaStatusFilter)
    return list
  }, [allThreads, qaTagFilter, qaStatusFilter])
  const selectedThread = selectedThreadId ? filteredThreads.find((t) => t.id === selectedThreadId) : null

  // Tab 3: Live sessions
  const liveSessions = useMemo(() => getCourseLiveSessions(courseId), [courseId])
  const [liveSessionOpen, setLiveSessionOpen] = useState(false)
  const [liveTitle, setLiveTitle] = useState('')
  const [liveTopic, setLiveTopic] = useState('')
  const [liveLink, setLiveLink] = useState('')
  const [livePlatform, setLivePlatform] = useState<'meet' | 'zoom' | 'teams'>('meet')
  const [liveStart, setLiveStart] = useState('')
  const [liveDuration, setLiveDuration] = useState('60')
  const [liveTarget, setLiveTarget] = useState<'all_learners' | 'center' | 'group'>('all_learners')
  const [liveTargetCenter, setLiveTargetCenter] = useState('')
  const [liveTargetGroup, setLiveTargetGroup] = useState('')

  const audienceLabel =
    announceAudience === 'all_enrolled'
      ? 'All enrolled'
      : announceAudience === 'center'
        ? announceCenter || 'Select center'
        : announceGroup || 'Select group'

  const tabDescriptions: Record<TabId, string> = {
    announcements: 'Short notices and updates — one line + clear action. Pin the important ones.',
    qa: 'Learners ask, you answer. Pin the best answer so everyone benefits.',
    live: 'Schedule live demos and Q&A. One-click join link for learners.',
  }

  return (
    <div className="min-w-0 space-y-6 overflow-x-hidden">
      <header>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Communication</h1>
        <p className="mt-1 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <BookOpen className="size-4" />
          {courseTitle}
        </p>
        <p className="mt-2 max-w-xl text-sm text-gray-600 dark:text-gray-300">
          Keep your course learners in the loop — announcements, Q&A, and live sessions in one place.
        </p>
      </header>

      {/* Tabs */}
      <nav className="border-b border-gray-200 dark:border-gray-700">
        <div className="-mb-px flex gap-1">
          {TABS.map((t) => {
            const Icon = t.icon
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${tab === t.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
              >
                <Icon className="size-4" />
                {t.label}
                {t.id === 'qa' && unansweredThreads.length > 0 && (
                  <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                    {unansweredThreads.length}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </nav>

      {/* Tab 1: Course Announcements */}
      {tab === 'announcements' && (
        <div className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {tabDescriptions.announcements}
            </p>
            <button
              type="button"
              onClick={() => setAnnouncementOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-hover transition-colors"
            >
              <Plus className="size-4" />
              Create announcement
            </button>
          </div>

          <ul className="space-y-3">
            {announcements.map((a) => (
              <li
                key={a.id}
                className={`${CARD_BASE} p-4 transition-shadow hover:shadow-md ${a.isPinned ? 'ring-1 ring-amber-200 dark:ring-amber-800' : ''}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-gray-900 dark:text-gray-100">{a.title}</span>
                      {a.isPinned && (
                        <span className="inline-flex items-center gap-1 rounded bg-amber-100 px-1.5 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                          <Pin className="size-3" /> Pinned
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{a.body}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                      <span>To: {a.audienceLabel}</span>
                      {a.attachments.length > 0 && (
                        <span className="flex items-center gap-1">
                          {a.attachments.some((x) => x.type === 'image') && <ImageIcon className="size-3" />}
                          {a.attachments.some((x) => x.type === 'pdf') && <FileText className="size-3" />}
                          {a.attachments.map((x) => x.name).join(', ')}
                        </span>
                      )}
                      {a.publishedAt && <span>Published {formatDate(a.publishedAt)}</span>}
                    </div>
                  </div>
                  <button type="button" className="shrink-0 rounded border border-gray-300 dark:border-gray-600 px-2 py-1 text-xs font-medium hover:bg-gray-50 dark:hover:bg-gray-700">
                    Edit
                  </button>
                </div>
              </li>
            ))}
          </ul>
          {announcements.length === 0 && (
            <div className={`${CARD_BASE} border-dashed px-6 py-12 text-center`}>
              <Megaphone className="mx-auto size-12 text-gray-400 dark:text-gray-500" />
              <p className="mt-3 text-sm font-medium text-gray-700 dark:text-gray-300">No announcements yet</p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Create your first one to tell learners what’s new — SOP updates, reminders, or instructions.</p>
              <button
                type="button"
                onClick={() => setAnnouncementOpen(true)}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover"
              >
                <Plus className="size-4" /> Create announcement
              </button>
            </div>
          )}

          {announcementOpen && (
            <div className={`${CARD_BASE} p-6`}>
              <h2 className="mb-4 flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
                <Megaphone className="size-4" /> Create announcement
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                    Title (one line + clear action)
                  </label>
                  <input
                    type="text"
                    value={announceTitle}
                    onChange={(e) => setAnnounceTitle(e.target.value)}
                    placeholder="e.g. New SOP update — review by end of week"
                    className={`${INPUT_BASE} w-full`}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                    Body (short description)
                  </label>
                  <textarea
                    rows={2}
                    value={announceBody}
                    onChange={(e) => setAnnounceBody(e.target.value)}
                    placeholder="Brief description and what to do."
                    className={`${INPUT_BASE} w-full`}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-medium text-gray-500 dark:text-gray-400">
                    Audience
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {COURSE_ANNOUNCEMENT_AUDIENCE_OPTIONS.map((o) => (
                      <label
                        key={o.value}
                        className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm ${announceAudience === o.value
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                      >
                        <input
                          type="radio"
                          name="audience"
                          checked={announceAudience === o.value}
                          onChange={() => setAnnounceAudience(o.value)}
                          className="sr-only"
                        />
                        {o.label}
                      </label>
                    ))}
                  </div>
                  {announceAudience === 'center' && (
                    <select
                      value={announceCenter}
                      onChange={(e) => setAnnounceCenter(e.target.value)}
                      className={`${INPUT_BASE} mt-2 max-w-xs`}
                    >
                      <option value="">Select center</option>
                      {COMMUNICATION_CENTERS.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  )}
                  {announceAudience === 'group' && (
                    <select
                      value={announceGroup}
                      onChange={(e) => setAnnounceGroup(e.target.value)}
                      className={`${INPUT_BASE} mt-2 max-w-xs`}
                    >
                      <option value="">Select group</option>
                      {COMMUNICATION_GROUPS.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  )}
                </div>
                <div>
                  <label className="mb-2 block text-xs font-medium text-gray-500 dark:text-gray-400">
                    Attach
                  </label>
                  <div className="flex flex-wrap gap-3">
                    <input
                      type="text"
                      value={announceAttachImage}
                      onChange={(e) => setAnnounceAttachImage(e.target.value)}
                      placeholder="Image poster URL"
                      className={`${INPUT_BASE} flex-1 min-w-0 max-w-sm`}
                    />
                    <input
                      type="text"
                      value={announceAttachPdf}
                      onChange={(e) => setAnnounceAttachPdf(e.target.value)}
                      placeholder="PDF checklist / job aid URL"
                      className={`${INPUT_BASE} flex-1 min-w-0 max-w-sm`}
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                    <Calendar className="size-3" /> Schedule publish (optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={announceSchedule}
                    onChange={(e) => setAnnounceSchedule(e.target.value)}
                    className={INPUT_BASE}
                  />
                </div>
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={announcePin}
                    onChange={(e) => setAnnouncePin(e.target.checked)}
                    className="rounded border-gray-300 text-primary"
                  />
                  Pin as important
                </label>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setAnnouncementOpen(false)}
                    className="rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover"
                  >
                    Publish
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Q&A / Forum Moderation */}
      {tab === 'qa' && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {tabDescriptions.qa} Reply with text, image, or voice. Lock or remove if needed.
          </p>
          <div className="flex flex-wrap gap-3">
            <select
              value={qaTagFilter}
              onChange={(e) => setQATagFilter(e.target.value as QAThreadTag | '')}
              className={INPUT_BASE}
            >
              <option value="">All tags</option>
              {QA_TAGS.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
            <select
              value={qaStatusFilter}
              onChange={(e) => setQAStatusFilter(e.target.value as QAThreadStatus | '')}
              className={INPUT_BASE}
            >
              <option value="">All statuses</option>
              {QA_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            {unansweredThreads.length > 0 && (
              <span className="rounded bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                {unansweredThreads.length} unanswered
              </span>
            )}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className={`${CARD_BASE} overflow-hidden`}>
              <ul className="divide-y divide-gray-200 dark:divide-gray-600">
                {filteredThreads.map((t) => (
                  <li
                    key={t.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedThreadId(t.id)}
                    onKeyDown={(e) => e.key === 'Enter' && setSelectedThreadId(t.id)}
                    className={`cursor-pointer px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 ${selectedThreadId === t.id ? 'bg-primary/5 dark:bg-primary/10' : ''
                      }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-medium text-gray-900 dark:text-gray-100 line-clamp-1">{t.question}</span>
                      <span className={`shrink-0 rounded px-1.5 py-0.5 text-xs ${t.status === 'open' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' :
                        t.status === 'locked' ? 'bg-gray-200 dark:bg-gray-600' : 'bg-gray-100 dark:bg-gray-700'
                        }`}>
                        {t.status}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                      {t.tag} · {t.askedBy} · {formatDate(t.askedAt)}
                    </p>
                  </li>
                ))}
              </ul>
              {filteredThreads.length === 0 && (
                <div className="px-6 py-10 text-center">
                  <MessageSquare className="mx-auto size-10 text-gray-400 dark:text-gray-500" />
                  <p className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">No questions match your filters</p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Try changing tag or status, or wait for learners to ask.</p>
                </div>
              )}
            </div>

            <div className={`${CARD_BASE} p-4`}>
              {selectedThread ? (
                <>
                  <div className="mb-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 text-xs font-medium">{selectedThread.tag}</span>
                      {selectedThread.isLocked && (
                        <span className="inline-flex items-center gap-1 text-xs text-gray-500"><Lock className="size-3" /> Locked</span>
                      )}
                    </div>
                    <h3 className="mt-1 font-semibold text-gray-900 dark:text-gray-100">{selectedThread.question}</h3>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{selectedThread.body}</p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{selectedThread.askedBy} · {formatDate(selectedThread.askedAt)}</p>
                  </div>
                  <div className="space-y-3">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Replies</span>
                    {selectedThread.replies.map((r) => (
                      <div
                        key={r.id}
                        className={`rounded-lg border p-3 text-sm ${r.isPinnedAsBest ? 'border-primary bg-primary/5 dark:bg-primary/10' : 'border-gray-200 dark:border-gray-600'
                          }`}
                      >
                        {r.isPinnedAsBest && (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-primary"><Pin className="size-3" /> Best answer</span>
                        )}
                        <p className="mt-1 text-gray-900 dark:text-gray-100">{r.body}</p>
                        {r.attachmentType === 'image' && <span className="mt-2 inline-flex items-center gap-1 text-xs text-gray-500"><ImageIcon className="size-3" /> Image</span>}
                        {r.attachmentType === 'voice' && <span className="mt-2 inline-flex items-center gap-1 text-xs text-gray-500"><Mic className="size-3" /> Voice note</span>}
                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{r.repliedBy} · {formatDate(r.repliedAt)}</p>
                      </div>
                    ))}
                  </div>
                  {!selectedThread.isLocked && (
                    <div className="mt-4 border-t border-gray-200 dark:border-gray-600 pt-4">
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Reply</label>
                      <textarea
                        rows={3}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Type your reply (text). You can add image or voice note below."
                        className={`${INPUT_BASE} w-full`}
                      />
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <button type="button" className="inline-flex items-center gap-1 rounded border border-gray-300 dark:border-gray-600 px-2 py-1.5 text-xs hover:bg-gray-50 dark:hover:bg-gray-700">
                          <ImageIcon className="size-3" /> Image
                        </button>
                        <button type="button" className="inline-flex items-center gap-1 rounded border border-gray-300 dark:border-gray-600 px-2 py-1.5 text-xs hover:bg-gray-50 dark:hover:bg-gray-700">
                          <Mic className="size-3" /> Voice note
                        </button>
                        <label className="flex cursor-pointer items-center gap-1.5 text-xs">
                          <input type="checkbox" checked={replyPinBest} onChange={(e) => setReplyPinBest(e.target.checked)} className="rounded text-primary" />
                          Pin as best answer
                        </label>
                      </div>
                      <button
                        type="button"
                        className="mt-3 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover"
                      >
                        <Send className="size-4" /> Reply
                      </button>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button type="button" className="inline-flex items-center gap-1 rounded border border-gray-300 dark:border-gray-600 px-2 py-1 text-xs hover:bg-gray-50 dark:hover:bg-gray-700">
                          <Pin className="size-3" /> Pin best
                        </button>
                        <button type="button" className="inline-flex items-center gap-1 rounded border border-gray-300 dark:border-gray-600 px-2 py-1 text-xs hover:bg-gray-50 dark:hover:bg-gray-700">
                          <Lock className="size-3" /> Lock thread
                        </button>
                        <button type="button" className="inline-flex items-center gap-1 rounded border border-red-200 px-2 py-1 text-xs text-red-700 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-900/20">
                          <Trash2 className="size-3" /> Remove
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="rounded-lg border border-dashed border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 px-6 py-8 text-center">
                  <MessageSquare className="mx-auto size-10 text-gray-400 dark:text-gray-500" />
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Select a question to view and reply</p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">The Reply button is ready when you pick one.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Live Session Schedule */}
      {tab === 'live' && (
        <div className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {tabDescriptions.live} Target all learners or a specific center/group. Mark attendance and share the recording after.
            </p>
            <button
              type="button"
              onClick={() => setLiveSessionOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover"
            >
              <Plus className="size-4" />
              Create session
            </button>
          </div>

          <div className={`${CARD_BASE} overflow-hidden`}>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Session</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">When</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Target</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Attendance</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Materials</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-700 dark:text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {liveSessions.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Video className="size-4 text-gray-400" />
                          <div>
                            <span className="font-medium text-gray-900 dark:text-gray-100">{s.title}</span>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{s.topic}</p>
                          </div>
                        </div>
                        <a
                          href={s.meetLink}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-1 inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors"
                        >
                          <Link2 className="size-3" /> Join (1-click)
                        </a>
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                        {formatDate(s.startAt)} · {s.durationMinutes} min
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{s.targetLabel}</td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                          <Users className="size-4" /> {s.attendanceMarked}/{s.attendanceTotal}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                        {s.recordingUrl && (
                          <span className="inline-flex items-center gap-1"><Film className="size-3" /> Recording</span>
                        )}
                        {s.handoutPdfUrl && (
                          <span className="ml-2 inline-flex items-center gap-1"><FileText className="size-3" /> Handout</span>
                        )}
                        {!s.recordingUrl && !s.handoutPdfUrl && '—'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button type="button" className="rounded border border-gray-300 dark:border-gray-600 px-2 py-1 text-xs font-medium hover:bg-gray-50 dark:hover:bg-gray-700">
                          Mark attendance
                        </button>
                        <button type="button" className="ml-1 inline-flex items-center gap-1 rounded border border-gray-300 dark:border-gray-600 px-2 py-1 text-xs font-medium hover:bg-gray-50 dark:hover:bg-gray-700">
                          <Download className="size-3" /> Export
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {liveSessions.length === 0 && (
              <div className="border-t border-gray-200 dark:border-gray-600 px-6 py-12 text-center">
                <Video className="mx-auto size-12 text-gray-400 dark:text-gray-500" />
                <p className="mt-3 text-sm font-medium text-gray-700 dark:text-gray-300">No live sessions yet</p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Schedule your first live demo or Q&A — craft training works best with a real-time session.</p>
                <button
                  type="button"
                  onClick={() => setLiveSessionOpen(true)}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover"
                >
                  <Plus className="size-4" /> Create session
                </button>
              </div>
            )}
          </div>

          {liveSessionOpen && (
            <div className={`${CARD_BASE} p-6`}>
              <h2 className="mb-4 flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
                <Video className="size-4" /> Create live session
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Title</label>
                  <input
                    type="text"
                    value={liveTitle}
                    onChange={(e) => setLiveTitle(e.target.value)}
                    placeholder="e.g. Dyeing SOP Live Demo"
                    className={`${INPUT_BASE} w-full`}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Topic</label>
                  <input
                    type="text"
                    value={liveTopic}
                    onChange={(e) => setLiveTopic(e.target.value)}
                    placeholder="e.g. Step-by-step demo + Q&A"
                    className={`${INPUT_BASE} w-full`}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Platform & link</label>
                  <select
                    value={livePlatform}
                    onChange={(e) => setLivePlatform(e.target.value as 'meet' | 'zoom' | 'teams')}
                    className={`${INPUT_BASE} mb-2 w-full`}
                  >
                    {LIVE_SESSION_PLATFORMS.map((p) => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                  <input
                    type="url"
                    value={liveLink}
                    onChange={(e) => setLiveLink(e.target.value)}
                    placeholder="Meet / Zoom / Teams link"
                    className={`${INPUT_BASE} w-full`}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Date & time</label>
                  <input
                    type="datetime-local"
                    value={liveStart}
                    onChange={(e) => setLiveStart(e.target.value)}
                    className={`${INPUT_BASE} w-full`}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Duration (minutes)</label>
                  <input
                    type="number"
                    min={1}
                    value={liveDuration}
                    onChange={(e) => setLiveDuration(e.target.value)}
                    className={`${INPUT_BASE} w-full`}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Target</label>
                  <select
                    value={liveTarget}
                    onChange={(e) => setLiveTarget(e.target.value as 'all_learners' | 'center' | 'group')}
                    className={`${INPUT_BASE} w-full`}
                  >
                    {LIVE_SESSION_TARGET_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                  {liveTarget === 'center' && (
                    <select
                      value={liveTargetCenter}
                      onChange={(e) => setLiveTargetCenter(e.target.value)}
                      className={`${INPUT_BASE} mt-2 w-full`}
                    >
                      <option value="">Select center</option>
                      {COMMUNICATION_CENTERS.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  )}
                  {liveTarget === 'group' && (
                    <select
                      value={liveTargetGroup}
                      onChange={(e) => setLiveTargetGroup(e.target.value)}
                      className={`${INPUT_BASE} mt-2 w-full`}
                    >
                      <option value="">Select group</option>
                      {COMMUNICATION_GROUPS.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setLiveSessionOpen(false)}
                  className="rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button type="button" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover">
                  Create session
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
