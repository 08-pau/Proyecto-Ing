// SaleDetail.js

import React from 'react';

function SaleDetail({ saleDetail, closeSaleDetail }) {
  if (!saleDetail) return null;

  return (
    <div id="sale-detail">
      <h1>Detalle de Venta</h1>
      <p><strong>Cliente:</strong> {saleDetail.customer}</p>
      <p><strong>Documento:</strong> {saleDetail.document}</p>
      <p><strong>Número de Venta:</strong> {saleDetail.number}</p>
      {/* Aquí se mostrarán los detalles de la venta */}
      <button onClick={closeSaleDetail}>Cerrar</button>
    </div>
  );
}

export default SaleDetail;
