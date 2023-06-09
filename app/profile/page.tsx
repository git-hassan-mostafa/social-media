'use client'
import ProfileComponent from '@/components/ProfileComponent'
import ProgressCircule from '@/components/ProgressCircule'
import { SessionType } from '@/hooks/types'
import { useSession } from 'next-auth/react'

export default function page() {
  const { data: session, status }: SessionType = useSession()
  if (status === 'loading') return <ProgressCircule />
  return (
    <div>
      <ProfileComponent _id={session?.user?.id} name={session?.user?.name} email={session?.user?.email} photo={session?.user?.image} />
    </div>
  )
}
