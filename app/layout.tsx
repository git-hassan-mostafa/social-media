import { Session } from "next-auth"
import RootLayoutComponent from "../components/RootLayout"
import { Metadata } from "next"

export default async function RootLayout({
  session,
  children,
}: {
  children: React.ReactNode,
  session: Session
}) {
  return (
    <RootLayoutComponent children={children} session={session} />
  )
}

export const metadata: Metadata = {
  title: 'H Social',
  description: 'social media app',
}

