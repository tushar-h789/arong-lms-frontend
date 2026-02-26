'use client'

import React, { useState } from 'react'
import { MOCK_DISCUSSION_POSTS, TOPIC_TAGS, type TopicTag, type DiscussionStatus } from '@/lib/discussions-data'
import { MessageSquare, Pin, Lock, Trash2, Flag, ThumbsUp } from 'lucide-react'

export function DiscussionsForums() {
  const [courseFilter, setCourseFilter] = useState('')
  const [tagFilter, setTagFilter] = useState<TopicTag | ''>('')
  const [sortBy, setSortBy] = useState<'recent' | 'helpful' | 'replies'>('recent')

  const filtered = MOCK_DISCUSSION_POSTS.filter((p) => {
    if (courseFilter && !p.courseName.toLowerCase().includes(courseFilter.toLowerCase())) return false
    if (tagFilter && !p.tags.includes(tagFilter)) return false
    return true
  })

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'recent') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    if (sortBy === 'helpful') return b.helpfulCount - a.helpfulCount
    return b.replyCount - a.replyCount
  })

  return (
    <div className="min-w-0 space-y-4 overflow-x-hidden">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Discussions / Forums</h1>
        <p className="mt-0.5 text-sm text-gray-500">
          Course-based discussion. Pin, lock, remove; report abuse. Topic tags. Top posts / most helpful for community learning.
        </p>
      </div>

      {/* Filters + sort */}
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Course name"
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
          className="w-48 rounded border border-gray-300 px-3 py-1.5 text-sm"
        />
        <select value={tagFilter} onChange={(e) => setTagFilter(e.target.value as TopicTag | '')} className="rounded border border-gray-300 px-3 py-1.5 text-sm">
          <option value="">All tags</option>
          {TOPIC_TAGS.map((t) => (
            <option key={t.id} value={t.id}>{t.label}</option>
          ))}
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as 'recent' | 'helpful' | 'replies')} className="rounded border border-gray-300 px-3 py-1.5 text-sm">
          <option value="recent">Recent</option>
          <option value="helpful">Most helpful</option>
          <option value="replies">Most replies</option>
        </select>
      </div>

      {/* Post list */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <ul className="divide-y divide-gray-200">
          {sorted.map((p) => (
            <li key={p.id} className="flex flex-col gap-2 px-4 py-3 hover:bg-gray-50 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-gray-900">{p.title}</span>
                  {p.status === 'pinned' && <span className="inline-flex items-center gap-1 rounded bg-primary/10 px-1.5 py-0.5 text-xs text-primary"><Pin className="size-3" /> Pinned</span>}
                  {p.status === 'locked' && <span className="inline-flex items-center gap-1 rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600"><Lock className="size-3" /> Locked</span>}
                  {p.isReported && <span className="rounded bg-red-100 px-1.5 py-0.5 text-xs text-red-800">Reported</span>}
                </div>
                <p className="mt-0.5 line-clamp-2 text-sm text-gray-600">{p.body}</p>
                <div className="mt-1 flex flex-wrap gap-2 text-xs text-gray-500">
                  <span>{p.courseName}</span>
                  <span>{p.authorName} · {new Date(p.createdAt).toLocaleDateString()}</span>
                  {p.tags.map((t) => (
                    <span key={t} className="rounded bg-gray-100 px-1.5 py-0.5">{t}</span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span className="flex items-center gap-1"><MessageSquare className="size-4" /> {p.replyCount}</span>
                <span className="flex items-center gap-1"><ThumbsUp className="size-4" /> {p.helpfulCount}</span>
              </div>
              <div className="flex shrink-0 gap-1">
                <button type="button" className="rounded border border-gray-300 p-1.5 text-gray-500 hover:bg-gray-100" title="Pin"><Pin className="size-4" /></button>
                <button type="button" className="rounded border border-gray-300 p-1.5 text-gray-500 hover:bg-gray-100" title="Lock"><Lock className="size-4" /></button>
                <button type="button" className="rounded border border-gray-300 p-1.5 text-gray-500 hover:bg-gray-100" title="Remove"><Trash2 className="size-4" /></button>
                <button type="button" className="rounded border border-red-200 p-1.5 text-red-600 hover:bg-red-50" title="Report abuse"><Flag className="size-4" /></button>
              </div>
            </li>
          ))}
        </ul>
        {sorted.length === 0 && <div className="px-4 py-8 text-center text-sm text-gray-500">No discussions match filters.</div>}
      </div>
    </div>
  )
}
