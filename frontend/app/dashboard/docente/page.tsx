"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { SelectItem } from "@/components/ui/select"
import { SelectContent } from "@/components/ui/select"
import { SelectValue } from "@/components/ui/select"
import { SelectTrigger } from "@/components/ui/select"
import { Select } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, BookOpen, FileText, FolderPlus, Plus, Upload, User } from "lucide-react"

import { authService, userService } from "@/lib/api"


export default function DocenteDashboard() {
  // Estado para almacenar los datos del usuario
  const [userData, setUserData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    institucion: "Universidad Tecnológica del Perú",
    codigoInstitucional: "",
    rol: ""
  })

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: ""
  })

  // Obtener los datos del usuario al cargar la página
  useEffect(() => {
    const fetchUserData = () => {
      try {
        // Obtener los datos del usuario desde localStorage
        const userData = authService.getUserData();
        console.log("Datos de usuario obtenidos:", userData);
        
        if (userData && userData.usuario) {
          const usuario = userData.usuario;
          setUserData({
            nombre: usuario.nombre || "",
            apellido: usuario.apellido || "",
            email: usuario.email || "",
            institucion: "Universidad Tecnológica del Perú",
            codigoInstitucional: usuario.codigo_institucional || "",
            rol: usuario.rol || ""
          })
          
          setFormData({
            nombre: usuario.nombre || "",
            apellido: usuario.apellido || ""
          })
        } else {
          console.error("No hay datos de usuario disponibles");
          setError("No se encontraron datos de usuario. Por favor inicie sesión nuevamente.")
        }
      } catch (err) {
        console.error("Error al cargar los datos del usuario:", err)
        setError("Error al cargar los datos del usuario. Por favor inicie sesión nuevamente.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData();
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSaveChanges = async () => {
    try {
      // Aquí implementarías la lógica para guardar los cambios
      console.log("Guardando cambios:", formData)
      // const response = await apiService.updateProfile(formData)
      // setUserData({ ...userData, ...formData })
      alert("Cambios guardados correctamente")
    } catch (error) {
      console.error("Error al guardar los cambios:", error)
      alert("Error al guardar los cambios")
    }
  }

  // Mostrar mensaje de carga mientras se obtienen los datos
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-[#5b36f2] border-r-transparent border-l-transparent border-b-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg">Cargando datos...</p>
        </div>
      </div>
    )
  }

  // Mostrar mensaje de error si ocurre algún problema
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center p-6 bg-red-50 rounded-lg max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <h2 className="text-xl font-bold mt-4">Error</h2>
          <p className="mt-2">{error}</p>
          <Button 
            className="mt-4" 
            onClick={() => window.location.href = "/login"}
          >
            Volver al inicio de sesión
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {userData.rol === 'estudiante' 
              ? "Dashboard de Estudiante" 
              : "Dashboard de Docente"}
          </h1>
          <p className="text-muted-foreground">
            Bienvenido(a) {userData.nombre} {userData.apellido}. Gestiona tus recursos y perfil.
          </p>
        </div>
        <div className="flex gap-2">
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            Subir Recurso
          </Button>
          <Button variant="outline">
            <FolderPlus className="mr-2 h-4 w-4" />
            Nueva Colección
          </Button>
        </div>
      </div>

      <Tabs defaultValue="resumen" className="space-y-6">
        <TabsList className="grid grid-cols-3 md:grid-cols-5 lg:w-[600px]">
          <TabsTrigger value="resumen">Resumen</TabsTrigger>
          <TabsTrigger value="recursos">Mis Recursos</TabsTrigger>
          <TabsTrigger value="colecciones">Colecciones</TabsTrigger>
          <TabsTrigger value="favoritos">Favoritos</TabsTrigger>
          <TabsTrigger value="perfil">Mi Perfil</TabsTrigger>
        </TabsList>

        <TabsContent value="resumen" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recursos Subidos</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">Empieza a compartir recursos</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Colecciones</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">Crea tu primera colección</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Descargas</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M8 17.929H6c-1.105 0-2-.912-2-2.036V5.036C4 3.91 4.895 3 6 3h8c1.105 0 2 .911 2 2.036v1.866m-6 .17h8c1.105 0 2 .91 2 2.035v10.857C20 21.09 19.105 22 18 22h-8c-1.105 0-2-.911-2-2.036V9.107c0-1.124.895-2.036 2-2.036z" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">Sin descargas aún</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Favoritos</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">Marca tus favoritos</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Recursos Disponibles</CardTitle>
                <CardDescription>Explora recursos compartidos por otros usuarios</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <FileText className="h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium">No hay recursos disponibles</h3>
                  <p className="text-sm text-gray-500 mt-1 mb-4">
                    Sé el primero en compartir recursos con la comunidad UTP
                  </p>
                  <Button>Subir mi primer recurso</Button>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Actividad Reciente</CardTitle>
                <CardDescription>Últimas interacciones con la plataforma</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <User className="h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium">Sin actividad reciente</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Tu actividad aparecerá aquí
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recursos" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Mis Recursos</CardTitle>
                <CardDescription>Gestiona todos tus recursos educativos</CardDescription>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Recurso
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FileText className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-medium">No has subido recursos todavía</h3>
                <p className="text-sm text-gray-500 mt-2 mb-6 max-w-md">
                  Comparte tus materiales educativos con la comunidad UTP. Sube presentaciones, documentos, 
                  videos o cualquier recurso que consideres útil.
                </p>
                <Button>
                  <Upload className="mr-2 h-4 w-4" />
                  Subir mi primer recurso
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="perfil" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Mi Perfil</CardTitle>
              <CardDescription>Gestiona tu información personal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-32 h-32 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <User className="h-16 w-16 text-gray-500" />
                  </div>
                  <Button variant="outline" size="sm">
                    Cambiar foto
                  </Button>
                </div>
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nombre</Label>
                      <Input 
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Apellido</Label>
                      <Input 
                        name="apellido"
                        value={formData.apellido}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Correo Electrónico</Label>
                    <Input 
                      value={userData.email}
                      readOnly
                      className="bg-gray-50"
                    />
                    <p className="text-xs text-gray-500">El correo institucional no se puede modificar</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Código Institucional</Label>
                    <Input 
                      value={userData.codigoInstitucional}
                      readOnly
                      className="bg-gray-50"
                    />
                    <p className="text-xs text-gray-500">El código institucional no se puede modificar</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Institución</Label>
                    <Input 
                      value="Universidad Tecnológica del Perú"
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Rol</Label>
                    <Input 
                      value={userData.rol === 'estudiante' ? 'Estudiante' : 'Docente'}
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline">Cancelar</Button>
                <Button onClick={handleSaveChanges}>Guardar Cambios</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return <div className="text-sm font-medium">{children}</div>
}