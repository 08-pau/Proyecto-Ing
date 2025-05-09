// src/components/Compras/DownloadReportButton.js
import React from 'react';
import jsPDF from 'jspdf';

const DownloadReportButton = ({ data }) => {
    const generatePDF = () => {
        const doc = new jsPDF();

        doc.text('Detalle de Compra', 10, 10);
        doc.text(`Proveedor: ${data.supplierName}`, 10, 20);
        doc.text(`Documento: ${data.document}`, 10, 30);
        doc.text(`Número de Compra: ${data.purchaseNumber}`, 10, 40);

        let startY = 50;
        data.items.forEach((item, index) => {
            doc.text(`Producto: ${item.product}`, 10, startY);
            doc.text(`Precio: $${item.price}`, 10, startY + 10);
            doc.text(`Descuento: ${item.discount}%`, 10, startY + 20);
            doc.text(`Cantidad: ${item.quantity}`, 10, startY + 30);
            doc.text(`Subtotal: $${item.subTotal}`, 10, startY + 40);
            startY += 50;
        });

        doc.text(`Total: $${data.total}`, 10, startY);
        doc.text(`Impuesto: $${data.tax}`, 10, startY + 10);
        doc.text(`Total a Pagar: $${data.totalPay}`, 10, startY + 20);

        doc.save(`reporte_compra_${data.purchaseNumber}.pdf`);
    };

    return (
        <button className="download-button" onClick={generatePDF}>
            Descargar PDF
        </button>
    );
};

export default DownloadReportButton;
