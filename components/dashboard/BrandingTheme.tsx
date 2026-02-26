'use client'

import React, { useState } from 'react'
import {
  DEFAULT_BRANDING,
  FONT_OPTIONS,
  DENSITY_OPTIONS,
  LANGUAGE_OPTIONS,
  type UIDensity,
  type DefaultLanguage,
} from '@/lib/branding-data'
import { Palette, Type, Layout, Languages, ZoomIn } from 'lucide-react'

export function BrandingTheme() {
  const [config, setConfig] = useState(DEFAULT_BRANDING)

  const update = (patch: Partial<typeof config>) => setConfig((c) => ({ ...c, ...patch }))

  return (
    <div className="min-w-0 space-y-6 overflow-x-hidden">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Branding & Theme</h1>
        <p className="mt-0.5 text-sm text-gray-500">
          Aarong look and feel. Logo, colors, typography, density. Default language and large text mode for field users.
        </p>
      </div>

      {/* Logo */}
      <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900"><Palette className="size-4" /> Logo</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Header logo</label>
            <input
              type="text"
              placeholder="URL or upload"
              value={config.logoHeaderUrl}
              onChange={(e) => update({ logoHeaderUrl: e.target.value })}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Sidebar logo</label>
            <input
              type="text"
              placeholder="URL or upload"
              value={config.logoSidebarUrl}
              onChange={(e) => update({ logoSidebarUrl: e.target.value })}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
        </div>
      </section>

      {/* Color palette */}
      <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-gray-900">Color palette</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Primary</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={config.primaryColor}
                onChange={(e) => update({ primaryColor: e.target.value })}
                className="h-10 w-14 cursor-pointer rounded border border-gray-300"
              />
              <input
                type="text"
                value={config.primaryColor}
                onChange={(e) => update({ primaryColor: e.target.value })}
                className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Secondary</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={config.secondaryColor}
                onChange={(e) => update({ secondaryColor: e.target.value })}
                className="h-10 w-14 cursor-pointer rounded border border-gray-300"
              />
              <input
                type="text"
                value={config.secondaryColor}
                onChange={(e) => update({ secondaryColor: e.target.value })}
                className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Neutral</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={config.neutralColor}
                onChange={(e) => update({ neutralColor: e.target.value })}
                className="h-10 w-14 cursor-pointer rounded border border-gray-300"
              />
              <input
                type="text"
                value={config.neutralColor}
                onChange={(e) => update({ neutralColor: e.target.value })}
                className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Typography */}
      <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900"><Type className="size-4" /> Typography</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Font family</label>
            <select
              value={config.fontFamily}
              onChange={(e) => update({ fontFamily: e.target.value })}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
            >
              {FONT_OPTIONS.map((f) => (
                <option key={f.id} value={f.id}>{f.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Base font size</label>
            <input
              type="text"
              value={config.fontSizeBase}
              onChange={(e) => update({ fontSizeBase: e.target.value })}
              placeholder="e.g. 16px"
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
        </div>
      </section>

      {/* UI density */}
      <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900"><Layout className="size-4" /> UI density</h2>
        <div className="flex flex-wrap gap-2">
          {DENSITY_OPTIONS.map((d) => (
            <label
              key={d.id}
              className={`flex cursor-pointer items-center rounded-lg border px-3 py-2 text-sm ${config.uiDensity === d.id ? 'border-primary bg-primary/5 text-primary' : 'border-gray-300 hover:bg-gray-50'}`}
            >
              <input
                type="radio"
                name="density"
                checked={config.uiDensity === d.id}
                onChange={() => update({ uiDensity: d.id })}
                className="sr-only"
              />
              {d.label}
            </label>
          ))}
        </div>
        <p className="mt-2 text-xs text-gray-500">Compact or comfortable spacing. Helpful for different screen sizes.</p>
      </section>

      {/* Default language + Large text mode */}
      <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900"><Languages className="size-4" /> Language & accessibility</h2>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Default language</label>
            <select
              value={config.defaultLanguage}
              onChange={(e) => update({ defaultLanguage: e.target.value as DefaultLanguage })}
              className="w-full max-w-xs rounded border border-gray-300 px-3 py-2 text-sm"
            >
              {LANGUAGE_OPTIONS.map((l) => (
                <option key={l.id} value={l.id}>{l.label}</option>
              ))}
            </select>
          </div>
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={config.largeTextMode}
              onChange={(e) => update({ largeTextMode: e.target.checked })}
              className="rounded text-primary"
            />
            <ZoomIn className="size-4 text-gray-500" />
            <div>
              <span className="text-sm font-medium text-gray-900">Large text mode</span>
              <p className="text-xs text-gray-500">Better usability for field users. Increases default text size.</p>
            </div>
          </label>
        </div>
      </section>

      <div className="flex gap-2">
        <button type="button" className="rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Reset</button>
        <button type="button" className="rounded border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90">Save changes</button>
      </div>
    </div>
  )
}
