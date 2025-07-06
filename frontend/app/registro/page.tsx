"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { authService } from "@/lib/api"
import Image from "next/image"
import { Eye, EyeOff, Info } from "lucide-react"

export default function RegistroPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    confirmPassword: "",
    tipoUsuario: "estudiante", 
    institucion: "Universidad Tecnológica del Perú", 
    nivelEducativo: "",
    areaEspecialidad: "",
    codigoInstitucional: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  
  
  useEffect(() => {
    if (formData.codigoInstitucional) {
      if (formData.tipoUsuario === 'estudiante') {
        setFormData(prev => ({ 
          ...prev, 
          email: `${formData.codigoInstitucional}@utp.edu.pe`
        }));
      } else if (formData.tipoUsuario === 'docente') {
        setFormData(prev => ({ 
          ...prev, 
          email: `${formData.codigoInstitucional}@utp.edu.pe`
        }));
      } else if (formData.tipoUsuario === 'admin') {
        setFormData(prev => ({ 
          ...prev, 
          email: `${formData.codigoInstitucional}@admin.utp.edu.pe`
        }));
      }
    }
  }, [formData.codigoInstitucional, formData.tipoUsuario]);

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

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    
    
    if (name === "tipoUsuario") {
      setFormData(prev => ({
        ...prev,
        codigoInstitucional: "",
        email: ""
      }));
    }
    
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

  if (!formData.nombre.trim()) newErrors.nombre = "El nombre es requerido"
  if (!formData.apellido.trim()) newErrors.apellido = "El apellido es requerido"
  if (!formData.codigoInstitucional.trim()) newErrors.codigoInstitucional = "El código institucional es requerido"

  
  if (formData.tipoUsuario === 'estudiante') {
    if (!formData.codigoInstitucional.match(/^U\d{7}$/)) {
      newErrors.codigoInstitucional = "El código debe tener formato Uxxxxxxx (U seguido de 7 dígitos)"
    }
  } else if (formData.tipoUsuario === 'docente') {
    if (!formData.codigoInstitucional.match(/^C\d{5}$/)) {
      newErrors.codigoInstitucional = "El código debe tener formato Cxxxxx (C seguido de 5 dígitos)"
    }
  }

  if (!formData.email) {
    newErrors.email = "El email es generado automáticamente con tu código"
  }

  if (!formData.password) {
    newErrors.password = "La contraseña es requerida"
  } else if (formData.password.length < 8) {
    newErrors.password = "La contraseña debe tener al menos 8 caracteres"
  }

  if (formData.password !== formData.confirmPassword) {
    newErrors.confirmPassword = "Las contraseñas no coinciden"
  }

 

  return newErrors
}


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  console.log("Formulario enviado")

  const newErrors = validateForm()

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors)
    console.log("Errores de validación:", newErrors)
    return
  }

  setIsLoading(true)

  try {
    
    const { confirmPassword, ...userData } = formData
    
    const userDataToSend = {
      ...userData,
      institucion: "Universidad Tecnológica del Perú",
      nivelEducativo: "universidad", 
      areaEspecialidad: formData.tipoUsuario === 'estudiante' ? "estudiante" : "docente"
    }
    
    console.log("Datos a enviar:", userDataToSend)
    const response = await authService.registro(userDataToSend)
    
    
    authService.setUserData(response.token, response.usuario)
    
    
    if (response.usuario.rol === 'estudiante') {
      router.push("/dashboard/estudiante")
    } else {
      router.push("/dashboard/docente")
    }
  } catch (error: any) {
    console.error('Error al registrar usuario:', error)
    setErrors({
      submit: error.response?.data?.mensaje || 'Error al registrar usuario. Por favor intenta nuevamente.'
    })
  } finally {
    setIsLoading(false)
  }
}

  return (
    <div className="flex min-h-screen">
      {}
      <div className="hidden md:block md:w-1/2 bg-[#f0edfe]">
        <div className="h-full flex items-center justify-center">
          <div className="w-[75%] p-6">
            <Image
              src="/login.svg"
              alt="Registro illustration"
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
      <div className="w-full md:w-1/2 flex flex-col justify-center p-6 md:p-12 py-12 overflow-y-auto max-h-screen">
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
              Registro de Usuario
            </h1>
            <p className="text-gray-600">
              Crea una cuenta para acceder a la plataforma de recursos educativos
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nombre" className="text-gray-700 font-medium">Nombre</Label>
                <Input
                  id="nombre"
                  name="nombre"
                  placeholder="Ingresa tu nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="border-gray-300 rounded-md h-12"
                />
                {errors.nombre && <p className="text-sm text-red-500">{errors.nombre}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="apellido" className="text-gray-700 font-medium">Apellido</Label>
                <Input
                  id="apellido"
                  name="apellido"
                  placeholder="Ingresa tu apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  className="border-gray-300 rounded-md h-12"
                />
                {errors.apellido && <p className="text-sm text-red-500">{errors.apellido}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">Tipo de Usuario</Label>
              <RadioGroup
                defaultValue="estudiante"
                value={formData.tipoUsuario}
                onValueChange={(value) => handleSelectChange("tipoUsuario", value)}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="estudiante" id="estudiante" />
                  <Label htmlFor="estudiante">Estudiante</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="docente" id="docente" />
                  <Label htmlFor="docente">Docente</Label>
                </div>
               
               
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="codigoInstitucional" className="text-gray-700 font-medium">Código Institucional</Label>
              <Input
                id="codigoInstitucional"
                name="codigoInstitucional"
                placeholder={formData.tipoUsuario === 'estudiante' ? 'Ej: U2210133' : formData.tipoUsuario === 'docente' ? 'Ej: C31585' : 'Ej: A1234'}
                value={formData.codigoInstitucional}
                onChange={handleChange}
                className="border-gray-300 rounded-md h-12"
              />
              {errors.codigoInstitucional ? (
                <p className="text-sm text-red-500">{errors.codigoInstitucional}</p>
              ) : (
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <Info size={14} className="mr-1" />
                  <span>
                    {formData.tipoUsuario === 'estudiante' 
                      ? 'Formato: Uxxxxxxx (U seguido de 7 dígitos)' 
                      : formData.tipoUsuario === 'docente'
                        ? 'Formato: Cxxxxx (C seguido de 5 dígitos)'
                        : 'Formato: Axxxx (A seguido de 4 dígitos)'}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-medium">Correo Electrónico</Label>
              <Input
                id="email"
                name="email"
                type="email"
                readOnly
                placeholder="El correo se generará automáticamente"
                value={formData.email}
                className="border-gray-300 rounded-md h-12 bg-gray-50"
              />
              <div className="flex items-center text-xs text-gray-500 mt-1">
                <Info size={14} className="mr-1" />
                <span>El correo se genera automáticamente con tu código institucional</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">Contraseña</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="********"
                  value={formData.password}
                  onChange={handleChange}
                  className="border-gray-300 rounded-md h-12"
                />
                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">Confirmar Contraseña</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="********"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="border-gray-300 rounded-md h-12"
                />
                {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
              </div>
            </div>

            <div className="space-y-2">
              
              
              
            </div>

           
            
             
            
            {errors.submit && (
              <div className="bg-red-50 p-3 rounded-md border border-red-200">
                <p className="text-sm text-red-600">{errors.submit}</p>
              </div>
            )}
            
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-12 bg-[#5b36f2] hover:bg-[#4a2bd0] text-white font-medium rounded-md"
            >
              {isLoading ? "Registrando..." : "Registrarse"}
            </Button>
            
            <div className="text-center">
              <p className="text-sm text-gray-600">
                ¿Ya tienes una cuenta?{" "}
                <Link href="/login" className="text-[#5b36f2] font-medium hover:underline">
                  Iniciar Sesión
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}