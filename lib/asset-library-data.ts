/**
 * Asset Library (Content Hub) — one place for reusable videos, docs, images.
 * Aarong-friendly: SOP Images, Training Videos, Safety Posters, Checklists; low-bandwidth preset; offline download.
 */

export type AssetType = 'pdf' | 'ppt' | 'video' | 'text' | 'image'

/** Aarong asset categories */
export type AssetCategory =
  | 'sop_images'
  | 'training_videos'
  | 'safety_posters'
  | 'checklists'

export type CompressionPreset = 'original' | 'high' | 'medium' | 'low'

export type AssetRow = {
  id: string
  name: string
  assetType: AssetType
  category: AssetCategory
  url: string
  version: number
  replacedAt?: string
  replacedBy?: string
  accessRules: string
  whoCanView: string[]
  compressionPreset: CompressionPreset
  offlineDownloadAllowed: boolean
  uploadedAt: string
  uploadedBy: string
}

export const ASSETS: AssetRow[] = [
  {
    id: 'a1',
    name: 'Dyeing SOP Step 1',
    assetType: 'image',
    category: 'sop_images',
    url: '/assets/sop-dyeing-1.jpg',
    version: 1,
    accessRules: 'Center + Group',
    whoCanView: ['Dhaka HQ', 'Chittagong', 'Weaving A'],
    compressionPreset: 'low',
    offlineDownloadAllowed: true,
    uploadedAt: '2025-02-01T10:00:00Z',
    uploadedBy: 'Rahim Uddin',
  },
  {
    id: 'a2',
    name: 'Fire Safety Demo',
    assetType: 'video',
    category: 'training_videos',
    url: '/assets/fire-safety-demo.mp4',
    version: 2,
    replacedAt: '2025-02-10T09:00:00Z',
    replacedBy: 'a2-v2',
    accessRules: 'All centers',
    whoCanView: ['Dhaka HQ', 'Chittagong', 'Field Center 1'],
    compressionPreset: 'medium',
    offlineDownloadAllowed: true,
    uploadedAt: '2025-02-10T09:00:00Z',
    uploadedBy: 'Nadia Islam',
  },
  {
    id: 'a3',
    name: 'Safety Poster - PPE',
    assetType: 'image',
    category: 'safety_posters',
    url: '/assets/ppe-poster.png',
    version: 1,
    accessRules: 'All',
    whoCanView: ['All'],
    compressionPreset: 'high',
    offlineDownloadAllowed: true,
    uploadedAt: '2025-01-15T14:00:00Z',
    uploadedBy: 'Admin User',
  },
  {
    id: 'a4',
    name: 'Quality Checklist PDF',
    assetType: 'pdf',
    category: 'checklists',
    url: '/assets/quality-checklist.pdf',
    version: 1,
    accessRules: 'By role',
    whoCanView: ['instructor', 'hr'],
    compressionPreset: 'original',
    offlineDownloadAllowed: true,
    uploadedAt: '2025-02-05T11:00:00Z',
    uploadedBy: 'Nadia Islam',
  },
  {
    id: 'a5',
    name: 'Weaving SOP Slides',
    assetType: 'ppt',
    category: 'sop_images',
    url: '/assets/weaving-sop.pptx',
    version: 1,
    accessRules: 'Center',
    whoCanView: ['Dhaka HQ', 'Chittagong'],
    compressionPreset: 'medium',
    offlineDownloadAllowed: false,
    uploadedAt: '2025-02-18T16:00:00Z',
    uploadedBy: 'Abdul Karim',
  },
]

export const ASSET_TYPE_LABELS: Record<AssetType, string> = {
  pdf: 'PDF',
  ppt: 'PPT',
  video: 'Video',
  text: 'Text',
  image: 'Image',
}

export const ASSET_CATEGORY_LABELS: Record<AssetCategory, string> = {
  sop_images: 'SOP Images',
  training_videos: 'Training Videos',
  safety_posters: 'Safety Posters',
  checklists: 'Checklists',
}

export const COMPRESSION_PRESET_LABELS: Record<CompressionPreset, string> = {
  original: 'Original',
  high: 'High quality',
  medium: 'Medium (balanced)',
  low: 'Low bandwidth',
}

export const ASSET_CATEGORIES: AssetCategory[] = [
  'sop_images',
  'training_videos',
  'safety_posters',
  'checklists',
]

export const ASSET_TYPES: AssetType[] = ['pdf', 'ppt', 'video', 'text', 'image']
