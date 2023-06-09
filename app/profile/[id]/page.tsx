'use client'
import ProfileComponent from '@/components/ProfileComponent'
import { fetchData } from '@/hooks/hooks'
import { useSearchParams } from 'next/navigation'

export default function Profile({params:{id}}:{params:{id:string}}) {
  const searchParams = useSearchParams()
  const name = searchParams.get('name')
  const email = searchParams.get('email')
  const photo = searchParams.get('photo')
  
  return (
    <div>
      <ProfileComponent _id={id} name={name} email={email} photo={photo} />
    </div>
  )
}


export async function generateStaticParams() {
    const data = await fetchData('/api/users','GET')
    return data?.data?.map((user:any) => ({
      id: user._id,
    }));
  }


