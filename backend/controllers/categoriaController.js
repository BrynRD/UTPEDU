const Categoria = require('../models/Categoria');
const { pool } = require('../config/db');

exports.getAllCategorias = async (req, res) => {
  try {
    const [categorias] = await pool.query('SELECT * FROM categorias ORDER BY nombre');
    res.json(categorias);
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({ mensaje: 'Error al obtener categorías' });
  }
};

exports.getCategoriaById = async (req, res) => {
  try {
    const categoria = await Categoria.findById(req.params.id);
    
    if (!categoria) {
      return res.status(404).json({ mensaje: 'Categoría no encontrada' });
    }
    
    res.json(categoria);
  } catch (error) {
    console.error('Error al obtener categoría:', error);
    res.status(500).json({ mensaje: 'Error al obtener categoría' });
  }
};

exports.createCategoria = async (req, res) => {
  try {
    const { nombre } = req.body;
    
    if (!nombre) {
      return res.status(400).json({ mensaje: 'El nombre es obligatorio' });
    }
    
    const [result] = await pool.query('INSERT INTO categorias (nombre) VALUES (?)', [nombre]);
    
    res.status(201).json({
      mensaje: 'Categoría creada correctamente',
      categoria: {
        id: result.insertId,
        nombre
      }
    });
  } catch (error) {
    console.error('Error al crear categoría:', error);
    res.status(500).json({ mensaje: 'Error al crear categoría' });
  }
};

exports.updateCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;
    
    if (!nombre) {
      return res.status(400).json({ mensaje: 'El nombre es obligatorio' });
    }
    
    const [result] = await pool.query('UPDATE categorias SET nombre = ? WHERE id = ?', [nombre, id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Categoría no encontrada' });
    }
    
    res.json({
      mensaje: 'Categoría actualizada correctamente',
      categoria: {
        id,
        nombre
      }
    });
  } catch (error) {
    console.error('Error al actualizar categoría:', error);
    res.status(500).json({ mensaje: 'Error al actualizar categoría' });
  }
};

exports.deleteCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si hay recursos asociados a esta categoría
    const [recursos] = await pool.query('SELECT COUNT(*) as count FROM recursos WHERE categoria_id = ?', [id]);
    
    if (recursos[0].count > 0) {
      return res.status(400).json({ 
        mensaje: 'No se puede eliminar la categoría porque tiene recursos asociados' 
      });
    }
    
    const [result] = await pool.query('DELETE FROM categorias WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Categoría no encontrada' });
    }
    
    res.json({ mensaje: 'Categoría eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar categoría:', error);
    res.status(500).json({ mensaje: 'Error al eliminar categoría' });
  }
};