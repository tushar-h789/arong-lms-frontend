'use client'

import React, { useState, useMemo } from 'react'
import {
  ASSETS,
  ASSET_TYPE_LABELS,
  ASSET_CATEGORY_LABELS,
  COMPRESSION_PRESET_LABELS,
  ASSET_CATEGORIES,
  ASSET_TYPES,
  type AssetRow,
  type AssetType,
  type AssetCategory,
  type CompressionPreset,
} from '@/lib/asset-library-data'
import {
  Search,
  Upload,
  MoreVertical,
  FileText,
  Image as ImageIcon,
  Video,
  FileCode,
  Lock,
  Wifi,
  Download,
  RefreshCw,
  X,
} from 'lucide-react'

export function AssetLibrary() {
  const [assets, setAssets] = useState<AssetRow[]>(ASSETS)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({
    assetType: '' as AssetType | '',
    category: '' as AssetCategory | '',
    compressionPreset: '' as CompressionPreset | '',
    offlineOnly: false,
  })
  const [showFilters, setShowFilters] = useState(false)
  const [uploadOpen, setUploadOpen] = useState(false)
  const [replaceTarget, setReplaceTarget] = useState<AssetRow | null>(null)
  const [accessModalAsset, setAccessModalAsset] = useState<AssetRow | null>(null)

  const filtered = useMemo(() => {
    return assets.filter((a) => {
      const q = search.toLowerCase()
      if (q && !a.name.toLowerCase().includes(q)) return false
      if (filters.assetType && a.assetType !== filters.assetType) return false
      if (filters.category && a.category !== filters.category) return false
      if (filters.compressionPreset && a.compressionPreset !== filters.compressionPreset) return false
      if (filters.offlineOnly && !a.offlineDownloadAllowed) return false
      return true
    })
  }, [assets, search, filters])

  const handleUpload = (newAsset: Omit<AssetRow, 'id' | 'version' | 'uploadedAt' | 'uploadedBy'>) => {
    setAssets((prev) => {
      const id = `a${Date.now()}`
      const now = new Date().toISOString()
      return [
        ...prev,
        {
          ...newAsset,
          id,
          version: 1,
          uploadedAt: now,
          uploadedBy: 'Current User',
        },
      ]
    })
    setUploadOpen(false)
  }

  const handleReplace = (oldAsset: AssetRow, newUrl: string) => {
    setAssets((prev) =>
      prev.map((a) => {
        if (a.id !== oldAsset.id) return a
        return {
          ...a,
          url: newUrl,
          version: a.version + 1,
          replacedAt: new Date().toISOString(),
          replacedBy: a.id,
          uploadedAt: new Date().toISOString(),
          uploadedBy: 'Current User',
        }
      })
    )
    setReplaceTarget(null)
  }

  const activeFilterCount = [filters.assetType, filters.category, filters.compressionPreset, filters.offlineOnly].filter(
    Boolean
  ).length

  return (
    <div className="min-w-0 space-y-6 overflow-x-hidden">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="wrap-break-word text-2xl font-bold text-gray-900 dark:text-gray-100">Asset Library (Content Hub)</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Reusable videos, docs, images in one place — upload, version, access rules, low-bandwidth & offline
          </p>
        </div>
        <button
          type="button"
          onClick={() => setUploadOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg border border-transparent bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary/90"
        >
          <Upload className="size-4" />
          Upload asset
        </button>
      </div>

      {uploadOpen && (
        <UploadAssetModal
          onClose={() => setUploadOpen(false)}
          onUpload={handleUpload}
          replaceTarget={null}
        />
      )}
      {replaceTarget && (
        <ReplaceVersionModal
          asset={replaceTarget}
          onClose={() => setReplaceTarget(null)}
          onReplace={handleReplace}
        />
      )}
      {accessModalAsset && (
        <AccessRulesModal asset={accessModalAsset} onClose={() => setAccessModalAsset(null)} />
      )}

      {/* Search + filters */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-4 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <input
              type="search"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 pl-10 pr-3 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`rounded-lg border px-4 py-2 text-sm font-medium ${
              showFilters || activeFilterCount > 0
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
            }`}
          >
            Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 grid gap-3 border-t border-gray-200 dark:border-gray-600 pt-4 sm:grid-cols-2 lg:grid-cols-4">
            <FilterSelect
              label="Asset type"
              value={filters.assetType}
              options={['', ...ASSET_TYPES.map((t) => ASSET_TYPE_LABELS[t])]}
              valueMap={['', ...ASSET_TYPES]}
              onChange={(v) => setFilters((f) => ({ ...f, assetType: v as AssetType | '' }))}
            />
            <FilterSelect
              label="Category"
              value={filters.category}
              options={['', ...ASSET_CATEGORIES.map((c) => ASSET_CATEGORY_LABELS[c])]}
              valueMap={['', ...ASSET_CATEGORIES]}
              onChange={(v) => setFilters((f) => ({ ...f, category: v as AssetCategory | '' }))}
            />
            <FilterSelect
              label="Compression / quality"
              value={filters.compressionPreset}
              options={['', ...(Object.keys(COMPRESSION_PRESET_LABELS) as CompressionPreset[])]}
              valueMap={['', ...(Object.keys(COMPRESSION_PRESET_LABELS) as CompressionPreset[])]}
              optionLabels={COMPRESSION_PRESET_LABELS}
              onChange={(v) => setFilters((f) => ({ ...f, compressionPreset: v as CompressionPreset | '' }))}
            />
            <div className="flex items-end">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.offlineOnly}
                  onChange={(e) => setFilters((f) => ({ ...f, offlineOnly: e.target.checked }))}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Offline download allowed only</span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Asset
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Version
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Access
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Quality / Offline
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Uploaded
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600 bg-white dark:bg-gray-800">
              {filtered.map((asset) => (
                <AssetRowComponent
                  key={asset.id}
                  asset={asset}
                  onReplace={() => setReplaceTarget(asset)}
                  onAccess={() => setAccessModalAsset(asset)}
                />
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="px-4 py-12 text-center text-sm text-gray-500 dark:text-gray-400">No assets match your filters.</div>
        )}
      </div>
    </div>
  )
}

function FilterSelect({
  label,
  value,
  options,
  valueMap,
  optionLabels,
  onChange,
}: {
  label: string
  value: string
  options: readonly string[]
  valueMap: readonly string[]
  optionLabels?: Record<string, string>
  onChange: (v: string) => void
}) {
  const labels = optionLabels
    ? valueMap.map((v) => (v ? optionLabels[v] ?? v : 'All'))
    : options
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      >
        {valueMap.map((v, i) => (
          <option key={v || '_'} value={v || ''}>
            {i === 0 ? 'All' : labels[i]}
          </option>
        ))}
      </select>
    </div>
  )
}

