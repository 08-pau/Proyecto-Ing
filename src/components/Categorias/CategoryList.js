import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ModalAgregarCategoriaConNiveles from './ModalAgregarCategoriaConNiveles';
import ModalEditarCategoria from './ModalEditarCategoria';
import ModalConfirmarEliminar from './ModalConfirmarEliminar';
import './stylesCategorias.css'; // Asegúrate de que esta ruta sea correcta

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [showAgregarModal, setShowAgregarModal] = useState(false);
  const [showEditarModal, setShowEditarModal] = useState(false);
  const [showEliminarModal, setShowEliminarModal] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    fetchCategorias(); // Obtener las categorías al montar el componente
  }, []);

  // Función para obtener las categorías
  const fetchCategorias = async () => {
    setCargando(true);
    try {
      const response = await axios.get('http://localhost:5002/api/categorias');
      setCategorias(response.data);
    } catch (error) {
      setMensaje('Error al obtener categorías.');
      console.error('Error fetching categories:', error);
    } finally {
      setCargando(false);
    }
  };

  const handleAgregarCategoria = async (nuevaCategoria) => {
    console.log('Nueva categoría a agregar:', nuevaCategoria); // Verifica que los datos sean correctos
    try {
      await axios.post('http://localhost:5002/api/categorias', nuevaCategoria);
      fetchCategorias(); // Actualiza la lista de categorías
      setShowAgregarModal(false);
      setMensaje('Categoría agregada exitosamente.');
    } catch (error) {
      setMensaje('Error al agregar categoría.');
    }
  };

  const handleEditarCategoria = async (categoriaActualizada) => {
    try {
      await axios.put(`http://localhost:5002/api/categorias/${categoriaActualizada.ID_Categoria}`, categoriaActualizada);
      fetchCategorias(); // Actualiza la lista de categorías
      setShowEditarModal(false);
      setMensaje('Categoría actualizada exitosamente.');
    } catch (error) {
      setMensaje(`Error al actualizar categoría: ${error.response.data.error || error.message}`);
      console.error('Error updating category:', error);
    }
  };

  const eliminarCategoria = async (id) => {
    try {
      await axios.delete(`http://localhost:5002/api/categorias/${id}`);
      fetchCategorias(); // Vuelve a cargar la lista de categorías
      setShowEliminarModal(false); // Cierra el modal después de eliminar
      setMensaje('Categoría eliminada exitosamente.');
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
      setMensaje('Error al eliminar la categoría.');
    }
  };

  const openEditarModal = (categoria) => {
    setCategoriaSeleccionada(categoria);
    setShowEditarModal(true);
  };

  const openEliminarModal = (categoria) => {
    setCategoriaSeleccionada(categoria);
    setShowEliminarModal(true);
  };

  return (
    <div className="main-content">
      <h1>Categorías</h1>
      <button onClick={() => setShowAgregarModal(true)}>Agregar Categoría</button>

      {/* Se ha eliminado la condición que mostraba 'Cargando...' */}
      {mensaje && <p>{mensaje}</p>}

      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Tipo Familia</th>
            <th>Segmento</th>
            <th>Subsegmento</th>
            <th>Marca Preferida</th>
            <th>Presentación Producto</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categorias.length > 0 ? (
            categorias.map(categoria => (
              <tr key={categoria.ID_Categoria}>
                <td>{categoria.Nombre}</td>
                <td>{categoria.Descripcion}</td>
                <td>{categoria.Tipo_Familia}</td>
                <td>{categoria.Segmento}</td>
                <td>{categoria.Subsegmento}</td>
                <td>{categoria.Marca_Preferida}</td>
                <td>{categoria.Presentacion_Producto}</td>
                <td>
                  <button onClick={() => openEditarModal(categoria)}>Editar</button>
                  <button onClick={() => openEliminarModal(categoria)}>Eliminar</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">No hay categorías disponibles.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modales */}
      <ModalAgregarCategoriaConNiveles
        show={showAgregarModal}
        onClose={() => setShowAgregarModal(false)}
        onAdd={handleAgregarCategoria}
      />

      {categoriaSeleccionada && (
        <ModalEditarCategoria
          show={showEditarModal}
          onClose={() => setShowEditarModal(false)}
          onEdit={handleEditarCategoria}
          categoria={categoriaSeleccionada}
        />
      )}

      {categoriaSeleccionada && (
        <ModalConfirmarEliminar
          show={showEliminarModal}
          onClose={() => setShowEliminarModal(false)}
          onDelete={() => eliminarCategoria(categoriaSeleccionada.ID_Categoria)}
        />
      )}
    </div>
  );
};

export default Categorias;
