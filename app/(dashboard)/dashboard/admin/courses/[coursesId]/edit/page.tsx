import React from 'react'
import { CourseBuilder } from '@/components/dashboard/courses/CourseBuilder'

type Props = { params: Promise<{ coursesId: string }> }

export default async function EditCoursePage({ params }: Props) {
  const { coursesId } = await params
  return <CourseBuilder courseId={coursesId} />
}
