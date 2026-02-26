import React from 'react'
import { COURSES } from '@/lib/courses-data'
import CourseCommunication from '@/components/dashboard/instructor/communication/CourseCommunication'
import CommunicationPageClient from './CommunicationPageClient'

type Props = {
  searchParams: Promise<{ course?: string }>
}

export default async function CommunicationPage({ searchParams }: Props) {
  const params = await searchParams
  const courseId = params.course ?? ''
  const course = courseId ? COURSES.find((c) => c.id === courseId) : null
  const courseTitle = course?.title ?? ''

  if (!courseId || !course) {
    return (
      <div className="min-w-0 space-y-6 overflow-x-hidden">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Communication
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Course-specific announcements, Q&A, and live sessions. Select a course to continue.
          </p>
        </div>
        <CommunicationPageClient />
      </div>
    )
  }

  return (
    <CourseCommunication courseId={courseId} courseTitle={courseTitle} />
  )
}
