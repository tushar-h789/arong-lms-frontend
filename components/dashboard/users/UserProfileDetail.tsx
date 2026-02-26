'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  getUserProfile,
  MOCK_LEARNING,
  MOCK_ASSESSMENTS,
  MOCK_ATTENDANCE,
  MOCK_CERTIFICATES,
  MOCK_ACTIVITY_LOG,
  type UserProfile,
} from '@/lib/user-profile-data'
import {
  ArrowLeft,
  User,
  BookOpen,
  ClipboardCheck,
  Calendar,
  Award,
  Activity,
  Shield,
  Key,
  UserX,
} from 'lucide-react'

type TabId = 'profile' | 'learning' | 'assessments' | 'attendance' | 'certificates' | 'activity' | 'admin'

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'profile', label: 'Profile', icon: <User className="size-4" /> },
  { id: 'learning', label: 'Learning', icon: <BookOpen className="size-4" /> },
  { id: 'assessments', label: 'Assessments', icon: <ClipboardCheck className="size-4" /> },
  { id: 'attendance', label: 'Attendance', icon: <Calendar className="size-4" /> },
  { id: 'certificates', label: 'Certificates', icon: <Award className="size-4" /> },
  { id: 'activity', label: 'Activity log', icon: <Activity className="size-4" /> },
  { id: 'admin', label: 'Admin actions', icon: <Shield className="size-4" /> },
]

export function UserProfileDetail({ userId }: { userId: string }) {
  const [tab, setTab] = useState<TabId>('profile')
  const profile = getUserProfile(userId)

  if (!profile) {
    return (
      <div className="min-w-0 space-y-6">
        <Link href="/dashboard/admin/users" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary">
          <ArrowLeft className="size-4" /> Back to Users
        </Link>
        <p className="text-gray-500">User not found.</p>
      </div>
    )
  }

  return (
    <div className="min-w-0 space-y-6 overflow-x-hidden">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/dashboard/admin/users" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary">
          <ArrowLeft className="size-4" /> Back to Users
        </Link>
      </div>

      <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary/15 text-lg font-semibold text-primary">
          {profile.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">{profile.name}</h1>
          <p className="text-sm text-gray-500">{profile.email}</p>
          <span className="mt-1 inline-flex rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 capitalize">
            {profile.status}
          </span>
        </div>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex flex-wrap gap-1" aria-label="Tabs">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                tab === t.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        {tab === 'profile' && <ProfileTab profile={profile} />}
        {tab === 'learning' && <LearningTab />}
        {tab === 'assessments' && <AssessmentsTab />}
        {tab === 'attendance' && <AttendanceTab />}
        {tab === 'certificates' && <CertificatesTab />}
        {tab === 'activity' && <ActivityTab />}
        {tab === 'admin' && <AdminTab />}
      </div>
    </div>
  )
}

function ProfileTab({ profile }: { profile: UserProfile }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div><span className="text-xs font-medium text-gray-500">Name</span><p className="text-gray-900">{profile.name}</p></div>
      <div><span className="text-xs font-medium text-gray-500">Mobile</span><p className="text-gray-900">{profile.mobile ?? '—'}</p></div>
      <div><span className="text-xs font-medium text-gray-500">Center</span><p className="text-gray-900">{profile.center}</p></div>
      <div><span className="text-xs font-medium text-gray-500">Group</span><p className="text-gray-900">{profile.group}</p></div>
      <div><span className="text-xs font-medium text-gray-500">Craft type</span><p className="text-gray-900 capitalize">{profile.craftType}</p></div>
      <div><span className="text-xs font-medium text-gray-500">Joining date</span><p className="text-gray-900">{profile.joiningDate}</p></div>
      <div><span className="text-xs font-medium text-gray-500">Role</span><p className="text-gray-900 capitalize">{profile.role}</p></div>
      {profile.trainer && <div><span className="text-xs font-medium text-gray-500">Trainer</span><p className="text-gray-900">{profile.trainer}</p></div>}
    </div>
  )
}

