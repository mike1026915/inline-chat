import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@mui/material/styles';
import { themeOptions } from '../theme/Theme';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Mike\'s Chat Room',
  description: 'Mike\'s Chat Room',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider theme={themeOptions}>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </ThemeProvider>
  )
}
