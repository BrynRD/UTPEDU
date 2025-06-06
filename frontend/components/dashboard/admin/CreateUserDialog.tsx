"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CreateUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUserCreated: (newUser: any) => void; // Callback after successful creation
}

export function CreateUserDialog({
  isOpen,
  onClose,
  onUserCreated,
}: CreateUserDialogProps) {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    rol: "estudiante", // Default role
    codigo_institucional: "", // Mandatory now
    institucion: "Universidad Tecnológica del Perú", // Institución fija
    areaEspecialidad: "", // Use areaEspecialidad
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({}); // State to hold validation errors

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    let updatedFormData = { ...formData, [id]: value };

    // Automatically generate email from codigo_institucional
    if (id === "codigo_institucional") {
      updatedFormData = { ...updatedFormData, email: `${value}@utp.edu.pe` };
    }

    setFormData(updatedFormData);
    // Clear error for the changed field
    setFormErrors(prevErrors => ({ ...prevErrors, [id]: '' }));
  };

  // Updated handleSelectChange to handle changes for any select field
  const handleSelectChange = (value: string, id: string) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      [id]: value, // Update the field specified by id
    }));
    // Clear error for the changed field
    setFormErrors(prevErrors => ({ ...prevErrors, [id]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFormErrors({}); // Clear previous errors

    console.log('Validando formulario...', formData);

    let errors: {[key: string]: string} = {};

    // Basic required fields validation
    if (!formData.nombre || !formData.apellido || !formData.codigo_institucional || !formData.password || !formData.rol || !formData.institucion || !formData.areaEspecialidad) {
      // Instead of returning, collect errors
      if (!formData.nombre) errors.nombre = "El Nombre es obligatorio.";
      if (!formData.apellido) errors.apellido = "El Apellido es obligatorio.";
      if (!formData.codigo_institucional) errors.codigo_institucional = "El Código Institucional es obligatorio.";
      if (!formData.password) errors.password = "La Contraseña es obligatoria.";
      if (!formData.rol) errors.rol = "El Rol es obligatorio.";
      if (!formData.institucion) errors.institucion = "La Institución es obligatoria.";
      if (!formData.areaEspecialidad) errors.areaEspecialidad = "El Área de Especialidad es obligatoria.";
    }

    // Email generation check (should always be generated if codigo_institucional is present)
     if (!formData.email && formData.codigo_institucional) {
        errors.email = "El email no se generó correctamente."; // Should not happen with current logic, but good check
     }

    // *** New: Validate Nombre and Apellido do not contain digits ***
    const nameRegex = /\d/;
    if (nameRegex.test(formData.nombre)) {
       errors.nombre = 'El campo Nombre no debe contener dígitos.';
    }
     if (nameRegex.test(formData.apellido)) {
       errors.apellido = 'El campo Apellido no debe contener dígitos.';
    }
    // *** End New Validation (Nombre/Apellido) ***

    // *** New: Basic Password Strength Validation (at least 6 characters) ***
     if (formData.password.length < 6) {
        errors.password = 'La contraseña debe tener al menos 6 caracteres.';
     }
    // *** End New Validation (Password) ***


    // *** Existing: Validate codigo_institucional format based on rol ***
    console.log('Validando formato de Código Institucional para rol:', formData.rol);
    let codigoError = null;
    if (formData.rol === 'estudiante') {
      const studentCodeRegex = /^U\d{7}$/;
      if (!studentCodeRegex.test(formData.codigo_institucional)) {
        codigoError = 'El Código Institucional para estudiantes debe tener el formato U seguido de 7 dígitos (Ej: U0000005).';
      }
    } else if (formData.rol === 'docente') {
      const teacherCodeRegex = /^C\d{5}$/;
       if (!teacherCodeRegex.test(formData.codigo_institucional)) {
        codigoError = 'El Código Institucional para docentes debe tener el formato C seguido de 5 dígitos (Ej: C00005).';
      }
    }
    // No specific format validation for 'admin' role assumed, but could be added if needed.

    if (codigoError) {
      errors.codigo_institucional = codigoError;
    }
    // *** End Existing Validation (Codigo Institucional) ***

    // Check if there are any errors
    if (Object.keys(errors).length > 0) {
        console.log('Errores de validación encontrados:', errors);
        setFormErrors(errors); // Set errors to state
        toast({
            title: "Error de Validación",
            description: "Por favor, corrija los campos con errores.",
            variant: "destructive",
        });
        setIsLoading(false);
        return; // Prevent form submission
    }

    console.log('Validaciones frontend pasadas. Enviando al backend...');
    // Optional: Add more frontend validation (more complex password rules, codigo_institucional format)

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/usuarios`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Include authorization header if required
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 409) {
          throw new Error("Ya existe un usuario con este código institucional o email.");
        } else if (response.status === 400) {
          throw new Error(data.error || "Datos de usuario inválidos.");
        } else if (response.status === 401) {
          throw new Error("No tiene autorización para realizar esta acción.");
        } else if (response.status === 500) {
          throw new Error("Error interno del servidor. Por favor, intente más tarde.");
        } else {
          throw new Error(data.error || "Error al crear el usuario.");
        }
      }

      toast({
        title: "Usuario Creado",
        description: `El usuario ${data.usuario.nombre} ${data.usuario.apellido} ha sido creado con éxito.`,
      });

      // Reset form and close dialog
      setFormData({
        nombre: "",
        apellido: "",
        email: "",
        password: "",
        rol: "estudiante",
        codigo_institucional: "",
        institucion: "Universidad Tecnológica del Perú",
        areaEspecialidad: "",
      });
      onUserCreated(data.usuario);
      onClose();

    } catch (error: any) {
      console.error("Error al crear usuario:", error);
      // Display the error message in a more user-friendly way
      toast({
        title: "Error al Crear Usuario",
        description: error.message || "No se pudo crear el usuario. Por favor, intente nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Usuario</DialogTitle>
          <DialogDescription>
            Ingrese los datos para crear una nueva cuenta de usuario.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nombre" className="text-right">Nombre</Label>
            <Input id="nombre" value={formData.nombre} onChange={handleInputChange} className={`col-span-3 ${formErrors.nombre ? 'border-red-500' : ''}`} disabled={isLoading} />
            {formErrors.nombre && <p className="col-span-4 text-right text-red-500 text-sm mt-1">{formErrors.nombre}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="apellido" className="text-right">Apellido</Label>
            <Input id="apellido" value={formData.apellido} onChange={handleInputChange} className={`col-span-3 ${formErrors.apellido ? 'border-red-500' : ''}`} disabled={isLoading} />
             {formErrors.apellido && <p className="col-span-4 text-right text-red-500 text-sm mt-1">{formErrors.apellido}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="codigo_institucional" className="text-right">Código Institucional</Label>
            <Input id="codigo_institucional" value={formData.codigo_institucional} onChange={handleInputChange} className={`col-span-3 ${formErrors.codigo_institucional ? 'border-red-500' : ''}`} disabled={isLoading} />
            {formErrors.codigo_institucional && <p className="col-span-4 text-right text-red-500 text-sm mt-1">{formErrors.codigo_institucional}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">Email (Generado)</Label>
            <Input id="email" type="email" value={formData.email} className={`col-span-3 ${formErrors.email ? 'border-red-500' : ''}`} disabled readOnly />
             {formErrors.email && <p className="col-span-4 text-right text-red-500 text-sm mt-1">{formErrors.email}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">Contraseña</Label>
            <Input id="password" type="password" value={formData.password} onChange={handleInputChange} className={`col-span-3 ${formErrors.password ? 'border-red-500' : ''}`} disabled={isLoading} />
             {formErrors.password && <p className="col-span-4 text-right text-red-500 text-sm mt-1">{formErrors.password}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="rol" className="text-right">Rol</Label>
            <Select 
              value={formData.rol} 
              onValueChange={(value) => handleSelectChange(value, 'rol')} 
              disabled={isLoading}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Seleccionar rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="estudiante">Estudiante</SelectItem>
                <SelectItem value="docente">Docente</SelectItem>
                <SelectItem value="admin">Administrador</SelectItem>
              </SelectContent>
            </Select>
            {formErrors.rol && <p className="col-span-4 text-right text-red-500 text-sm mt-1">{formErrors.rol}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="institucion" className="text-right">Institución</Label>
            <Input 
              id="institucion" 
              value={formData.institucion} 
              className="col-span-3" 
              disabled={true}
              readOnly
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="areaEspecialidad" className="text-right">Área de Especialidad</Label>
            <Select 
              value={formData.areaEspecialidad}
              onValueChange={(value) => handleSelectChange(value, 'areaEspecialidad')}
              disabled={isLoading}
            >
              <SelectTrigger className={`col-span-3 ${formErrors.areaEspecialidad ? 'border-red-500' : ''}`}>
                <SelectValue placeholder="Seleccionar Área" />
              </SelectTrigger>
              <SelectContent>
                {/* Example careers. Ideally, load this list dynamically from the backend */}
                <SelectItem value="Ingeniería de Software">Ingeniería de Software</SelectItem>
                <SelectItem value="Administración de Empresas">Administración de Empresas</SelectItem>
                <SelectItem value="Derecho">Derecho</SelectItem>
                <SelectItem value="Psicología">Psicología</SelectItem>
                <SelectItem value="Arquitectura">Arquitectura</SelectItem>
              </SelectContent>
            </Select>
            {formErrors.areaEspecialidad && <p className="col-span-4 text-right text-red-500 text-sm mt-1">{formErrors.areaEspecialidad}</p>}
          </div>
        </form>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>Cancelar</Button>
          <Button type="submit" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Creando..." : "Crear Usuario"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 