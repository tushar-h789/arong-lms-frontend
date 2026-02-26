'use client'

import React from 'react'
import { Leaderboard } from './Leaderboard'

export function GamificationPage() {
  return (
    <div className="min-w-0 space-y-6 overflow-x-hidden">
      {/* <div>
        <h1 className="break-words text-2xl font-bold text-gray-900">Gamification</h1>
        <p className="mt-1 text-sm text-gray-500">
          Leaderboards, points, badges — motivate learners
        </p>
      </div> */}

      <Leaderboard />
    </div>
  )
}
