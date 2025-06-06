import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ModalAgregarCliente from './ModalAgregarCliente';
import ModalEditarCliente from './ModalEditarCliente';
import ModalConfirmarEliminar from './ModalConfirmarEliminar';
import './stylesCliente.css';

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [showAgregarModal, setShowAgregarModal] = useState(false);
  const [showEditarModal, setShowEditarModal] = useState(false);
  const [showEliminarModal, setShowEliminarModal] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    setCargando(true);
    try {
      const response = await axios.get('http://localhost:5002/api/clientes');
      setClientes(response.data);
    } catch (error) {
      setMensaje('Error al obtener clientes.');
    } finally {
      setCargando(false);
    }
  };

  const handleAgregarCliente = async (nuevoCliente) => {
    try {
      await axios.post('http://localhost:5002/api/clientes', nuevoCliente);
      fetchClientes();
      setShowAgregarModal(false);
      setMensaje('Cliente agregado exitosamente.');
    } catch (error) {
      setMensaje('Error al agregar cliente.');
    }
  };

  const handleEditarCliente = async (clienteActualizado) => {
    try {
      await axios.put(`http://localhost:5002/api/clientes/${clienteActualizado.ID_Cliente}`, clienteActualizado);
      fetchClientes();
      setShowEditarModal(false);
      setMensaje('Cliente actualizado exitosamente.');
    } catch (error) {
      setMensaje(`Error al actualizar cliente: ${error.response?.data?.error || error.message}`);
    }
  };

  const eliminarCliente = async (id) => {
    try {
      await axios.delete(`http://localhost:5002/api/clientes/${id}`);
      fetchClientes();
      setShowEliminarModal(false);
      setMensaje('Cliente eliminado exitosamente.');
    } catch (error) {
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

  const clientesFiltrados = clientes.filter((cliente) =>
    cliente.Nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

 return (
  <div className="cliente-main-content">
    <h1 className="cliente-titulo">Clientes</h1>

    <div className="cliente-acciones-top">
      <input
        type="text"
        placeholder="Buscar cliente..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="cliente-buscador-input"
      />
      <button className="cliente-btn-agregar" onClick={() => setShowAgregarModal(true)}>
        Agregar Cliente
      </button>
    </div>

    {mensaje && <p className="cliente-mensaje">{mensaje}</p>}

    <table className="cliente-tabla">
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
        {clientesFiltrados.length > 0 ? (
          clientesFiltrados.map((cliente) => (
            <tr key={cliente.ID_Cliente}>
              <td>{cliente.Nombre}</td>
              <td>{cliente.Tipo_Documento}</td>
              <td>{cliente.Numero_Documento}</td>
              <td>{cliente.Direccion}</td>
              <td>{cliente.Telefono}</td>
              <td>{cliente.Email}</td>
              <td>
                <button className="cliente-btn-editar" onClick={() => openEditarModal(cliente)}>Editar</button>
                <button className="cliente-btn-eliminar" onClick={() => openEliminarModal(cliente)}>Eliminar</button>
              </td>
            </tr>
          ))
        ) : (
          <tr><td colSpan="7">No hay clientes disponibles.</td></tr>
        )}
      </tbody>
    </table>

      <ModalAgregarCliente show={showAgregarModal} onClose={() => setShowAgregarModal(false)} onAdd={handleAgregarCliente} />

      {clienteSeleccionado && (
        <>
          <ModalEditarCliente show={showEditarModal} onClose={() => setShowEditarModal(false)} onEdit={handleEditarCliente} cliente={clienteSeleccionado} />
          <ModalConfirmarEliminar show={showEliminarModal} onClose={() => setShowEliminarModal(false)} onDelete={() => eliminarCliente(clienteSeleccionado.ID_Cliente)} />
        </>
      )}
    </div>
  );
};

export default Clientes;
