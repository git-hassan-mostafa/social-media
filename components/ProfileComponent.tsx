'use client'
import ProfileHeader from '@/components/profileHeader'
import { Post, profileProps } from '@/hooks/types'
import { useInfiniteFetching } from '@/hooks/hooks'
import { ProgressCirculeInline } from '@/components/ProgressCircule'
import Posts from '@/components/Posts'

export default function ProfileComponent({ _id, name, email, photo }: profileProps) {
    const { data, isLoading } = useInfiniteFetching<Post>(`/api/posts`, `userId=${_id}`)
    return (
        <div>
            {
                <>
                    <ProfileHeader _id={_id} name={name} email={email} photo={photo} />
                    <h1 className='text-center text-3xl text-slate-900 font-bold my-10'> POSTS </h1>
                    {
                        isLoading ?
                            <ProgressCirculeInline />
                            :
                            data?.length || 0 > 0 ?
                                <Posts data={data} /> :
                                <h1 className='text-center text-xl text-zinc-700 '> NO POSTS YET </h1>
                    }
                </>
            }
        </div>
    )
}
