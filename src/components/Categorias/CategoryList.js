import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ModalAgregarCategoriaConNiveles from './ModalAgregarCategoriaConNiveles';
import ModalEditarCategoria from './ModalEditarCategoria';
import ModalConfirmarEliminar from './ModalConfirmarEliminar';
import './stylesCategorias.css';

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [showAgregarModal, setShowAgregarModal] = useState(false);
  const [showEditarModal, setShowEditarModal] = useState(false);
  const [showEliminarModal, setShowEliminarModal] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    setCargando(true);
    try {
      const response = await axios.get('http://localhost:5002/api/categorias');
      setCategorias(response.data);
    } catch (error) {
      setMensaje('Error al obtener categorías.');
    } finally {
      setCargando(false);
    }
  };

  const handleAgregarCategoria = async (nuevaCategoria) => {
    try {
      await axios.post('http://localhost:5002/api/categorias', nuevaCategoria);
      fetchCategorias();
      setShowAgregarModal(false);
      setMensaje('Categoría agregada exitosamente.');
    } catch (error) {
      setMensaje('Error al agregar categoría.');
    }
  };

  const handleEditarCategoria = async (categoriaActualizada) => {
    try {
      await axios.put(`http://localhost:5002/api/categorias/${categoriaActualizada.ID_Categoria}`, categoriaActualizada);
      fetchCategorias();
      setShowEditarModal(false);
      setMensaje('Categoría actualizada exitosamente.');
    } catch (error) {
      setMensaje(`Error al actualizar categoría: ${error.response?.data?.error || error.message}`);
    }
  };

  const eliminarCategoria = async (id) => {
    try {
      await axios.delete(`http://localhost:5002/api/categorias/${id}`);
      fetchCategorias();
      setShowEliminarModal(false);
      setMensaje('Categoría eliminada exitosamente.');
    } catch (error) {
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

  const categoriasFiltradas = categorias.filter((categoria) =>
    categoria.Nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

 return (
  <div className="categoria-main-content">
    <h1 className="categoria-titulo-pago">Categorías</h1>

    <div className="categoria-acciones-top">
      <input
        type="text"
        placeholder="Buscar categoría..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="categoria-buscador-input"
      />
      <button className="categoria-btn-agregar" onClick={() => setShowAgregarModal(true)}>
        Agregar Categoría
      </button>
    </div>

    {mensaje && <p className="categoria-mensaje">{mensaje}</p>}

    <table className="categoria-tabla-metodos">
      
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
        {categoriasFiltradas.length > 0 ? (
          categoriasFiltradas.map((categoria) => (
            <tr key={categoria.ID_Categoria}>
              <td>{categoria.Nombre}</td>
              <td>{categoria.Descripcion}</td>
              <td>{categoria.Tipo_Familia}</td>
              <td>{categoria.Segmento}</td>
              <td>{categoria.Subsegmento}</td>
              <td>{categoria.Marca_Preferida}</td>
              <td>{categoria.Presentacion_Producto}</td>
              <td>
                 <div className="proveedor-acciones-botones">
                <button className="categoria-btn-editar" onClick={() => openEditarModal(categoria)}>
                  Editar
                </button>
                <button
                  className="categoria-btn-editar"
                  style={{ backgroundColor: '#3b82f6' }}
                  onClick={() => openEliminarModal(categoria)}
                >
                  Eliminar
                </button>
                </div>
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



      <ModalAgregarCategoriaConNiveles
        show={showAgregarModal}
        onClose={() => setShowAgregarModal(false)}
        onAdd={handleAgregarCategoria}
      />

      {categoriaSeleccionada && (
        <>
          <ModalEditarCategoria
            show={showEditarModal}
            onClose={() => setShowEditarModal(false)}
            onEdit={handleEditarCategoria}
            categoria={categoriaSeleccionada}
          />
          <ModalConfirmarEliminar
            show={showEliminarModal}
            onClose={() => setShowEliminarModal(false)}
            onDelete={() => eliminarCategoria(categoriaSeleccionada.ID_Categoria)}
          />
        </>
      )}
    </div>
  );
};

export default Categorias;

