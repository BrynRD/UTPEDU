"use client"

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
import { 
  AlertCircle, 
  BookOpen, 
  FileText, 
  Download, 
  Search, 
  User,
  GraduationCap,
  Clock,
  Star,
  Calendar
} from "lucide-react"
import { authService, userService } from "@/lib/api"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import api, { recursoService } from "@/lib/api"

interface Recurso {
  id: number;
  titulo: string;
  descripcion: string;
  archivo_url: string;
  categoria_id: number;
  usuario_id: number;
  fecha_creacion: string; // o Date si se parsea
  // Añadir otras propiedades si el backend las devuelve en getAllRecursos, como nombre de categoría/usuario
  categoria_nombre?: string;
  usuario_nombre?: string; // o un objeto de usuario parcial
}

export default function StudentDashboard() {
  const [userData, setUserData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    institucion: "Universidad Tecnológica del Perú",
    codigoInstitucional: "",
    rol: "",
    carrera: "",
    ciclo: "",
    creditosAcumulados: 0
  })

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    carrera: "",
    ciclo: "",
    telefono: "",
    intereses: ""
  })

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    passwordActual: "",
    passwordNuevo: "",
    confirmarPassword: ""
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [materiales, setMateriales] = useState<Recurso[]>([]);
  const [isLoadingMateriales, setIsLoadingMateriales] = useState(true);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");

  const [cursosActuales] = useState([
    { id: 1, nombre: "Matemática Discreta", profesor: "Dr. Carlos Rodríguez", creditos: 4, progreso: 65 },
    { id: 2, nombre: "Programación Orientada a Objetos", profesor: "Ing. Laura Méndez", creditos: 5, progreso: 78 },
    { id: 3, nombre: "Arquitectura de Computadoras", profesor: "Mg. Roberto Sánchez", creditos: 3, progreso: 42 }
  ]);

  const [materialesRecientes] = useState([
    { id: 1, titulo: "Estructuras de Datos Avanzadas", tipo: "PDF", fecha: "25/04/2025", curso: "Programación Orientada a Objetos", tamaño: "2.3 MB" },
    { id: 2, titulo: "Ejercicios resueltos - Semana 5", tipo: "DOCX", fecha: "22/04/2025", curso: "Matemática Discreta", tamaño: "1.1 MB" },
    { id: 3, titulo: "Laboratorio Virtual - Procesadores", tipo: "ZIP", fecha: "20/04/2025", curso: "Arquitectura de Computadoras", tamaño: "15.8 MB" }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDataFromStorage = authService.getUserData();
        console.log("Datos iniciales de usuario obtenidos:", userDataFromStorage);
        
        if (userDataFromStorage && userDataFromStorage.usuario) {
          const usuario = userDataFromStorage.usuario;
          
          try {
            const apiUserData = await userService.getPerfil();
            console.log("Datos de usuario obtenidos de la API:", apiUserData);
            
            if (apiUserData && apiUserData.usuario) {
              usuario.carrera = apiUserData.usuario.carrera || "";
              usuario.ciclo = apiUserData.usuario.ciclo || "";
              usuario.telefono = apiUserData.usuario.telefono || "";
              usuario.intereses = apiUserData.usuario.intereses || "";
              usuario.creditosAcumulados = apiUserData.usuario.creditos_acumulados || 0;
            }
          } catch (apiError) {
            console.error("No se pudieron obtener datos actualizados de la API:", apiError);
          }
          
          setUserData({
            nombre: usuario.nombre || "",
            apellido: usuario.apellido || "",
            email: usuario.email || "",
            institucion: usuario.institucion || "Universidad Tecnológica del Perú",
            codigoInstitucional: usuario.codigo_institucional || "",
            rol: usuario.rol || "",
            carrera: usuario.carrera || "Ingeniería de Sistemas",
            ciclo: usuario.ciclo || "5",
            creditosAcumulados: usuario.creditosAcumulados || 75
          });
          
          setFormData({
            nombre: usuario.nombre || "",
            apellido: usuario.apellido || "",
            carrera: usuario.carrera || "Ingeniería de Sistemas",
            ciclo: usuario.ciclo || "5",
            telefono: usuario.telefono || "",
            intereses: usuario.intereses || ""
          });
        } else {
          console.error("No hay datos de usuario disponibles en localStorage");
          setError("No se encontraron datos de usuario. Por favor inicie sesión nuevamente.");
        }
      } catch (err) {
        console.error("Error al cargar los datos del usuario:", err);
        setError("Error al cargar los datos del usuario. Por favor inicie sesión nuevamente.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();

    console.log('useEffect triggered with:', { searchTerm, currentPage });

    const handler = setTimeout(async () => {
      try {
        setIsLoadingMateriales(true);
        console.log('Fetching materiales with params directly in useEffect:', { searchTerm, currentPage });
        const response = await recursoService.getAllRecursos(searchTerm, currentPage, 7);
        console.log('Frontend useEffect: Received', {
          recursosCount: response.recursos.length,
          totalRecursos: response.totalRecursos,
          currentPage: response.currentPage,
          totalPages: response.totalPages,
          firstRecurso: response.recursos[0]?.titulo,
          lastRecurso: response.recursos[response.recursos.length - 1]?.titulo
        });
        setMateriales(response.recursos);
        setTotalPages(response.totalPages);
        setCurrentPage(response.currentPage);
      } catch (error) {
        console.error('Error al obtener materiales en useEffect:', error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los materiales. Por favor, intenta nuevamente.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingMateriales(false);
      }
    }, 100);

    return () => clearTimeout(handler);
  }, [searchTerm, currentPage]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const errors = [];
    
    if (!formData.nombre.trim()) {
      errors.push("El nombre es obligatorio");
    }
    
    if (!formData.apellido.trim()) {
      errors.push("El apellido es obligatorio");
    }
    
    if (errors.length > 0) {
      toast({
        title: "Error de validación",
        description: errors.join(", "),
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };

  const handleSaveChanges = async () => {
    if (!validateForm()) return;
    
    try {
      setIsSaving(true);
      
      const oldNombre = userData.nombre;
      const oldApellido = userData.apellido;
      
      const datosActualizados = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        carrera: formData.carrera,
        ciclo: formData.ciclo,
        telefono: formData.telefono,
        intereses: formData.intereses
      };
      
      console.log("Enviando datos actualizados:", datosActualizados);
      
      const response = await userService.updatePerfil(datosActualizados);
      console.log("Respuesta de actualización:", response);
      
      setUserData(prevData => ({
        ...prevData,
        nombre: formData.nombre,
        apellido: formData.apellido,
        carrera: formData.carrera,
        ciclo: formData.ciclo
      }));
      
      const currentUserData = authService.getUserData();
      if (currentUserData && currentUserData.usuario && currentUserData.token) {
        const updatedUser = {
          ...currentUserData.usuario,
          nombre: formData.nombre,
          apellido: formData.apellido,
          carrera: formData.carrera,
          ciclo: formData.ciclo
        };
        authService.setUserData(currentUserData.token, updatedUser);
      }
      
      let cambiosRealizados = [];
      
      if (oldNombre !== formData.nombre) {
        cambiosRealizados.push(`Nombre actualizado de "${oldNombre}" a "${formData.nombre}"`);
      }
      
      if (oldApellido !== formData.apellido) {
        cambiosRealizados.push(`Apellido actualizado de "${oldApellido}" a "${formData.apellido}"`);
      }
      
      const mensajeCambios = cambiosRealizados.length > 0 
        ? cambiosRealizados.join(", ") 
        : "Los datos han sido verificados correctamente";
      
      setUpdateMessage(mensajeCambios);
      
      toast({
        title: "Perfil actualizado",
        description: mensajeCambios,
        variant: "default",
      });
      
      setUpdateSuccess(true);
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 5000);
      
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
      toast({
        title: "Error",
        description: "No se pudieron guardar los cambios. Intenta nuevamente.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    // Validaciones
    if (!passwordData.passwordActual) {
      toast({ title: "Error", description: "Ingresa tu contraseña actual", variant: "destructive" });
      return;
    }
    
    if (passwordData.passwordNuevo.length < 6) {
      toast({ title: "Error", description: "La nueva contraseña debe tener al menos 6 caracteres", variant: "destructive" });
      return;
    }
    
    if (passwordData.passwordNuevo !== passwordData.confirmarPassword) {
      toast({ title: "Error", description: "Las contraseñas nuevas no coinciden", variant: "destructive" });
      return;
    }
    
    try {
      setIsChangingPassword(true);
      
      const userData = authService.getUserData();
      if (!userData || !userData.token) {
        throw new Error('No hay sesión activa');
      }
      
      const response = await api.post('/usuarios/cambiar-password', {
        passwordActual: passwordData.passwordActual,
        passwordNuevo: passwordData.passwordNuevo,
        confirmarPassword: passwordData.confirmarPassword
      });
      
      const data = response.data;
      
      setPasswordData({
        passwordActual: "",
        passwordNuevo: "",
        confirmarPassword: ""
      });
      
      setPasswordSuccess(true);
      setTimeout(() => {
        setPasswordSuccess(false);
        setShowPasswordForm(false);
      }, 3000);
      
      toast({
        title: "Contraseña actualizada",
        description: "Tu contraseña ha sido actualizada correctamente",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar la contraseña",
        variant: "destructive"
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDownload = async (recursoId: number) => {
    try {
      console.log('Frontend Student Download: Initiating download for resource ID:', recursoId);
      console.log('Frontend Student Download: Fetching from URL:', `${process.env.NEXT_PUBLIC_API_URL}/recursos/download/${recursoId}`);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/recursos/download/${recursoId}`, {
        method: 'GET',
        // No need for Authorization header here anymore, as we removed auth middleware in backend/app.js for this route
        // headers: {
        //   'Authorization': `Bearer ${localStorage.getItem('token')}`,
        // }
      });

      console.log('Frontend Student Download: Response status', response.status);
      console.log('Frontend Student Download: Response ok', response.ok);
      console.log('Frontend Student Download: Response headers', [...response.headers.entries()]);

      if (!response.ok) {
        console.error('Frontend Student Download: Response not OK.', response.status, response.statusText);
        // If response is not ok, try to parse JSON for an error message
        try {
            const errorData = await response.json();
            console.error('Frontend Student Download: Error data from backend:', errorData);
            throw new Error(errorData.mensaje || `Error del servidor: ${response.status}`);
        } catch (jsonError) {
            // If JSON parsing fails, throw a generic error with status text
            console.error('Frontend Student Download: Failed to parse error JSON:', jsonError);
            throw new Error(`Error al descargar el recurso: ${response.statusText || response.status}`);
        }
      }

      // Get filename from Content-Disposition header
      const contentDisposition = response.headers.get('Content-Disposition');
      console.log('Frontend Student Download: Received Content-Disposition header:', contentDisposition);
      let filename = 'downloaded-file';
      if (contentDisposition) {
        // Manual extraction of filename, avoiding regex issues
        const filenamePrefix = 'filename="';
        const startIndex = contentDisposition.indexOf(filenamePrefix);
        
        if (startIndex !== -1) {
          let extractedFilename = contentDisposition.substring(startIndex + filenamePrefix.length);
          
          // Remove trailing quote if present
          if (extractedFilename.endsWith('"')) {
            extractedFilename = extractedFilename.substring(0, extractedFilename.length - 1);
          }
          
          // Remove trailing semicolon if present (in case of filename="...";)
          if (extractedFilename.endsWith(';')) {
             extractedFilename = extractedFilename.substring(0, extractedFilename.length - 1);
          }
          
          filename = extractedFilename;
          console.log('Frontend Student Download: Manually extracted filename:', filename);
        } else {
            // Fallback for cases without quotes (less common but possible)
            const basicFilenamePrefix = 'filename=';
            const basicStartIndex = contentDisposition.indexOf(basicFilenamePrefix);
            if (basicStartIndex !== -1) {
                 let extractedFilename = contentDisposition.substring(basicStartIndex + basicFilenamePrefix.length);
                 // Remove trailing semicolon if present
                 if (extractedFilename.endsWith(';')) {
                    extractedFilename = extractedFilename.substring(0, extractedFilename.length - 1);
                 }
                 filename = extractedFilename;
                 console.log('Frontend Student Download: Manually extracted filename (no quotes):', filename);
            }
        }
      }
      console.log('Frontend Student Download: Determined filename:', filename);

      // Get the file content as a Blob
      const blob = await response.blob();

      // Create a temporary URL for the blob
      const url = window.URL.createObjectURL(blob);

      // Create a temporary anchor element and trigger the download
      const a = document.createElement('a');
      a.href = url;
      a.download = filename; // Set the suggested filename
      document.body.appendChild(a);
      a.click();

      // Clean up the temporary URL and anchor element
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Descarga iniciada",
        description: "El archivo debería empezar a descargarse pronto.",
      });

    } catch (error) {
      console.error('Error al descargar:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo descargar el recurso. Intenta nuevamente.",
        variant: "destructive",
      });
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handlePageChange = (newPage: number) => {
    console.log('Changing to page:', newPage);
    setCurrentPage(newPage);
  };

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
            Dashboard de Estudiante
          </h1>
          <p className="text-muted-foreground">
            Bienvenido(a) {userData.nombre} {userData.apellido}. Gestiona tus cursos y perfil.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Mis Descargas
          </Button>
        </div>
      </div>

      <Tabs defaultValue="resumen" className="space-y-6">
        <TabsList className="grid grid-cols-3 md:grid-cols-3 lg:w-[600px]">
          <TabsTrigger value="resumen">Resumen</TabsTrigger>
          <TabsTrigger value="recursos">Recursos</TabsTrigger>
          <TabsTrigger value="perfil">Mi Perfil</TabsTrigger>
        </TabsList>

        <TabsContent value="resumen" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cursos Actuales</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{cursosActuales.length}</div>
                <p className="text-xs text-muted-foreground">Semestre 2025-I</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Créditos Acumulados</CardTitle>
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userData.creditosAcumulados}</div>
                <p className="text-xs text-muted-foreground">De 220 requeridos</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Materiales</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{materialesRecientes.length}</div>
                <p className="text-xs text-muted-foreground">Recursos nuevos esta semana</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Próximo Evento</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-md font-bold">Examen Parcial</div>
                <p className="text-xs text-muted-foreground">05 Mayo, 9:00 AM</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Mis Cursos Actuales</CardTitle>
                <CardDescription>Semestre 2025-I</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cursosActuales.map((curso) => (
                    <div key={curso.id} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{curso.nombre}</h3>
                          <p className="text-sm text-gray-600">{curso.profesor}</p>
                          <div className="flex items-center mt-1">
                            <Badge variant="outline" className="text-xs">
                              {curso.creditos} créditos
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-medium">
                            Progreso: {curso.progreso}%
                          </span>
                          <div className="w-32 h-2 bg-gray-200 rounded-full mt-1">
                            <div 
                              className="h-2 bg-green-500 rounded-full"
                              style={{ width: `${curso.progreso}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Materiales Recientes</CardTitle>
                <CardDescription>Últimos recursos disponibles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-6">
                  <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      placeholder="Buscar materiales..." 
                      className="pl-9"
                    />
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Select defaultValue="todos">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filtrar por curso" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos los cursos</SelectItem>
                        {cursosActuales.map(curso => (
                          <SelectItem key={curso.id} value={`curso-${curso.id}`}>
                            {curso.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="bg-gray-50 p-3 rounded-t-md">
                    <div className="grid grid-cols-12 text-sm font-medium text-gray-500">
                      <div className="col-span-6">Nombre</div>
                      <div className="col-span-3">Curso</div>
                      <div className="col-span-2">Fecha</div>
                      <div className="col-span-1 text-right">Acción</div>
                    </div>
                  </div>

                  {isLoadingMateriales ? (
                    <div className="text-center p-6">
                      <div className="w-10 h-10 border-4 border-t-[#5b36f2] border-r-transparent border-l-transparent border-b-transparent rounded-full animate-spin mx-auto mb-3"></div>
                      <p className="text-sm text-gray-600">Cargando materiales...</p>
                    </div>
                  ) : materiales.length === 0 ? (
                    <div className="text-center p-6 text-gray-600">
                      No hay materiales disponibles en este momento.
                    </div>
                  ) : (
                    materiales.map((material, index) => (
                      <div 
                        key={material.id} 
                        className={`grid grid-cols-12 text-sm p-3 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                      >
                        <div className="col-span-6 flex items-center gap-2">
                          <div className={`h-8 w-8 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center`}>
                            <span className="font-medium text-xs">{/* Material Type/Icon */}</span>
                          </div>
                          <span className="font-medium">{material.titulo}</span>
                        </div>
                        <div className="col-span-3 flex items-center">{material.categoria_nombre || `Cat ID: ${material.categoria_id}`}</div>
                        <div className="col-span-2 flex items-center">{new Date(material.fecha_creacion).toLocaleDateString()}</div>
                        <div className="col-span-1 flex justify-end items-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownload(material.id)}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Descargar
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="flex justify-center mt-6">
                  <Button variant="outline">Cargar más materiales</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Actividad Reciente</CardTitle>
              <CardDescription>Tus últimas interacciones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                    <FileText className="h-5 w-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Descargaste "Práctica Calificada 2"</p>
                    <p className="text-xs text-gray-500">Hace 2 horas • Programación Orientada a Objetos</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                    <Star className="h-5 w-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Marcaste como favorito "Ejemplos de Recursividad"</p>
                    <p className="text-xs text-gray-500">Ayer • Matemática Discreta</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                    <Clock className="h-5 w-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Completaste el cuestionario "Control de Flujo"</p>
                    <p className="text-xs text-gray-500">Hace 2 días • Programación Orientada a Objetos</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recursos" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recursos Educativos Disponibles</CardTitle>
                <CardDescription>Explora y descarga materiales subidos por la comunidad.</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  type="text"
                  placeholder="Buscar recursos..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-64"
                />
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingMateriales ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              ) : materiales.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FileText className="h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-xl font-medium">No se encontraron recursos</h3>
                  <p className="text-sm text-gray-500 mt-2 mb-6 max-w-md">
                    Intenta con otro término de búsqueda o sube un nuevo recurso.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {materiales.map((material) => (
                    <Card key={material.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {renderFileIcon(material.archivo_url)}
                          <div>
                            <h4 className="font-medium">{material.titulo}</h4>
                            <p className="text-sm text-gray-500">{material.categoria_nombre} • Subido el {new Date(material.fecha_creacion).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <Button onClick={() => handleDownload(material.id)}>Descargar</Button>
                      </div>
                    </Card>
                  ))}
                  <div className="flex justify-center mt-4">
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Anterior
                      </Button>
                      <span className="flex items-center px-4">
                        Página {currentPage} de {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Siguiente
                      </Button>
                    </div>
                  </div>
                </div>
              )}
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
                  <Avatar className="h-32 w-32">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-gray-100 text-gray-800 text-4xl">
                      {userData.nombre.charAt(0)}{userData.apellido.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm">
                    Cambiar foto
                  </Button>
                </div>
                <div className="flex-1 space-y-4">
                  {/* Campos editables */}
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
                  
                  {/* Campos de solo lectura */}
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
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Institución</Label>
                      <Input 
                        value={userData.institucion}
                        readOnly
                        className="bg-gray-50"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Rol</Label>
                      <Input 
                        value="Estudiante"
                        readOnly
                        className="bg-gray-50"
                      />
                    </div>
                  </div>
                  
                  {/* Campos específicos de estudiante */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Carrera</Label>
                      <Select 
                        value={formData.carrera} 
                        onValueChange={(value) => handleSelectChange('carrera', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona tu carrera" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Ingeniería de Sistemas">Ingeniería de Sistemas</SelectItem>
                          <SelectItem value="Ingeniería Civil">Ingeniería Civil</SelectItem>
                          <SelectItem value="Ingeniería Mecánica">Ingeniería Mecánica</SelectItem>
                          <SelectItem value="Administración">Administración</SelectItem>
                          <SelectItem value="Contabilidad">Contabilidad</SelectItem>
                          <SelectItem value="Psicología">Psicología</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Ciclo</Label>
                      <Select 
                        value={formData.ciclo} 
                        onValueChange={(value) => handleSelectChange('ciclo', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona tu ciclo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Primer Ciclo</SelectItem>
                          <SelectItem value="2">Segundo Ciclo</SelectItem>
                          <SelectItem value="3">Tercer Ciclo</SelectItem>
                          <SelectItem value="4">Cuarto Ciclo</SelectItem>
                          <SelectItem value="5">Quinto Ciclo</SelectItem>
                          <SelectItem value="6">Sexto Ciclo</SelectItem>
                          <SelectItem value="7">Séptimo Ciclo</SelectItem>
                          <SelectItem value="8">Octavo Ciclo</SelectItem>
                          <SelectItem value="9">Noveno Ciclo</SelectItem>
                          <SelectItem value="10">Décimo Ciclo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                      
                  <div className="space-y-2">
                    <Label>Teléfono</Label>
                    <Input 
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      placeholder="Ingresa tu número de teléfono"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Áreas de Interés</Label>
                    <textarea 
                      name="intereses"
                      value={formData.intereses}
                      onChange={handleChange}
                      placeholder="Describe tus intereses académicos y profesionales"
                      className="w-full h-24 px-3 py-2 border rounded-md border-input resize-none"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setFormData({
                      nombre: userData.nombre,
                      apellido: userData.apellido,
                      carrera: userData.carrera,
                      ciclo: userData.ciclo,
                      telefono: formData.telefono || "",
                      intereses: formData.intereses || ""
                    });
                  }}
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleSaveChanges}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Guardando...
                    </>
                  ) : (
                    'Guardar Cambios'
                  )}
                </Button>
              </div>
              
              <div className="mt-8 pt-6 border-t">
                <h3 className="text-lg font-medium mb-4">Seguridad</h3>
                
                <Button 
                  variant="outline" 
                  onClick={() => setShowPasswordForm(!showPasswordForm)}
                >
                  {showPasswordForm ? "Cancelar" : "Cambiar contraseña"}
                </Button>
                
                {showPasswordForm && (
                  <div className="mt-4 space-y-4 p-4 border rounded-md bg-gray-50">
                    <div className="space-y-2">
                      <Label>Contraseña actual</Label>
                      <Input 
                        type="password" 
                        value={passwordData.passwordActual}
                        onChange={(e) => setPasswordData({...passwordData, passwordActual: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Nueva contraseña</Label>
                      <Input 
                        type="password" 
                        value={passwordData.passwordNuevo}
                        onChange={(e) => setPasswordData({...passwordData, passwordNuevo: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Confirmar nueva contraseña</Label>
                      <Input 
                        type="password" 
                        value={passwordData.confirmarPassword}
                        onChange={(e) => setPasswordData({...passwordData, confirmarPassword: e.target.value})}
                      />
                    </div>
                    
                    {passwordSuccess && (
                      <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-md">
                        Contraseña actualizada correctamente.
                      </div>
                    )}
                    
                    <Button 
                      onClick={handlePasswordChange}
                      disabled={isChangingPassword}
                    >
                      {isChangingPassword ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Cambiando...
                        </>
                      ) : (
                        'Actualizar contraseña'
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <Toaster />
    </div>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return <div className="text-sm font-medium">{children}</div>
}

// Función auxiliar para renderizar iconos de archivo
function renderFileIcon(archivoUrl: string) {
  const extension = archivoUrl.split('.').pop()?.toLowerCase();
  // Implementar lógica para renderizar diferentes iconos basados en la extensión
  // Por ahora, un icono genérico de archivo
  return <FileText className="h-6 w-6 text-blue-500" />;
}