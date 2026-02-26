'use client'

import React from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import QuizTakePage from '@/components/dashboard/learner/assessments/QuizTakePage'

export default function QuizAttemptPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const quizId = typeof params.quizId === 'string' ? params.quizId : ''
  const resumeAttemptId = searchParams.get('resume')

  return <QuizTakePage quizId={quizId} resumeAttemptId={resumeAttemptId} />
}
