// SaleDetail.js

import React from 'react';
import './stylesVentas.css';
function SaleDetail({ saleDetail, closeSaleDetail }) {
  if (!saleDetail) return null;

<div className="venta-detalle">
  <div className="venta-detalle-contenido">
    <div className="venta-detalle-header">
      <h2 className="venta-detalle-titulo">Detalles de la Venta</h2>
      <button className="venta-detalle-cerrar" onClick={closeSaleDetail}>
        Cerrar
      </button>
    </div>

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
        {saleDetail.detalles.map((detalle, i) => (
          <tr key={i}>
            <td>{detalle.ID_Producto}</td>
            <td>{detalle.Cantidad}</td>
            <td>{parseFloat(detalle.PrecioUnitario).toFixed(2)}</td>
            <td>{parseFloat(detalle.Subtotal).toFixed(2)}</td>
            <td>{parseFloat(detalle.Total).toFixed(2)}</td>
            <td>{parseFloat(detalle.Impuesto).toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>


}

export default SaleDetail;