function AssetRowComponent({
  asset,
  onReplace,
  onAccess,
}: {
  asset: AssetRow
  onReplace: () => void
  onAccess: () => void
}) {
  const [menuOpen, setMenuOpen] = useState(false)

  const TypeIcon =
    asset.assetType === 'video'
      ? Video
      : asset.assetType === 'image'
        ? ImageIcon
        : asset.assetType === 'pdf' || asset.assetType === 'ppt'
          ? FileText
          : FileCode

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400">
            <TypeIcon className="size-5" />
          </div>
          <div>
            <span className="font-medium text-gray-900 dark:text-gray-100">{asset.name}</span>
            <span className="block text-xs text-gray-500 dark:text-gray-400 truncate max-w-[200px]">{asset.url}</span>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{ASSET_TYPE_LABELS[asset.assetType]}</td>
      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{ASSET_CATEGORY_LABELS[asset.category]}</td>
      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
        v{asset.version}
        {asset.replacedAt && (
          <span className="ml-1 text-xs text-gray-400 dark:text-gray-500" title={`Replaced ${asset.replacedAt}`}>
            (replaced)
          </span>
        )}
      </td>
      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
        <button
          type="button"
          onClick={onAccess}
          className="inline-flex items-center gap-1 rounded bg-slate-100 dark:bg-slate-600/50 px-2 py-1 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
        >
          <Lock className="size-3" />
          {asset.accessRules}
        </button>
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <span
            className="inline-flex items-center gap-1 rounded bg-gray-100 dark:bg-gray-600/50 px-2 py-0.5 text-xs text-gray-700 dark:text-gray-300"
            title="Compression / quality preset"
          >
            <Wifi className="size-3" />
            {COMPRESSION_PRESET_LABELS[asset.compressionPreset]}
          </span>
          {asset.offlineDownloadAllowed && (
            <span
              className="inline-flex items-center gap-1 rounded bg-emerald-100 dark:bg-emerald-900/40 px-2 py-0.5 text-xs text-emerald-800 dark:text-emerald-300"
              title="Offline download allowed (future mobile app)"
            >
              <Download className="size-3" />
              Offline OK
            </span>
          )}
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
        <span className="block">{asset.uploadedBy}</span>
        <span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(asset.uploadedAt)}</span>
      </td>
      <td className="relative px-4 py-3 text-right">
        <div className="relative flex justify-end">
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded p-1.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600"
            aria-expanded={menuOpen}
          >
            <MoreVertical className="size-4" />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" aria-hidden onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-full z-20 mt-1 w-48 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 py-1 shadow-lg">
                <button
                  type="button"
                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  onClick={() => { onReplace(); setMenuOpen(false) }}
                >
                  <RefreshCw className="size-4" />
                  Replace / new version
                </button>
                <button
                  type="button"
                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  onClick={() => { onAccess(); setMenuOpen(false) }}
                >
                  <Lock className="size-4" />
                  Access rules
                </button>
              </div>
            </>
          )}
        </div>
      </td>
    </tr>
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

