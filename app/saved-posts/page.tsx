'use client'
import { useSession } from 'next-auth/react'
import ProgressCircule from '@/components/ProgressCircule'
import Posts from '@/components/Posts'

export default function Save() {
  const { data: session, status }: any = useSession()
  const data = session?.user?.savedPost
  return (
    <>
      {
        status !== 'authenticated' ?
          <ProgressCircule /> :
          <>
            <h1 className='text-3xl sm:text-5xl text-center m-10 font-bold text-slate-800'>SAVED POSTS</h1>
            <Posts data={data.reverse()} />
          </>

      }
    </>
  )
}
