/**
 * Training Needs Analysis (TNA) — data/report-driven: which center/group/artisan
 * has skill gaps, then suggest/assign training. Backbone: Skill taxonomy + gap scoring.
 * V1: LMS data only (completion %, quiz, drop-off, attendance). Phase-2: defect rate, supervisor eval.
 */

import { CENTERS, GROUPS } from '@/lib/assignment-monitor-data'

// —— Skill framework (TNA backbone) ——
export type SkillAreaId =
  | 'safety'
  | 'quality'
  | 'sop'
  | 'craft_embroidery'
  | 'craft_weaving'
  | 'craft_dyeing'
  | 'craft_finishing'
  | 'values_compliance'

export type SkillTopicId = string

export type SkillArea = {
  id: SkillAreaId
  name: string
  topicIds: SkillTopicId[]
}

export type SkillTopic = {
  id: SkillTopicId
  areaId: SkillAreaId
  name: string
  /** Course IDs tagged to this topic */
  courseIds: string[]
  /** Path IDs tagged to this topic */
  pathIds: string[]
}

export type GapLevel = 'high' | 'medium' | 'low'

// —— Gap scoring rules (V1) ——
// Quiz < 60% → High; Completion < 70% → Medium; Inactive 14 days → Medium; Practical fail → High
export const GAP_RULES = {
  quizHighThreshold: 60,
  completionMediumThreshold: 70,
  inactiveDaysMedium: 14,
}

export const GAP_LEVEL_LABELS: Record<GapLevel, string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
}

// —— Skill taxonomy (Aarong example) ——
const SKILL_AREAS: SkillArea[] = [
  { id: 'safety', name: 'Safety', topicIds: ['needle_safety', 'chemical_handling', 'fire_safety'] },
  { id: 'quality', name: 'Quality Checking', topicIds: ['defect_identification', 'finishing_standards'] },
  { id: 'sop', name: 'SOP Process', topicIds: ['sop_dyeing', 'sop_weaving', 'sop_embroidery'] },
  { id: 'craft_embroidery', name: 'Craft: Embroidery', topicIds: ['basic_stitch', 'pattern_alignment'] },
  { id: 'craft_weaving', name: 'Craft: Weaving', topicIds: ['loom_basics', 'pattern_weaving'] },
  { id: 'craft_dyeing', name: 'Craft: Dyeing', topicIds: ['dye_mixing', 'color_consistency'] },
  { id: 'craft_finishing', name: 'Craft: Finishing', topicIds: ['inspection', 'packaging_standards'] },
  { id: 'values_compliance', name: 'Values & Compliance', topicIds: ['code_of_conduct', 'certification_refresh'] },
]

const SKILL_TOPICS: SkillTopic[] = [
  { id: 'needle_safety', areaId: 'safety', name: 'Needle safety', courseIds: ['c1'], pathIds: ['p3'] },
  { id: 'chemical_handling', areaId: 'safety', name: 'Chemical handling', courseIds: ['c1'], pathIds: ['p3'] },
  { id: 'fire_safety', areaId: 'safety', name: 'Fire safety', courseIds: ['c1'], pathIds: ['p3'] },
  { id: 'defect_identification', areaId: 'quality', name: 'Defect Identification', courseIds: ['c2', 'c3'], pathIds: ['p4'] },
  { id: 'finishing_standards', areaId: 'quality', name: 'Finishing Standards', courseIds: ['c3'], pathIds: ['p4'] },
  { id: 'sop_dyeing', areaId: 'sop', name: 'SOP: Dyeing', courseIds: ['c2'], pathIds: ['p1'] },
  { id: 'sop_weaving', areaId: 'sop', name: 'SOP: Weaving', courseIds: [], pathIds: ['p1', 'p2'] },
  { id: 'sop_embroidery', areaId: 'sop', name: 'SOP: Embroidery', courseIds: [], pathIds: ['p1'] },
  { id: 'basic_stitch', areaId: 'craft_embroidery', name: 'Basic stitch', courseIds: [], pathIds: ['p1'] },
  { id: 'pattern_alignment', areaId: 'craft_embroidery', name: 'Pattern alignment', courseIds: [], pathIds: ['p1'] },
  { id: 'loom_basics', areaId: 'craft_weaving', name: 'Loom basics', courseIds: [], pathIds: ['p1', 'p2'] },
  { id: 'pattern_weaving', areaId: 'craft_weaving', name: 'Pattern weaving', courseIds: [], pathIds: ['p2'] },
  { id: 'dye_mixing', areaId: 'craft_dyeing', name: 'Dye mixing', courseIds: ['c2'], pathIds: ['p1'] },
  { id: 'color_consistency', areaId: 'craft_dyeing', name: 'Color consistency', courseIds: ['c2'], pathIds: [] },
  { id: 'inspection', areaId: 'craft_finishing', name: 'Inspection', courseIds: ['c3'], pathIds: ['p4'] },
  { id: 'packaging_standards', areaId: 'craft_finishing', name: 'Packaging standards', courseIds: ['c3'], pathIds: [] },
  { id: 'code_of_conduct', areaId: 'values_compliance', name: 'Code of conduct', courseIds: ['c1'], pathIds: ['p3'] },
  { id: 'certification_refresh', areaId: 'values_compliance', name: 'Certification refresh', courseIds: [], pathIds: ['p3'] },
]

