'use client'
import React, { ChangeEventHandler, FormEvent, useState } from 'react'
import '../styles/addPost.scss'
import Image from 'next/image'
import Google from '../../public/Google.png'
import { ref, uploadBytesResumable, getDownloadURL, UploadTask } from "firebase/storage"
import { storage } from '../../firebaseConfig'
import { fetchData } from '@/hooks/hooks'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import CloseIcon from '@mui/icons-material/Close'
import { Alert, Snackbar } from '@mui/material'

export default function AddPost() {
  const { push } = useRouter()
  const { data: session }: any = useSession()
  const [text, setText] = useState('')
  const [imageSrc, setImageSrc] = React.useState<string | null>('');
  const [data, setData] = React.useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false)
  const [fetchedData, setFetchedData] = useState<{ status: string } | null>(null)
  const [open, setOpen] = React.useState(false)
  const [errorPhoto, setErrorPhoto] = React.useState('posts/image.jpg')
  const storageRef = ref(storage, `posts/${data?.name}`);
  const uploadTask: UploadTask | null = data ? uploadBytesResumable(storageRef, data) : null;


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    if (!session.user) return
    e.preventDefault();
    try {

      setIsLoading(true)
      uploadTask?.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          switch (snapshot.state) {
            case 'paused':
              break;
            case 'running':
              break;
          }
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            const fetchedData = await fetchData(`/api/posts?userId=${session?.user?.id}`, 'POST', {
              photo: downloadURL,
              photoPath: storageRef.fullPath,
              text
            })
            setFetchedData(fetchedData)
            setIsLoading(false)
            if (fetchedData.status === 'success')
              push('/')
            setOpen(true)
            setTimeout(() => {
              setOpen(false);
            }, 3000)

            if (fetchedData.status !== 'success') {
              const deleteData = await fetchData('/api/deletedImages', 'POST', {
                imagePath: storageRef.fullPath
              })
            }
          });
        }
      );

      if (!imageSrc) {
        const fetchedData = await fetchData(`/api/posts?userId=${session?.user?.id}`, 'POST', {
          text
        })
        setFetchedData(fetchedData)
        setIsLoading(false)
        if (fetchedData.status === 'success')
          push('/')
        setOpen(true)
        setTimeout(() => {
          setOpen(false);
        }, 3000)
      }

    } catch (error) {
      console.log(error)
    }


  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e?.target?.files?.[0];
    setData(file || null)
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setImageSrc(imageURL);
    }
  };

  const handleTextAreaChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setText(e.target.value)
  }

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false)
  };


  return (
    <div className='add-post'>
      <h2>Create a post</h2>
      <hr className='m-3' />
      <form onSubmit={handleSubmit} >
        <div className="content">
          <textarea className='input' placeholder='Add some text' onChange={handleTextAreaChange} />
          <div className={`post-image ${!imageSrc && 'hidden'}`} >
            <Image src={imageSrc || Google} width={10} height={10} className='w-full h-full' hidden={!imageSrc?.length} alt={'image'} />
            <CloseIcon onClick={() => {
              setImageSrc(null);
              setData(null)
            }} className='remove-image' />
          </div>

        </div>
        <div className="buttons">
          <label className='upload-photo' htmlFor="input-file">upload photo</label>
          <input onChange={handleInputChange} type="file" className='hidden' name="input-file" id="input-file" />
          <button disabled={!Boolean(text || imageSrc)} className={`post ${!Boolean(text || imageSrc) && 'cursor-not-allowed'} `} type='submit'>
            {
              isLoading ? 'loading' : 'post'
            }
          </button>
        </div>

      </form>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert variant='filled' onClose={handleClose} severity={fetchedData?.status === 'success' ? 'success' : 'error'} sx={{ width: '100%' }}>
          {
            fetchedData?.status === 'success' ? 'post has been posted successfully' : 'an error occured , please try again'
          }
        </Alert>
      </Snackbar>
    </div>

  )
}


