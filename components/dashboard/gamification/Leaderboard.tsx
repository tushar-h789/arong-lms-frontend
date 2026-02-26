'use client'

import React from 'react'
import { LEADERBOARD_DATA, type LeaderboardEntry } from '@/lib/gamification-data'
import { Medal, Award } from 'lucide-react'

function getRankDisplay(rank: number) {
  if (rank === 1) {
    return (
      <span className="flex items-center gap-1.5">
        <Medal className="size-5 text-amber-400" aria-hidden />
        <span className="font-semibold text-amber-600">1</span>
      </span>
    )
  }
  if (rank === 2) {
    return (
      <span className="flex items-center gap-1.5">
        <Medal className="size-5 text-slate-400" aria-hidden />
        <span className="font-semibold text-slate-600">2</span>
      </span>
    )
  }
  if (rank === 3) {
    return (
      <span className="flex items-center gap-1.5">
        <Medal className="size-5 text-amber-700" aria-hidden />
        <span className="font-semibold text-amber-800">3</span>
      </span>
    )
  }
  return <span className="text-sm font-medium text-gray-600">{rank}th</span>
}

function getInitial(name: string): string {
  return name.charAt(0).toUpperCase()
}

export function Leaderboard() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-gray-900">Leaderboard</h2>
        <p className="mt-0.5 text-sm text-gray-500">Top scores.</p>
      </div>
      <div className="max-h-[400px] overflow-x-auto overflow-y-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="pb-3 pr-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                User(s)
              </th>
              <th className="pb-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Rank
              </th>
              <th className="pb-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Completed
              </th>
              <th className="pb-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Points
              </th>
              <th className="pb-3 pl-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Badges
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {LEADERBOARD_DATA.map((entry) => (
              <LeaderboardRow key={entry.id} entry={entry} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function LeaderboardRow({ entry }: { entry: LeaderboardEntry }) {
  return (
    <tr className="hover:bg-gray-50/50">
      <td className="py-3 pr-4">
        <div className="flex items-center gap-3">
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${entry.avatarColor} text-sm font-semibold text-white`}
          >
            {getInitial(entry.name)}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-gray-900">{entry.name}</p>
            <p className="truncate text-xs text-gray-500">{entry.email}</p>
          </div>
        </div>
      </td>
      <td className="py-3 px-4">{getRankDisplay(entry.rank)}</td>
      <td className="py-3 px-4 text-sm text-gray-900">{entry.completed}</td>
      <td className="py-3 px-4 text-sm font-medium text-gray-900">{entry.points}</td>
      <td className="py-3 pl-4">
        <span className="inline-flex items-center gap-1 text-sm text-gray-900">
          <Award className="size-4 text-amber-500" aria-hidden />
          {entry.badges}
        </span>
      </td>
    </tr>
  )
}
