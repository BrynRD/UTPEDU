"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog,DialogContent,DialogDescription,DialogFooter,DialogHeader,DialogTitle,DialogTrigger,} from "@/components/ui/dialog"
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs"
import { 
  FileText, 
  Search, 
  Settings, 
  Shield, 
  User, 
  Users,
  Check,
  X,
  AlertCircle
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/contexts/AuthContext"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import { ChangePasswordDialog } from "@/components/dashboard/admin/ChangePasswordDialog"
import { CreateUserDialog } from "@/components/dashboard/admin/CreateUserDialog"


interface Usuario {
  id: number
  nombre: string
  apellido: string
  email: string
  rol: string
  codigo_institucional: string
  createdAt: string
  activo: boolean
}

interface Recurso {
  id: number
  titulo: string
  descargas: number
  categoria: string
  autor: {
    id: number
    nombre: string
    apellido: string
  }
}

interface EstadisticasDashboard {
  totalUsuarios: number
  usuariosNuevosMes: number
  totalRecursos: number
  recursosNuevosMes: number
  totalDescargas: number
  descargasSemanales: number
  nuevosRegistros: number
  nuevosRegistrosSemanales: number
}

export default function AdminDashboard() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [usuariosRecientes, setUsuariosRecientes] = useState<Usuario[]>([])
  const [recursosMasDescargados, setRecursosMasDescargados] = useState<Recurso[]>([])
  const [estadisticas, setEstadisticas] = useState<EstadisticasDashboard | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<Usuario | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isManagingPermissions, setIsManagingPermissions] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [isCreatingUser, setIsCreatingUser] = useState(false)
  const { toast } = useToast()
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(15); // 15 users per page
  const [totalUsers, setTotalUsers] = useState(0);

  const [formUsuario, setFormUsuario] = useState({
    nombre: "",
    apellido: "",
    email: "",
    rol: "",
    activo: true
  })


  const [permisos, setPermisos] = useState({
    crearRecursos: false,
    editarRecursos: false,
    eliminarRecursos: false,
    gestionarUsuarios: false,
    verEstadisticas: false,
    administrarSistema: false
  })

  
  useEffect(() => {
    if (!loading && (!isAuthenticated || user?.rol !== 'admin')) {
      toast({
        title: "Acceso denegado",
        description: "No tienes permisos para ver esta página",
        variant: "destructive"
      })
      router.push('/')
    }
  }, [isAuthenticated, user, loading, router, toast])

 
