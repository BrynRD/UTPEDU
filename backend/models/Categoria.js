const { pool } = require('../config/db');

class Categoria {
  
  static async findAll() {
    const [categorias] = await pool.query('SELECT * FROM categorias');
    return categorias;
  }

  static async findById(id) {
    const [categorias] = await pool.query('SELECT * FROM categorias WHERE id = ?', [id]);
    return categorias.length ? categorias[0] : null;
  }
}

module.exports = Categoria;