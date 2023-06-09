'use client'
import React, { SetStateAction, useEffect, useState } from 'react'
import Post from './Post'
import '../app/styles/posts.scss'
import ProgressCircule, { ProgressCirculeInline } from './ProgressCircule'
import { Post as PostType, SessionType } from '@/hooks/types'
import { fetchData } from '@/hooks/hooks'
import { Alert, Backdrop, CircularProgress, Snackbar } from '@mui/material'
import { useSession } from 'next-auth/react'
import { storage } from '@/firebaseConfig'
import { deleteObject, ref } from 'firebase/storage'


function Posts(
  { data: posts, isLoading, isFetching }:
   { data: PostType[] | null, isLoading?: boolean, isFetching?: boolean }
) {
  const { data: session }: SessionType = useSession()
  const [data, setData] = useState<PostType[] | null>(posts)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [deleteStatus, setDeleteStatus] = useState<{ message: string, status: string }>({ message: '', status: '' })
  useEffect(() => {
    const allPosts = posts
    setData(allPosts)
  }, [posts])



  const handlePostDelete = async (id: string, userId: string) => {
    setDeleteLoading(true)
    if (session?.user?.id !== userId) {
      setDeleteLoading(false)
      setOpen(true)
      setTimeout(() => setOpen(false), 5000)
      setDeleteStatus({ status: 'not-success', message: 'sorry , you do not have the privilages to delete this post' })
      return
    }
    const deletedData = await fetchData(`/api/posts/${id}`, 'DElETE')
    setDeleteLoading(false)
    setOpen(true)
    setTimeout(() => setOpen(false), 5000)


    if (deletedData.status === 'success') {
      setDeleteStatus({ status: deletedData.status, message: 'successfully deleted' })
      // delete the photo from firebase
      if (deletedData?.data?.photoPath) {
        const desertRef = ref(storage, deletedData?.data?.photoPath);
        deleteObject(desertRef).then(() => {
        }).catch((error) => {
          console.log(error)
        })
      }
      const filteredData = data?.filter((post: { _id: string }) => post._id !== id)
      setData(filteredData as SetStateAction<PostType[] | null>)
    }

  }

  const handlePostEdit = () => {

  }

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false)
  };
  return (
    <div className='posts'>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme: { zIndex: { drawer: number } }) => theme.zIndex.drawer + 1 }}
        open={deleteLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {
        isLoading ? <ProgressCircule /> :
          data?.map((post: PostType) => (
            <Post
              key={post._id}
              _id={post._id}
              user={{
                email: post?.user?.email || '',
                name: post?.user?.name || '',
                photo: post?.user?.photo || '',
                _id: post?.user?._id || ''
              }
              }
              photo={post.photo}
              text={post?.text}
              likes={post?.likes}
              comments={post.comments}
              createdAt={post.createdAt}
              onDelete={() => handlePostDelete(post._id, post.user._id)}
              onEdit={handlePostEdit}
            />
          ))
      }
      {
        isFetching && <ProgressCirculeInline />
      }
      {
        open &&
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert variant='filled' onClose={handleClose} severity={deleteStatus.status === "success" ? "success" : "error"} sx={{ width: '100%' }}>
            {
              deleteStatus.message
            }
          </Alert>
        </Snackbar>
      }

    </div>
  )
}

export default React.memo(Posts)


