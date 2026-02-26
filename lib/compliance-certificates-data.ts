/**
 * Mock data for Compliance & Certifications (Aarong staff + field training).
 * Replace with real API calls later.
 */

export type ComplianceCategory = 'gender' | 'safeguarding' | 'values' | 'safety'

export type ComplianceDashboardRow = {
  id: string
  category: ComplianceCategory
  categoryLabel: string
  totalRequired: number
  completed: number
  percentComplete: number
  status: 'compliant' | 'at_risk' | 'non_compliant'
  department?: string
}

export type NonCompliantRow = {
  id: string
  learnerName: string
  email: string
  department: string
  missingItems: string[]
  overdueDays: number
}

export type CertificateIssueRow = {
  id: string
  learnerName: string
  certificateName: string
  courseName: string
  issuedDate: string
  expiryDate: string
  daysToExpiry: number
  department: string
}

export type RecertTriggerRow = {
  id: string
  learnerName: string
  email: string
  department: string
  certificateName: string
  courseName: string
  expiryDate: string
  daysToExpiry: number
  status: 'expired' | 'expiring_soon'
}

export const COMPLIANCE_CERTIFICATES = {
  completionDashboard: [
    { id: 'cd1', category: 'gender' as const, categoryLabel: 'Gender', totalRequired: 120, completed: 118, percentComplete: 98, status: 'compliant' as const },
    { id: 'cd2', category: 'safeguarding' as const, categoryLabel: 'Safeguarding', totalRequired: 120, completed: 108, percentComplete: 90, status: 'compliant' as const },
    { id: 'cd3', category: 'values' as const, categoryLabel: 'Values', totalRequired: 120, completed: 96, percentComplete: 80, status: 'at_risk' as const },
    { id: 'cd4', category: 'safety' as const, categoryLabel: 'Safety', totalRequired: 120, completed: 85, percentComplete: 71, status: 'non_compliant' as const },
  ] as ComplianceDashboardRow[],
  nonCompliant: [
    { id: 'n1', learnerName: 'Karim Hossain', email: 'karim@aarong.com', department: 'Operations', missingItems: ['Safety', 'Values'], overdueDays: 14 },
    { id: 'n2', learnerName: 'Nadia Islam', email: 'nadia@aarong.com', department: 'Operations', missingItems: ['Safeguarding'], overdueDays: 7 },
    { id: 'n3', learnerName: 'Sadia Akter', email: 'sadia@aarong.com', department: 'Finance', missingItems: ['Safety', 'Gender'], overdueDays: 21 },
    { id: 'n4', learnerName: 'Abdul Rahman', email: 'abdul@aarong.com', department: 'Field', missingItems: ['Safety', 'Values', 'Safeguarding'], overdueDays: 30 },
  ] as NonCompliantRow[],
  certificateIssue: [
    { id: 'ci1', learnerName: 'Rahim Ahmed', certificateName: 'Safety Certified', courseName: 'Workplace Safety Essentials', issuedDate: '2024-02-20', expiryDate: '2025-02-25', daysToExpiry: 3, department: 'HR' },
    { id: 'ci2', learnerName: 'Fatima Khan', certificateName: 'Privacy Trained', courseName: 'Data Privacy Basics', issuedDate: '2024-03-10', expiryDate: '2025-03-15', daysToExpiry: 21, department: 'HR' },
    { id: 'ci3', learnerName: 'Karim Hossain', certificateName: 'Fire Safety Certified', courseName: 'Fire Safety Fundamentals', issuedDate: '2024-01-05', expiryDate: '2025-04-05', daysToExpiry: 42, department: 'Operations' },
    { id: 'ci4', learnerName: 'Nadia Islam', certificateName: 'Safety Certified', courseName: 'Workplace Safety Essentials', issuedDate: '2024-04-20', expiryDate: '2025-04-20', daysToExpiry: 57, department: 'Operations' },
    { id: 'ci5', learnerName: 'Imran Rahman', certificateName: 'Privacy Trained', courseName: 'Data Privacy Basics', issuedDate: '2024-02-01', expiryDate: '2025-05-01', daysToExpiry: 68, department: 'IT' },
    { id: 'ci6', learnerName: 'Sadia Akter', certificateName: 'Safety Certified', courseName: 'Workplace Safety Essentials', issuedDate: '2024-05-22', expiryDate: '2025-05-22', daysToExpiry: 89, department: 'Finance' },
  ] as CertificateIssueRow[],
  recertTrigger: [
    { id: 'rt1', learnerName: 'Rahim Ahmed', email: 'rahim@aarong.com', department: 'HR', certificateName: 'Safety Certified', courseName: 'Workplace Safety Essentials', expiryDate: '2025-02-25', daysToExpiry: 3, status: 'expiring_soon' as const },
    { id: 'rt2', learnerName: 'Mina Begum', email: 'mina@aarong.com', department: 'Field', certificateName: 'Safety Certified', courseName: 'Workplace Safety Essentials', expiryDate: '2025-01-15', daysToExpiry: -38, status: 'expired' as const },
  ] as RecertTriggerRow[],
}
