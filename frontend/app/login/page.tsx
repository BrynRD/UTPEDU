"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import Image from "next/image"
import { Eye, EyeOff, Info } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

export default function LoginPage() {
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    codigoInstitucional: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.codigoInstitucional.trim()) {
      newErrors.codigoInstitucional = "El código institucional es requerido"
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es requerida"
    }

    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors = validateForm()

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)

    try {
      
      await login(formData.codigoInstitucional, formData.password)
      
    } catch (error: any) {
      console.error('Error al iniciar sesión:', error)
      setErrors({
        submit: error.response?.data?.mensaje || 'Credenciales inválidas. Por favor verifique su código y contraseña.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
     
      <div className="hidden md:block md:w-1/2 bg-[#f0edfe]">
        <div className="h-full flex items-center justify-center">
          <div className="w-[75%] p-6">
            <Image
              src="/login.svg"
              alt="Login illustration"
              width={800}
              height={800}
              className="w-full h-auto"
              quality={100}
              priority
            />
          </div>
        </div>
      </div>
    
      {}
      <div className="w-full md:w-1/2 flex flex-col justify-center p-6 md:p-12">
        <div className="w-full max-w-md mx-auto">
          {}
          <div className="mb-6">
            <Link href="/">
              <Image
                src="/img/logou.png"
                alt="UTP+class"
                width={240}
                height={60}
                className="h-14 w-auto cursor-pointer hover:opacity-80 transition-opacity"
              />
            </Link>
          </div>
          
          {}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">
              La nueva experiencia digital de aprendizaje
            </h1>
            <p className="text-gray-600">
              Cercana, dinámica y flexible
            </p>
          </div>
          
          <p className="text-gray-700 mb-4">Ingresa tus datos para iniciar sesión.</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {}
            <div className="space-y-2">
              <Label htmlFor="codigoInstitucional" className="text-gray-700 font-medium">Código UTP</Label>
              <Input
                id="codigoInstitucional"
                name="codigoInstitucional"
                type="text"
                placeholder="Ingresa tu código"
                value={formData.codigoInstitucional}
                onChange={handleChange}
                className="border-gray-300 rounded-md h-12"
              />
              {errors.codigoInstitucional ? (
                <p className="text-sm text-red-500">{errors.codigoInstitucional}</p>
              ) : (
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <Info size={14} className="mr-1" />
                  <span>Ejemplo para estudiante: U2210133, docente: C31585</span>
                </div>
              )}
            </div>
            
            {}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 font-medium">Contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Ingresa tu contraseña"
                  value={formData.password}
                  onChange={handleChange}
                  className="border-gray-300 rounded-md h-12 pr-10"
                />
                <button 
                  type="button"
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
              <div className="flex justify-end">
                <Link href="/recuperar-password" className="text-sm text-[#5b36f2] hover:underline">
                  Restablecer contraseña
                </Link>
              </div>
            </div>
            
            {errors.submit && (
              <div className="bg-red-50 p-3 rounded-md border border-red-200">
                <p className="text-sm text-red-600">{errors.submit}</p>
              </div>
            )}
            
            {}
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-12 bg-[#5b36f2] hover:bg-[#4a2bd0] text-white font-medium rounded-md"
            >
              {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
            </Button>
            
            {}
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                ¿No tienes una cuenta?{" "}
                <Link href="/registro" className="text-[#5b36f2] font-medium hover:underline">
                  Registrarse
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}