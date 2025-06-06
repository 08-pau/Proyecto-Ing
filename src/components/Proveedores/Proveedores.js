import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ModalAgregarProveedor from './ModalAgregarProveedor';
import ModalEditarProveedor from './ModalEditarProveedor';
import ModalConfirmarEliminar from './ModalConfirmarEliminar';

const Proveedores = () => {
  const [proveedores, setProveedores] = useState([]);
  const [showAgregarModal, setShowAgregarModal] = useState(false);
  const [showEditarModal, setShowEditarModal] = useState(false);
  const [showEliminarModal, setShowEliminarModal] = useState(false);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);
  const [busqueda, setBusqueda] = useState(''); // ✅ Estado para la búsqueda
  useEffect(() => {
    fetchProveedores(); // Obtener los proveedores al montar el componente
  }, []);
 useEffect(() => {
    fetchProveedores();
  }, []);

  const proveedoresFiltrados = proveedores.filter((prov) =>
    prov.Nombre.toLowerCase().includes(busqueda.toLowerCase())
  );
  // Función para obtener los proveedores
  const fetchProveedores = async () => {
    setCargando(true);
    try {
      const response = await axios.get('http://localhost:5002/api/proveedores');
      setProveedores(response.data);
    } catch (error) {
      setMensaje('Error al obtener proveedores.');
      console.error('Error fetching providers:', error);
    } finally {
      setCargando(false);
    }
  };

  const handleAgregarProveedor = async (nuevoProveedor) => {
    try {
      await axios.post('http://localhost:5002/api/proveedores', nuevoProveedor);
      fetchProveedores(); // Actualiza la lista de proveedores
      setShowAgregarModal(false);
      setMensaje('El Proveedor agregado exitosamente.');
    } catch (error) {
      setMensaje('Error al agregar proveedor.');
      console.error('Error adding provider:', error);
    }
  };

  const handleEditarProveedor = async (proveedorActualizado) => {
    try {
      await axios.put(`http://localhost:5002/api/proveedores/${proveedorActualizado.ID_Proveedor}`, proveedorActualizado);
      fetchProveedores(); // Actualiza la lista de proveedores
      setShowEditarModal(false);
      setMensaje('El Proveedor actualizado exitosamente.');
    } catch (error) {
      setMensaje(`Error al actualizar proveedor: ${error.response?.data?.error || error.message}`);
      console.error('Error updating provider:', error);
    }
  };

  const eliminarProveedor = async (id) => {
    try {
      await axios.delete(`http://localhost:5002/api/proveedores/${id}`);
      fetchProveedores(); // Vuelve a cargar la lista de proveedores
      setShowEliminarModal(false); // Cierra el modal después de eliminar
      setMensaje('El proveedor eliminado exitosamente .');
    } catch (error) {
      console.error('Error al eliminar proveedor:', error);
      setMensaje('Error al eliminar el proveedor.');
    }
  };

  const openEditarModal = (proveedor) => {
    setProveedorSeleccionado(proveedor);
    setShowEditarModal(true);
  };

  const openEliminarModal = (proveedor) => {
    setProveedorSeleccionado(proveedor);
    setShowEliminarModal(true);
  };

return (
  <div className="proveedor-main-content">
    <h1 className="proveedor-titulo-pago">Proveedores</h1>

    <div className="proveedor-acciones-top">
      <input
        type="text"
        placeholder="Buscar proveedor..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="proveedor-buscador-input"
      />
      <button className="proveedor-btn-agregar" onClick={() => setShowAgregarModal(true)}>
        Agregar Proveedor
      </button>
    </div>

    {mensaje && <p className="proveedor-mensaje">{mensaje}</p>}

    <div className="proveedor-tabla-container">
      <table className="proveedor-tabla">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Tipo de Documento</th>
            <th>Número</th>
            <th>Teléfono</th>
            <th>Email</th>
            <th>Dirección</th>
            <th>Frecuencia</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {proveedoresFiltrados.length > 0 ? (
            proveedoresFiltrados.map((prov) => (
              <tr key={prov.ID_Proveedor}>
                <td>{prov.Nombre}</td>
                <td>{prov.Tipo_Documento}</td>
                <td>{prov.Numero_Documento}</td>
                <td>{prov.Telefono}</td>
                <td>{prov.Email}</td>
                <td>{prov.Direccion}</td>
                <td>{prov.Frecuencia_Visita}</td>
                <td>
                    <div className="proveedor-acciones-botones">
                  <button className="proveedor-btn-editar" onClick={() => openEditarModal(prov)}>
                    Editar
                  </button>
                  <button className="proveedor-btn-eliminar" onClick={() => openEliminarModal(prov)}>
                    Eliminar
                  </button>
                   </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">No se encontraron proveedores.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    {/* ✅ Modales */}
    <ModalAgregarProveedor
      show={showAgregarModal}
      onClose={() => setShowAgregarModal(false)}
      onAdd={handleAgregarProveedor}
    />

    <ModalEditarProveedor
      show={showEditarModal}
      onClose={() => setShowEditarModal(false)}
      proveedor={proveedorSeleccionado}
      onEdit={handleEditarProveedor}
    />

    <ModalConfirmarEliminar
      show={showEliminarModal}
      onClose={() => setShowEliminarModal(false)}
      proveedor={proveedorSeleccionado}
      onConfirm={() => eliminarProveedor(proveedorSeleccionado?.ID_Proveedor)}
    />
  </div>
);

};

export default Proveedores;

