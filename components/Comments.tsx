import React from 'react'
import { Post } from '../hooks/types'
import Image from 'next/image'
import '../app/styles/comment.scss'
import CommentsInput from './CommentsInput'
import Link from 'next/link'

export default function Comments({ data, setData, postUser, _id , setCommentOpen }: {
    data: Post['comments'],
    setData: React.Dispatch<React.SetStateAction<Post['comments'] | []>>,
    postUser: string, _id: string,
    setCommentOpen:React.Dispatch<React.SetStateAction<boolean>>
}) {
    return (
        <>
            <div className="comments-block">
                <div onClick={()=>setCommentOpen(false)} className="close">x</div>
                <h2 className="title">
                    {postUser.toUpperCase()}'s POST
                </h2>
                <div className="comments">
                    {
                        data?.map((comment) => (
                            <div key={comment.id} className="one-comment">
                                <Link href={{
                                    pathname: `/profile/${comment.user.id}`,
                                    query: {
                                        name: comment.user.name,
                                        email: comment.user.email,
                                        photo: comment.user.photo
                                    }
                                }} >
                                    <Image priority unoptimized className="user-photo" width={32} height={32} alt={'avatar'} src={comment.user.photo} />
                                </Link>
                                <div className="comment-block">
                                    <Link href={{
                                        pathname: `/profile/${comment.user.id}`,
                                        query: {
                                            id: comment.user.id,
                                            name: comment.user.name,
                                            email: comment.user.email,
                                            photo: comment.user.photo
                                        }
                                    }}  >
                                        <div className="user-name">{comment.user.name}</div>
                                    </Link>
                                    <div className="comment">{comment.text}</div>
                                </div>
                            </div>
                        )).reverse()
                    }

                </div>
                <CommentsInput _id={_id} setData={setData} />
            </div>
        </>

    )
}
