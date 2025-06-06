import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ModalRegistrarSalida from './ModalRegistrarSalida';
import './stylesSalida.css';

function ListaSalidas() {
  const [salidas, setSalidas] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    fetchSalidas();
  }, []);

  const fetchSalidas = async () => {
    try {
      const response = await axios.get('http://localhost:5002/api/salidas');
      setSalidas(response.data);
    } catch (error) {
      console.error('Error al obtener las salidas:', error);
    }
  };

  const salidasFiltradas = salidas.filter((salida) =>
    salida.TipoSalida.toLowerCase().includes(busqueda.toLowerCase()) ||
    salida.FechaSalida.toLowerCase().includes(busqueda.toLowerCase())
  );

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="salida-main-content">
      <h1 className="salida-titulo-pago">Salidas de Inventario</h1>

      <div className="salida-acciones-top">
        <input
          type="text"
          placeholder="Buscar por tipo o fecha..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="salida-buscador-input"
        />
        <button className="salida-btn-agregar" onClick={openModal}>
          Agregar Salida
        </button>
      </div>

      <div className="salida-tabla-container">
        <div className="salida-tabla-wrapper">
          <table className="salida-tabla">
            <thead>
              <tr>
                <th>Tipo de Salida</th>
                <th>Cantidad</th>
                <th>Fecha</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {salidasFiltradas.length > 0 ? (
                salidasFiltradas.map((salida) => (
                  <tr key={salida.ID_Salida}>
                    <td>{salida.TipoSalida}</td>
                    <td>{salida.Cantidad}</td>
                    <td>{new Date(salida.FechaSalida).toLocaleDateString()}</td>
                    <td>{salida.Total}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No se encontraron resultados.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="salida-modal">
          <div className="salida-modal-content">
            <div className="salida-modal-header">
              <h2>Registrar Salida</h2>
              <span className="salida-close" onClick={closeModal}>&times;</span>
            </div>
            <ModalRegistrarSalida 
              fetchSalidas={fetchSalidas} 
              onClose={closeModal} 
              show={isModalOpen}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ListaSalidas;
