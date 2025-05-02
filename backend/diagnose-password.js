const bcrypt = require('bcrypt');
const { pool } = require('./config/db');

async function diagnosticoDeContraseñas() {
  try {
    // Datos a probar - MODIFICA ESTOS VALORES
    const usuarioEmail = 'C31585@utp.edu.pe'; // El email del usuario
    const contraActual = '12345678'; // La contraseña que sí funciona para iniciar sesión
    const contraNueva = '87654321'; // La contraseña que intentaste establecer
    
    console.log('--- DIAGNÓSTICO DE CONTRASEÑAS ---');
    
    // 1. Obtener el usuario por email
    const [usuarios] = await pool.query('SELECT id, email, password FROM usuarios WHERE LOWER(email) = LOWER(?)', [usuarioEmail]);
    
    if (usuarios.length === 0) {
      console.log('No se encontró ningún usuario con el email:', usuarioEmail);
      return;
    }
    
    if (usuarios.length > 1) {
      console.log('⚠️ ALERTA: Se encontraron múltiples usuarios con el mismo email!');
      console.table(usuarios.map(u => ({ id: u.id, email: u.email })));
    }
    
    const usuario = usuarios[0];
    console.log('Usuario encontrado ID:', usuario.id);
    console.log('Hash almacenado:', usuario.password);
    
    // 2. Verificar la contraseña actual
    const actualMatch = await bcrypt.compare(contraActual, usuario.password);
    console.log('¿La contraseña actual coincide?', actualMatch ? 'SÍ ✅' : 'NO ❌');
    
    // 3. Verificar la contraseña nueva
    const nuevaMatch = await bcrypt.compare(contraNueva, usuario.password);
    console.log('¿La contraseña nueva coincide?', nuevaMatch ? 'SÍ ✅' : 'NO ❌');
    
    // 4. Crear un nuevo hash con la contraseña nueva para comparar
    const nuevoHash = await bcrypt.hash(contraNueva, 10);
    console.log('Nuevo hash generado ahora para la contraseña nueva:', nuevoHash);
    
    // 5. Verificar nuevamente con el hash recién generado
    const verificacionNueva = await bcrypt.compare(contraNueva, nuevoHash);
    console.log('¿La contraseña nueva coincide con el hash recién generado?', verificacionNueva ? 'SÍ ✅' : 'NO ❌');
    
    console.log('\n--- DIAGNÓSTICO COMPLETO ---');
    
    if (actualMatch && !nuevaMatch) {
      console.log('RESULTADO: La contraseña NO se actualizó correctamente. La antigua sigue funcionando.');
    } else if (!actualMatch && nuevaMatch) {
      console.log('RESULTADO: La contraseña SE actualizó, pero el sistema de login no la reconoce.');
    } else if (!actualMatch && !nuevaMatch) {
      console.log('RESULTADO: Ninguna contraseña coincide. Algo está mal con la verificación.');
    } else {
      console.log('RESULTADO: Ambas contraseñas parecen coincidir. Hay algo raro con el sistema de hashing.');
    }
  } catch (error) {
    console.error('Error en diagnóstico:', error);
  } finally {
    // Cerrar la conexión
    pool.end();
  }
}

diagnosticoDeContraseñas();