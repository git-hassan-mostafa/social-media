import Image from 'next/image';
import '../app/styles/profile.scss';
import { profileProps } from '@/hooks/types';
import Link from 'next/link';
import { Url } from 'next/dist/shared/lib/router/router';


export default function ProfileHeader({ _id, name, email, photo }: profileProps) {
    return (
        <section className='profile-header'>
            <Link target='_blank' href={photo?.toString() as Url} >
                <Image priority unoptimized src={photo || ''} width={10} height={10} alt='avatar' className='profile-avatar' />
            </Link>
            <div className="profile-inforamtions">
                <h1 className="name"> {name?.toUpperCase()} </h1>
                <div className="email"> {email} </div>
                <div className="_id"> {_id} </div>
                <div className="posts"> { } </div>
            </div>
            {/* <div className="icons">
                <DeleteIcon />
                <EditIcon />
            </div> */}
        </section>
    )
}
