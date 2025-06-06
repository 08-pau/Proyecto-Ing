import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ModalRegistrarEntrada from './ModalRegistrarEntrada';
import './stylesEntrada.css';

function ListaEntradas() {
  const [entradas, setEntradas] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    fetchEntradas();
  }, []);

  const fetchEntradas = async () => {
    try {
      const response = await axios.get('http://localhost:5002/api/entradas');
      setEntradas(response.data);
    } catch (error) {
      console.error('Error al obtener las entradas:', error);
    }
  };

  const entradasFiltradas = entradas.filter((entrada) =>
    entrada.Motivo.toLowerCase().includes(busqueda.toLowerCase()) ||
    entrada.FechaEntrada.toLowerCase().includes(busqueda.toLowerCase())
  );

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="entrada-main-content">
      <h1 className="entrada-titulo">Entradas de Inventario</h1>

      <div className="entrada-acciones-top">
        <input
          type="text"
          placeholder="Buscar por motivo o fecha..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="entrada-buscador-input"
        />
        <button className="entrada-btn-agregar" onClick={openModal}>
          Agregar Entrada
        </button>
      </div>

      <div className="entrada-tabla-container">
        <div className="entrada-tabla-wrapper">
          <table className="entrada-tabla">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Motivo</th>
                <th>Fecha</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {entradasFiltradas.length > 0 ? (
                entradasFiltradas.map((entrada) => (
                  <tr key={entrada.ID_Entrada}>
                    <td>{entrada.NombreProducto}</td>
                    <td>{entrada.Cantidad}</td>
                    <td>{entrada.Motivo}</td>
                    <td>{new Date(entrada.FechaEntrada).toLocaleDateString()}</td>
                    <td>{entrada.Total}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No se encontraron resultados.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="entrada-modal">
          <div className="entrada-modal-content">
            <div className="entrada-modal-header">
              <h2>Registrar Entrada</h2>
              <span className="entrada-close" onClick={closeModal}>&times;</span>
            </div>
            <ModalRegistrarEntrada
              fetchEntradas={fetchEntradas}
              onClose={closeModal}
              show={isModalOpen}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ListaEntradas;
