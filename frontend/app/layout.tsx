import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import FooterWrapper from "@/components/footer-wrapper"
import { Providers } from "./providers"
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "UTPEDU - Plataforma Educativa UTP",
  description: "Plataforma educativa de la Universidad Tecnológica del Perú",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={cn('min-h-screen bg-background font-sans antialiased', inter.className)}>
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