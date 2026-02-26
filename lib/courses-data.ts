/**
 * Mock data for Courses list (lifecycle control).
 * Replace with real API calls later.
 * Aarong-friendly: Course type (Safety/SOP/Skill/Quality/Compliance), Language/Format, Low bandwidth.
 */

export type CourseStatus = 'draft' | 'published' | 'archived'

export type CourseType = 'safety' | 'sop' | 'skill' | 'quality' | 'compliance'

/** Language/format tag for Aarong: localized voice/video, image-step, text */
export type LanguageFormat =
  | 'bangla_voice'
  | 'bangla_video'
  | 'image_step'
  | 'text'
  | 'bangla_text'

export type VisibilityScope = 'center' | 'group' | 'department'

export type CourseRow = {
  id: string
  title: string
  status: CourseStatus
  category: string
  courseType: CourseType
  languageFormat: LanguageFormat[]
  lowBandwidthReady: boolean
  visibility: VisibilityScope[]
  visibilityCenters: string[]
  visibilityGroups: string[]
  createdBy: string
  createdAt: string
  scheduledStart?: string
  scheduledEnd?: string
}

export const COURSES: CourseRow[] = [
  {
    id: 'c1',
    title: 'Fire Safety at Workplace',
    status: 'published',
    category: 'Safety',
    courseType: 'safety',
    languageFormat: ['bangla_video', 'image_step'],
    lowBandwidthReady: true,
    visibility: ['center', 'group'],
    visibilityCenters: ['Dhaka HQ', 'Chittagong'],
    visibilityGroups: ['Weaving A', 'Embroidery B'],
    createdBy: 'Nadia Islam',
    createdAt: '2025-01-15T10:00:00Z',
    scheduledStart: '2025-01-20T00:00:00Z',
    scheduledEnd: '2025-12-31T23:59:59Z',
  },
  {
    id: 'c2',
    title: 'Standard Operating Procedure: Dyeing',
    status: 'published',
    category: 'SOP',
    courseType: 'sop',
    languageFormat: ['bangla_voice', 'image_step', 'text'],
    lowBandwidthReady: false,
    visibility: ['center', 'department'],
    visibilityCenters: ['Chittagong'],
    visibilityGroups: ['Dyeing C'],
    createdBy: 'Rahim Uddin',
    createdAt: '2025-02-01T09:00:00Z',
    scheduledStart: '2025-02-10T00:00:00Z',
    scheduledEnd: undefined,
  },
  {
    id: 'c3',
    title: 'Basic Weaving Skills',
    status: 'draft',
    category: 'Skill',
    courseType: 'skill',
    languageFormat: ['bangla_video', 'text'],
    lowBandwidthReady: true,
    visibility: ['group'],
    visibilityCenters: [],
    visibilityGroups: ['Weaving A', 'Weaving B'],
    createdBy: 'Abdul Karim',
    createdAt: '2025-02-18T14:30:00Z',
    scheduledStart: undefined,
    scheduledEnd: undefined,
  },
  {
    id: 'c4',
    title: 'Quality Checkpoints',
    status: 'published',
    category: 'Quality',
    courseType: 'quality',
    languageFormat: ['image_step', 'text'],
    lowBandwidthReady: true,
    visibility: ['center', 'group'],
    visibilityCenters: ['Dhaka HQ', 'Chittagong', 'Field Center 1'],
    visibilityGroups: ['Embroidery A', 'Embroidery B'],
    createdBy: 'Nadia Islam',
    createdAt: '2025-01-28T11:00:00Z',
    scheduledStart: '2025-02-01T00:00:00Z',
    scheduledEnd: '2025-06-30T23:59:59Z',
  },
  {
    id: 'c5',
    title: 'Compliance: Labor Standards',
    status: 'archived',
    category: 'Compliance',
    courseType: 'compliance',
    languageFormat: ['bangla_text', 'text'],
    lowBandwidthReady: true,
    visibility: ['center'],
    visibilityCenters: ['Dhaka HQ'],
    visibilityGroups: [],
    createdBy: 'Admin User',
    createdAt: '2024-11-01T08:00:00Z',
    scheduledStart: '2024-11-15T00:00:00Z',
    scheduledEnd: '2025-01-31T23:59:59Z',
  },
  {
    id: 'c6',
    title: 'Embroidery Stitch SOP',
    status: 'draft',
    category: 'SOP',
    courseType: 'sop',
    languageFormat: ['bangla_video', 'image_step'],
    lowBandwidthReady: false,
    visibility: ['group'],
    visibilityCenters: [],
    visibilityGroups: ['Embroidery A', 'Embroidery B'],
    createdBy: 'Fatima Begum',
    createdAt: '2025-02-20T16:00:00Z',
    scheduledStart: undefined,
    scheduledEnd: undefined,
  },
]

/** Unique values for filter dropdowns */
export const COURSE_FILTER_OPTIONS = {
  statuses: ['draft', 'published', 'archived'] as const,
  categories: ['Safety', 'SOP', 'Skill', 'Quality', 'Compliance'] as const,
  courseTypes: ['safety', 'sop', 'skill', 'quality', 'compliance'] as const,
  languageFormats: ['bangla_voice', 'bangla_video', 'image_step', 'text', 'bangla_text'] as const,
  visibilityScopes: ['center', 'group', 'department'] as const,
  centers: ['Dhaka HQ', 'Chittagong', 'Field Center 1'] as const,
  groups: ['Weaving A', 'Weaving B', 'Embroidery A', 'Embroidery B', 'Dyeing C'] as const,
  createdBy: ['Nadia Islam', 'Rahim Uddin', 'Abdul Karim', 'Fatima Begum', 'Admin User'] as const,
}

export const COURSE_TYPE_LABELS: Record<CourseType, string> = {
  safety: 'Safety',
  sop: 'SOP',
  skill: 'Skill',
  quality: 'Quality',
  compliance: 'Compliance',
}

export const LANGUAGE_FORMAT_LABELS: Record<LanguageFormat, string> = {
  bangla_voice: 'Localized voice',
  bangla_video: 'Localized video',
  image_step: 'Image-step',
  text: 'Text',
  bangla_text: 'Localized text',
}
