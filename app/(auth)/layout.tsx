import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Authentication | Aarong LMS',
  description: 'Login or create an account',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <main className="min-h-screen">{children}</main>
}
