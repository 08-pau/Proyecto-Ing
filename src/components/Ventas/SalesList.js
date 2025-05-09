import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DetalleVenta from './DetalleVenta';
import ModalAgregarVenta from './ModalAgregarVenta';
import ModalConfirmarEliminar from './ModalConfirmarEliminar';
import DownloadReportButton from './DownloadReportButton';

const Ventas = () => {
  const [ventas, setVentas] = useState([]);
  const [showDetallesModal, setShowDetallesModal] = useState(false);
  const [idVentaDetalles, setIdVentaDetalles] = useState(null);
  const [showAgregarModal, setShowAgregarModal] = useState(false);
  const [showEliminarModal, setShowEliminarModal] = useState(false);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    fetchVentas();
  }, []);

  const fetchDetallesVenta = async (idVenta) => {
    try {
      const response = await axios.get(`http://localhost:5002/api/detalles_venta/${idVenta}`);
      console.log('Detalles de venta:', response.data);
    } catch (error) {
      console.error('Error fetching sale details:', error.response ? error.response.data : error.message);
      setMensaje('Hubo un error al cargar los detalles de la venta.');
    }
  };

  // Función para obtener las ventas
  const fetchVentas = async () => {
    setCargando(true);
    try {
      const response = await axios.get('http://localhost:5002/api/Verventas');
      setVentas(response.data);
    } catch (error) {
      setMensaje('Error al obtener ventas.');
      console.error('Error fetching ventas:', error);
    } finally {
      setCargando(false);
    }
  };

  const handleAgregarVenta = async (nuevaVenta) => {
    try {
      await axios.post('http://localhost:5002/api/ventas', nuevaVenta);
      fetchVentas();
      setShowAgregarModal(false);
      setMensaje('Venta agregada exitosamente.');
    } catch (error) {
      setMensaje('Error al agregar venta.');
      console.error('Error adding venta:', error);
    }
  };

  const eliminarVenta = async (id) => {
    try {
      await axios.delete(`http://localhost:5002/api/ventas/${id}`);
      fetchVentas();
      setShowEliminarModal(false);
      setMensaje('Venta eliminada exitosamente.');
    } catch (error) {
      setMensaje('Error al eliminar venta.');
      console.error('Error deleting venta:', error);
    }
  };

  const openEliminarModal = (venta) => {
    setVentaSeleccionada(venta);
    setShowEliminarModal(true);
  };

  const seleccionarVentaParaReporte = (venta) => {
    setVentaSeleccionada(venta); // Solo seleccionamos una venta para el reporte
  };

  return (
    <div className="main-content">
      <h1>Ventas</h1>
      <button onClick={() => setShowAgregarModal(true)}>Agregar Venta</button>

      {mensaje && <p>{mensaje}</p>}

      <table>
        <thead>
          <tr>
            <th>ID Venta</th>
            <th>Numero</th>
            <th>Fecha</th>
            <th>Cliente</th>
            <th>Usuario</th>
            <th>Metodo de pago</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ventas.length > 0 ? (
            ventas.map((venta) => (
              <tr key={venta.ID_Venta}>
                <td>{venta.ID_Venta}</td>
                <td>{venta.Numero}</td>
                <td>{venta.Fecha}</td>
                <td>{venta.ID_Cliente}</td>
                <td>{venta.ID_Usuario}</td>
                <td>{venta.ID_Metodo_Pago}</td>
                <td>
                  <button onClick={() => {
                    setIdVentaDetalles(venta.ID_Venta);
                    setShowDetallesModal(true);
                    fetchDetallesVenta(venta.ID_Venta);
                  }}>
                    Ver Detalles
                  </button>

                  <button onClick={() => seleccionarVentaParaReporte(venta)}>Generar Reporte</button>

                  <button onClick={() => openEliminarModal(venta)}>Eliminar</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No hay ventas disponibles.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Botón para descargar reporte */}
      {ventaSeleccionada && (
  <DownloadReportButton
    ventaSeleccionada={ventaSeleccionada} // Pasa correctamente la venta seleccionada
  />
)}


      {/* Modales */}
      <ModalAgregarVenta
        show={showAgregarModal}
        onClose={() => setShowAgregarModal(false)}
        onAdd={handleAgregarVenta}
      />
      {showDetallesModal && idVentaDetalles && (
        <DetalleVenta
          idVenta={idVentaDetalles}
          show={showDetallesModal}
          onClose={() => setShowDetallesModal(false)}
        />
      )}

      {ventaSeleccionada && (
        <ModalConfirmarEliminar
          show={showEliminarModal}
          onClose={() => setShowEliminarModal(false)}
          onDelete={() => eliminarVenta(ventaSeleccionada.ID_Venta)}
          mensaje={`¿Estás seguro de eliminar la venta número ${ventaSeleccionada.Numero}?`}
        />
      )}
    </div>
  );
};

export default Ventas;
