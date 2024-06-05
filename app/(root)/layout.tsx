import { StreamVideoProvider } from '@/providers/StreamClientProvider'
import { Metadata } from 'next';
import React, {ReactNode} from 'react'

export const metadata: Metadata = {
  title: "Yoom",
  description: "Video calling web app",
  icons: {
    icon: "/icons/logo.svg",
  },
};
const RootLayout = ({children}: {children: ReactNode}) => {
  return (  
    <main>
      <StreamVideoProvider>
        {children}
      </StreamVideoProvider>
    </main>

  )
}

export default RootLayout


// what is reactNode
// routing group
// dynamic routing