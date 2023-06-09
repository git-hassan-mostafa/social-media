'use client'
import Image from "next/image";
import '../app/styles/post.scss';
import SettingsIcon from '@mui/icons-material/Settings';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import React, { useState } from "react";
import PostOptionsDivider from "./PostOptionsDivider";
import BookmarkIcon from '@mui/icons-material/Bookmark';
import Profile from '../public/Profile.jpg';
import { useSession } from "next-auth/react";
import { fetchData } from "@/hooks/hooks";
import Tooltip from "@mui/material/Tooltip";
import { Post } from "@/hooks/types";
import Link from "next/link";
import Comments from "./Comments";




export default React.memo(function Post({ _id, user, text, likes, photo, comments, createdAt, onDelete, onEdit }: Post) {
  const { data: session }: any = useSession()
  const [isLiked, setIsLiked] = React.useState(false)
  const [isSaved, setIsSaved] = React.useState(false)
  const [likeCount, setLikeCount] = React.useState(likes)
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = React.useState<Post['comments'] | []>(comments)

  const [commentOpen, setCommentOpen] = useState(false)
  React.useEffect(() => {
    getUser()
  }, [])
  const getUser = async () => {
    setIsLoading(true)
    const userData = await fetchData(`/api/users/${session?.user?.id}`, 'GET')
    const postLiked = userData.data.likedPost?.find((post: string) => post === _id)
    const postSaved = userData.data.savedPost?.find((post: string) => post === _id)
    setIsLiked(Boolean(postLiked))
    setIsSaved(Boolean(postSaved))
    setIsLoading(false)
  }

  const [isLikeLoading, setIsLikeLoading] = React.useState(false)
  const [isSaveLoading, setIsSaveLoading] = React.useState(false)
  const [showOptions, setShowOptions] = React.useState(false)

  const handlePostLike = async () => {
    if (isLikeLoading) return
    setIsLikeLoading(true)
    const userData = await fetchData(`/api/users/${session?.user?.id}?populate=true`, 'GET')
    const isPostLiked = userData.data.likedPost?.find((post: Post) => post._id === _id)
    const data = await fetchData(`/api/posts/${_id}?userId=${session?.user?.id}`, 'PATCH', {
      type: Boolean(isPostLiked) ? 'unlike' : 'like'
    })
    setIsLikeLoading(false)
    if (data.status === 'success') {
      const unlikePost = session.user.likedPost.filter((post: { _id: string; }) => post._id !== _id)
      Boolean(isPostLiked) ?
        session.user.likedPost = unlikePost :
        session.user.likedPost.push({
          _id, user, text, likes, photo, comments, createdAt
        })
      setLikeCount(prev => Boolean(isPostLiked) ? prev - 1 : prev + 1)
      setIsLiked(prev => !prev)
    }


  }

  const handlePostSave = async () => {
    setIsSaveLoading(true)
    const userData = await fetchData(`/api/users/${session?.user?.id}?populate=true`, 'GET')
    const isPostSaved = userData.data.savedPost?.find((post: Post) => post._id === _id)
    const data = await fetchData(`/api/users/${session?.user?.id}?postId=${_id}`, 'PATCH', {
      type: Boolean(isPostSaved) ? 'unsave' : 'save'
    })
    setIsSaveLoading(false)
    if (data.status === 'success') {
      const unsavePost = session.user.likedPost.filter((post: { _id: string; }) => post._id !== _id)
      Boolean(isPostSaved) ?
        session.user.savedPost = unsavePost :
        session.user.savedPost.push({
          _id, user, text, likes, photo, comments, createdAt
        })
      setIsSaved(prev => !prev)

    }
  }

  const userImage =
    user?.photo ||
    Profile

  React.useEffect(() => {
    setTimeout(() => {
    }, 100);
  }, []);

  React.useEffect(() => {
    onEdit && onEdit()
  })
  return (
    <>
      <div className="post">
        <div className="post-head">
          <Link className="user-link" href={{
            pathname: `/profile/${user._id}`,
            query: {
              name: user.name,
              email: user.email,
              photo: user.photo
            }
          }}>
            <div className="user">
              <Image priority unoptimized className="avatar" width={20} height={20} alt={'avatar'} src={userImage} />
              <div className="user-info">
                <div className="name">{user.name}</div>
                <div className="email">{user.email}</div>
              </div>
            </div>
          </Link>


          <Tooltip placement="top" title='options' >
            <div className="post-options">
              <SettingsIcon onClick={() => setShowOptions(prev => !prev)} className="options-icon sm:cursor-pointer" />
              {showOptions && session.user.id === user._id && <PostOptionsDivider onDelete={onDelete ? onDelete : () => { }} onEdit={onDelete ? onDelete : () => { }} />}
            </div>
          </Tooltip>

        </div>
        <p className="post-text">{text}</p>
        {
          photo &&
          <Link target="_blank" className="image-link" href={photo} >
            <Image loading="lazy" unselectable="off" unoptimized className="image" width={476} height={450} alt="image" src={photo} />
          </Link>
        }
        <div className="post-footer">
          <div className="post-info-count">
            <div className="flex items-center justify-center gap-0.5">
              <FavoriteIcon className="text-red-600 text-xl" />
              <span>{likeCount} {likeCount > 1 ? 'likes' : 'like'}</span>
            </div>
            <div onClick={() => setCommentOpen(true)} className="flex items-center justify-center gap-1 cursor-pointer">
              {data.length} {data.length <= 1 ? 'comment' : 'comments'}
              <ChatBubbleOutlineIcon />
            </div>
          </div>
          <hr className="line" />
          <div className="post-actions">
            <Tooltip title='like'>
              <button disabled={isLikeLoading} onClick={handlePostLike} className="like">
                {
                  isLikeLoading ? <p>loading...</p> :
                    <>
                      <FavoriteIcon className={`${isLiked && 'text-red-600'} text-3xl`} /> <span className={isLiked ? 'text-red-600' : ''}>like</span>
                    </>
                }
              </button>
            </Tooltip>
            <Tooltip title='comment' >
              <button onClick={() => setCommentOpen(true)} className="comments">
                <ChatBubbleIcon className="text-3xl" /> <span>comment</span>
              </button>
            </Tooltip>

            <Tooltip title='save' >
              <button disabled={isSaveLoading} className="save">
                {
                  isSaveLoading ? <p>loading...</p> :
                    <>
                      <BookmarkIcon onClick={handlePostSave} className={`${isSaved && 'text-yellow-500'} text-4xl`} />
                    </>
                }
              </button>
            </Tooltip>

          </div>
        </div>
        {
          commentOpen && <>
            <div onClick={() => setCommentOpen(false)} className='comments-black-screen' />
            <Comments setCommentOpen={setCommentOpen} data={data} setData={setData} _id={_id} postUser={user.name} />
          </>
        }

      </div>

    </>
  )

}
)

export const getStaticProps = async () => {
  const data = await fetchData('/api/posts', 'GET')
  return {
    props: {
      _id: data?.data?._id,
      user: data?.data?.user,
      text: data?.data?.text,
      likes: data?.data?.likes,
      photo: data?.data?.photo,
      comments: data?.data?.comments,
      createdAt: data?.data?.createdAT
    }
  };
};