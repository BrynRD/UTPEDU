"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export default function ReportarIncidenciaPage() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    asunto: "",
    descripcion: ""
  });
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Autocompletar solo el nombre si el usuario está logueado, pero dejar el email en blanco
    try {
      const userData = authService.getUserData();
      if (userData && userData.usuario) {
        setForm((prev) => ({
          ...prev,
          nombre: `${userData.usuario.nombre || ""} ${userData.usuario.apellido || ""}`.trim(),
          email: ""
        }));
      }
    } catch (e) {}
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre || !form.email || !form.asunto || !form.descripcion) {
      toast({
        title: "Completa todos los campos",
        description: "Por favor, llena todos los campos para enviar tu incidencia.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('nombre', form.nombre);
      formData.append('email', form.email);
      formData.append('asunto', form.asunto);
      formData.append('descripcion', form.descripcion);
      if (file) {
        formData.append('imagen', file);
      }
      // Obtener el token del usuario autenticado
      let token = "";
      try {
        const userData = authService.getUserData();
        token = userData?.token || localStorage.getItem('token') || "";
      } catch (e) {}
      const response = await fetch("/api/incidencias", {
        method: "POST",
        body: formData,
        headers: token ? { 'Authorization': `Bearer ${token}` } : undefined,
      });
      if (response.ok) {
        setIsLoading(false);
        setSuccess(true);
        toast({
          title: "Incidencia enviada",
          description: "Tu reporte fue recibido. Pronto recibirás un correo de confirmación.",
        });
        setForm({ nombre: "", email: "", asunto: "", descripcion: "" });
        setFile(null);
      } else {
        const data = await response.json();
        setIsLoading(false);
        toast({
          title: "Error al enviar",
          description: data.mensaje || "No se pudo enviar la incidencia. Intenta nuevamente.",
          variant: "destructive",
        });
      }
    } catch (err) {
      setIsLoading(false);
      toast({
        title: "Error al enviar",
        description: "No se pudo enviar la incidencia. Intenta nuevamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-gray-50 dark:bg-background">
      {success ? (
        <Card className="w-full max-w-lg shadow-lg text-center py-12">
          <CardHeader>
            <CardTitle>¡Incidencia enviada!</CardTitle>
            <p className="text-green-600 text-lg mt-2">Tu reporte fue recibido correctamente.<br />Pronto recibirás un correo de confirmación.</p>
          </CardHeader>
          <CardContent>
            <img src="https://i.imgur.com/MacSbiJ.png" alt="UTP Logo" width="100" className="mx-auto my-6" />
            <Button className="mt-4" onClick={() => {
              if (user?.rol === 'admin') {
                router.push('/dashboard/admin');
              } else if (user?.rol === 'docente') {
                router.push('/dashboard/docente');
              } else {
                router.push('/dashboard/estudiante');
              }
            }}>
              Volver al dashboard
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="w-full max-w-lg shadow-lg">
          <CardHeader>
            <CardTitle>Reportar Incidencia</CardTitle>
            <p className="text-gray-500 text-sm mt-2">Completa el siguiente formulario para reportar un problema técnico. Recibirás una respuesta automática en tu correo.</p>
          </CardHeader>
          <CardContent>
            <form className="space-y-5" onSubmit={handleSubmit} encType="multipart/form-data">
              <div>
                <label className="block text-sm font-medium mb-1">Nombre</label>
                <Input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Tu nombre" autoComplete="name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Correo electrónico</label>
                <Input name="email" type="email" value={form.email} onChange={handleChange} placeholder="tucorreo@utp.edu.pe" autoComplete="email" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Asunto</label>
                <Input name="asunto" value={form.asunto} onChange={handleChange} placeholder="Breve asunto de la incidencia" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Descripción</label>
                <Textarea name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="Describe el problema con detalle..." rows={4} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Adjuntar imagen (opcional)</label>
                <input type="file" accept="image/*" onChange={handleFileChange} />
                {file && <span className="text-xs text-gray-500">{file.name}</span>}
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Enviando..." : "Enviar incidencia"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
      <Toaster />
    </div>
  );
} 