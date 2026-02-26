/**
 * Mock data for Home/Overview dashboard.
 * Replace with real API calls later.
 */

export type CategoryBreakdownData = {
  title: string
  totalLabel: string
  total: number
  unit: string
  items: { id: string; label: string; value: number; color: string }[]
}

export const OVERVIEW = {
  totalUsers: 1247,
  totalUsersTrend: [98, 102, 105, 110, 115, 118, 122, 125, 128, 130, 124, 124, 127, 1247], // last 14 periods (e.g. days)
  activeUsers: 892,
  activeUsersTrend: [420, 450, 480, 510, 520, 550, 580, 600, 620, 650, 680, 720, 800, 892],
  compliancePercent: 78,
  pendingGradingCount: 23,
  expiringCertificatesNext30Days: 12,
  systemHealth: 'green' as const, // 'green' | 'amber' | 'red'
  systemAlerts: [
    { id: '1', message: 'All systems operational', type: 'success' },
    { id: '2', message: 'Backup completed at 02:00', type: 'info' },
  ] as { id: string; message: string; type: 'success' | 'info' }[],
  assignedVsCompleted: Array.from({ length: 90 }, (_, i) => ({
    day: i + 1,
    assigned: Math.round(50 + Math.sin(i / 8) * 25 + i * 1.2 + (i % 5) * 3),
    completed: Math.round(40 + Math.sin(i / 7) * 20 + i * 1.1 + (i % 4) * 2),
  })),
  /** Category breakdown for donut card (e.g. completion by status) */
  categoryBreakdown: {
    title: 'Completion by Status',
    totalLabel: 'Total',
    total: 4520,
    unit: 'Enrollments',
    items: [
      { id: 'completed', label: 'Completed', value: 2169, color: '#4A6BFB' },
      { id: 'in_progress', label: 'In Progress', value: 1492, color: '#7A96FF' },
      { id: 'not_started', label: 'Not Started', value: 859, color: '#D1DAFF' },
    ],
  } satisfies CategoryBreakdownData,
}

export type ChartRange = '7d' | '30d' | '90d'