useEffect(() => {
  const fetchData = async () => {
    try {
      setIsLoading(true)
      
     
      console.log('Iniciando fetch de datos...');
      console.log('NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
      
      // Obtener datos de usuarios con paginación
      console.log(`Consultando usuarios (frontend): página ${currentPage}, límite ${usersPerPage}`);
      const resUsuarios = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/usuarios?page=${currentPage}&limit=${usersPerPage}`)
      console.log('Status respuesta usuarios:', resUsuarios.status);
      const dataUsuarios = await resUsuarios.json()
      console.log('Datos de usuarios recibidos:', dataUsuarios);
      
      if (dataUsuarios.usuarios) {
        setUsuarios(dataUsuarios.usuarios)
        setTotalUsers(dataUsuarios.totalUsuarios); // Set total users from backend
        
       
        const recientes = [...dataUsuarios.usuarios]
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5) // Still show 5 recent from the *current page's* fetched users
        
        setUsuariosRecientes(recientes)
      }
      
     
      console.log('Consultando recursos populares...');
      const resRecursos = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/recursos/populares`)
      const dataRecursos = await resRecursos.json()
      
      if (dataRecursos.recursos) {
        setRecursosMasDescargados(dataRecursos.recursos)
      }
      
      
      console.log('Consultando estadísticas...');
      const resEstadisticas = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/estadisticas`)
      const dataEstadisticas = await resEstadisticas.json()
      
      if (dataEstadisticas.estadisticas) {
        setEstadisticas(dataEstadisticas.estadisticas)
      }
      
    } catch (error) {
      console.error("Error detallado al cargar datos:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos. Intente nuevamente más tarde.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  fetchData()
}, [toast, currentPage, usersPerPage])


  const usuariosFiltrados = usuarios.filter(usuario => 
    usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.codigo_institucional.toLowerCase().includes(searchTerm.toLowerCase())
  )

 
  const handleEditUsuario = (usuario: Usuario) => {
    setUsuarioSeleccionado(usuario)
    setFormUsuario({
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      rol: usuario.rol,
      activo: usuario.activo
    })
    setIsEditing(true)
  }

  const handleCambiarContraseña = (usuario: Usuario) => {
    setUsuarioSeleccionado(usuario)
    setIsChangingPassword(true)
  }

  const handlePasswordChanged = () => {
    console.log('Contraseña cambiada con éxito. Considerar recargar datos de usuario si es necesario.')
  }

const guardarCambiosUsuario = async () => {
  try {
    if (!usuarioSeleccionado) return
    
  
    console.log('Usuario original:', usuarioSeleccionado);
    console.log('Guardando cambios usuario:', formUsuario);
    console.log('Rol específico a enviar:', formUsuario.rol);
    
   
    const datosActualizados = {
      ...formUsuario,
      rol: formUsuario.rol.toLowerCase()
    };
    
    console.log('Datos normalizados a enviar:', datosActualizados);
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/usuarios/${usuarioSeleccionado.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datosActualizados)
    })
    
    const data = await response.json()
    console.log('Respuesta al actualizar usuario:', data);
    
    if (data.success) {
      toast({
        title: "Usuario actualizado",
        description: "Los datos del usuario han sido actualizados correctamente",
      })
      
    
      setUsuarios(usuarios.map(u => 
        u.id === usuarioSeleccionado.id ? { ...u, ...datosActualizados } : u
      ))
      
      setIsEditing(false)
    } else {
      throw new Error(data.message || "Error al actualizar usuario")
    }
  } catch (error: any) {
    console.error("Error detallado al actualizar:", error);
    toast({
      title: "Error",
      description: error.message || "No se pudo actualizar el usuario",
      variant: "destructive"
    })
  }
}

const handleGestionarPermisos = (usuario: Usuario) => {
  setUsuarioSeleccionado(usuario)
  
  const fetchPermissions = async () => {
    try {
      console.log('Consultando permisos para usuario ID:', usuario.id);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/usuarios/${usuario.id}/permisos`)
      console.log('Status respuesta permisos:', response.status);
      
      const data = await response.json()
      console.log('Datos de permisos recibidos:', data);
      
      if (data.permisos) {
        setPermisos(data.permisos)
      }
    } catch (error) {
      console.error("Error detallado al obtener permisos:", error)
      if (usuario.rol === 'admin') {
        setPermisos({
          crearRecursos: true,
          editarRecursos: true,
          eliminarRecursos: true,
          gestionarUsuarios: true,
          verEstadisticas: true,
          administrarSistema: true
        })
      } else if (usuario.rol === 'docente') {
        setPermisos({
          crearRecursos: true,
          editarRecursos: true,
          eliminarRecursos: false,
          gestionarUsuarios: false,
          verEstadisticas: false,
          administrarSistema: false
        })
      } else {
        setPermisos({
          crearRecursos: false,
          editarRecursos: false,
          eliminarRecursos: false,
          gestionarUsuarios: false,
          verEstadisticas: false,
          administrarSistema: false
        })
      }
    }
  }
  
  fetchPermissions()
  setIsManagingPermissions(true)
  
}


const toggleUsuarioActivo = async (usuario: Usuario) => {
  try {
    const nuevoEstado = !usuario.activo;
    
    console.log(`Cambiando estado de usuario ${usuario.id} a ${nuevoEstado ? 'activo' : 'inactivo'}`);
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/usuarios/${usuario.id}/activo`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ activo: nuevoEstado })
    });
    
    const data = await response.json();
    console.log('Respuesta al cambiar estado:', data);
    
    if (data.success) {
      setUsuarios(usuarios.map(u => 
        u.id === usuario.id ? { ...u, activo: nuevoEstado } : u
      ));
      
      toast({
        title: `Usuario ${nuevoEstado ? 'activado' : 'desactivado'}`,
        description: `El usuario ha sido ${nuevoEstado ? 'activado' : 'desactivado'} correctamente`,
      });
    } else {
      throw new Error(data.message || `Error al ${nuevoEstado ? 'activar' : 'desactivar'} usuario`);
    }
  } catch (error: any) {
    console.error("Error:", error);
    toast({
      title: "Error",
      description: error.message || "No se pudo cambiar el estado del usuario",
      variant: "destructive"
    });
  }
};
const guardarPermisos = async () => {
  try {
    if (!usuarioSeleccionado) return
    
    console.log('Guardando permisos para usuario ID:', usuarioSeleccionado.id, permisos);
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/usuarios/${usuarioSeleccionado.id}/permisos`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ permisos })
    })
    
    const data = await response.json()
    console.log('Respuesta al actualizar permisos:', data);
    
    if (data.success) {
      toast({
        title: "Permisos actualizados",
        description: "Los permisos del usuario han sido actualizados correctamente",
      })
      setIsManagingPermissions(false)
    } else {
      throw new Error(data.message || "Error al actualizar permisos")
    }
  } catch (error: any) {
    console.error("Error detallado al guardar permisos:", error);
    toast({
      title: "Error",
      description: error.message || "No se pudieron actualizar los permisos",
      variant: "destructive"
    })
  }
}

