import type React from "react"
import { Inter } from 'next/font/google'
import "./globals.css"
import Header from "@/components/header"
import FooterWrapper from "@/components/footer-wrapper"
import { Providers } from "./providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Plataforma de Recursos Educativos",
  description: "Plataforma para que docentes compartan recursos educativos",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <FooterWrapper />
          </div>
        </Providers>
      </body>
    </html>
  )
}