function UploadAssetModal({
  onClose,
  onUpload,
  replaceTarget,
}: {
  onClose: () => void
  onUpload: (asset: Omit<AssetRow, 'id' | 'version' | 'uploadedAt' | 'uploadedBy'>) => void
  replaceTarget: AssetRow | null
}) {
  const [name, setName] = useState('')
  const [assetType, setAssetType] = useState<AssetType>('pdf')
  const [category, setCategory] = useState<AssetRow['category']>('sop_images')
  const [url, setUrl] = useState('')
  const [accessRules, setAccessRules] = useState('')
  const [whoCanView, setWhoCanView] = useState('')
  const [compressionPreset, setCompressionPreset] = useState<CompressionPreset>('medium')
  const [offlineDownloadAllowed, setOfflineDownloadAllowed] = useState(true)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUpload({
      name: name.trim(),
      assetType,
      category,
      url: url.trim(),
      replacedAt: undefined,
      replacedBy: undefined,
      accessRules: accessRules.trim() || 'All',
      whoCanView: whoCanView ? whoCanView.split(',').map((s) => s.trim()).filter(Boolean) : ['All'],
      compressionPreset,
      offlineDownloadAllowed,
    })
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" aria-hidden onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="upload-asset-title"
        className="relative z-10 w-full max-w-lg rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-600 px-6 py-4">
          <h2 id="upload-asset-title" className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {replaceTarget ? 'Replace / new version' : 'Upload asset'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1.5 text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-200"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Upload: PDF / PPT / Video / Text / Images. Enter URL or path (file upload can be wired later).
          </p>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Asset name"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
              <select
                value={assetType}
                onChange={(e) => setAssetType(e.target.value as AssetType)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {ASSET_TYPES.map((t) => (
                  <option key={t} value={t}>{ASSET_TYPE_LABELS[t]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as AssetRow['category'])}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {ASSET_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{ASSET_CATEGORY_LABELS[c]}</option>
                ))}
              </select>
              <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">SOP Images, Training Videos, Safety Posters, Checklists</p>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">URL or path</label>
            <input
              type="text"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="/assets/file.pdf or https://..."
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Access rules (who can view)</label>
            <input
              type="text"
              value={accessRules}
              onChange={(e) => setAccessRules(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="e.g. All centers, By role"
            />
            <input
              type="text"
              value={whoCanView}
              onChange={(e) => setWhoCanView(e.target.value)}
              className="mt-2 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Who can view (comma-separated: centers, groups, roles)"
            />
          </div>
          <div className="rounded-lg border border-primary/30 dark:border-primary/40 bg-primary/5 dark:bg-primary/10 p-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Aarong options</h3>
            <div className="mt-2">
              <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">Compression / quality preset</label>
              <select
                value={compressionPreset}
                onChange={(e) => setCompressionPreset(e.target.value as CompressionPreset)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {(Object.entries(COMPRESSION_PRESET_LABELS) as [CompressionPreset, string][]).map(([k, label]) => (
                  <option key={k} value={k}>{label}</option>
                ))}
              </select>
              <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">Low bandwidth preset for field use</p>
            </div>
            <label className="mt-3 flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={offlineDownloadAllowed}
                onChange={(e) => setOfflineDownloadAllowed(e.target.checked)}
                className="rounded border-gray-300 dark:border-gray-500 text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Offline download permission</span>
            </label>
            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">For future mobile app</p>
          </div>
          <div className="flex justify-end gap-2 border-t border-gray-200 dark:border-gray-600 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
            >
              {replaceTarget ? 'Replace' : 'Upload'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function ReplaceVersionModal({
  asset,
  onClose,
  onReplace,
}: {
  asset: AssetRow
  onClose: () => void
  onReplace: (asset: AssetRow, newUrl: string) => void
}) {
  const [newUrl, setNewUrl] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newUrl.trim()) onReplace(asset, newUrl.trim())
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" aria-hidden onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 w-full max-w-md rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-6 shadow-xl"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Replace / new version</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Upload a new file or enter URL to replace &quot;{asset.name}&quot; (v{asset.version}). Optional versioning.
        </p>
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <input
            type="text"
            required
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="New file URL or path"
          />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600">
              Cancel
            </button>
            <button type="submit" className="rounded-lg border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90">
              Replace
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function AccessRulesModal({ asset, onClose }: { asset: AssetRow; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" aria-hidden onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 w-full max-w-md rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-6 shadow-xl"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Access rules — who can view</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{asset.name}</p>
        <div className="mt-4 space-y-2">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Rules: {asset.accessRules}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Who can view: {asset.whoCanView.join(', ')}</p>
        </div>
        <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">Edit access in upload/replace form or a dedicated access panel.</p>
        <button
          type="button"
          onClick={onClose}
          className="mt-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
        >
          Close
        </button>
      </div>
    </div>
  )
}
