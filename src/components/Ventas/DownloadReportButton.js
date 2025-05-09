import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const DownloadReportButton = ({ ventaSeleccionada }) => {
  const [ventaData, setVentaData] = useState(null);

  useEffect(() => {
    const fetchVenta = async () => {
      if (!ventaSeleccionada) return;

      try {
        const response = await fetch(`http://localhost:5002/factura/${ventaSeleccionada.ID_Venta}`);
        if (response.ok) {
          const data = await response.json();
          setVentaData(data);
        } else {
          console.error('Error al obtener los datos de la venta:', response.statusText);
        }
      } catch (error) {
        console.error('Error al hacer la solicitud:', error);
      }
    };

    fetchVenta();
  }, [ventaSeleccionada]);

  const generatePDF = () => {
    if (!ventaData) {
      console.error("No hay datos de la venta para generar el PDF.");
      return;
    }

    const doc = new jsPDF();

    // Titulo de la factura
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('FACTURA DE VENTA', 105, 15, null, null, 'center');

    // Información de cabecera (alineada a la izquierda y derecha)
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`Número de Venta: ${ventaData.Numero}`, 10, 30);
    doc.text(`Fecha: ${new Date(ventaData.Fecha).toLocaleDateString()}`, 10, 36);
    doc.text(`Cliente: ${ventaData.Cliente}`, 10, 42);

    // Mover "Método de Pago" y "Atendido por" a la derecha
    doc.text(`Método de Pago: ${ventaData.MetodoPago}`, 150, 30);
    doc.text(`Atendido por: ${ventaData.Usuario}`, 150, 36);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Detalle de Productos', 10, 55);

    // Detalle de productos
    const productRows = [];
    ventaData.Productos?.forEach(item => {
      productRows.push([
        item.Cantidad,
        item.Nombre,
        `${Number(item.Precio).toFixed(0)}`,
        `${Number(item.Impuesto || 0).toFixed(0)}`,
        `${Number(item.Total).toFixed(0)}`
      ]);

      // Agregar detalle de promociones si existe
      if (item.DescripcionPromocion) {
        productRows.push([
          '',
          `Promoción: ${item.DescripcionPromocion}`,
          '', '', ''
        ]);
      }
    });

    doc.autoTable({
      startY: 60,
      head: [['Cant', 'Producto', 'Unitario', 'Impuesto', 'Total']],
      body: productRows.length > 0 ? productRows : [['', 'Sin productos', '', '', '']],
      theme: 'striped',
      styles: { fontSize: 10, cellPadding: 2 },
      headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] },
      margin: { left: 10, right: 10 }
    });

    let finalY = doc.lastAutoTable.finalY + 10;

    // Resumen de pago
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Resumen de Pago', 10, finalY);

    doc.autoTable({
      startY: finalY + 4,
      head: [['Concepto', 'Monto']],
      body: [
        ['Subtotal', `${Number(ventaData.Subtotal).toFixed(0)}`],
        ['Descuento', `-${Number(ventaData.Descuento || 0).toFixed(0)}`],
        ['Impuesto Total', `${Number(ventaData.Impuesto).toFixed(0)}`],
        ['Total a Pagar', `${Number(ventaData.Total).toFixed(0)}`]
      ],
      theme: 'plain',
      styles: { fontSize: 10 },
      margin: { left: 10, right: 10 }
    });

    finalY = doc.lastAutoTable.finalY + 15;

    // Mensaje de agradecimiento
    doc.setFontSize(12);
    doc.setFont('helvetica', 'italic','bold');
    doc.text('Gracias por tu compra', 105, finalY, null, null, 'center'); // Centrado y en cursiva

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Valoramos mucho tu preferencia. ¡Esperamos verte pronto de nuevo!', 105, finalY + 6, null, null, 'center');

    // Guardar el archivo PDF
    doc.save(`factura_venta_${ventaData.ID_Venta}.pdf`);
  };

  return (
    <button 
      className="btn btn-download-factura" 
      onClick={generatePDF}
      disabled={!ventaData}
    >
      Descargar Factura PDF
    </button>
  );
};

export default DownloadReportButton;
