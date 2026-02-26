'use client'

import React from 'react'
import Link from 'next/link'
import { SETTINGS_TILES, MOCK_SYSTEM_STATUS } from '@/lib/settings-overview-data'
import { Palette, Plug, Shield, FileText, Award, Mail, Users, Workflow, Key, Video, Lock, ShieldCheck, Activity, CheckCircle, XCircle, Clock } from 'lucide-react'

const tileIcons: Record<string, React.ReactNode> = {
  branding: <Palette className="size-5 text-gray-500" />,
  certificates: <Award className="size-5 text-gray-500" />,
  'email-sms': <Mail className="size-5 text-gray-500" />,
  integrations: <Plug className="size-5 text-gray-500" />,
  'hr-sync': <Users className="size-5 text-gray-500" />,
  'ams-integration': <Workflow className="size-5 text-gray-500" />,
  'sso-auth': <Key className="size-5 text-gray-500" />,
  'video-conferencing': <Video className="size-5 text-gray-500" />,
  security: <Lock className="size-5 text-gray-500" />,
  'access-control': <ShieldCheck className="size-5 text-gray-500" />,
  audit: <FileText className="size-5 text-gray-500" />,
  'system-logs': <Activity className="size-5 text-gray-500" />,
}

export function SettingsOverview() {
  const status = MOCK_SYSTEM_STATUS

  return (
    <div className="min-w-0 space-y-6 overflow-x-hidden">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings Overview</h1>
        <p className="mt-0.5 text-sm text-gray-500">
          One-click access to all settings. Check system status at a glance.
        </p>
      </div>

      {/* Quick tiles */}
      <section>
        <h2 className="mb-3 text-sm font-semibold text-gray-900">Quick access</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {SETTINGS_TILES.map((tile) => (
            <Link
              key={tile.id}
              href={tile.href}
              className="flex flex-col rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:border-primary hover:bg-primary/5"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                  {tileIcons[tile.id]}
                </div>
                <div>
                  <span className="font-medium text-gray-900">{tile.label}</span>
                  <p className="text-xs text-gray-500">{tile.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* System status snapshot */}
      <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-gray-900">System status snapshot</h2>
        <ul className="space-y-2">
          <li className="flex items-center justify-between rounded border border-gray-100 px-3 py-2">
            <span className="text-sm text-gray-700">HR sync last run</span>
            {status.hrSyncLastRun ? (
              <span className="flex items-center gap-1 text-sm text-gray-600">
                <Clock className="size-4" />
                {new Date(status.hrSyncLastRun).toLocaleString()}
              </span>
            ) : (
              <span className="text-sm text-gray-400">Not configured</span>
            )}
          </li>
          <li className="flex items-center justify-between rounded border border-gray-100 px-3 py-2">
            <span className="text-sm text-gray-700">SSO</span>
            {status.ssoEnabled ? (
              <span className="flex items-center gap-1 text-sm text-green-600"><CheckCircle className="size-4" /> Enabled</span>
            ) : (
              <span className="flex items-center gap-1 text-sm text-gray-500"><XCircle className="size-4" /> Disabled</span>
            )}
          </li>
          <li className="flex items-center justify-between rounded border border-gray-100 px-3 py-2">
            <span className="text-sm text-gray-700">Export jobs health</span>
            {status.exportJobsHealthy === true && <span className="flex items-center gap-1 text-sm text-green-600"><CheckCircle className="size-4" /> Healthy</span>}
            {status.exportJobsHealthy === false && <span className="flex items-center gap-1 text-sm text-amber-600">Issues</span>}
            {status.exportJobsHealthy === null && <span className="text-sm text-gray-400">—</span>}
          </li>
          <li className="flex items-center justify-between rounded border border-gray-100 px-3 py-2">
            <span className="text-sm text-gray-700">Pending approvals</span>
            {status.pendingApprovalsCount > 0 ? (
              <Link href="/dashboard/admin/settings" className="flex items-center gap-1 text-sm text-primary hover:underline">
                {status.pendingApprovalsCount} pending
              </Link>
            ) : (
              <span className="text-sm text-gray-500">None</span>
            )}
          </li>
        </ul>
      </section>
    </div>
  )
}
