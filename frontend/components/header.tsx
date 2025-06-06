"use client"

import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Menu, X, User, LogOut, ChevronDown } from 'lucide-react'
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  
 
  const { isAuthenticated, user, logout, loading } = useAuth()
  
  
  if (pathname === "/login" || pathname === "/registro") {
    return null
  }

  return (
    <header className="border-b bg-background">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <Image
            src="/img/logou.png"
            alt="UTP Logo"
            width={130} 
            height={130}
            className="h-36 w-36 object-contain"
            priority
          />
        </Link>
        
        <nav className="hidden md:flex gap-6">
          <Link href="/" className="text-sm font-medium hover:underline underline-offset-4">
            Inicio
          </Link>
          <Link href="/recursos" className="text-sm font-medium hover:underline underline-offset-4">
            Recursos
          </Link>
          <Link href="/colecciones" className="text-sm font-medium hover:underline underline-offset-4">
            Colecciones
          </Link>
          <Link href="/acerca" className="text-sm font-medium hover:underline underline-offset-4">
            Acerca de
          </Link>
        </nav>
        
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-4 w-4" />
                  </div>
                  <span>{user?.nombre || "Usuario"}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <DropdownMenuItem asChild>
                  <Link href={
                    user?.rol === 'admin' 
                      ? "/dashboard/admin" 
                      : user?.rol === 'estudiante' 
                        ? "/dashboard/estudiante" 
                        : "/dashboard/docente"
                  }>
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                
                {(user?.rol === 'docente' || user?.rol === 'admin') && (
                  <DropdownMenuItem asChild>
                    <Link href="/recursos/mis-recursos">
                      Mis recursos
                    </Link>
                  </DropdownMenuItem>
                )}
                
                <DropdownMenuItem asChild>
                  <Link href="/perfil">
                    Mi perfil
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-red-500 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <nav className="flex items-center gap-2">
              <Link href="/login">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-[#5b36f2] text-[#5b36f2] hover:bg-[#f0edfe] transition-colors"
                >
                  Iniciar Sesión
                </Button>
              </Link>
              <Link href="/registro">
                <Button
                  size="sm"
                  className="bg-[#5b36f2] hover:bg-[#4a2bd0] text-white transition-colors"
                >
                  Registrarse
                </Button>
              </Link>
            </nav>
          )}
        </div>
        
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>
      
      {isMenuOpen && (
        <div className="container md:hidden py-4 px-4">
          <nav className="flex flex-col gap-2">
            <Link
              href="/"
              className="text-sm font-medium hover:underline underline-offset-4"
              onClick={() => setIsMenuOpen(false)}
            >
              Inicio
            </Link>
            <Link
              href="/recursos"
              className="text-sm font-medium hover:underline underline-offset-4"
              onClick={() => setIsMenuOpen(false)}
            >
              Recursos
            </Link>
            <Link
              href="/colecciones"
              className="text-sm font-medium hover:underline underline-offset-4"
              onClick={() => setIsMenuOpen(false)}
            >
              Colecciones
            </Link>
            <Link
              href="/acerca"
              className="text-sm font-medium hover:underline underline-offset-4"
              onClick={() => setIsMenuOpen(false)}
            >
              Acerca de
            </Link>
            
            <div className="flex flex-col gap-2 mt-4">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-2 p-2 bg-muted rounded mb-2">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                      <User className="h-3 w-3" />
                    </div>
                    <span className="text-sm font-medium">{user?.nombre || "Usuario"}</span>
                  </div>
                  <Link 
                    href={user?.rol === 'estudiante' ? "/dashboard/estudiante" : "/dashboard/docente"}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Button variant="outline" className="w-full justify-start">
                      Dashboard
                    </Button>
                  </Link>
                  <Link 
                    href="/perfil"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Button variant="outline" className="w-full justify-start">
                      Mi Perfil
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-red-500" 
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar Sesión
                  </Button>
                </>
              ) : (
                <nav className="flex items-center gap-2">
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-[#5b36f2] text-[#5b36f2] hover:bg-[#f0edfe] transition-colors"
                    >
                      Iniciar Sesión
                    </Button>
                  </Link>
                  <Link href="/registro" onClick={() => setIsMenuOpen(false)}>
                    <Button
                      size="sm"
                      className="bg-[#5b36f2] hover:bg-[#4a2bd0] text-white transition-colors"
                    >
                      Registrarse
                    </Button>
                  </Link>
                </nav>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}