export { SKILL_AREAS, SKILL_TOPICS }

// —— TNA Overview ——
export type TNAOverview = {
  topSkillGaps: { skillTopicName: string; skillAreaName: string; gapLevel: GapLevel; count: number }[]
  topCentersWithGaps: { center: string; highCount: number; mediumCount: number }[]
  complianceGapsSnapshot: { reason: string; count: number }[]
}

// —— By Center / Group ——
export type CenterGapRow = {
  center: string
  groupCount: number
  highGapCount: number
  mediumGapCount: number
  lowGapCount: number
  /** Heatmap: topicId → gap level for this center (worst per topic) */
  topicGaps: Record<SkillTopicId, GapLevel>
}

export type GroupGapRow = {
  center: string
  group: string
  highGapCount: number
  mediumGapCount: number
  lowGapCount: number
  learnerCount: number
}

export type PersonGapRow = {
  userId: string
  userName: string
  center: string
  group: string
  craft: string
  topicGaps: { topicId: SkillTopicId; topicName: string; gapLevel: GapLevel; quizScorePercent: number | null; completionPercent: number }[]
}

// —— By Skill Topic ——
export type SkillTopicGapRow = {
  topicId: SkillTopicId
  topicName: string
  areaName: string
  highCount: number
  mediumCount: number
  lowCount: number
  byCenter: { center: string; count: number; gapLevel: GapLevel }[]
}

// —— Recommendations (actionable) ——
export type TNARecommendation = {
  id: string
  gapLevel: GapLevel
  skillTopicName: string
  skillAreaName: string
  center: string
  group: string
  userIds: string[]
  userNames: string[]
  suggestedPathId: string
  suggestedPathName: string
  suggestedCourseIds: string[]
  suggestedCourseNames: string[]
}

// —— Mock data (replace with API / calculation job later) ——
const MOCK_TOP_SKILL_GAPS: TNAOverview['topSkillGaps'] = [
  { skillTopicName: 'Defect Identification', skillAreaName: 'Quality Checking', gapLevel: 'high', count: 24 },
  { skillTopicName: 'Fire safety', skillAreaName: 'Safety', gapLevel: 'high', count: 18 },
  { skillTopicName: 'SOP: Dyeing', skillAreaName: 'SOP Process', gapLevel: 'medium', count: 31 },
  { skillTopicName: 'Finishing Standards', skillAreaName: 'Quality Checking', gapLevel: 'medium', count: 22 },
  { skillTopicName: 'Certification refresh', skillAreaName: 'Values & Compliance', gapLevel: 'high', count: 12 },
]

const MOCK_TOP_CENTERS: TNAOverview['topCentersWithGaps'] = [
  { center: 'Chittagong', highCount: 15, mediumCount: 28 },
  { center: 'Dhaka HQ', highCount: 12, mediumCount: 35 },
  { center: 'Field Center 1', highCount: 8, mediumCount: 14 },
]

const MOCK_COMPLIANCE_SNAPSHOT: TNAOverview['complianceGapsSnapshot'] = [
  { reason: 'Safety certificate expired / expiring', count: 9 },
  { reason: 'Compliance training overdue', count: 5 },
  { reason: 'Quality SOP not completed', count: 14 },
]

