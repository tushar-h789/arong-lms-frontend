'use client'

import React, { useState } from 'react'
import { DEFAULT_PASSWORD_POLICY, DEFAULT_SESSION_POLICY, DEFAULT_LOCK_POLICY } from '@/lib/security-policies-data'
import { Lock, Shield, Clock, AlertTriangle } from 'lucide-react'

export function SecurityPolicies() {
  const [password, setPassword] = useState(DEFAULT_PASSWORD_POLICY)
  const [session, setSession] = useState(DEFAULT_SESSION_POLICY)
  const [lock, setLock] = useState(DEFAULT_LOCK_POLICY)
  const [admin2FA, setAdmin2FA] = useState(true)

  return (
    <div className="min-w-0 space-y-6 overflow-x-hidden">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Security Policies</h1>
        <p className="mt-0.5 text-sm text-gray-500">
          Password, 2FA, session, account lock. Support-friendly policy so field users do not get locked out by mistake.
        </p>
      </div>

      <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900"><Lock className="size-4" /> Password policy</h2>
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Min length</label>
            <input type="number" min={6} value={password.minLength} onChange={(e) => setPassword((p) => ({ ...p, minLength: Number(e.target.value) }))} className="w-20 rounded border border-gray-300 px-3 py-2 text-sm" />
          </div>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={password.requireUppercase} onChange={(e) => setPassword((p) => ({ ...p, requireUppercase: e.target.checked }))} className="rounded text-primary" /> Require uppercase</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={password.requireNumber} onChange={(e) => setPassword((p) => ({ ...p, requireNumber: e.target.checked }))} className="rounded text-primary" /> Require number</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={password.requireSpecial} onChange={(e) => setPassword((p) => ({ ...p, requireSpecial: e.target.checked }))} className="rounded text-primary" /> Require special character</label>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Reset frequency (days, optional)</label>
            <input type="number" min={0} placeholder="No expiry" value={password.resetFrequencyDays ?? ''} onChange={(e) => setPassword((p) => ({ ...p, resetFrequencyDays: e.target.value ? Number(e.target.value) : null }))} className="w-24 rounded border border-gray-300 px-3 py-2 text-sm" />
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900"><Shield className="size-4" /> 2FA policy</h2>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={admin2FA} onChange={(e) => setAdmin2FA(e.target.checked)} className="rounded text-primary" /> Admin / HR: 2FA mandatory</label>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900"><Clock className="size-4" /> Session rules</h2>
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Timeout (minutes)</label>
            <input type="number" min={5} value={session.timeoutMinutes} onChange={(e) => setSession((s) => ({ ...s, timeoutMinutes: Number(e.target.value) }))} className="w-24 rounded border border-gray-300 px-3 py-2 text-sm" />
          </div>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={session.singleDeviceLogin} onChange={(e) => setSession((s) => ({ ...s, singleDeviceLogin: e.target.checked }))} className="rounded text-primary" /> Single-device login (optional)</label>
        </div>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900"><AlertTriangle className="size-4" /> Account lock rules</h2>
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Failed attempts threshold</label>
            <input type="number" min={3} value={lock.failedAttemptsThreshold} onChange={(e) => setLock((l) => ({ ...l, failedAttemptsThreshold: Number(e.target.value) }))} className="w-24 rounded border border-gray-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Lockout duration (minutes)</label>
            <input type="number" min={5} value={lock.lockoutMinutes} onChange={(e) => setLock((l) => ({ ...l, lockoutMinutes: Number(e.target.value) }))} className="w-24 rounded border border-gray-300 px-3 py-2 text-sm" />
          </div>
        </div>
        <p className="mt-2 text-xs text-amber-700">Keep threshold and lockout support-friendly so field users can recover without long lockouts.</p>
      </section>
    </div>
  )
}
