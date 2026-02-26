import React from 'react'
import { PathBuilder } from '@/components/dashboard/paths/PathBuilder'

type Props = { params: Promise<{ pathId: string }> }

export default async function EditPathPage({ params }: Props) {
  const { pathId } = await params
  return <PathBuilder pathId={pathId} />
}