const MOCK_CENTER_GAPS: CenterGapRow[] = CENTERS.slice(0, 3).map((center, i) => ({
  center,
  groupCount: i === 0 ? 4 : i === 1 ? 3 : 2,
  highGapCount: [12, 15, 8][i],
  mediumGapCount: [35, 28, 14][i],
  lowGapCount: [20, 18, 10][i],
  topicGaps: {
    defect_identification: (['high', 'high', 'medium'] as unknown as GapLevel)[i],
    fire_safety: 'high',
    sop_dyeing: 'medium',
    finishing_standards: (['medium', 'high', 'medium'] as unknown as GapLevel)[i],
    certification_refresh: (['low', 'high', 'medium'] as unknown as GapLevel)[i],
  } as Record<SkillTopicId, GapLevel>,
}))

const MOCK_GROUP_GAPS: GroupGapRow[] = [
  { center: 'Dhaka HQ', group: 'Weaving A', highGapCount: 3, mediumGapCount: 8, lowGapCount: 5, learnerCount: 16 },
  { center: 'Dhaka HQ', group: 'Weaving B', highGapCount: 2, mediumGapCount: 6, lowGapCount: 4, learnerCount: 12 },
  { center: 'Dhaka HQ', group: 'Embroidery B', highGapCount: 4, mediumGapCount: 9, lowGapCount: 3, learnerCount: 16 },
  { center: 'Chittagong', group: 'Dyeing C', highGapCount: 7, mediumGapCount: 12, lowGapCount: 6, learnerCount: 25 },
]

const MOCK_PERSON_GAPS: PersonGapRow[] = [
  {
    userId: 'u2',
    userName: 'Fatima Khan',
    center: 'Dhaka HQ',
    group: 'Embroidery B',
    craft: 'embroidery',
    topicGaps: [
      { topicId: 'defect_identification', topicName: 'Defect Identification', gapLevel: 'high', quizScorePercent: 52, completionPercent: 65 },
      { topicId: 'fire_safety', topicName: 'Fire safety', gapLevel: 'high', quizScorePercent: 58, completionPercent: 70 },
      { topicId: 'sop_embroidery', topicName: 'SOP: Embroidery', gapLevel: 'medium', quizScorePercent: 72, completionPercent: 80 },
    ],
  },
  {
    userId: 'u3',
    userName: 'Karim Hossain',
    center: 'Chittagong',
    group: 'Dyeing C',
    craft: 'dyeing',
    topicGaps: [
      { topicId: 'sop_dyeing', topicName: 'SOP: Dyeing', gapLevel: 'high', quizScorePercent: 48, completionPercent: 45 },
      { topicId: 'dye_mixing', topicName: 'Dye mixing', gapLevel: 'medium', quizScorePercent: 65, completionPercent: 60 },
      { topicId: 'defect_identification', topicName: 'Defect Identification', gapLevel: 'high', quizScorePercent: 55, completionPercent: 50 },
    ],
  },
  {
    userId: 'u10',
    userName: 'Mofizul Islam',
    center: 'Chittagong',
    group: 'Dyeing C',
    craft: 'dyeing',
    topicGaps: [
      { topicId: 'sop_dyeing', topicName: 'SOP: Dyeing', gapLevel: 'high', quizScorePercent: null, completionPercent: 20 },
      { topicId: 'certification_refresh', topicName: 'Certification refresh', gapLevel: 'high', quizScorePercent: null, completionPercent: 0 },
    ],
  },
]

const MOCK_SKILL_TOPIC_GAPS: SkillTopicGapRow[] = [
  {
    topicId: 'defect_identification',
    topicName: 'Defect Identification',
    areaName: 'Quality Checking',
    highCount: 24,
    mediumCount: 18,
    lowCount: 30,
    byCenter: [
      { center: 'Chittagong', count: 12, gapLevel: 'high' },
      { center: 'Dhaka HQ', count: 8, gapLevel: 'high' },
      { center: 'Field Center 1', count: 4, gapLevel: 'medium' },
    ],
  },
  {
    topicId: 'fire_safety',
    topicName: 'Fire safety',
    areaName: 'Safety',
    highCount: 18,
    mediumCount: 22,
    lowCount: 40,
    byCenter: [
      { center: 'Chittagong', count: 9, gapLevel: 'high' },
      { center: 'Dhaka HQ', count: 6, gapLevel: 'high' },
      { center: 'Field Center 1', count: 3, gapLevel: 'medium' },
    ],
  },
  {
    topicId: 'sop_dyeing',
    topicName: 'SOP: Dyeing',
    areaName: 'SOP Process',
    highCount: 14,
    mediumCount: 31,
    lowCount: 25,
    byCenter: [
      { center: 'Chittagong', count: 18, gapLevel: 'high' },
      { center: 'Dhaka HQ', count: 15, gapLevel: 'medium' },
      { center: 'Field Center 1', count: 12, gapLevel: 'medium' },
    ],
  },
]

