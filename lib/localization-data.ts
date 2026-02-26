/**
 * Localization / Language Management.
 * Language variants, subtitles/transcript upload, "Visual-first version" tag.
 */

export type LanguageVariantRow = {
  id: string
  courseId: string
  courseTitle: string
  primaryLanguage: string
  variants: { lang: string; label: string; hasSubtitles: boolean; hasTranscript: boolean; visualFirst: boolean }[]
  updatedAt: string
}

export const LANGUAGE_VARIANTS: LanguageVariantRow[] = [
  {
    id: 'lv1',
    courseId: 'c1',
    courseTitle: 'Fire Safety at Workplace',
    primaryLanguage: 'bn',
    variants: [
      { lang: 'bn', label: 'Bengali (primary)', hasSubtitles: true, hasTranscript: true, visualFirst: false },
      { lang: 'en', label: 'English', hasSubtitles: true, hasTranscript: false, visualFirst: false },
      { lang: 'visual', label: 'Visual-first', hasSubtitles: false, hasTranscript: false, visualFirst: true },
    ],
    updatedAt: '2025-02-20T11:00:00Z',
  },
  {
    id: 'lv2',
    courseId: 'c2',
    courseTitle: 'Standard Operating Procedure: Dyeing',
    primaryLanguage: 'bn',
    variants: [
      { lang: 'bn', label: 'Bengali (primary)', hasSubtitles: false, hasTranscript: true, visualFirst: false },
      { lang: 'visual', label: 'Visual-first version', hasSubtitles: false, hasTranscript: false, visualFirst: true },
    ],
    updatedAt: '2025-02-18T16:00:00Z',
  },
]
