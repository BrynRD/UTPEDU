const Incidencia = require('../models/Incidencia');

describe('Modelo Incidencia', () => {
  let incidenciaId;

  test('crear una incidencia y recuperarla por ID', async () => {
    
    incidenciaId = await Incidencia.create({
      nombre: 'Test User',
      email: 'testuser@utp.edu.pe',
      asunto: 'Prueba Jest',
      descripcion: 'Esto es una incidencia de prueba',
      estado: 'pendiente',
      imagenUrl: '',
      usuario_id: 1 
    });

  
    const incidencia = await Incidencia.findById(incidenciaId);

    expect(incidencia).toBeDefined();
    expect(incidencia.nombre).toBe('Test User');
    expect(incidencia.email).toBe('testuser@utp.edu.pe');
    expect(incidencia.asunto).toBe('Prueba Jest');
    expect(incidencia.estado).toBe('pendiente');
  });

  
});