'use client'

import React, { useMemo } from 'react'
import { Award } from 'lucide-react'
import type { BadgeId } from '@/lib/learner-dashboard-data'
import { BADGE_SET } from '@/lib/learner-dashboard-data'

export type BadgeEarn = (typeof BADGE_SET)[number]

export type Language = 'en' | 'bn'

export type BadgeEarnOverlayProps = {
  badge: BadgeEarn
  onClose: () => void
  language?: Language
}

const CONFETTI_COLORS = [
  '#f57820', '#fbbf24', '#34d399', '#60a5fa', '#a78bfa', '#f472b6', '#2dd4bf',
]

function getBadge(badgeId: BadgeId) {
  return BADGE_SET.find((b) => b.id === badgeId)
}

/** One confetti particle: moves from center to (cx, cy) with rotation and fade */
function ConfettiParticle({
  cx,
  cy,
  color,
  delay,
  size,
}: {
  cx: number
  cy: number
  color: string
  delay: number
  size: number
}) {
  return (
    <div
      className="pointer-events-none absolute left-1/2 top-1/2 rounded-sm opacity-0 animate-badge-confetti"
      style={
        {
          '--cx': `${cx}px`,
          '--cy': `${cy}px`,
          animationDelay: `${delay}ms`,
          width: size,
          height: size,
          backgroundColor: color,
        } as React.CSSProperties
      }
      aria-hidden
    />
  )
}

/** Full-screen overlay: centered badge card + confetti burst */
export function BadgeEarnOverlay({
  badge,
  onClose,
  language = 'en',
}: BadgeEarnOverlayProps) {
  const isBn = language === 'bn'
  const badgeLabel = isBn ? (badge as { labelBn?: string }).labelBn ?? badge.label : badge.label
  const badgeTagline = isBn ? (badge as { taglineBn?: string }).taglineBn ?? badge.tagline : badge.tagline
  const unlockedText = isBn ? 'ব্যাজ আনলক হয়েছে' : 'Badge unlocked'
  const continueText = isBn ? 'চালিয়ে যান' : 'Continue'
  const particles = useMemo(() => {
    const count = 48
    // Deterministic "random" from index so render stays pure (no Math.random during render)
    const prng = (seed: number) => {
      const x = Math.sin(seed * 9999) * 10000
      return x - Math.floor(x)
    }
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2 + prng(i) * 0.5
      const dist = 120 + prng(i + 1000) * 180
      const cx = Math.cos(angle) * dist
      const cy = Math.sin(angle) * dist
      return {
        cx,
        cy,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        delay: prng(i + 2000) * 200,
        size: 6 + prng(i + 3000) * 6,
      }
    })
  }, [])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-badge-backdrop"
      style={{ backgroundColor: 'rgba(0,0,0,0.75)' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="badge-earn-title"
      aria-describedby="badge-earn-desc"
    >
      {/* Confetti burst from center */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {particles.map((p, i) => (
          <ConfettiParticle
            key={i}
            cx={p.cx}
            cy={p.cy}
            color={p.color}
            delay={p.delay}
            size={p.size}
          />
        ))}
      </div>

      {/* Centered badge card */}
      <div className="relative z-10 flex max-w-sm flex-col items-center rounded-2xl border border-amber-200/50 dark:border-amber-600/50 bg-white dark:bg-gray-800 px-8 py-8 shadow-2xl animate-badge-bounce">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br from-amber-100 to-primary/20 dark:from-amber-900/40 dark:to-primary/30 text-5xl ring-4 ring-amber-200/60 dark:ring-amber-700/50 animate-badge-glow">
          {badge.icon}
        </div>
        <p className="mt-4 flex items-center gap-2 text-sm font-medium uppercase tracking-wide text-amber-600 dark:text-amber-400">
          <Award className="size-4" />
          {unlockedText}
        </p>
        <h2
          id="badge-earn-title"
          className="mt-2 text-center text-xl font-bold text-gray-900 dark:text-gray-100"
        >
          {badgeLabel}
        </h2>
        <p id="badge-earn-desc" className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
          {badgeTagline}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:scale-[1.02] hover:bg-primary-hover active:scale-[0.98]"
        >
          {continueText}
        </button>
      </div>
    </div>
  )
}

/** Helper: trigger badge earn by badgeId (e.g. from API). Returns badge object or null. */
export function getBadgeForEarn(badgeId: BadgeId): BadgeEarn | null {
  const b = getBadge(badgeId)
  return b ?? null
}
