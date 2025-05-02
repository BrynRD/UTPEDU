import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Crear instancia de axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir el token a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Servicios de autenticación
export const authService = {
  // Modificado para compatibilidad tanto con email como con codigoInstitucional
  login: async (codigoInstitucional: string, password: string) => {
    try {
      // Generar el email basado en el código institucional si es necesario
      let email;
      if (codigoInstitucional.includes('@')) {
        email = codigoInstitucional;
      } else if (codigoInstitucional.startsWith('U') || codigoInstitucional.startsWith('C')) {
        email = `${codigoInstitucional}@utp.edu.pe`;
      } else {
        email = codigoInstitucional;
      }
      
      console.log(`Iniciando sesión con: ${codigoInstitucional}`);
      
      // Enviar AMBOS campos para mayor compatibilidad
      const response = await api.post('/auth/login', { 
        email, 
        codigoInstitucional,
        password 
      });
      
      console.log('Respuesta del servidor:', response.data);
      
      // Normalizar la estructura recibida
      const { token, user, usuario } = response.data;
      
      // Usar usuario si existe, de lo contrario usar user
      const userData = usuario || user;
      
      if (!userData) {
        throw new Error('No se recibieron datos de usuario desde el servidor');
      }
      
      // Almacenar de forma normalizada
      authService.setUserData(token, userData);
      
      return { token, usuario: userData };
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  },
  
  registro: async (userData: any) => {
    const response = await api.post('/auth/registro', userData);
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('user'); // También eliminar la versión legacy
  },
  
  getCurrentUser: () => {
    // Primero buscar en 'usuario' (nuevo estándar)
    const usuarioStr = localStorage.getItem('usuario');
    if (usuarioStr) {
      try {
        return JSON.parse(usuarioStr);
      } catch (e) {
        console.error('Error al parsear datos de usuario:', e);
      }
    }
    
    // Si no encuentra, intentar con 'user' (legacy)
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        // Migrar a 'usuario' para normalizar
        localStorage.setItem('usuario', userStr);
        console.log('Datos migrados de "user" a "usuario" para normalización');
        return userData;
      } catch (e) {
        console.error('Error al parsear datos de user:', e);
      }
    }
    
    return null;
  },
  
  getUserData: () => {
    const token = localStorage.getItem('token');
    let usuario = null;
    
    // Intentar obtener datos de 'usuario' primero (nuevo estándar)
    const usuarioStr = localStorage.getItem('usuario');
    if (usuarioStr) {
      try {
        usuario = JSON.parse(usuarioStr);
      } catch (e) {
        console.error('Error al parsear datos de usuario:', e);
      }
    } 
    // Si no hay datos en 'usuario', intentar con 'user' (legacy)
    else {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          usuario = JSON.parse(userStr);
          // Migrar a 'usuario' para normalizar
          localStorage.setItem('usuario', userStr);
          console.log('Datos migrados de "user" a "usuario" para normalización');
        } catch (e) {
          console.error('Error al parsear datos de user:', e);
        }
      }
    }
    
    return { token, usuario };
  },
  
  setUserData: (token: string, usuario: any) => {
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
  },
  
  migrateUserData: () => {
    try {
      const userStr = localStorage.getItem('user');
      const usuarioStr = localStorage.getItem('usuario');
      
      // Solo migrar si existe 'user' pero no 'usuario'
      if (userStr && !usuarioStr) {
        localStorage.setItem('usuario', userStr);
        console.log('Datos migrados automáticamente de "user" a "usuario"');
      }
    } catch (e) {
      console.error('Error durante la migración de datos:', e);
    }
  },
  
  checkAuth: () => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    // Verificar si hay datos de usuario disponibles
    const usuarioData = localStorage.getItem('usuario') || localStorage.getItem('user');
    return !!usuarioData;
  }
};

// Servicios de usuario
export const userService = {
  getPerfil: async () => {
    const response = await api.get('/usuarios/perfil');
    return response.data;
  },
  
  updatePerfil: async (userData: any) => {
    const response = await api.put('/usuarios/perfil', userData);
    return response.data;
  },
  
  getAllUsuarios: async () => {
    const response = await api.get('/usuarios/admin/usuarios');
    return response.data;
  }
};

// Servicios de recursos
export const recursoService = {
  getAllRecursos: async () => {
    const response = await api.get('/recursos');
    return response.data;
  },
  
  getMisRecursos: async () => {
    const response = await api.get('/recursos/mis-recursos');
    return response.data;
  },
  
  getRecursoById: async (id: string) => {
    const response = await api.get(`/recursos/${id}`);
    return response.data;
  },
  
  createRecurso: async (formData: FormData) => {
    const response = await api.post('/recursos', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  updateRecurso: async (id: string, recursoData: any) => {
    const response = await api.put(`/recursos/${id}`, recursoData);
    return response.data;
  },
  
  deleteRecurso: async (id: string) => {
    const response = await api.delete(`/recursos/${id}`);
    return response.data;
  }
};

// Servicios de categorías
export const categoriaService = {
  getAllCategorias: async () => {
    const response = await api.get('/categorias');
    return response.data;
  },
  
  getCategoriaById: async (id: string) => {
    const response = await api.get(`/categorias/${id}`);
    return response.data;
  }
};

export default api;