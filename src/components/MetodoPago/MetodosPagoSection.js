import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ModalAgregarMetodoPago from './ModalAgregarMetodoPago';
import ModalEditarMetodoPago from './ModalEditarMetodoPago';
import './stylesMetodo.css';

const MetodosPagoSection = () => {
  const [metodosPago, setMetodosPago] = useState([]);
  const [showAgregarModal, setShowAgregarModal] = useState(false);
  const [showEditarModal, setShowEditarModal] = useState(false);
  const [metodoSeleccionado, setMetodoSeleccionado] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    fetchMetodosPago();
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
      fetchMetodosPago();
      setShowAgregarModal(false);
      setMensaje('Método de pago agregado exitosamente.');
    } catch (error) {
      setMensaje('Error al agregar método de pago.');
    }
  };

  const toggleActivoMetodoPago = async (id, estadoActual) => {
    const nuevoEstado = estadoActual === 1 ? 0 : 1;
    try {
      await axios.put(`http://localhost:5002/api/metodos_pago/${id}/status`, { activo: nuevoEstado });
      fetchMetodosPago();
      setMensaje(nuevoEstado === 1 ? 'Método de pago activado exitosamente.' : 'Método de pago desactivado exitosamente.');
    } catch (error) {
      setMensaje('Error al actualizar el estado del método de pago.');
    }
  };

  const handleEditarMetodoPago = async (metodoActualizado) => {
    try {
      await axios.put(`http://localhost:5002/api/metodos_pago/${metodoActualizado.id}`, metodoActualizado);
      fetchMetodosPago();
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

  const metodosFiltrados = metodosPago.filter((metodo) =>
    metodo.Nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
  <div className="metodos-main-content">
    <h1 className="metodos-titulo-pago">Métodos de Pago</h1>

    <div className="metodos-acciones-top">
      <input
        type="text"
        placeholder="Buscar método de pago..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="metodos-buscador-input"
      />
      <button className="metodos-btn-agregar" onClick={() => setShowAgregarModal(true)}>
        Agregar Método de Pago
      </button>
    </div>

    {mensaje && <p className="metodos-mensaje">{mensaje}</p>}

    <div className="metodos-tabla-container">
      <table className="metodos-tabla">
        <thead>
          <tr>
            <th>Nombre del Método</th>
            <th>Estado</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {metodosFiltrados.length > 0 ? (
            metodosFiltrados.map((metodo) => (
              <tr key={metodo.ID_Metodo_Pago}>
                <td>{metodo.Nombre}</td>
                <td>
                  <button
                    className={metodo.activo ? 'metodos-estado-activo' : 'metodos-estado-inactivo'}
                    onClick={() => toggleActivoMetodoPago(metodo.ID_Metodo_Pago, metodo.activo)}
                  >
                    {metodo.activo ? 'Activo' : 'Inactivo'}
                  </button>
                </td>
                <td>
                  <button className="metodos-btn-editar" onClick={() => abrirModalEditar(metodo)}>
                    Editar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No se encontraron métodos de pago.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

    <ModalAgregarMetodoPago
      show={showAgregarModal}
      onClose={() => setShowAgregarModal(false)}
      onAdd={handleAgregarMetodoPago}
    />

    <ModalEditarMetodoPago
      show={showEditarModal}
      onClose={() => setShowEditarModal(false)}
      metodoPago={metodoSeleccionado}
      onEdit={handleEditarMetodoPago}
    />
  </div>
);

};

export default MetodosPagoSection;
