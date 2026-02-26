'use client'

import React from 'react'
import { Key, Users, Clock } from 'lucide-react'

export function SSOAuth() {
  return (
    <div className="min-w-0 space-y-6 overflow-x-hidden">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">SSO / Authentication</h1>
        <p className="mt-0.5 text-sm text-gray-500">
          Corporate login. SAML/OIDC config, allowed domains, role mapping (SSO claim → LMS role), session duration. Test login.
        </p>
      </div>

      <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900"><Key className="size-4" /> SAML / OIDC config</h2>
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Provider</label>
            <select className="w-full max-w-xs rounded border border-gray-300 px-3 py-2 text-sm"><option value="saml">SAML</option><option value="oidc">OIDC</option></select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">IdP metadata URL / Issuer</label>
            <input type="url" placeholder="https://..." className="w-full max-w-md rounded border border-gray-300 px-3 py-2 text-sm" />
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-gray-900">Allowed domains</h2>
        <input type="text" placeholder="e.g. aarong.com.bd, company.com" className="w-full rounded border border-gray-300 px-3 py-2 text-sm" />
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900"><Users className="size-4" /> Role mapping (SSO claim → LMS role)</h2>
        <table className="min-w-full text-sm">
          <thead>
            <tr><th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">Claim</th><th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">Value</th><th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">LMS role</th></tr>
          </thead>
          <tbody>
            <tr className="border-t border-gray-100"><td className="px-3 py-2">department</td><td className="px-3 py-2">hr</td><td className="px-3 py-2">hr</td></tr>
            <tr className="border-t border-gray-100"><td className="px-3 py-2">role</td><td className="px-3 py-2">admin</td><td className="px-3 py-2">admin</td></tr>
          </tbody>
        </table>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900"><Clock className="size-4" /> Session duration</h2>
        <input type="number" min={5} placeholder="60" className="w-24 rounded border border-gray-300 px-3 py-2 text-sm" />
        <span className="ml-2 text-sm text-gray-500">minutes</span>
      </section>

      <button type="button" className="rounded border border-primary bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/20">Test login</button>
    </div>
  )
}
