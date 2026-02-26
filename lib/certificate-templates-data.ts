/**
 * Certificate Templates — design for course/path completion. Logo, name, course/path, date. Signatures, ID/QR, expiry. Compliance proof + recognition.
 */

export type CertificateTemplate = {
  id: string
  name: string
  layout: {
    logoUrl: string
    showName: boolean
    showCoursePath: boolean
    showDate: boolean
    signatureBlocks: { label: string; role: string }[]
    showCertificateId: boolean
    showQr: boolean
    expiryMonths: number | null
  }
  updatedAt: string
}

export const MOCK_CERTIFICATE_TEMPLATE: CertificateTemplate = {
  id: 'cert1',
  name: 'Default completion certificate',
  layout: {
    logoUrl: '',
    showName: true,
    showCoursePath: true,
    showDate: true,
    signatureBlocks: [
      { label: 'HR', role: 'HR Manager' },
      { label: 'Trainer', role: 'Training Lead' },
    ],
    showCertificateId: true,
    showQr: true,
    expiryMonths: null,
  },
  updatedAt: '2025-02-20T10:00:00Z',
}
