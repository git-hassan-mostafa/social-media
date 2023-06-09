'use client'
import React from 'react'
import Header from '@/components/Header'
import '../app/globals.css'
import { SessionProvider } from 'next-auth/react'
import { Session } from 'next-auth'
// import { Session } from 'next-auth'



export default function RootLayoutComponent({
  session,
  children,
}: {
  children: React.ReactNode,
  session: Session
}) {
  return (
    <html lang="en">
      <head>
      <link rel='icon' href='/favicon.ico'/>
      </head>
      <body>
        <SessionProvider session={session}>
          <Header />
          <main>
            {children}
          </main>
        </SessionProvider>
      </body>
    </html>
  );
}