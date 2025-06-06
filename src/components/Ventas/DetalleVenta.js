// DetalleVenta.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
const DetalleVenta = ({ idVenta, onClose, show }) => {
  const [detalles, setDetalles] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const fetchDetalles = async () => {
      setCargando(true);
      try {
        const response = await axios.get(`http://localhost:5002/api/detalles_venta/${idVenta}`);
        setDetalles(response.data);
      } catch (error) {
        setMensaje('Error al obtener detalles de la venta.');
        console.error('Error fetching sale details:', error);
      } finally {
        setCargando(false);
      }
    };

    if (idVenta) {
      fetchDetalles();
    }
  }, [idVenta]);

  const formatNumber = (num) => {
    // Asegúrate de convertir el valor a número flotante antes de aplicar toFixed
    const parsedNum = parseFloat(num);
    return !isNaN(parsedNum) ? parsedNum.toFixed(2) : '0.00';
  };
  
  return(

 <div className="venta-modal" style={{ display: show ? 'flex' : 'none' }}>
  <div className="venta-modal-content">
    <div className="venta-modal-header">
      <h2>Detalles de la Venta</h2>
      <span className="venta-close" onClick={onClose}>&times;</span>
    </div>

    {cargando ? (
      <p className="venta-detalle-mensaje">Cargando...</p>
    ) : mensaje ? (
      <p className="venta-detalle-mensaje">{mensaje}</p>
    ) : (
      <table className="venta-detalle-tabla">
        <thead>
          <tr>
            <th>ID Producto</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Subtotal</th>
            <th>Total</th>
            <th>Impuesto</th>
          </tr>
        </thead>
        <tbody>
          {detalles.length > 0 ? (
            detalles.map((detalle) => (
              <tr key={detalle.ID_Detalle_Venta}>
                <td>{detalle.ID_Producto}</td>
                <td>{detalle.Cantidad}</td>
                <td>{formatNumber(detalle.Precio)}</td>
                <td>{formatNumber(detalle.Subtotal)}</td>
                <td>{formatNumber(detalle.Total)}</td>
                <td>{formatNumber(detalle.Impuesto)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No hay detalles disponibles para esta venta.</td>
            </tr>
          )}
        </tbody>
      </table>
    )}
  </div>
</div>
);
};

export default DetalleVenta;
