import React from 'react'
import Link from 'next/link'

export default function CoursePage() {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 p-6">
      <p className="text-gray-600 dark:text-gray-400">Select a course from My Learning to start.</p>
      <Link
        href="/dashboard/learner/my-learning"
        className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover"
      >
        Go to My Learning
      </Link>
    </div>
  )
}
