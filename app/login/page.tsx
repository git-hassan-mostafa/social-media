'use client'
import Image from 'next/image'
import '../styles/login.scss'
import Google from '../../public/Google.png'
import Facebook from '../../public/Facebook.png'
import { ClientSafeProvider, LiteralUnion, getProviders, signIn, useSession } from 'next-auth/react'
import { BuiltInProviderType } from 'next-auth/providers'
import React from 'react'
import { useRouter } from 'next/navigation'
import ProgressCircule from '@/components/ProgressCircule'
export default function Login() {
    const [providers, setProviders] = React.useState<Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider> | null>(null);
    const [isLoading, setIsLoading] = React.useState(false)
    React.useEffect(() => {
        (async () => {
            const res = await getProviders();
            setProviders(res);
        })();
    }, []);

    const { data } = useSession()
    const { push } = useRouter()
    React.useEffect(() => {
        if (data) push('/')
    }, [data, []])

    const logoes = [Google, Facebook]

    const handleSignIn=async (e:string)=>{
        await signIn(e)
        push('/')
    }
    return (
        <>
            <h1 className='font-bold font text-4xl m-auto w-fit text-slate-700 mt-10'> {'sign in'.toLocaleUpperCase()} </h1>
            <div className="providers">
                {
                    !providers ? <ProgressCircule /> : Object.values(providers || []).map((provider, i) => (
                        <section onClick={() => handleSignIn(provider.id)} key={provider?.id} className="box">
                            <button className='provider'>
                                <Image
                                    unoptimized
                                    className='provider-img'
                                    // width={undefined}
                                    // height={undefined}
                                    src={logoes[i]}
                                    alt='google'
                                />
                            </button>
                        </section>
                    ))
                }
            </div>

        </>
    )
}
