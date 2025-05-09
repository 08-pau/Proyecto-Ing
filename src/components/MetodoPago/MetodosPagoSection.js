import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ModalAgregarMetodoPago from './ModalAgregarMetodoPago'; // Modal para agregar método de pago
import ModalEditarMetodoPago from './ModalEditarMetodoPago'; // Modal para editar método de pago

const MetodosPagoSection = () => {
  const [metodosPago, setMetodosPago] = useState([]);
  const [showAgregarModal, setShowAgregarModal] = useState(false);
  const [showEditarModal, setShowEditarModal] = useState(false);
  const [metodoSeleccionado, setMetodoSeleccionado] = useState(null);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    fetchMetodosPago(); // Llamar a la función para obtener métodos de pago
  }, []);

  const fetchMetodosPago = async () => {
    try {
      const response = await axios.get('http://localhost:5002/api/metodos_pago');
      setMetodosPago(response.data);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
    }
  };

  const handleAgregarMetodoPago = async (nuevoMetodo) => {
    try {
      await axios.post('http://localhost:5002/api/metodos_pago', nuevoMetodo);
      fetchMetodosPago(); // Actualiza la lista de métodos de pago
      setShowAgregarModal(false);
      setMensaje('Método de pago agregado exitosamente.');
    } catch (error) {
      setMensaje('Error al agregar método de pago.');
    }
  };

  const toggleActivoMetodoPago = async (id, estadoActual) => {
    const nuevoEstado = estadoActual === 1 ? 0 : 1; // Cambia de activo a inactivo y viceversa
    try {
      await axios.put(`http://localhost:5002/api/metodos_pago/${id}/status`, { activo: nuevoEstado });
      fetchMetodosPago(); // Actualiza la lista de métodos de pago

      if (nuevoEstado === 1) {
        setMensaje('Método de pago activado exitosamente.');
      } else {
        setMensaje('Método de pago desactivado exitosamente.');
      }
    } catch (error) {
      setMensaje('Error al actualizar el estado del método de pago.');
    }
  };

  const handleEditarMetodoPago = async (metodoActualizado) => {
    try {
      await axios.put(`http://localhost:5002/api/metodos_pago/${metodoActualizado.id}`, metodoActualizado);
      fetchMetodosPago(); // Actualiza la lista de métodos de pago después de la edición
      setShowEditarModal(false);
      setMensaje('Método de pago actualizado exitosamente.');
    } catch (error) {
      setMensaje('Error al actualizar método de pago.');
    }
  };

  const abrirModalEditar = (metodo) => {
    setMetodoSeleccionado(metodo);
    setShowEditarModal(true);
  };

  return (
    <div className="main-content">
      <h1>Métodos de Pago</h1>
      <button onClick={() => setShowAgregarModal(true)}>Agregar Método de Pago</button>
      {mensaje && <p>{mensaje}</p>}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre del Método</th>
            <th>Estado</th> {/* Nueva columna para estado */}
            <th>Acciones</th> {/* Nueva columna para acciones */}
          </tr>
        </thead>
        <tbody>
          {metodosPago.length > 0 ? (
            metodosPago.map((metodo) => (
              <tr key={metodo.ID_Metodo_Pago}>
                <td>{metodo.ID_Metodo_Pago}</td>
                <td>{metodo.Nombre}</td>
                <td>
                  <button onClick={() => toggleActivoMetodoPago(metodo.ID_Metodo_Pago, metodo.activo)}>
                    {metodo.activo ? 'Desactivar' : 'Activar'}
                  </button>
                </td>
                <td>
                  <button onClick={() => abrirModalEditar(metodo)}>Editar</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No se encontraron métodos de pago.</td>
            </tr>
          )}
        </tbody>
      </table>
      <ModalAgregarMetodoPago
        show={showAgregarModal}
        onClose={() => setShowAgregarModal(false)}
        onAdd={handleAgregarMetodoPago}
      />
      <ModalEditarMetodoPago
        show={showEditarModal}
        onClose={() => setShowEditarModal(false)}
        metodoPago={metodoSeleccionado}  // Cambiado de 'metodo' a 'metodoPago'
        onEdit={handleEditarMetodoPago}
      />

    </div>
  );
};

export default MetodosPagoSection;

