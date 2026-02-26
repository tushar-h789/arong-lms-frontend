/**
 * Mock data for Reports Overview (executive snapshot).
 * Replace with real API calls later.
 */

export const REPORTS_OVERVIEW = {
  kpis: {
    overallCompletionPercent: 68,
    overdueCount: 14,
    compliancePercent: 78,
    avgAssessmentScore: 72,
  },
  topAlerts: [
    { id: '1', title: 'Expiring certs', message: '12 certificates expiring in next 30 days', type: 'warning' as const, href: '/dashboard/admin/reports/compliance-certificates' },
    { id: '2', title: 'Low engagement depts', message: 'HR and Operations below 50% completion', type: 'warning' as const, href: '/dashboard/admin/reports/learner-progress' },
    { id: '3', title: 'High dropout courses', message: '"Data Privacy Basics" has 23% dropout rate', type: 'error' as const, href: '/dashboard/admin/reports/course-completion' },
  ],
  quickLinks: [
    { label: 'Open Compliance', href: '/dashboard/admin/reports/compliance-certificates', description: 'Compliance & Certificates report' },
    { label: 'Open Course Completion', href: '/dashboard/admin/reports/course-completion', description: 'Course Completion report' },
    { label: 'Export Center', href: '/dashboard/admin/reports/export-center', description: 'Export and schedule reports' },
  ],
}
