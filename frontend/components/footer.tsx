import type React from "react"
import Link from "next/link"
import Image from "next/image"

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container flex flex-col gap-6 py-8 px-4 md:flex-row md:items-center md:justify-between md:py-12">
        <div className="flex flex-col gap-2">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <Image
              src="/img/logou.png"
              alt="UTP Logo"
              width={100}
              height={100}
              className="h-32 w-32 object-contain"
              priority
            />
          </Link>
          <p className="text-sm text-muted-foreground">Plataforma de recursos educativos para docentes.</p>
        </div>
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 md:gap-8">
          <div className="space-y-3">
            {/* El resto del código se mantiene igual */}


            
            <h3 className="text-sm font-medium">Plataforma</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/recursos" className="text-sm text-muted-foreground hover:underline">
                  Recursos
                </Link>
              </li>
              <li>
                <Link href="/colecciones" className="text-sm text-muted-foreground hover:underline">
                  Colecciones
                </Link>
              </li>
              <li>
                <Link href="/docentes" className="text-sm text-muted-foreground hover:underline">
                  Docentes
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Soporte</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/ayuda" className="text-sm text-muted-foreground hover:underline">
                  Ayuda
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-sm text-muted-foreground hover:underline">
                  Contacto
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-muted-foreground hover:underline">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terminos" className="text-sm text-muted-foreground hover:underline">
                  Términos
                </Link>
              </li>
              <li>
                <Link href="/privacidad" className="text-sm text-muted-foreground hover:underline">
                  Privacidad
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-sm text-muted-foreground hover:underline">
                  Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t py-6 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} EduRecursos. Todos los derechos reservados.</p>
      </div>
    </footer>
  )
}

function BookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
    </svg>
  )
}