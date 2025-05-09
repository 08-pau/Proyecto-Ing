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

  useEffect(() => {
    fetchProveedores(); // Obtener los proveedores al montar el componente
  }, []);

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
    <div className="main-content">
      <h1>Proveedores</h1>
      <button onClick={() => setShowAgregarModal(true)}>Agregar Proveedor</button>

      {/* Mensaje de éxito o error */}
      {mensaje && <p>{mensaje}</p>}

      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Tipo de Documento</th>
            <th>Número de Documento</th>
            <th>Teléfono</th>
            <th>Email</th>
            <th>Dirección</th>
            <th>Frecuencia de Visita</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {proveedores.length > 0 ? (
            proveedores.map(proveedor => (
              <tr key={proveedor.ID_Proveedor}>
                <td>{proveedor.Nombre}</td>
                <td>{proveedor.Tipo_Documento}</td>
                <td>{proveedor.Numero_Documento}</td>
                <td>{proveedor.Telefono}</td>
                <td>{proveedor.Email}</td>
                <td>{proveedor.Direccion}</td>
                <td>{proveedor.Frecuencia_Visita}</td>
                <td>
                  <button onClick={() => openEditarModal(proveedor)}>Editar</button>
                  <button onClick={() => openEliminarModal(proveedor)}>Eliminar</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">No hay proveedores disponibles.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modales */}
      <ModalAgregarProveedor
        show={showAgregarModal}
        onClose={() => setShowAgregarModal(false)}
        onAdd={handleAgregarProveedor}
      />

      {proveedorSeleccionado && (
        <ModalEditarProveedor
          show={showEditarModal}
          onClose={() => setShowEditarModal(false)}
          onEdit={handleEditarProveedor}
          proveedor={proveedorSeleccionado}
        />
      )}

      {proveedorSeleccionado && (
        <ModalConfirmarEliminar
          show={showEliminarModal}
          onClose={() => setShowEliminarModal(false)}
          onDelete={() => eliminarProveedor(proveedorSeleccionado.ID_Proveedor)}
        />
      )}
    </div>
  );
};

export default Proveedores;

