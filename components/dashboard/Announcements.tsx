'use client'

import React, { useState } from 'react'
import {
  MOCK_ANNOUNCEMENTS,
  AUDIENCE_TYPES,
  PRIORITY_LEVELS,
  ATTACHMENT_TYPES,
  DELIVERY_CHANNELS,
  type AudienceType,
  type PriorityLevel,
  type AttachmentType,
  type DeliveryChannel,
} from '@/lib/announcements-data'
import { Megaphone, Plus, Calendar, Image as ImageIcon, FileText, Video, Send } from 'lucide-react'

export function Announcements() {
  const [createOpen, setCreateOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [audienceType, setAudienceType] = useState<AudienceType>('global')
  const [priority, setPriority] = useState<PriorityLevel>('normal')
  const [scheduledAt, setScheduledAt] = useState('')
  const [attachments, setAttachments] = useState<{ type: AttachmentType; name: string; url: string }[]>([])
  const [deliveryChannels, setDeliveryChannels] = useState<DeliveryChannel[]>(['in_app'])

  const toggleDelivery = (ch: DeliveryChannel) => {
    setDeliveryChannels((prev) => (prev.includes(ch) ? prev.filter((c) => c !== ch) : [...prev, ch]))
  }

  const addAttachment = (type: AttachmentType) => {
    setAttachments((prev) => [...prev, { type, name: '', url: '' }])
  }

  return (
    <div className="min-w-0 space-y-4 overflow-x-hidden">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Announcements (Broadcast)</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Quick notices to everyone or specific groups. Posters, PDFs, short video. Effective for field and village workers.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-transparent bg-primary px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90"
        >
          <Plus className="size-4" />
          New announcement
        </button>
      </div>

      {/* List */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <ul className="divide-y divide-gray-200">
          {MOCK_ANNOUNCEMENTS.map((a) => (
            <li key={a.id} className="flex flex-col gap-2 px-4 py-3 hover:bg-gray-50 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-gray-900">{a.title}</span>
                  <span
                    className={`rounded px-1.5 py-0.5 text-xs font-medium ${
                      a.priority === 'urgent' ? 'bg-red-100 text-red-800' : a.priority === 'important' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {a.priority}
                  </span>
                </div>
                <p className="mt-0.5 line-clamp-2 text-sm text-gray-600">{a.body}</p>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                  <span>To: {a.audienceLabel}</span>
                  {a.attachments.length > 0 && (
                    <span className="flex items-center gap-1">
                      {a.attachments.some((x) => x.type === 'image') && <ImageIcon className="size-3" />}
                      {a.attachments.some((x) => x.type === 'pdf') && <FileText className="size-3" />}
                      {a.attachments.some((x) => x.type === 'video') && <Video className="size-3" />}
                      {a.attachments.length} attachment(s)
                    </span>
                  )}
                  {a.publishedAt && (
                    <span>Published {new Date(a.publishedAt).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
              <div className="flex shrink-0 gap-1">
                <button type="button" className="rounded border border-gray-300 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50">
                  Edit
                </button>
              </div>
            </li>
          ))}
        </ul>
        {MOCK_ANNOUNCEMENTS.length === 0 && (
          <div className="px-4 py-8 text-center text-sm text-gray-500">No announcements yet. Create one to broadcast.</div>
        )}
      </div>

      {/* Create / Edit form */}
      {createOpen && (
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 font-semibold text-gray-900">
            <Megaphone className="size-4" />
            New announcement
          </h2>

          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Announcement title"
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Body</label>
              <textarea
                rows={3}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Short notice text (poster-style works best for field)"
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
              />
            </div>

            {/* Audience */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Audience</label>
              <div className="flex flex-wrap gap-2">
                {AUDIENCE_TYPES.map((t) => (
                  <label
                    key={t.id}
                    className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm ${audienceType === t.id ? 'border-primary bg-primary/5 text-primary' : 'border-gray-300 hover:bg-gray-50'}`}
                  >
                    <input
                      type="radio"
                      name="audience"
                      checked={audienceType === t.id}
                      onChange={() => setAudienceType(t.id)}
                      className="sr-only"
                    />
                    {t.label}
                  </label>
                ))}
              </div>
              {audienceType === 'course' && (
                <input type="text" placeholder="Select course" className="mt-2 w-full max-w-xs rounded border border-gray-300 px-3 py-1.5 text-sm" />
              )}
              {audienceType === 'center' && (
                <input type="text" placeholder="Select center / location" className="mt-2 w-full max-w-xs rounded border border-gray-300 px-3 py-1.5 text-sm" />
              )}
              {audienceType === 'craft' && (
                <select className="mt-2 rounded border border-gray-300 px-3 py-1.5 text-sm">
                  <option value="">Select craft</option>
                  <option value="weaving">Weaving</option>
                  <option value="embroidery">Embroidery</option>
                  <option value="dyeing">Dyeing</option>
                </select>
              )}
            </div>

            {/* Schedule (optional) */}
            <div>
              <label className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700">
                <Calendar className="size-4" />
                Schedule publish (optional)
              </label>
              <input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="rounded border border-gray-300 px-3 py-1.5 text-sm"
              />
            </div>

            {/* Priority */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Priority</label>
              <div className="flex flex-wrap gap-2">
                {PRIORITY_LEVELS.map((p) => (
                  <label key={p.id} className="flex cursor-pointer items-center gap-2">
                    <input
                      type="radio"
                      name="priority"
                      checked={priority === p.id}
                      onChange={() => setPriority(p.id)}
                      className="text-primary"
                    />
                    <span className="text-sm">{p.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Attachments */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Attachments</label>
              <div className="flex flex-wrap gap-2">
                {ATTACHMENT_TYPES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => addAttachment(t.id)}
                    className="inline-flex items-center gap-1.5 rounded border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    {t.id === 'image' && <ImageIcon className="size-4" />}
                    {t.id === 'pdf' && <FileText className="size-4" />}
                    {t.id === 'video' && <Video className="size-4" />}
                    Add {t.label}
                  </button>
                ))}
              </div>
              {attachments.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {attachments.map((att, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <span className="text-gray-500">{att.type}</span>
                      <input
                        type="text"
                        placeholder="File name or URL"
                        value={att.name || att.url}
                        onChange={(e) => {
                          const next = [...attachments]
                          next[i] = { ...next[i], name: e.target.value, url: e.target.value }
                          setAttachments(next)
                        }}
                        className="flex-1 rounded border border-gray-300 px-2 py-1 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setAttachments((prev) => prev.filter((_, j) => j !== i))}
                        className="text-gray-400 hover:text-red-600"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Delivery channels (future) */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Delivery</label>
              <div className="flex flex-wrap gap-3">
                {DELIVERY_CHANNELS.map((ch) => (
                  <label key={ch.id} className="flex cursor-pointer items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={deliveryChannels.includes(ch.id)}
                      onChange={() => toggleDelivery(ch.id)}
                      className="rounded text-primary"
                    />
                    {ch.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCreateOpen(false)}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              {scheduledAt ? (
                <button type="button" className="inline-flex items-center gap-2 rounded-lg border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90">
                  <Calendar className="size-4" />
                  Schedule
                </button>
              ) : (
                <button type="button" className="inline-flex items-center gap-2 rounded-lg border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90">
                  <Send className="size-4" />
                  Publish now
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
