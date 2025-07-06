const Usuario = require('../models/Usuario');
const { pool } = require('../config/db');

describe('Modelo Usuario', () => {
  let usuarioId;
  const testEmail = `test.usuario.${Date.now()}@utp.edu.pe`;

  beforeEach(async () => {
    try {
      await pool.query('DELETE FROM usuarios WHERE email LIKE ?', ['test.usuario.%@utp.edu.pe']);
    } catch (error) {
     
    }
  });

  afterEach(async () => {
    try {
      if (usuarioId) {
        await pool.query('DELETE FROM usuarios WHERE id = ?', [usuarioId]);
        usuarioId = null;
      }
    } catch (error) {
      
    }
  });

  test('crear un usuario y recuperarlo por ID', async () => {
    usuarioId = await Usuario.create({
      nombre: 'Juan',
      apellido: 'Pérez',
      email: testEmail,
      password: '123456',
      rolId: 4, 
      codigoInstitucional: 'U1234567',
      institucion: 'Universidad Tecnológica del Perú',
      areaEspecialidad: 'Ingeniería'
    });

    const usuario = await Usuario.findById(usuarioId);

    expect(usuario).toBeDefined();
    expect(usuario.nombre).toBe('Juan');
    expect(usuario.email).toBe(testEmail);
    expect(usuario.rol_id).toBe(4);
  });
});