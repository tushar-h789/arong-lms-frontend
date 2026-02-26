/**
 * Question Bank — central repository. Reuse by topic. Aarong: SOP/Quality/Safety, image-based MCQ.
 */

export type QuestionType = 'mcq' | 'true_false' | 'short_answer' | 'image_mcq'

export type QuestionTopic = 'safety' | 'quality' | 'sop' | 'compliance' | 'craft'

export type CraftTag = 'weaving' | 'embroidery' | 'dyeing' | 'general'

export type Difficulty = 'easy' | 'medium' | 'hard'

export type QuestionLanguage = 'en' | 'bn'

export type QuestionRow = {
  id: string
  type: QuestionType
  title: string
  body: string
  bodyBn?: string
  imageUrl?: string
  topics: QuestionTopic[]
  craft: CraftTag
  difficulty: Difficulty
  language: QuestionLanguage
  options?: string[]
  correctOptionIndex?: number
  correctShortAnswer?: string
  version: number
  deprecated: boolean
  createdAt: string
  createdBy: string
}

export const QUESTION_TYPES: QuestionType[] = ['mcq', 'true_false', 'short_answer', 'image_mcq']
export const QUESTION_TOPICS: QuestionTopic[] = ['safety', 'quality', 'sop', 'compliance', 'craft']
export const CRAFT_TAGS: CraftTag[] = ['weaving', 'embroidery', 'dyeing', 'general']
export const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard']
export const LANGUAGES: QuestionLanguage[] = ['en', 'bn']

export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  mcq: 'MCQ',
  true_false: 'True/False',
  short_answer: 'Short Answer (manual)',
  image_mcq: 'Image-based MCQ (SOP)',
}

export const TOPIC_LABELS: Record<QuestionTopic, string> = {
  safety: 'Safety',
  quality: 'Quality',
  sop: 'SOP',
  compliance: 'Compliance',
  craft: 'Craft',
}

export const CRAFT_LABELS: Record<CraftTag, string> = {
  weaving: 'Weaving',
  embroidery: 'Embroidery',
  dyeing: 'Dyeing',
  general: 'General',
}

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
}

export const LANGUAGE_LABELS: Record<QuestionLanguage, string> = {
  en: 'English',
  bn: 'Bengali',
}

export const QUESTIONS: QuestionRow[] = [
  {
    id: 'q1',
    type: 'mcq',
    title: 'Fire extinguisher use',
    body: 'What is the first step when using a fire extinguisher?',
    topics: ['safety'],
    craft: 'general',
    difficulty: 'easy',
    language: 'en',
    options: ['Pull the pin', 'Aim at the base', 'Squeeze the lever', 'Call for help'],
    correctOptionIndex: 0,
    version: 1,
    deprecated: false,
    createdAt: '2025-02-01T10:00:00Z',
    createdBy: 'Nadia Islam',
  },
  {
    id: 'q2',
    type: 'true_false',
    title: 'PPE requirement',
    body: 'Wearing PPE is mandatory in the production area.',
    bodyBn: 'Wearing PPE is mandatory in the production area.',
    topics: ['safety', 'compliance'],
    craft: 'general',
    difficulty: 'easy',
    language: 'bn',
    options: ['True', 'False'],
    correctOptionIndex: 0,
    version: 1,
    deprecated: false,
    createdAt: '2025-02-05T09:00:00Z',
    createdBy: 'Admin User',
  },
  {
    id: 'q3',
    type: 'image_mcq',
    title: 'SOP step identification',
    body: 'What is the correct next step shown in this SOP image?',
    bodyBn: 'What is the correct next step shown in this SOP image?',
    imageUrl: '/assets/sop-step-1.jpg',
    topics: ['sop', 'quality'],
    craft: 'dyeing',
    difficulty: 'medium',
    language: 'bn',
    options: ['Check temperature', 'Add dye', 'Stir for 5 min', 'Drain'],
    correctOptionIndex: 1,
    version: 1,
    deprecated: false,
    createdAt: '2025-02-10T14:00:00Z',
    createdBy: 'Rahim Uddin',
  },
  {
    id: 'q4',
    type: 'short_answer',
    title: 'Quality checkpoint',
    body: 'Name two quality checkpoints in the weaving process.',
    bodyBn: 'Name two quality checkpoints in the weaving process.',
    topics: ['quality', 'craft'],
    craft: 'weaving',
    difficulty: 'medium',
    language: 'bn',
    correctShortAnswer: 'e.g. Thread tension, Weave alignment',
    version: 1,
    deprecated: false,
    createdAt: '2025-02-12T11:00:00Z',
    createdBy: 'Abdul Karim',
  },
]