const MOCK_RECOMMENDATIONS: TNARecommendation[] = [
  {
    id: 'rec1',
    gapLevel: 'high',
    skillTopicName: 'Defect Identification',
    skillAreaName: 'Quality Checking',
    center: 'Chittagong',
    group: 'Dyeing C',
    userIds: ['u3', 'u10', 'u11'],
    userNames: ['Karim Hossain', 'Mofizul Islam', 'Rokeya Begum'],
    suggestedPathId: 'p4',
    suggestedPathName: 'Quality SOP Refresher',
    suggestedCourseIds: ['c2', 'c3'],
    suggestedCourseNames: ['Standard Operating Procedure: Dyeing', 'Finishing Standards'],
  },
  {
    id: 'rec2',
    gapLevel: 'high',
    skillTopicName: 'Fire safety',
    skillAreaName: 'Safety',
    center: 'Dhaka HQ',
    group: 'Embroidery B',
    userIds: ['u2'],
    userNames: ['Fatima Khan'],
    suggestedPathId: 'p3',
    suggestedPathName: 'Safety & Compliance Path',
    suggestedCourseIds: ['c1'],
    suggestedCourseNames: ['Fire Safety at Workplace'],
  },
  {
    id: 'rec3',
    gapLevel: 'medium',
    skillTopicName: 'SOP: Dyeing',
    skillAreaName: 'SOP Process',
    center: 'Chittagong',
    group: 'Dyeing C',
    userIds: ['u3', 'u10', 'u12', 'u13'],
    userNames: ['Karim Hossain', 'Mofizul Islam', 'Abdul Malek', 'Shirin Akter'],
    suggestedPathId: 'p1',
    suggestedPathName: 'New Artisan Onboarding',
    suggestedCourseIds: ['c2'],
    suggestedCourseNames: ['Standard Operating Procedure: Dyeing'],
  },
]

// —— API-style getters ——
export function getTNAOverview(): TNAOverview {
  return {
    topSkillGaps: MOCK_TOP_SKILL_GAPS,
    topCentersWithGaps: MOCK_TOP_CENTERS,
    complianceGapsSnapshot: MOCK_COMPLIANCE_SNAPSHOT,
  }
}

export function getTNACenterGaps(_filters?: { center?: string }): CenterGapRow[] {
  return MOCK_CENTER_GAPS
}

export function getTNAGroupGaps(filters?: { center?: string; group?: string }): GroupGapRow[] {
  let list = MOCK_GROUP_GAPS.slice()
  if (filters?.center) list = list.filter((r) => r.center === filters.center)
  if (filters?.group) list = list.filter((r) => r.group === filters.group)
  return list
}

export function getTNAPersonGaps(filters?: { center?: string; group?: string }): PersonGapRow[] {
  let list = MOCK_PERSON_GAPS.slice()
  if (filters?.center) list = list.filter((r) => r.center === filters.center)
  if (filters?.group) list = list.filter((r) => r.group === filters.group)
  return list
}

export function getTNASkillTopicGaps(_filters?: { areaId?: SkillAreaId }): SkillTopicGapRow[] {
  return MOCK_SKILL_TOPIC_GAPS
}

export function getTNARecommendations(filters?: { center?: string; gapLevel?: GapLevel }): TNARecommendation[] {
  let list = MOCK_RECOMMENDATIONS.slice()
  if (filters?.center) list = list.filter((r) => r.center === filters.center)
  if (filters?.gapLevel) list = list.filter((r) => r.gapLevel === filters.gapLevel)
  return list
}

export function getSkillAreaById(id: SkillAreaId): SkillArea | undefined {
  return SKILL_AREAS.find((a) => a.id === id)
}

export function getSkillTopicById(id: SkillTopicId): SkillTopic | undefined {
  return SKILL_TOPICS.find((t) => t.id === id)
}

export const TNA_CENTERS = CENTERS
export const TNA_GROUPS = GROUPS