const handleUserCreated = (newUser: Usuario) => {
  setUsuarios(prevUsers => [...prevUsers, newUser].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
}

// Add Delete User Function
const handleDeleteUsuario = async (usuarioId: number) => {
  if (window.confirm("¿Está seguro de que desea eliminar este usuario?")) {
    try {
      console.log('Eliminando usuario con ID:', usuarioId);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/usuarios/${usuarioId}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      console.log('Respuesta al eliminar usuario:', data);
      
      if (data.success) {
        toast({
          title: "Usuario eliminado",
          description: "El usuario ha sido eliminado correctamente",
        });
        // Remove the deleted user from the state
        setUsuarios(prevUsers => prevUsers.filter(user => user.id !== usuarioId));
      } else {
        throw new Error(data.message || "Error al eliminar usuario");
      }
    } catch (error: any) {
      console.error("Error detallado al eliminar usuario:", error);
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar el usuario",
        variant: "destructive"
      });
    }
  }
};

  if (loading || (isAuthenticated && user?.rol !== 'admin')) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="flex justify-center items-center h-[50vh]">
          <div className="text-center">
            <Skeleton className="h-12 w-80 mb-4" />
            <Skeleton className="h-4 w-64 mx-auto" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard de Administrador</h1>
          <p className="text-muted-foreground">
            Bienvenido {user?.nombre}. Gestiona usuarios, recursos y permisos.
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Shield className="mr-2 h-4 w-4" />
                Gestionar Permisos
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Gestionar Permisos</DialogTitle>
                <DialogDescription>
                  Seleccione un usuario de la lista para gestionar sus permisos específicos.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Label htmlFor="usuario-select">Seleccionar Usuario</Label>
                <Select>
                  <SelectTrigger className="w-full mt-2">
                    <SelectValue placeholder="Seleccionar usuario" />
                  </SelectTrigger>
                  <SelectContent>
                    {usuarios.map((usuario) => (
                      <SelectItem 
                        key={usuario.id} 
                        value={usuario.id.toString()}
                      >
                        {usuario.nombre} {usuario.apellido} ({usuario.rol})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button variant="outline">Cancelar</Button>
                <Button>Ver Permisos</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            Configuración
          </Button>
        </div>
      </div>

      <Tabs defaultValue="resumen" className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 lg:w-[600px]">
          <TabsTrigger value="resumen">Resumen</TabsTrigger>
          <TabsTrigger value="usuarios">Usuarios</TabsTrigger>
          <TabsTrigger value="recursos">Recursos</TabsTrigger>
          <TabsTrigger value="reportes">Reportes</TabsTrigger>
          <TabsTrigger value="configuracion">Configuración</TabsTrigger>
        </TabsList>

        <TabsContent value="resumen" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-6 w-20" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">{estadisticas?.totalUsuarios || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      +{estadisticas?.usuariosNuevosMes || 0} en el último mes
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Recursos</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-6 w-20" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">{estadisticas?.totalRecursos || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      +{estadisticas?.recursosNuevosMes || 0} en el último mes
                    </p>
                  </>
                )}
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
                {isLoading ? (
                  <Skeleton className="h-6 w-20" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">{estadisticas?.totalDescargas || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      +{estadisticas?.descargasSemanales || 0} desde la semana pasada
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Nuevos Registros</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-6 w-20" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">{estadisticas?.nuevosRegistros || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      +{estadisticas?.nuevosRegistrosSemanales || 0} en la última semana
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Usuarios Recientes</CardTitle>
                <CardDescription>
                  {usuariosRecientes.length} nuevos usuarios registrados recientemente
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-center gap-4">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-4 w-[200px]" />
                          <Skeleton className="h-4 w-[160px]" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {usuariosRecientes.map((usuario) => (
                      <div key={usuario.id} className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-500" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="font-medium">
                            {usuario.nombre} {usuario.apellido}
                            {!usuario.activo && (
                              <span className="ml-2 text-xs text-red-500 font-normal">
                                (Inactivo)
                              </span>
                            )}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {usuario.email} • {usuario.rol} • Registrado el{" "}
                            {new Date(usuario.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEditUsuario(usuario)}
                          >
                            Editar
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleGestionarPermisos(usuario)}
                          >
                            Permisos
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => handleDeleteUsuario(usuario.id)}
                          >
                            Eliminar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recursos Populares</CardTitle>
                <CardDescription>Los recursos más descargados este mes</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-center gap-4">
                        <Skeleton className="h-8 w-8 rounded" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-4 w-[180px]" />
                          <Skeleton className="h-3 w-[100px]" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recursosMasDescargados.map((recurso) => (
                      <div key={recurso.id} className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                          <FileText className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="font-medium">{recurso.titulo}</p>
                          <p className="text-xs text-muted-foreground">
                            {recurso.descargas} descargas • Por {recurso.autor.nombre} {recurso.autor.apellido}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="usuarios" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Gestión de Usuarios</CardTitle>
                <CardDescription>Administra todos los usuarios de la plataforma</CardDescription>
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="search" 
                    placeholder="Buscar usuarios..." 
                    className="w-[200px] md:w-[300px] pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button onClick={() => setIsCreatingUser(true)}>
                  <User className="mr-2 h-4 w-4" />
                  Nuevo Usuario
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="p-3 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-5 w-[200px]" />
                          <Skeleton className="h-4 w-[300px]" />
                        </div>
                        <div className="flex gap-2">
                          <Skeleton className="h-9 w-[60px]" />
                          <Skeleton className="h-9 w-[60px]" />
                          <Skeleton className="h-9 w-[80px]" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {usuariosFiltrados.length > 0 ? (
                    usuariosFiltrados.map((usuario) => (
                      <div key={usuario.id} className="flex items-center gap-4 p-3 border rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-500" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">
                              {usuario.nombre} {usuario.apellido}
                            </p>
                            <span className={`px-2 py-0.5 text-xs rounded-full ${
                              usuario.rol === 'admin' 
                                ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' 
                                : usuario.rol === 'docente'
                                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                                  : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                            }`}>
                              {usuario.rol.charAt(0).toUpperCase() + usuario.rol.slice(1)}
                            </span>
                            {!usuario.activo && (
                              <span className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">
                                Inactivo
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {usuario.email} • {usuario.codigo_institucional} • 
                            Registrado el {new Date(usuario.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleEditUsuario(usuario)}
                          >
                            Editar
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleGestionarPermisos(usuario)}
                          >
                            Permisos
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleCambiarContraseña(usuario)}
                          >
                            Contraseña
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => handleDeleteUsuario(usuario.id)}
                          >
                            Eliminar
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8">
                      <AlertCircle className="h-12 w-12 text-muted-foreground mb-3" />
                      <h3 className="text-lg font-medium">No se encontraron usuarios</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        No hay usuarios que coincidan con tu búsqueda
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
            {/* Pagination Controls */}
            <div className="flex justify-end space-x-2 p-4">
              <Button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1 || isLoading}
                variant="outline"
              >
                Anterior
              </Button>
              <Button
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={currentPage * usersPerPage >= totalUsers || isLoading}
                variant="outline"
              >
                Siguiente
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="recursos">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Recursos</CardTitle>
              <CardDescription>Administra los recursos educativos de la plataforma</CardDescription>
            </CardHeader>
            <CardContent>
              <p>El contenido de esta pestaña está en desarrollo.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reportes">
          <Card>
            <CardHeader>
              <CardTitle>Reportes y Estadísticas</CardTitle>
              <CardDescription>Visualiza datos estadísticos sobre el uso de la plataforma</CardDescription>
            </CardHeader>
            <CardContent>
              <p>El contenido de esta pestaña está en desarrollo.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="configuracion">
          <Card>
            <CardHeader>
              <CardTitle>Configuración del Sistema</CardTitle>
              <CardDescription>Configura los parámetros globales de la plataforma</CardDescription>
            </CardHeader>
            <CardContent>
              <p>El contenido de esta pestaña está en desarrollo.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog para editar usuario */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Usuario</DialogTitle>
            <DialogDescription>
              Modifica los datos del usuario {usuarioSeleccionado?.nombre} {usuarioSeleccionado?.apellido}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  value={formUsuario.nombre}
                  onChange={(e) => setFormUsuario({...formUsuario, nombre: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apellido">Apellido</Label>
                <Input
                  id="apellido"
                  value={formUsuario.apellido}
                  onChange={(e) => setFormUsuario({...formUsuario, apellido: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                value={formUsuario.email}
                onChange={(e) => setFormUsuario({...formUsuario, email: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rol">Rol</Label>
              <Select
                value={formUsuario.rol}
                onValueChange={(value) => setFormUsuario({...formUsuario, rol: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="docente">Docente</SelectItem>
                  <SelectItem value="estudiante">Estudiante</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <Switch
                id="usuario-activo"
                checked={formUsuario.activo}
                onCheckedChange={(checked) => setFormUsuario({...formUsuario, activo: checked})}
              />
              <Label htmlFor="usuario-activo">Usuario activo</Label>
            </div>
            <p className="text-sm text-muted-foreground">
              El código institucional no puede ser modificado: {usuarioSeleccionado?.codigo_institucional}
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(false)}>Cancelar</Button>
            <Button onClick={guardarCambiosUsuario}>Guardar Cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para gestionar permisos */}
      <Dialog open={isManagingPermissions} onOpenChange={setIsManagingPermissions}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Gestionar Permisos</DialogTitle>
            <DialogDescription>
              Configura los permisos para {usuarioSeleccionado?.nombre} {usuarioSeleccionado?.apellido}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="crear-recursos" 
                  checked={permisos.crearRecursos} 
                  onCheckedChange={(checked) => 
                    setPermisos({...permisos, crearRecursos: checked === true})
                  }
                />
                <Label htmlFor="crear-recursos">Crear recursos educativos</Label>
              </div>
              <p className="text-xs text-muted-foreground pl-6">
                Permite al usuario crear nuevos recursos educativos
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="editar-recursos" 
                  checked={permisos.editarRecursos} 
                  onCheckedChange={(checked) => 
                    setPermisos({...permisos, editarRecursos: checked === true})
                  }
                />
                <Label htmlFor="editar-recursos">Editar recursos educativos</Label>
              </div>
              <p className="text-xs text-muted-foreground pl-6">
                Permite al usuario editar recursos existentes
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="eliminar-recursos" 
                  checked={permisos.eliminarRecursos} 
                  onCheckedChange={(checked) => 
                    setPermisos({...permisos, eliminarRecursos: checked === true})
                  }
                />
                <Label htmlFor="eliminar-recursos">Eliminar recursos</Label>
              </div>
              <p className="text-xs text-muted-foreground pl-6">
                Permite al usuario eliminar recursos de la plataforma
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="gestionar-usuarios" 
                  checked={permisos.gestionarUsuarios} 
                  onCheckedChange={(checked) => 
                    setPermisos({...permisos, gestionarUsuarios: checked === true})
                  }
                />
                <Label htmlFor="gestionar-usuarios">Gestionar usuarios</Label>
              </div>
              <p className="text-xs text-muted-foreground pl-6">
                Permite al usuario gestionar otros usuarios
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="ver-estadisticas" 
                  checked={permisos.verEstadisticas} 
                  onCheckedChange={(checked) => 
                    setPermisos({...permisos, verEstadisticas: checked === true})
                  }
                />
                <Label htmlFor="ver-estadisticas">Ver estadísticas</Label>
              </div>
              <p className="text-xs text-muted-foreground pl-6">
                Permite al usuario ver estadísticas y reportes
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="administrar-sistema" 
                  checked={permisos.administrarSistema} 
                  onCheckedChange={(checked) => 
                    setPermisos({...permisos, administrarSistema: checked === true})
                  }
                />
                <Label htmlFor="administrar-sistema">Administrar sistema</Label>
              </div>
              <p className="text-xs text-muted-foreground pl-6">
                Permite al usuario configurar parámetros del sistema
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsManagingPermissions(false)}>Cancelar</Button>
            <Button onClick={guardarPermisos}>Guardar Permisos</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Nuevo Dialogo para Cambiar Contraseña */}
      <ChangePasswordDialog
        isOpen={isChangingPassword}
        onClose={() => setIsChangingPassword(false)}
        userId={usuarioSeleccionado?.id || null}
        userName={`${usuarioSeleccionado?.nombre || ''} ${usuarioSeleccionado?.apellido || ''}`.trim()}
        onPasswordChanged={handlePasswordChanged}
      />

      {/* Nuevo Dialogo para Crear Usuario */}
      <CreateUserDialog
        isOpen={isCreatingUser}
        onClose={() => setIsCreatingUser(false)}
        onUserCreated={handleUserCreated}
      />
    </div>
  )
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      {...props}
    />
  )
}