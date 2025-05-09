import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ModalRegistrarSalida from './ModalRegistrarSalida';

function ListaSalidas() {
  const [salidas, setSalidas] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="main-content">
      <h2>Historial de Salidas de Inventario</h2>
      <button onClick={openModal}>Agregar Salida</button>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="btn-cerrar-modal" onClick={closeModal}>Cerrar</button>
            <ModalRegistrarSalida fetchSalidas={fetchSalidas} closeModal={closeModal} />
          </div>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>ID Salida</th>
            <th>Cantidad</th>
            <th>Tipo de Salida</th>
            <th>Fecha</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {salidas.map((salida) => (
            <tr key={salida.ID_Salida}>
              <td>{salida.ID_Salida}</td>
              <td>{salida.Cantidad}</td>
              <td>{salida.TipoSalida}</td>
              <td>{new Date(salida.FechaSalida).toLocaleString()}</td>
              <td>{salida.Total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ListaSalidas;



