/**
 * Learner My Certificates — proof of completion, download. Replace with API later.
 */

export type CertificateExpiryStatus = 'valid' | 'expiring_30' | 'expired'

export interface LearnerCertificate {
  id: string
  title: string // Course/Path name
  issuedDate: string // e.g. "Feb 20, 2025"
  issuedDateRaw: string // ISO for sort
  expiryDate: string | null // display
  expiryStatus: CertificateExpiryStatus | null // valid | expiring_30 | expired
  downloadUrl: string
}

const CERTIFICATES: LearnerCertificate[] = [
  {
    id: 'cert1',
    title: 'Safety Fundamentals',
    issuedDate: 'Feb 20, 2025',
    issuedDateRaw: '2025-02-20',
    expiryDate: null,
    expiryStatus: null,
    downloadUrl: '#',
  },
  {
    id: 'cert2',
    title: 'Workplace Safety Essentials',
    issuedDate: 'Jan 15, 2025',
    issuedDateRaw: '2025-01-15',
    expiryDate: 'May 31, 2025',
    expiryStatus: 'expiring_30',
    downloadUrl: '#',
  },
  {
    id: 'cert3',
    title: 'Data Privacy Basics',
    issuedDate: 'Dec 10, 2024',
    issuedDateRaw: '2024-12-10',
    expiryDate: 'Dec 10, 2025',
    expiryStatus: 'valid',
    downloadUrl: '#',
  },
  {
    id: 'cert4',
    title: 'Fire Safety at Work',
    issuedDate: 'Oct 1, 2024',
    issuedDateRaw: '2024-10-01',
    expiryDate: 'Jan 15, 2025',
    expiryStatus: 'expired',
    downloadUrl: '#',
  },
]

export interface CertificatesSummary {
  total: number
  expiringSoon: number
}

export function getCertificatesSummary(): CertificatesSummary {
  const total = CERTIFICATES.length
  const expiringSoon = CERTIFICATES.filter((c) => c.expiryStatus === 'expiring_30').length
  return { total, expiringSoon }
}

export type CertificateFilter = 'all' | 'valid' | 'expiring' | 'expired'

export function getLearnerCertificates(filter: CertificateFilter = 'all'): LearnerCertificate[] {
  let list = [...CERTIFICATES]
  if (filter === 'valid') list = list.filter((c) => c.expiryStatus === 'valid' || c.expiryStatus === null)
  if (filter === 'expiring') list = list.filter((c) => c.expiryStatus === 'expiring_30')
  if (filter === 'expired') list = list.filter((c) => c.expiryStatus === 'expired')
  return list.sort((a, b) => b.issuedDateRaw.localeCompare(a.issuedDateRaw))
}
