'use client'
import Posts from '@/components/Posts'
import ProgressCircule from '@/components/ProgressCircule'
import { useInfiniteFetching } from '@/hooks/hooks'
import { Post } from '@/hooks/types'
import { useSession } from 'next-auth/react'




function Home() {
  const {status }: any = useSession()
  const { data, isLoading, isFetching } = useInfiniteFetching<Post>(`/api/posts`)
  return (
    <>
      {
        status !== 'authenticated' ?
          <ProgressCircule /> :
          <Posts
           data={data} isLoading={isLoading} isFetching={isFetching}
            />

      }
    </>
  )
}

export default Home
