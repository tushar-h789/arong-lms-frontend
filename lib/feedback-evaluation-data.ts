/**
 * Mock data for Training Feedback & Evaluation report.
 * Content language/format effectiveness for rural/artisan learners.
 * Replace with real API calls later.
 */

export type CourseRatingRow = {
  id: string
  courseName: string
  avgRating: number
  totalResponses: number
  rating1: number
  rating2: number
  rating3: number
  rating4: number
  rating5: number
}

export type CommentTheme = {
  id: string
  theme: string
  count: number
}

export type QuickSurveyRow = {
  id: string
  question: string
  yesPercent: number
  noPercent: number
  neutralPercent: number
  totalResponses: number
}

export type TrainerRatingRow = {
  id: string
  trainerName: string
  courseName: string
  avgRating: number
  totalResponses: number
  center: string
}

export type CenterSatisfactionRow = {
  id: string
  center: string
  avgSatisfaction: number
  totalResponses: number
}

export const FEEDBACK_EVALUATION = {
  courseRatings: [
    { id: 'cr1', courseName: 'Workplace Safety Essentials', avgRating: 4.2, totalResponses: 156, rating1: 2, rating2: 8, rating3: 42, rating4: 68, rating5: 36 },
    { id: 'cr2', courseName: 'Data Privacy Basics', avgRating: 3.8, totalResponses: 98, rating1: 4, rating2: 12, rating3: 35, rating4: 32, rating5: 15 },
    { id: 'cr3', courseName: 'Fire Safety Fundamentals', avgRating: 4.5, totalResponses: 124, rating1: 1, rating2: 5, rating3: 22, rating4: 52, rating5: 44 },
  ] as CourseRatingRow[],
  commentThemes: [
    { id: 'ct1', theme: 'Easy to understand', count: 78 },
    { id: 'ct2', theme: 'Language too difficult', count: 23 },
    { id: 'ct3', theme: 'Video quality issues', count: 18 },
    { id: 'ct4', theme: 'Too fast paced', count: 15 },
    { id: 'ct5', theme: 'Good examples', count: 65 },
    { id: 'ct6', theme: 'Needs more practice', count: 34 },
  ] as CommentTheme[],
  quickSurvey: [
    { id: 'qs1', question: 'Was it easy to understand?', yesPercent: 72, noPercent: 18, neutralPercent: 10, totalResponses: 245 },
    { id: 'qs2', question: 'Was the video clear?', yesPercent: 68, noPercent: 22, neutralPercent: 10, totalResponses: 245 },
    { id: 'qs3', question: 'Did the examples help?', yesPercent: 85, noPercent: 8, neutralPercent: 7, totalResponses: 198 },
  ] as QuickSurveyRow[],
  trainerRatings: [
    { id: 'tr1', trainerName: 'Abdul Karim', courseName: 'Workplace Safety', avgRating: 4.6, totalResponses: 45, center: 'Dhaka HQ' },
    { id: 'tr2', trainerName: 'Fatima Begum', courseName: 'Safety Basics', avgRating: 4.2, totalResponses: 38, center: 'Dhaka HQ' },
    { id: 'tr3', trainerName: 'Rahim Uddin', courseName: 'Fire Safety', avgRating: 4.4, totalResponses: 52, center: 'Chittagong' },
  ] as TrainerRatingRow[],
  centerSatisfaction: [
    { id: 'cs1', center: 'Dhaka HQ', avgSatisfaction: 4.3, totalResponses: 142 },
    { id: 'cs2', center: 'Chittagong', avgSatisfaction: 4.1, totalResponses: 78 },
    { id: 'cs3', center: 'Field Centers (Rural)', avgSatisfaction: 3.8, totalResponses: 95 },
  ] as CenterSatisfactionRow[],
}
