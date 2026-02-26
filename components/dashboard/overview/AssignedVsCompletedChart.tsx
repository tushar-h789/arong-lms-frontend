'use client'

import React, { useState, useRef, useCallback, useMemo } from 'react'

type DataPoint = { day: number; assigned: number; completed: number }

type RangeKey = '7d' | '30d' | '90d'

const RANGES: { key: RangeKey; label: string }[] = [
  { key: '7d', label: '7 days' },
  { key: '30d', label: '30 days' },
  { key: '90d', label: '90 days' },
]

/** Smooth curve through points using cubic Bezier (Catmull-Rom style) */
function smoothPathD(
  points: { x: number; y: number }[]
): string {
  if (points.length < 2) return ''
  const n = points.length
  const p = (i: number) => points[Math.max(0, Math.min(i, n - 1))]
  let d = `M ${p(0).x},${p(0).y}`
  for (let i = 0; i < n - 1; i++) {
    const p0 = p(i)
    const p1 = p(i + 1)
    const cp1x = p0.x + (p1.x - p(i - 1).x) / 6
    const cp1y = p0.y + (p1.y - p(i - 1).y) / 6
    const cp2x = p1.x - (p(i + 2).x - p0.x) / 6
    const cp2y = p1.y - (p(i + 2).y - p0.y) / 6
    d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p1.x},${p1.y}`
  }
  return d
}

export function AssignedVsCompletedChart({ data }: { data: DataPoint[] }) {
  const [range, setRange] = useState<RangeKey>('30d')
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  const rangeLen = useMemo(() => (range === '7d' ? 7 : range === '30d' ? 30 : 90), [range])
  const chartData = useMemo(
    () => (data.length <= rangeLen ? data : data.slice(-rangeLen)),
    [data, rangeLen]
  )

  const width = 640
  const height = 220
  const padding = { top: 36, right: 24, bottom: 36, left: 44 }
  const chartWidth = width - padding.left - padding.right
  const chartHeight = height - padding.top - padding.bottom

  const maxY = useMemo(() => {
    const maxA = Math.max(...chartData.map((d) => d.assigned))
    const maxC = Math.max(...chartData.map((d) => d.completed))
    return Math.max(maxA, maxC, 1)
  }, [chartData])
  const minY = 0

  const scaleY = useCallback(
    (v: number) =>
      padding.top + chartHeight - ((v - minY) / (maxY - minY)) * chartHeight,
    [maxY, chartHeight, padding.top]
  )
  const scaleX = useCallback(
    (i: number) =>
      padding.left + (i / (chartData.length - 1 || 1)) * chartWidth,
    [chartData.length, chartWidth, padding.left]
  )

  const assignedPoints = useMemo(
    () => chartData.map((d, i) => ({ x: scaleX(i), y: scaleY(d.assigned) })),
    [chartData, scaleX, scaleY]
  )
  const completedPoints = useMemo(
    () => chartData.map((d, i) => ({ x: scaleX(i), y: scaleY(d.completed) })),
    [chartData, scaleX, scaleY]
  )

  const assignedPathD = useMemo(() => smoothPathD(assignedPoints), [assignedPoints])

  const areaPathD = useCallback(
    (points: { x: number; y: number }[]) => {
      const lineD = smoothPathD(points)
      const firstX = scaleX(0)
      const lastX = scaleX(chartData.length - 1)
      const bottomY = padding.top + chartHeight
      return `${lineD} L ${lastX},${bottomY} L ${firstX},${bottomY} Z`
    },
    [chartData.length, scaleX, chartHeight, padding.top]
  )

  /** Path for stacked band: top edge (assigned) then bottom edge (completed) closed with smooth reverse */
  const stackedBandPathD = useMemo(() => {
    if (assignedPoints.length < 2 || completedPoints.length < 2) return ''
    const topD = smoothPathD(assignedPoints)
    const last = completedPoints.length - 1
    const completedReversed = [...completedPoints].reverse()
    const revD = smoothPathD(completedReversed)
    const curvePart = revD.includes(' C ') ? revD.substring(revD.indexOf(' C ') + 1) : revD.substring(2)
    return `${topD} L ${completedPoints[last].x},${completedPoints[last].y} ${curvePart} Z`
  }, [assignedPoints, completedPoints])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      const svg = svgRef.current
      if (!svg) return
      const rect = svg.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * width
      const relativeX = x - padding.left
      if (relativeX < 0 || relativeX > chartWidth) {
        setHoveredIndex(null)
        return
      }
      const index = Math.round((relativeX / chartWidth) * (chartData.length - 1))
      setHoveredIndex(Math.max(0, Math.min(index, chartData.length - 1)))
    },
    [chartData.length, chartWidth, padding.left]
  )

  const handleMouseLeave = useCallback(() => setHoveredIndex(null), [])

  const updateHoverFromTouch = useCallback(
    (clientX: number) => {
      const svg = svgRef.current
      if (!svg) return
      const rect = svg.getBoundingClientRect()
      const x = ((clientX - rect.left) / rect.width) * width
      const relativeX = x - padding.left
      if (relativeX < 0 || relativeX > chartWidth) {
        setHoveredIndex(null)
        return
      }
      const index = Math.round((relativeX / chartWidth) * (chartData.length - 1))
      setHoveredIndex(Math.max(0, Math.min(index, chartData.length - 1)))
    },
    [chartData.length, chartWidth, padding.left]
  )
  const handleTouchStart = useCallback(
    (e: React.TouchEvent<SVGSVGElement>) => {
      if (e.touches[0]) updateHoverFromTouch(e.touches[0].clientX)
    },
    [updateHoverFromTouch]
  )
  const handleTouchMove = useCallback(
    (e: React.TouchEvent<SVGSVGElement>) => {
      if (e.touches[0]) updateHoverFromTouch(e.touches[0].clientX)
    },
    [updateHoverFromTouch]
  )
  const handleTouchEnd = useCallback(() => setHoveredIndex(null), [])

  const yTicks = useMemo(() => {
    const step = maxY <= 10 ? 2 : maxY <= 50 ? 10 : maxY <= 200 ? 50 : 100
    const ticks: number[] = []
    for (let v = 0; v <= maxY; v += step) ticks.push(v)
    if (ticks[ticks.length - 1] !== maxY) ticks.push(maxY)
    return ticks
  }, [maxY])

  const totalAssigned = chartData.reduce((s, d) => s + d.assigned, 0)
  const totalCompleted = chartData.reduce((s, d) => s + d.completed, 0)
  const prevData = useMemo(
    () =>
      data.length > rangeLen
        ? data.slice(-rangeLen * 2, -rangeLen)
        : [],
    [data, rangeLen]
  )
  const prevAssigned = prevData.reduce((s, d) => s + d.assigned, 0)
  const prevCompleted = prevData.reduce((s, d) => s + d.completed, 0)
  const assignedPct =
    prevAssigned > 0
      ? (((totalAssigned - prevAssigned) / prevAssigned) * 100).toFixed(1)
      : null
  const completedPct =
    prevCompleted > 0
      ? (((totalCompleted - prevCompleted) / prevCompleted) * 100).toFixed(1)
      : null

  const hoveredPoint = hoveredIndex != null ? chartData[hoveredIndex] : null
  const completionRate =
    totalAssigned > 0 ? Math.round((totalCompleted / totalAssigned) * 100) : 0

  if (!chartData.length) return null

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-600 bg-white dark:bg-gray-800 p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] dark:shadow-none">
      {/* Header: title + time selector */}
      <div className="mb-4 flex min-w-0 flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-base font-semibold tracking-tight text-gray-900 dark:text-gray-100">Assigned vs Completed</h3>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            Assigned vs completed over time
          </p>
        </div>
        <div className="flex shrink-0 rounded-lg bg-gray-100 dark:bg-gray-700 p-0.5">
          {RANGES.map((r) => (
            <button
              key={r.key}
              type="button"
              onClick={() => setRange(r.key)}
              className={`min-h-[44px] min-w-[44px] rounded-md px-3 py-2 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:min-w-0 sm:py-1.5 ${range === r.key
                ? 'bg-primary text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI row */}
      <div className="mb-4 grid min-w-0 grid-cols-2 gap-4 sm:gap-10">
        <div>
          <p className="flex items-baseline gap-2">
            <span className="text-xl font-semibold tabular-nums tracking-tight text-gray-900 dark:text-gray-100">
              {totalAssigned.toLocaleString()}
            </span>
            {assignedPct != null && (
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${Number(assignedPct) >= 0 ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                  }`}
              >
                {Number(assignedPct) >= 0 ? '+' : ''}{assignedPct}%
              </span>
            )}
          </p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Total Assigned</p>
        </div>
        <div>
          <p className="flex items-baseline gap-2">
            <span className="text-xl font-semibold tabular-nums tracking-tight text-gray-900 dark:text-gray-100">
              {totalCompleted.toLocaleString()}
            </span>
            {completedPct != null && (
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${Number(completedPct) >= 0 ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                  }`}
              >
                {Number(completedPct) >= 0 ? '+' : ''}{completedPct}%
              </span>
            )}
          </p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Total Completed · {completionRate}% rate</p>
        </div>
      </div>

      {/* Chart - full width, compact height; flex-1 so card fills row when paired */}
      <div className="relative min-h-[200px] w-full min-w-0 flex-1">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          className="h-full w-full min-w-0 cursor-crosshair select-none"
          preserveAspectRatio="none"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
        >
          <defs>
            <linearGradient id="completedFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#86efac" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#bbf7d0" stopOpacity="0.25" />
            </linearGradient>
            <linearGradient id="assignedFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.5" />
              <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.08" />
            </linearGradient>
          </defs>

          {/* Y-axis labels only (no grid lines for clean look) */}
          {yTicks.map((t) => (
            <text
              key={t}
              x={padding.left - 8}
              y={scaleY(t) + 3}
              textAnchor="end"
              className="fill-gray-400 text-[10px] tabular-nums"
            >
              {t}
            </text>
          ))}

          {/* X-axis labels */}
          {[0, Math.floor(chartData.length / 3), Math.floor((2 * chartData.length) / 3), chartData.length - 1]
            .filter((_, i, a) => a.indexOf(a[i]) === i)
            .map((i) => (
              <text
                key={i}
                x={scaleX(i)}
                y={height - 12}
                textAnchor="middle"
                className="fill-gray-400 text-[10px]"
              >
                {rangeLen <= 7 ? `D${chartData[i].day}` : `W${Math.ceil(chartData[i].day / 7)}`}
              </text>
            ))}

          {/* Stacked areas: Completed base (green), then Assigned-on-top band (orange) */}
          <path d={areaPathD(completedPoints)} fill="url(#completedFill)" />
          <path d={stackedBandPathD} fill="url(#assignedFill)" />
          {/* Top edge line for clarity */}
          <path
            d={assignedPathD}
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Hover */}
          {hoveredIndex != null && hoveredPoint && (
            <g>
              <line
                x1={scaleX(hoveredIndex)}
                y1={padding.top}
                x2={scaleX(hoveredIndex)}
                y2={padding.top + chartHeight}
                stroke="#e5e7eb"
                strokeWidth="1"
              />
              <circle
                cx={scaleX(hoveredIndex)}
                cy={scaleY(hoveredPoint.assigned)}
                r="4"
                fill="white"
                stroke="var(--color-primary)"
                strokeWidth="1.5"
              />
              <circle
                cx={scaleX(hoveredIndex)}
                cy={scaleY(hoveredPoint.completed)}
                r="4"
                fill="white"
                stroke="#22c55e"
                strokeWidth="1.5"
              />
            </g>
          )}
        </svg>

        {/* Tooltip - positioned to stay in view on all screen sizes */}
        {hoveredIndex != null && hoveredPoint && (
          <div
            className="pointer-events-none absolute z-10 w-[140px] max-w-[calc(100%-24px)] rounded-lg border border-gray-100 bg-white px-3 py-2 text-left shadow-md"
            style={{
              left: `clamp(12px, ${(scaleX(hoveredIndex) / width) * 100}% - 70px, calc(100% - 152px))`,
              top: 8,
            }}
          >
            <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
              {rangeLen <= 7 ? `Day ${hoveredPoint.day}` : `W${Math.ceil(hoveredPoint.day / 7)}`}
            </p>
            <p className="mt-1 text-xs font-semibold text-gray-900">
              Assigned <span className="tabular-nums text-primary">{hoveredPoint.assigned}</span>
            </p>
            <p className="text-xs font-semibold text-gray-600">
              Completed <span className="tabular-nums text-emerald-600">{hoveredPoint.completed}</span>
            </p>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-3 flex min-w-0 flex-wrap justify-end gap-4 gap-y-2 text-xs text-gray-600 sm:gap-5">
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-primary" />
          Assigned
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          Completed
        </span>
      </div>
    </div>
  )
}
