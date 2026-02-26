import React from 'react'
import { UserProfileDetail } from '@/components/dashboard/users/UserProfileDetail'

type Props = { params: Promise<{ id: string }> }

export default async function UserProfilePage({ params }: Props) {
  const { id } = await params
  return <UserProfileDetail userId={id} />
}
