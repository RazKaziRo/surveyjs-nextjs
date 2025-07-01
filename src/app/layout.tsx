import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/contexts/AuthContext'
import Header from "@/components/shared/Header";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SurveyJS + NextJS Quickstart Template',
  description: 'SurveyJS + NextJS Quickstart Template',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Header />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  )
}
