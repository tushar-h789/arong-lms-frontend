'use client'

import React, { useMemo } from 'react'
import { MoreVertical } from 'lucide-react'

export type CategoryBreakdownCardData = {
    title: string
    totalLabel: string
    total: number
    unit: string
    items: { id: string; label: string; value: number; color: string }[]
}

const DONUT_SIZE = 200
const CX = DONUT_SIZE / 2
const CY = DONUT_SIZE / 2
const OUTER_R = 72
const INNER_R = 44

/** One donut segment path: from angle a1 to a2 (degrees, 0 = top, clockwise) */
function segmentPath(
    cx: number,
    cy: number,
    outerR: number,
    innerR: number,
    startAngleDeg: number,
    endAngleDeg: number
): string {
    const toRad = (d: number) => ((d - 90) * Math.PI) / 180
    const x1 = cx + outerR * Math.cos(toRad(startAngleDeg))
    const y1 = cy + outerR * Math.sin(toRad(startAngleDeg))
    const x2 = cx + outerR * Math.cos(toRad(endAngleDeg))
    const y2 = cy + outerR * Math.sin(toRad(endAngleDeg))
    const x3 = cx + innerR * Math.cos(toRad(endAngleDeg))
    const y3 = cy + innerR * Math.sin(toRad(endAngleDeg))
    const x4 = cx + innerR * Math.cos(toRad(startAngleDeg))
    const y4 = cy + innerR * Math.sin(toRad(startAngleDeg))
    const large = endAngleDeg - startAngleDeg > 180 ? 1 : 0
    return `M ${x1},${y1} A ${outerR},${outerR} 0 ${large},1 ${x2},${y2} L ${x3},${y3} A ${innerR},${innerR} 0 ${large},0 ${x4},${y4} Z`
}

export default function CategoryBreakdownCard({ data }: { data: CategoryBreakdownCardData }) {
    const { title, totalLabel, total, unit, items } = data

    const segments = useMemo(() => {
        if (!total || !items.length) return []
        let acc = 0
        return items.map((item) => {
            const startAngle = (acc / total) * 360
            acc += item.value
            const endAngle = (acc / total) * 360
            return {
                ...item,
                startAngle,
                endAngle,
                pathD: segmentPath(CX, CY, OUTER_R, INNER_R, startAngle, endAngle),
                percent: total > 0 ? Math.round((item.value / total) * 100) : 0,
            }
        })
    }, [items, total])

    return (
        <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-600 bg-white dark:bg-gray-800 px-5 py-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)] dark:shadow-none">
            {/* Header: title + options icon */}
            <div className="mb-4 flex shrink-0 items-center justify-between gap-2">
                <h3 className="min-w-0 break-words text-base font-semibold tracking-tight text-gray-900 dark:text-gray-100">{title}</h3>
                <button
                    type="button"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded text-gray-400 dark:text-gray-500 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    aria-label="Options"
                >
                    <MoreVertical className="size-5" />
                </button>
            </div>

            <div className="flex min-h-0 flex-1 flex-col justify-center gap-6 sm:flex-row sm:items-center sm:gap-8">
                {/* Donut chart */}
                <div className="flex min-w-0 shrink-0 justify-center sm:justify-start">
                    <svg
                        width={DONUT_SIZE}
                        height={DONUT_SIZE}
                        className="overflow-visible"
                        aria-hidden
                    >
                        {segments.map((seg) => (
                            <path
                                key={seg.id}
                                d={seg.pathD}
                                fill={seg.color}
                                className="transition-opacity hover:opacity-90"
                            />
                        ))}
                        {/* Center hole label: Total + value (match image typography) */}
                        <g textAnchor="middle" dominantBaseline="middle">
                            <text
                                x={CX}
                                y={CY - 10}
                                fill="#111827"
                                style={{ fontFamily: 'inherit', fontSize: 14, fontWeight: 700 }}
                            >
                                {totalLabel}
                            </text>
                            <text
                                x={CX}
                                y={CY + 12}
                                fill="#111827"
                                style={{ fontFamily: 'inherit', fontSize: 16, fontWeight: 400 }}
                            >
                                {total.toLocaleString()}
                            </text>
                        </g>
                    </svg>
                </div>

                {/* Legend */}
                <div className="min-w-0 flex-1 space-y-4">
                    {segments.map((seg) => (
                        <div key={seg.id} className="min-w-0 flex flex-col gap-0.5">
                            <div className="flex items-center gap-2">
                                <span
                                    className="size-3 shrink-0 rounded-full"
                                    style={{ backgroundColor: seg.color }}
                                    aria-hidden
                                />
                                <span className="min-w-0 break-words text-sm font-semibold text-gray-900 dark:text-gray-100">{seg.label}</span>
                            </div>
                            <p className="pl-5 text-xs text-gray-500 dark:text-gray-400">
                                {seg.percent}% <span className="mx-1.5 text-gray-300 dark:text-gray-600">•</span>{' '}
                                {seg.value.toLocaleString()} {unit}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
