import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ModalAgregarCliente from './ModalAgregarCliente';
import ModalEditarCliente from './ModalEditarCliente';
import ModalConfirmarEliminar from './ModalConfirmarEliminar';

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [showAgregarModal, setShowAgregarModal] = useState(false);
  const [showEditarModal, setShowEditarModal] = useState(false);
  const [showEliminarModal, setShowEliminarModal] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    fetchClientes(); // Cambiar a fetchClientes
  }, []);

  // Función para obtener los clientes (fetchClientes)
  const fetchClientes = async () => {
    setCargando(true);
    try {
      const response = await axios.get('http://localhost:5002/api/clientes');
      setClientes(response.data);
    } catch (error) {
      setMensaje('Error al obtener clientes.');
      console.error('Error fetching clients:', error);
    } finally {
      setCargando(false);
    }
  };

  const handleAgregarCliente = async (nuevoCliente) => {
    console.log('Nuevo cliente a agregar:', nuevoCliente); // Verifica que los datos sean correctos
    try {
      await axios.post('http://localhost:5002/api/clientes', nuevoCliente);
      fetchClientes(); // Actualiza la lista de clientes
      setShowAgregarModal(false);
      setMensaje('Cliente agregado exitosamente.');
    } catch (error) {
      setMensaje('Error al agregar cliente.');
     }
  };
  

  const handleEditarCliente = async (clienteActualizado) => {
    try {
      await axios.put(`http://localhost:5002/api/clientes/${clienteActualizado.ID_Cliente}`, clienteActualizado);
      fetchClientes(); // Actualiza la lista de clientes
      setShowEditarModal(false);
      setMensaje('Cliente actualizado exitosamente.');
    } catch (error) {
      setMensaje(`Error al actualizar cliente: ${error.response.data.error || error.message}`);
      console.error('Error updating client:', error);
    }
  };
  
  

  const eliminarCliente = async (id) => {
    try {
      await axios.delete(`http://localhost:5002/api/clientes/${id}`);
      fetchClientes(); // Vuelve a cargar la lista de clientes
      setShowEliminarModal(false); // Cierra el modal después de eliminar
      setMensaje('Cliente eliminado exitosamente.');
    } catch (error) {
      console.error('Error al eliminar cliente:', error);
      setMensaje('Error al eliminar el cliente.');
    }
  };
  

  const openEditarModal = (cliente) => {
    setClienteSeleccionado(cliente);
    setShowEditarModal(true);
  };

  const openEliminarModal = (cliente) => {
    setClienteSeleccionado(cliente);
    setShowEliminarModal(true);
  };

  return (
    <div className="main-content">
      <h1>Clientes</h1>
      <button onClick={() => setShowAgregarModal(true)}>Agregar Cliente</button>

      {cargando ? <p></p> : mensaje && <p>{mensaje}</p>}

      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Tipo de Documento</th>
            <th>Número de Documento</th>
            <th>Dirección</th>
            <th>Teléfono</th>
            <th>Email</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.length > 0 ? (
            clientes.map(cliente => (
              <tr key={cliente.ID_Cliente}>
                <td>{cliente.Nombre}</td>
                <td>{cliente.Tipo_Documento}</td>
                <td>{cliente.Numero_Documento}</td>
                <td>{cliente.Direccion}</td>
                <td>{cliente.Telefono}</td>
                <td>{cliente.Email}</td>
                <td>
                  <button onClick={() => openEditarModal(cliente)}>Editar</button>
                  <button onClick={() => openEliminarModal(cliente)}>Eliminar</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No hay clientes disponibles.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modales */}
      <ModalAgregarCliente
        show={showAgregarModal}
        onClose={() => setShowAgregarModal(false)}
        onAdd={handleAgregarCliente}
      />

      {clienteSeleccionado && (
        <ModalEditarCliente
          show={showEditarModal}
          onClose={() => setShowEditarModal(false)}
          onEdit={handleEditarCliente}
          cliente={clienteSeleccionado}
        />
      )}

      {clienteSeleccionado && (
        <ModalConfirmarEliminar
          show={showEliminarModal}
          onClose={() => setShowEliminarModal(false)}
          onDelete={() => eliminarCliente(clienteSeleccionado.ID_Cliente)} // Corregido para usar eliminarCliente
        />
      )}
    </div>
  );
};

export default Clientes;
