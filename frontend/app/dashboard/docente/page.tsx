"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  FileText,
  BookOpen,
  User,
  Upload,
  FolderPlus,
  Plus,
  Pencil,
  Trash,
  Ticket,
  AlertCircle,
} from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { authService } from "@/lib/api";
import { recursoService } from "@/lib/api/recursoService";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { RecursoViewer } from "@/components/RecursoViewer";
import Link from "next/link";

interface Categoria {
  id: number;
  nombre: string;
}

interface Recurso {
  id: number;
  titulo: string;
  descripcion: string;
  archivo_url: string;
  categoria_id: number;
  categoria_nombre: string;
  fecha_creacion: string;
  tipo_archivo?: string;
  descargas: number;
}

interface EditFormData {
    titulo: string;
    descripcion: string;
    categoria_id: number;
}

interface UploadFormData {
    titulo: string;
    descripcion: string;
    categoria_id: number;
    archivo: File | null;
}

interface StatsState {
  totalRecursos: number;
  totalDescargas: number;
  recursosPopulares: Recurso[];
}

export default function DocenteDashboard() {
  // Datos de ejemplo - En una implementación real, estos vendrían de una API
  const [userData, setUserData] = useState({
    nombre: "Carlos",
    apellido: "Rodríguez",
    email: "carlos.rodriguez@utp.edu.pe",
    codigoInstitucional: "U20210123",
    rol: "docente"
  });

  const [recursos, setRecursos] = useState<Recurso[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  const [showEditForm, setShowEditForm] = useState(false);
  const [editingResource, setEditingResource] = useState<Recurso | null>(null);
  const [editFormData, setEditFormData] = useState<EditFormData>({
    titulo: "",
    descripcion: "",
    categoria_id: 0
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    nombre: userData.nombre,
    apellido: userData.apellido
  });

  const [activeTab, setActiveTab] = useState("resumen");

  const [uploadFormData, setUploadFormData] = useState<UploadFormData>({
    titulo: '',
    descripcion: '',
    categoria_id: 0,
    archivo: null
  });
  const [isUploading, setIsUploading] = useState(false);

  const [stats, setStats] = useState<StatsState>({
    totalRecursos: 0,
    totalDescargas: 0,
    recursosPopulares: []
  });

  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const [selectedRecurso, setSelectedRecurso] = useState<Recurso | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [incidencias, setIncidencias] = useState<any[]>([]);
  const [isLoadingIncidencias, setIsLoadingIncidencias] = useState(false);

  const [editFile, setEditFile] = useState<File | null>(null);

  const handleEdit = (recurso: Recurso) => {
    setSelectedRecurso(null);
    setEditingResource(recurso);
    setEditFormData({
      titulo: recurso.titulo,
      descripcion: recurso.descripcion || "",
      categoria_id: recurso.categoria_id || 1
    });
    setEditFile(null);
    setShowEditForm(true);
  };

  const handleDelete = async (id: number) => {
    console.log("Eliminar recurso con ID:", id);
     const confirmDelete = confirm('¿Estás seguro de que deseas eliminar este recurso?');
    if (!confirmDelete) {
      return;
    }

    try {
      await recursoService.deleteRecurso(id.toString());
      toast({
        title: "Éxito",
        description: "Recurso eliminado correctamente.",
      });
      setRecursos(recursos.filter(recurso => recurso.id !== id));
      if (selectedRecurso && selectedRecurso.id === id) {
        setSelectedRecurso(null);
      }
    } catch (error) {
      console.error('Error al eliminar recurso:', error);
      toast({
        title: "Error al eliminar",
        description: "No se pudo eliminar el recurso. Intenta nuevamente.",
        variant: "destructive",
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveChanges = () => {
    console.log("Guardar cambios de perfil:", formData);
  };

  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setEditFile(e.target.files[0]);
    }
  };

  const handleUpdateResource = async () => {
      if (!editingResource) return;

      if (!editFormData.titulo || !editFormData.descripcion || !editFormData.categoria_id) {
          toast({
              title: "Error",
              description: "Por favor, completa todos los campos requeridos.",
              variant: "destructive",
          });
          return;
      }

      try {
          setIsUpdating(true);
          let response;
          if (editFile) {
            const formData = new FormData();
            formData.append('titulo', editFormData.titulo);
            formData.append('descripcion', editFormData.descripcion);
            formData.append('categoriaId', editFormData.categoria_id.toString());
            formData.append('archivo', editFile);
            response = await recursoService.updateRecurso(editingResource.id.toString(), formData, true);
          } else {
            response = await recursoService.updateRecurso(editingResource.id.toString(), {
                titulo: editFormData.titulo,
                descripcion: editFormData.descripcion,
                categoriaId: editFormData.categoria_id,
            });
          }
          toast({
              title: "Éxito",
              description: "Recurso actualizado correctamente.",
          });
          setRecursos(recursos.map(res =>
              res.id === editingResource.id
              ? { ...res, ...editFormData, categoria_nombre: categorias.find(cat => cat.id === editFormData.categoria_id)?.nombre || '' }
              : res
          ));
          setShowEditForm(false);
          setEditingResource(null);
          setEditFile(null);
          setIsUpdating(false);
      } catch (error) {
          console.error('Error updating resource:', error);
          toast({
              title: "Error al actualizar",
              description: "No se pudo actualizar el recurso. Intenta nuevamente.",
              variant: "destructive",
          });
          setIsUpdating(false);
      }
  };

  const handleUploadChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUploadFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadFormData(prev => ({
        ...prev,
        archivo: e.target.files![0]
      }));
    }
  };

  const handleCategoriaChange = (value: string) => {
    setUploadFormData(prev => ({
      ...prev,
      categoria_id: parseInt(value)
    }));
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uploadFormData.titulo || !uploadFormData.descripcion || !uploadFormData.categoria_id || !uploadFormData.archivo) {
      toast({
        title: "Error",
        description: "Por favor, completa todos los campos requeridos.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('titulo', uploadFormData.titulo);
      formData.append('descripcion', uploadFormData.descripcion);
      formData.append('categoriaId', uploadFormData.categoria_id.toString());
      formData.append('archivo', uploadFormData.archivo);

      await recursoService.createRecurso(formData);
      
      toast({
        title: "Éxito",
        description: "Recurso subido correctamente.",
      });

      // Limpiar el formulario
      setUploadFormData({
        titulo: '',
        descripcion: '',
        categoria_id: 0,
        archivo: null
      });

      // Actualizar la lista de recursos
      const recursosResponse: Recurso[] = await recursoService.getMisRecursos();
      setRecursos(recursosResponse);

      setActiveTab('recursos');

      setStats({
        totalRecursos: recursosResponse.length,
        totalDescargas: recursosResponse.reduce((sum: number, recurso: Recurso) => sum + (recurso.descargas || 0), 0),
        recursosPopulares: recursosResponse.slice().sort((a: Recurso, b: Recurso) => (b.descargas || 0) - (a.descargas || 0)).slice(0, 5) as Recurso[],
      });
    } catch (error) {
      console.error('Error al subir recurso:', error);
      toast({
        title: "Error",
        description: "No se pudo subir el recurso. Intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    console.log('DocenteDashboard useEffect running');
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          console.log('No hay token, redirigiendo al login...');
          router.push('/login');
          return;
        }

        // Fetch user data ONLY if token exists
        if (token) {
          const user = await authService.getUserData();
          console.log('Fetched user data:', user.usuario);
          setUserData(user.usuario);

          const categoriasResponse = await recursoService.getAllCategorias();
          setCategorias(categoriasResponse);

          const recursosResponse: Recurso[] = await recursoService.getMisRecursos();
          setRecursos(recursosResponse);

          setStats({
            totalRecursos: recursosResponse.length,
            totalDescargas: recursosResponse.reduce((sum: number, recurso: Recurso) => sum + (recurso.descargas || 0), 0),
            recursosPopulares: recursosResponse.slice().sort((a: Recurso, b: Recurso) => (b.descargas || 0) - (a.descargas || 0)).slice(0, 5) as Recurso[],
          });

          // Cargar incidencias del usuario
          setIsLoadingIncidencias(true);
          fetch(`/api/incidencias/usuario`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          })
            .then(res => res.json())
            .then(data => setIncidencias(data.incidencias || []))
            .finally(() => setIsLoadingIncidencias(false));
        }
      } catch (error: any) {
        console.error("Error al cargar datos iniciales:", error);
        
        if (error.response?.status === 401) {
          console.log('Sesión expirada, redirigiendo al login...');
          router.push('/login');
        } else {
          toast({
            title: "Error",
            description: "No se pudieron cargar los datos. Por favor, intenta nuevamente.",
            variant: "destructive",
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router, authService.checkAuth]);

  const getFileIcon = (url: string) => {
    const ext = url.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf':
        return <FileText className="h-6 w-6 text-red-500" />;
      case 'doc':
      case 'docx':
        return <FileText className="h-6 w-6 text-blue-500" />;
      case 'xls':
      case 'xlsx':
        return <FileText className="h-6 w-6 text-green-500" />;
      case 'ppt':
      case 'pptx':
        return <FileText className="h-6 w-6 text-orange-500" />;
      default:
        return <FileText className="h-6 w-6 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="container mx-auto py-10 px-4">
      {isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard de Docente</h1>
          <p className="text-muted-foreground">
            Bienvenido(a) {userData.nombre} {userData.apellido}. Gestiona tus recursos y perfil.
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            asChild
            title="Reportar incidencia"
          >
            <Link href="/reportar-incidencia">
              <Ticket className="h-5 w-5 mr-1" />
              <span className="hidden sm:inline">Reportar incidencia</span>
            </Link>
          </Button>
          <Button onClick={() => setActiveTab('subir')}>
            <Upload className="mr-2 h-4 w-4" />
            Subir Recurso
          </Button>
          <Button variant="outline">
            <FolderPlus className="mr-2 h-4 w-4" />
            Nueva Colección
          </Button>
        </div>
      </div>

          <Tabs defaultValue="resumen" className="space-y-6" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 md:grid-cols-6 lg:w-[800px]">
          <TabsTrigger value="resumen">Resumen</TabsTrigger>
          <TabsTrigger value="recursos">Mis Recursos</TabsTrigger>
          <TabsTrigger value="colecciones">Colecciones</TabsTrigger>
          <TabsTrigger value="favoritos">Favoritos</TabsTrigger>
          <TabsTrigger value="perfil">Mi Perfil</TabsTrigger>
          <TabsTrigger value="incidencias" className="text-[#5b36f2] data-[state=active]:bg-[#5b36f2] data-[state=active]:text-white">
            <Ticket className="h-4 w-4 mr-1" /> Mis Incidencias
          </TabsTrigger>
        </TabsList>

        <TabsContent value="resumen" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recursos Subidos</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                    <div className="text-2xl font-bold">{stats.totalRecursos}</div>
                    <p className="text-xs text-muted-foreground">
                      {stats.totalRecursos === 0 ? 'Empieza a compartir recursos' : 'Recursos compartidos'}
                    </p>
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
                    <div className="text-2xl font-bold">{stats.totalDescargas}</div>
                    <p className="text-xs text-muted-foreground">
                      {stats.totalDescargas === 0 ? 'Sin descargas aún' : 'Descargas totales'}
                    </p>
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
                    <CardTitle>Recursos Populares</CardTitle>
                    <CardDescription>Los recursos más descargados</CardDescription>
              </CardHeader>
              <CardContent>
                    {stats.recursosPopulares.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <FileText className="h-12 w-12 text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium">No hay recursos populares</h3>
                  <p className="text-sm text-gray-500 mt-1 mb-4">
                          Sube recursos para verlos aquí
                        </p>
                        <Button onClick={() => setActiveTab('subir')}>Subir Recurso</Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {(stats.recursosPopulares as Recurso[]).map((recurso: Recurso) => (
                          <div key={recurso.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="flex items-center space-x-4">
                              {getFileIcon(recurso.archivo_url)}
                              <div>
                                <h4 className="font-medium">{recurso.titulo}</h4>
                                <p className="text-sm text-gray-500">{recurso.categoria_nombre}</p>
                              </div>
                            </div>
                            <div className="text-sm font-medium text-blue-600">
                              {recurso.descargas} descargas
                            </div>
                          </div>
                        ))}
                </div>
                    )}
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
                  <Button onClick={() => setActiveTab('subir')}>
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Recurso
              </Button>
            </CardHeader>
            <CardContent>
                  {recursos.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FileText className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-medium">No has subido recursos todavía</h3>
                <p className="text-sm text-gray-500 mt-2 mb-6 max-w-md">
                  Comparte tus materiales educativos con la comunidad UTP. Sube presentaciones, documentos, 
                  videos o cualquier recurso que consideres útil.
                </p>
                      <Button onClick={() => setActiveTab('subir')}>
                  <Upload className="mr-2 h-4 w-4" />
                  Subir mi primer recurso
                      </Button>
                    </div>
                  ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {recursos.map((recurso) => (
                        <Card 
                          key={recurso.id} 
                          className="group hover:shadow-lg transition-all duration-200 cursor-pointer"
                          onClick={() => setSelectedRecurso(recurso)}
                        >
                          <CardHeader className="p-4 pb-2">
                            <div className="flex items-center gap-3">
                              <div 
                                className="p-2 bg-gray-100 rounded-lg group-hover:bg-blue-50 transition-colors"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {getFileIcon(recurso.archivo_url)}
                              </div>
                              <div>
                                <CardTitle 
                                  className="text-lg line-clamp-1 group-hover:text-blue-600 transition-colors cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(`${process.env.NEXT_PUBLIC_API_URL}/recursos/download/${recurso.id}`, '_blank');
                                  }}
                                >
                                  {recurso.titulo}
                                </CardTitle>
                                <CardDescription className="flex items-center gap-2">
                                  <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                                    {recurso.categoria_nombre}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {new Date(recurso.fecha_creacion).toLocaleDateString()}
                                  </span>
                                </CardDescription>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="p-4 pt-2">
                            <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                              {recurso.descripcion}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <span className="flex items-center gap-1 text-blue-600 font-medium">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    className="h-4 w-4"
                                  >
                                    <path d="M8 17.929H6c-1.105 0-2-.912-2-2.036V5.036C4 3.91 4.895 3 6 3h8c1.105 0 2 .911 2 2.036v1.866m-6 .17h8c1.105 0 2 .91 2 2.035v10.857C20 21.09 19.105 22 18 22h-8c-1.105 0-2-.911-2-2.036V9.107c0-1.124.895-2.036 2-2.036z" />
                                  </svg>
                                  {recurso.descargas || 0}
                                </span>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(`${process.env.NEXT_PUBLIC_API_URL}/recursos/download/${recurso.id}`, '_blank');
                                  }}
                                  className="hover:bg-blue-50 hover:text-blue-600"
                                >
                                  <FileText className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => { e.stopPropagation(); handleEdit(recurso); }}
                                  className="hover:bg-blue-50 hover:text-blue-600"
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => { e.stopPropagation(); handleDelete(recurso.id); }}
                                  className="hover:bg-red-50 hover:text-red-600"
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="subir" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Subir Nuevo Recurso</CardTitle>
                  <CardDescription>Completa los campos para subir un nuevo recurso educativo.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUploadSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="titulo">Título del Recurso</Label>
                      <Input 
                        id="titulo" 
                        name="titulo"
                        value={uploadFormData.titulo}
                        onChange={handleUploadChange}
                        placeholder="Ej: Presentación de Cálculo I" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="descripcion">Descripción</Label>
                      <Textarea 
                        id="descripcion" 
                        name="descripcion"
                        value={uploadFormData.descripcion}
                        onChange={handleUploadChange}
                        placeholder="Ej: Material de apoyo para el primer parcial..." 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="categoria">Categoría</Label>
                      <Select 
                        value={uploadFormData.categoria_id.toString()} 
                        onValueChange={handleCategoriaChange}
                      >
                        <SelectTrigger id="categoria">
                          <SelectValue placeholder="Selecciona una categoría" />
                        </SelectTrigger>
                        <SelectContent>
                          {categorias.map((categoria) => (
                            <SelectItem key={categoria.id} value={categoria.id.toString()}>
                              {categoria.nombre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="archivo">Archivo</Label>
                      <Input 
                        id="archivo" 
                        type="file" 
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt"
                      />
                      <p className="text-xs text-muted-foreground">
                        Formatos permitidos: PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, TXT
                      </p>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setActiveTab('recursos')}
                      >
                        Cancelar
                      </Button>
                      <Button type="submit" disabled={isUploading}>
                        {isUploading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Subiendo...
                          </>
                        ) : (
                          'Subir Recurso'
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {showEditForm && editingResource && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <Card className="w-full max-w-md">
                        <CardHeader>
                            <CardTitle>Editar Recurso</CardTitle>
                            <CardDescription>Modifica la información del recurso.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-titulo">Título del Recurso</Label>
                                <Input
                                    id="edit-titulo"
                                    value={editFormData.titulo}
                                    onChange={(e) => setEditFormData({ ...editFormData, titulo: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-descripcion">Descripción</Label>
                                <Textarea
                                    id="edit-descripcion"
                                    value={editFormData.descripcion}
                                    onChange={(e) => setEditFormData({ ...editFormData, descripcion: e.target.value })}
                                />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="edit-categoria">Categoría</Label>
                                 <Select
                                    value={editFormData.categoria_id.toString()}
                                    onValueChange={(value) => setEditFormData({ ...editFormData, categoria_id: parseInt(value) })}
                                >
                                    <SelectTrigger id="edit-categoria">
                                        <SelectValue placeholder="Selecciona una categoría" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categorias.map((categoria) => (
                                            <SelectItem key={categoria.id} value={categoria.id.toString()}>
                                                {categoria.nombre}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit-archivo">Archivo (opcional, para reemplazar)</Label>
                              <Input
                                id="edit-archivo"
                                type="file"
                                accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt"
                                onChange={handleEditFileChange}
                              />
                              <p className="text-xs text-muted-foreground">
                                Si seleccionas un archivo, reemplazará el actual.
                              </p>
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setShowEditForm(false)}>Cancelar</Button>
                                <Button onClick={handleUpdateResource} disabled={isUpdating}>
                                    {isUpdating ? (
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
                        </CardContent>
                    </Card>
                </div>
            )}

            <TabsContent value="colecciones" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Mis Colecciones</CardTitle>
                  <CardDescription>Organiza tus recursos en colecciones temáticas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <BookOpen className="h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-xl font-medium">No has creado colecciones todavía</h3>
                    <p className="text-sm text-gray-500 mt-2 mb-6 max-w-md">
                      Las colecciones te permiten organizar recursos relacionados para facilitar su acceso y compartir secuencias completas.
                    </p>
                    <Button>
                      <FolderPlus className="mr-2 h-4 w-4" />
                      Crear mi primera colección
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="favoritos" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Mis Favoritos</CardTitle>
                  <CardDescription>Recursos que has marcado como favoritos</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-16 w-16 text-gray-300 mb-4"
                    >
                      <path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z" />
                    </svg>
                    <h3 className="text-xl font-medium">No tienes favoritos todavía</h3>
                    <p className="text-sm text-gray-500 mt-2 mb-6 max-w-md">
                      Explora recursos y marca como favoritos aquellos que te resulten más útiles para acceder fácilmente a ellos.
                    </p>
                    <Button variant="outline">
                      Explorar recursos
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

        <TabsContent value="incidencias" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Mis Incidencias</CardTitle>
              <CardDescription>Historial de reportes enviados a soporte técnico</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingIncidencias ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5b36f2] mx-auto mb-4"></div>
                  <p className="text-gray-600">Cargando incidencias...</p>
                </div>
              ) : incidencias.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <AlertCircle className="h-20 w-20 text-[#5b36f2] mb-6" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No has reportado incidencias</h3>
                  <p className="text-sm text-gray-500 max-w-md">
                    Cuando reportes un problema, aparecerá aquí el historial de tus incidencias.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {incidencias.map((inc) => (
                    <Card key={inc.id} className="border-l-4 border-[#5b36f2] hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row gap-6">
                          {/* Imagen con vista previa */}
                          {inc.imagenUrl && (
                            <div className="flex-shrink-0">
                              <div 
                                className="relative cursor-pointer group"
                                onClick={() => setSelectedImage(inc.imagenUrl)}
                              >
                                <img 
                                  src={inc.imagenUrl} 
                                  alt="Imagen incidencia" 
                                  className="w-32 h-32 object-cover rounded-lg border-2 border-[#5b36f2] hover:border-[#4c2fd9] transition-colors" 
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                    </svg>
                                  </div>
                                </div>
                              </div>
                              <p className="text-xs text-gray-500 mt-2 text-center">Clic para ampliar</p>
                            </div>
                          )}
                          
                          {/* Contenido principal */}
                          <div className="flex-1 min-w-0">
                            {/* Header con ID, estado y fecha */}
                            <div className="flex flex-wrap items-center gap-3 mb-3">
                              <Badge variant="outline" className="text-xs font-mono bg-gray-50">
                                #{inc.id}
                              </Badge>
                              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 text-xs">
                                {inc.estado || 'Pendiente'}
                              </Badge>
                              <span className="text-xs text-gray-500 ml-auto">
                                {new Date(inc.fecha).toLocaleString('es-PE', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                            
                            {/* Asunto destacado */}
                            <h3 className="text-lg font-semibold text-[#5b36f2] mb-2 hover:text-[#4c2fd9] transition-colors cursor-pointer">
                              {inc.asunto}
                            </h3>
                            
                            {/* Email del usuario */}
                            <div className="flex items-center gap-2 mb-3">
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                              </svg>
                              <span className="text-sm text-gray-600 font-medium">{inc.email}</span>
                            </div>
                            
                            {/* Descripción */}
                            <div className="bg-gray-50 p-4 rounded-lg mb-3">
                              <p className="text-gray-800 text-sm leading-relaxed">
                                {inc.descripcion}
                              </p>
                            </div>
                            
                            {/* Footer con información adicional */}
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <div className="flex items-center gap-4">
                                <span>Reportado por: {inc.nombre}</span>
                                {inc.imagenUrl && (
                                  <span className="flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z" />
                                    </svg>
                                    Con imagen
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

          {selectedRecurso && (
            <RecursoViewer
              recurso={selectedRecurso}
              isOpen={!!selectedRecurso}
              onClose={() => setSelectedRecurso(null)}
            />
          )}

          {/* Modal para ver imagen en grande */}
          {selectedImage && (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
              <div className="relative max-w-4xl max-h-full">
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <img
                  src={selectedImage}
                  alt="Vista previa ampliada"
                  className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
                />
              </div>
            </div>
          )}
        </>
      )}
      <Toaster />
    </div>
  );
}