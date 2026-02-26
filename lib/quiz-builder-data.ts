/**
 * Quiz Builder — create quiz/test from Question Bank. Presets, time limit, feedback, anti-cheat. Aarong: short quiz vs full test, language mode for artisans.
 */

import type { QuestionTopic } from './question-bank-data'

export type BuildMode = 'manual' | 'auto'

export type FeedbackWhen = 'instant' | 'after_submission' | 'after_close'

export type QuizLanguageMode = 'en' | 'bn_only' | 'simple_bn'

export type QuizPreset = 'short' | 'full' | 'custom'

export type QuizSettings = {
  preset: QuizPreset
  questionCount: number
  timeLimitMinutes: number | null
  randomizeQuestions: boolean
  randomizeOptions: boolean
  attemptsCount: number
  passScorePercent: number
  openAt: string | null
  closeAt: string | null
  feedbackWhen: FeedbackWhen
  showCorrectAnswers: boolean
  oneQuestionAtATime: boolean
  disableBackNavigation: boolean
  languageMode: QuizLanguageMode
  autoTopic?: QuestionTopic[]
  autoDifficulty?: string[]
}

export const QUIZ_PRESETS: { id: QuizPreset; label: string; questionCount: number }[] = [
  { id: 'short', label: 'Short quiz (5 questions)', questionCount: 5 },
  { id: 'full', label: 'Full test (20 questions)', questionCount: 20 },
  { id: 'custom', label: 'Custom', questionCount: 0 },
]

export const FEEDBACK_WHEN_OPTIONS: { id: FeedbackWhen; label: string }[] = [
  { id: 'instant', label: 'Instant (after each answer)' },
  { id: 'after_submission', label: 'After submission' },
  { id: 'after_close', label: 'After quiz close' },
]

export const QUIZ_LANGUAGE_MODES: { id: QuizLanguageMode; label: string }[] = [
  { id: 'en', label: 'English' },
  { id: 'bn_only', label: 'Bengali only (for artisans)' },
  { id: 'simple_bn', label: 'Simple Bengali (for artisans)' },
]

export const DEFAULT_QUIZ_SETTINGS: QuizSettings = {
  preset: 'short',
  questionCount: 5,
  timeLimitMinutes: 15,
  randomizeQuestions: true,
  randomizeOptions: true,
  attemptsCount: 2,
  passScorePercent: 60,
  openAt: null,
  closeAt: null,
  feedbackWhen: 'after_submission',
  showCorrectAnswers: true,
  oneQuestionAtATime: false,
  disableBackNavigation: false,
  languageMode: 'bn_only',
}
