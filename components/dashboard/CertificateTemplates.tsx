'use client'

import React, { useState } from 'react'
import { MOCK_CERTIFICATE_TEMPLATE } from '@/lib/certificate-templates-data'
import { Award, Eye, FileSignature, QrCode } from 'lucide-react'

export function CertificateTemplates() {
  const [layout, setLayout] = useState(MOCK_CERTIFICATE_TEMPLATE.layout)
  const [preview, setPreview] = useState(false)

  return (
    <div className="min-w-0 space-y-6 overflow-x-hidden">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Certificate Templates</h1>
        <p className="mt-0.5 text-sm text-gray-500">
          Design certificates for course/path completion. Layout, signatures, ID/QR, expiry. Compliance proof and recognition.
        </p>
      </div>

      {/* Layout */}
      <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-gray-900">Certificate layout</h2>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Logo URL</label>
            <input type="text" value={layout.logoUrl} onChange={(e) => setLayout((l) => ({ ...l, logoUrl: e.target.value }))} placeholder="Logo for certificate" className="w-full max-w-md rounded border border-gray-300 px-3 py-2 text-sm" />
          </div>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={layout.showName} onChange={(e) => setLayout((l) => ({ ...l, showName: e.target.checked }))} className="rounded text-primary" /> Show learner name</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={layout.showCoursePath} onChange={(e) => setLayout((l) => ({ ...l, showCoursePath: e.target.checked }))} className="rounded text-primary" /> Show course/path</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={layout.showDate} onChange={(e) => setLayout((l) => ({ ...l, showDate: e.target.checked }))} className="rounded text-primary" /> Show date</label>
          </div>
        </div>
      </section>

      {/* Signature blocks */}
      <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900"><FileSignature className="size-4" /> Signature blocks (HR / Trainer)</h2>
        <ul className="space-y-2">
          {layout.signatureBlocks.map((sig, i) => (
            <li key={i} className="flex items-center gap-2 rounded border border-gray-200 p-2">
              <input type="text" value={sig.label} placeholder="Label" className="w-24 rounded border border-gray-300 px-2 py-1 text-sm" />
              <input type="text" value={sig.role} placeholder="Role" className="flex-1 rounded border border-gray-300 px-2 py-1 text-sm" />
            </li>
          ))}
        </ul>
      </section>

      {/* Certificate ID + QR, Expiry */}
      <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-gray-900">Options</h2>
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={layout.showCertificateId} onChange={(e) => setLayout((l) => ({ ...l, showCertificateId: e.target.checked }))} className="rounded text-primary" /> Certificate ID</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={layout.showQr} onChange={(e) => setLayout((l) => ({ ...l, showQr: e.target.checked }))} className="rounded text-primary" /> <QrCode className="size-4" /> QR code (optional)</label>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Expiry (months, for compliance)</label>
            <input type="number" min={0} placeholder="No expiry" value={layout.expiryMonths ?? ''} onChange={(e) => setLayout((l) => ({ ...l, expiryMonths: e.target.value ? Number(e.target.value) : null }))} className="w-24 rounded border border-gray-300 px-3 py-2 text-sm" />
          </div>
        </div>
      </section>

      {/* Preview + test generate */}
      <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900"><Eye className="size-4" /> Preview & test</h2>
        <button type="button" onClick={() => setPreview(!preview)} className="rounded border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-50">Preview certificate</button>
        <button type="button" className="ml-2 rounded border border-primary bg-primary/10 px-3 py-2 text-sm font-medium text-primary hover:bg-primary/20">Test generate PDF</button>
        {preview && (
          <div className="mt-4 rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
            <Award className="mx-auto size-12 text-gray-400" />
            <p className="mt-2 font-semibold text-gray-900">Certificate of Completion</p>
            <p className="mt-1 text-gray-600">[Learner name]</p>
            <p className="text-sm text-gray-500">[Course/Path name] · [Date]</p>
            <p className="mt-4 text-xs text-gray-400">[Signature blocks] · [Certificate ID] · [QR]</p>
          </div>
        )}
      </section>
    </div>
  )
}
