'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import CourseWorkspacePage from '@/components/dashboard/instructor/my-courses/CourseWorkspacePage'

export default function InstructorCourseWorkspaceRoute() {
  const params = useParams()
  const courseId = typeof params.courseId === 'string' ? params.courseId : ''

  return <CourseWorkspacePage courseId={courseId} />
}
