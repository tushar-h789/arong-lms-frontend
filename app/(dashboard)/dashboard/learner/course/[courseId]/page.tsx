import React from 'react'
import CoursePlayer from '@/components/dashboard/learner/course-player/CoursePlayer'

type Props = { params: Promise<{ courseId: string }> }

export default async function CoursePlayerPage({ params }: Props) {
  const { courseId } = await params
  return <CoursePlayer courseId={courseId} />
}
