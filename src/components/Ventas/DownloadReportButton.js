import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generarFacturaPDF = async (ventaSeleccionada) => {
  if (!ventaSeleccionada || !ventaSeleccionada.ID_Venta) return;

  try {
    const response = await fetch(`http://localhost:5002/factura/${ventaSeleccionada.ID_Venta}`);
    if (!response.ok) throw new Error('Error al obtener los datos de la venta.');

    const ventaData = await response.json();

    const doc = new jsPDF();

    // Título
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('FACTURA DE VENTA', 105, 15, null, null, 'center');

    // 🔴 Sello ANULADA (si corresponde)
    if (ventaData.Estado === 0) {
      doc.setTextColor(255, 0, 0);
      doc.setFontSize(40);
      doc.text('ANULADA', 105, 100, { align: 'center', angle: 45 }); // Inclinado en diagonal
      doc.setTextColor(0, 0, 0); // Volver a negro
    }

    // Datos generales
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Número de Venta: ${ventaData.Numero}`, 10, 30);
    doc.text(`Fecha: ${new Date(ventaData.Fecha).toLocaleDateString()}`, 10, 36);
    doc.text(`Cliente: ${ventaData.Cliente}`, 10, 42);
    doc.text(`Método de Pago: ${ventaData.MetodoPago}`, 150, 30);
    doc.text(`Atendido por: ${ventaData.Usuario}`, 150, 36);
    doc.text(`Estado: ${ventaData.Estado === 1 ? 'Procesada' : 'Anulada'}`, 150, 42);

    // Detalle productos
    doc.setFontSize(12);
    doc.text('Detalle de Productos', 10, 55);

    const productRows = [];
    ventaData.Productos?.forEach(item => {
      productRows.push([
        item.Cantidad,
        item.Nombre,
        `${Number(item.Precio).toFixed(0)}`,
        `${Number(item.Impuesto || 0).toFixed(0)}`,
        `${Number(item.Total).toFixed(0)}`
      ]);
      if (item.DescripcionPromocion) {
        productRows.push(['', `Promoción: ${item.DescripcionPromocion}`, '', '', '']);
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

    // Mensaje final
    doc.setFontSize(12);
    doc.setFont('helvetica', 'italic', 'bold');
    doc.text('Gracias por tu compra', 105, finalY, null, null, 'center');

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Valoramos mucho tu preferencia. ¡Esperamos verte pronto de nuevo!', 105, finalY + 6, null, null, 'center');

    doc.save(`factura_venta_${ventaData.ID_Venta}.pdf`);
  } catch (error) {
    console.error('Error al generar el PDF:', error.message);
  }
};
