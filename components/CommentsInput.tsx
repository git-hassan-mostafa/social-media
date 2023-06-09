import React, { useState } from 'react';
import '../app/styles/comment-input.scss';
import SendIcon from '@mui/icons-material/Send';
import { Post, SessionType } from '@/hooks/types';
import { useSession } from 'next-auth/react';
import { fetchData } from '@/hooks/hooks';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

export default function CommentsInput({ setData, _id }: {
    setData: React.Dispatch<React.SetStateAction<Post['comments'] | []>>,
    _id: string
}) {
    const { data: session }: SessionType = useSession()
    const [isLoading, setIsLoading] = useState(false)
    const inputRef = React.useRef<HTMLInputElement | null>(null)
    React.useEffect(() => {
        inputRef?.current?.focus()
    }, [])

    const handleAddComment = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!inputRef?.current?.value) return
        setIsLoading(true)
        const fetchedData = await fetchData(`/api/posts/${_id}`, 'PATCH', {
            comment: inputRef?.current?.value as string,
            user: session?.user?.id
        })
        setIsLoading(false)
        setData(prev => [{
            text: inputRef?.current?.value?.toString() as string,
            user: {
                name: session?.user?.name as string,
                email: session?.user?.email as string,
                photo: session?.user?.image as string
            } as any,
            id: (Math.random() * 1000).toString() as string
        }, ...prev])
        inputRef?.current ? inputRef.current.value = '' : null

    };

    return (
        <div>
            <form onSubmit={handleAddComment} className="search">
                <input ref={inputRef} type="text" className="search__input" placeholder="Type your text" />
                <button disabled={isLoading } type='submit' className={`search__button`}>
                    {
                        isLoading ? <MoreHorizIcon className='text-blue-600' /> :
                            <SendIcon className='text-blue-600' />
                    }
                </button>
            </form>
        </div>
    )
}
