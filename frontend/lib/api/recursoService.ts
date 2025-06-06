import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface RecursoResponse {
  recursos: any[];
  totalRecursos: number;
  currentPage: number;
  totalPages: number;
}

interface RecursoService {
  getAllRecursos: (searchTerm?: string, page?: number, limit?: number) => Promise<RecursoResponse>;
  getMisRecursos: () => Promise<any[]>;
  getRecursoById: (id: string) => Promise<any>;
  createRecurso: (formData: FormData) => Promise<any>;
  updateRecurso: (id: string, recursoData: any) => Promise<any>;
  deleteRecurso: (id: string) => Promise<any>;
  getAllCategorias: () => Promise<any[]>;
  getEstadisticas: () => Promise<any>;
}

export const recursoService: RecursoService = {
  getAllRecursos: async (searchTerm: string = '', page: number = 1, limit: number = 7) => {
    try {
      const queryParams = new URLSearchParams({
        searchTerm: searchTerm.toString(),
        page: page.toString(),
        limit: limit.toString(),
      }).toString();

      const url = `${API_URL}/recursos?${queryParams}`;

      console.log('Frontend Service: Sending GET request to URL:', url);

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log('Frontend Service: Received response data:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al obtener recursos:', error);
      throw error;
    }
  },

  getMisRecursos: async () => {
    try {
      const response = await axios.get(`${API_URL}/recursos/mis-recursos`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener mis recursos:', error);
      throw error;
    }
  },

  getRecursoById: async (id: string) => {
    try {
      const response = await axios.get(`${API_URL}/recursos/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener recurso:', error);
      throw error;
    }
  },

  createRecurso: async (formData: FormData) => {
    try {
      const response = await axios.post(`${API_URL}/recursos`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error al crear recurso:', error);
      throw error;
    }
  },

  updateRecurso: async (id: string, recursoData: any) => {
    try {
      const response = await axios.put(`${API_URL}/recursos/${id}`, recursoData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error al actualizar recurso:', error);
      throw error;
    }
  },

  deleteRecurso: async (id: string) => {
    try {
      const response = await axios.delete(`${API_URL}/recursos/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error al eliminar recurso:', error);
      throw error;
    }
  },

  getAllCategorias: async () => {
    try {
      const response = await axios.get(`${API_URL}/categorias`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      throw error;
    }
  },

  getEstadisticas: async () => {
    try {
      const response = await axios.get(`${API_URL}/recursos/estadisticas`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw error;
    }
  }
}; 