function LearningTab() {
  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-500">Assigned courses/paths, progress, overdue</p>
      <table className="min-w-full divide-y divide-gray-200">
        <thead><tr><th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Title</th><th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Type</th><th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Progress</th><th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Status</th><th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Overdue</th></tr></thead>
        <tbody className="divide-y divide-gray-200">
          {MOCK_LEARNING.map((r) => (
            <tr key={r.id}><td className="px-4 py-2 text-sm">{r.title}</td><td className="px-4 py-2 text-sm capitalize">{r.type}</td><td className="px-4 py-2 text-sm">{r.progress}%</td><td className="px-4 py-2 text-sm capitalize">{r.status.replace('_', ' ')}</td><td className="px-4 py-2 text-sm">{r.overdue ? 'Yes' : 'No'}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function AssessmentsTab() {
  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-500">Scores, attempts</p>
      <table className="min-w-full divide-y divide-gray-200">
        <thead><tr><th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Assessment</th><th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Date</th><th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Score</th><th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Attempts</th><th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Passed</th></tr></thead>
        <tbody className="divide-y divide-gray-200">
          {MOCK_ASSESSMENTS.map((r) => (
            <tr key={r.id}><td className="px-4 py-2 text-sm">{r.name}</td><td className="px-4 py-2 text-sm">{r.date}</td><td className="px-4 py-2 text-sm">{r.score}/{r.maxScore}</td><td className="px-4 py-2 text-sm">{r.attempts}</td><td className="px-4 py-2 text-sm">{r.passed ? 'Yes' : 'No'}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function AttendanceTab() {
  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-500">Virtual/physical attendance history</p>
      <table className="min-w-full divide-y divide-gray-200">
        <thead><tr><th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Date</th><th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Type</th><th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Session</th><th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Status</th></tr></thead>
        <tbody className="divide-y divide-gray-200">
          {MOCK_ATTENDANCE.map((r) => (
            <tr key={r.id}><td className="px-4 py-2 text-sm">{r.date}</td><td className="px-4 py-2 text-sm capitalize">{r.type}</td><td className="px-4 py-2 text-sm">{r.courseOrSession ?? '—'}</td><td className="px-4 py-2 text-sm capitalize">{r.status}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function CertificatesTab() {
  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-500">Issued/expiry</p>
      <table className="min-w-full divide-y divide-gray-200">
        <thead><tr><th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Name</th><th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Issued</th><th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Expiry</th><th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Status</th></tr></thead>
        <tbody className="divide-y divide-gray-200">
          {MOCK_CERTIFICATES.map((r) => (
            <tr key={r.id}><td className="px-4 py-2 text-sm">{r.name}</td><td className="px-4 py-2 text-sm">{r.issuedDate}</td><td className="px-4 py-2 text-sm">{r.expiryDate}</td><td className="px-4 py-2 text-sm capitalize">{r.status.replace('_', ' ')}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ActivityTab() {
  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-500">Last login, last course access</p>
      <table className="min-w-full divide-y divide-gray-200">
        <thead><tr><th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Action</th><th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Time</th><th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Detail</th></tr></thead>
        <tbody className="divide-y divide-gray-200">
          {MOCK_ACTIVITY_LOG.map((r) => (
            <tr key={r.id}><td className="px-4 py-2 text-sm">{r.action}</td><td className="px-4 py-2 text-sm">{new Date(r.timestamp).toLocaleString()}</td><td className="px-4 py-2 text-sm">{r.detail ?? '—'}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function AdminTab() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">Reset password, change role, deactivate</p>
      <div className="flex flex-wrap gap-3">
        <button type="button" className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
          <Key className="size-4" /> Reset password
        </button>
        <button type="button" className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
          <Shield className="size-4" /> Change role
        </button>
        <button type="button" className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-700 hover:bg-red-50">
          <UserX className="size-4" /> Deactivate
        </button>
      </div>
    </div>
  )
}
