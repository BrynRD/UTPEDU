"use client"

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react'
import { authService } from '@/lib/api'
import { useRouter } from 'next/navigation'

// Definimos el tipo para un usuario autenticado
type User = {
  id?: number
  nombre?: string
  apellido?: string
  email?: string
  rol?: string
  codigo_institucional?: string
  [key: string]: any // Para cualquier otra propiedad que pueda tener
}

// Definimos la estructura del contexto
type AuthContextType = {
  isAuthenticated: boolean
  user: User | null
  login: (codigoInstitucional: string, password: string) => Promise<any>
  logout: () => void
  loading: boolean
}

// Creamos el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Componente Provider que envolverá la aplicación
export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Verificar la autenticación al cargar
  useEffect(() => {
    const checkAuth = () => {
      try {
        // Obtener datos del localStorage
        const token = localStorage.getItem('token')
        const userStr = localStorage.getItem('user')
        
        // Mostrar lo que tenemos almacenado para depuración
        console.log('Token en localStorage:', token ? 'Existe' : 'No existe')
        
        // Validar que userStr sea una cadena válida antes de parsear
        let userData = null
        if (userStr && typeof userStr === 'string') {
          try {
            userData = JSON.parse(userStr)
            console.log('Datos de usuario cargados desde localStorage:', { 
              id: userData.id, 
              email: userData.email, 
              rol: userData.rol 
            })
          } catch (e) {
            console.error('Error al parsear datos de usuario:', e)
            // Datos corruptos, limpiar
            localStorage.removeItem('user')
          }
        }
        
        // Verificar que tengamos todos los datos necesarios
        if (token && userData && userData.id && userData.rol) {
          setIsAuthenticated(true)
          setUser(userData)
        } else {
          setIsAuthenticated(false)
          setUser(null)
        }
      } catch (error) {
        console.error('Error al verificar autenticación:', error)
        setIsAuthenticated(false)
        setUser(null)
      }
      
      setLoading(false)
    }

    checkAuth()

    // Escuchar cambios en localStorage (para múltiples pestañas)
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'token' || event.key === 'user') {
        checkAuth()
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  // Función de login mejorada para ser más flexible con la estructura de respuesta
  const login = async (codigoInstitucional: string, password: string) => {
    try {
      console.log('Iniciando login para:', codigoInstitucional);
      
      // Llamar al servicio de autenticación
      const response = await authService.login(codigoInstitucional, password);
      
      console.log('Respuesta del servidor:', response);
      
      // Extraer token de manera flexible
      let token = null;
      if (response.token) {
        token = response.token;
      } else if (response.data && response.data.token) {
        token = response.data.token;
      }
      
      if (!token) {
        console.error('No se encontró token en la respuesta');
        throw new Error('No se recibió token de autenticación');
      }
      
      // Extraer datos de usuario de manera flexible
      let userData = null;
      
      // Intentar encontrar el objeto de usuario en diferentes ubicaciones posibles
      if (response.usuario && response.usuario.id) {
        userData = response.usuario;
      } else if (response.user && response.user.id) {
        userData = response.user;
      } else if (response.data && response.data.user && response.data.user.id) {
        userData = response.data.user;
      } else if (response.data && response.data.usuario && response.data.usuario.id) {
        userData = response.data.usuario;
      } else if (response.id && response.rol) {
        // La respuesta misma podría ser el objeto de usuario
        userData = response;
      }
      
      console.log('Datos de usuario extraídos:', userData);
      
      if (!userData || !userData.id) {
        console.error('No se pudieron obtener datos de usuario válidos');
        throw new Error('Datos de usuario incompletos');
      }
      
      // Asegurarnos de tener un rol
      if (!userData.rol) {
        console.warn('Usuario sin rol definido, asignando rol "estudiante" por defecto');
        userData.rol = 'estudiante';
      }
      
      // Guardar en localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Actualizar estado
      setIsAuthenticated(true);
      setUser(userData);
      
      // Redireccionar según rol
      const rol = userData.rol.toLowerCase();
      console.log('Rol detectado para redirección:', rol);
      
      switch (rol) {
        case 'admin':
          router.push('/dashboard/admin');
          break;
        case 'docente':
          router.push('/dashboard/docente');
          break;
        case 'estudiante':
          router.push('/dashboard/estudiante');
          break;
        default:
          console.warn('Rol no reconocido:', rol);
          router.push('/');
      }
      
      return { success: true, user: userData };
    } catch (error: any) {
      console.error('Error durante login:', error);
      
      // Mejorar el manejo de errores para dar retroalimentación más precisa
      let errorMessage = 'Error al iniciar sesión';
      
      if (error.response) {
        errorMessage = error.response.data?.mensaje || 'Credenciales incorrectas';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  }

  // Función de logout
  const logout = () => {
    // Limpiar todo del localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('usuario'); // Eliminar también la otra clave por si acaso
    
    // Reiniciar estado
    setIsAuthenticated(false);
    setUser(null);
    
    // Redireccionar al inicio
    router.push('/');
  }

  // Devolvemos el Provider con los valores actualizados
  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      login, 
      logout, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook personalizado para usar el contexto
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}