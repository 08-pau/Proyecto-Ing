import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RegistrarSalida = ({ fetchSalidas, closeModal }) => {
  const [formDataSalida, setFormDataSalida] = useState({
    cantidad: '',
    motivo: '',
    fechaSalida: '',
    idVenta: '',
    total: '',  // Nuevo campo 'total'
  });
  const [mensaje, setMensaje] = useState('');
  const [ventas, setVentas] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormDataSalida({ ...formDataSalida, [name]: value });
  };

  useEffect(() => {
    if (formDataSalida.motivo === 'venta') {
      obtenerVentas();
    }
  }, [formDataSalida.motivo]);

  const obtenerVentas = async () => {
    try {
      const response = await axios.get('http://localhost:5002/api/ventas');
      setVentas(response.data);
    } catch (error) {
      console.error('Error al obtener las ventas:', error);
    }
  };

  const agregarSalida = async () => {
    const { cantidad, motivo, fechaSalida, total } = formDataSalida;
    
    if (!cantidad || !motivo || !fechaSalida || !total) {
      setMensaje("Por favor complete todos los campos.");
      return;
    }
    const salida = {
      cantidad,
      tipoSalida: motivo,
      fechaSalida,
      total,  // Incluye el campo total en la salida
    };
    try {
      await axios.post('http://localhost:5002/api/salidas', salida);
      setMensaje("Salida registrada exitosamente.");
      fetchSalidas();  // Refresca la lista de salidas
      // Eliminar closeModal() para que el modal no se cierre automáticamente
    } catch (error) {
      console.error('Error al registrar la salida:', error);
      setMensaje("Error al registrar la salida.");
    }
  };

  return (
    <div>
      <h3>Registrar Salida de Producto</h3>
      {mensaje && <div style={{ color: mensaje.includes('error') ? 'red' : 'green' }}>{mensaje}</div>}
      <form onSubmit={(e) => e.preventDefault()}>
        <input
          type="number"
          name="cantidad"
          placeholder="Cantidad"
          value={formDataSalida.cantidad}
          onChange={handleChange}
        />

        <select
          name="motivo"
          value={formDataSalida.motivo}
          onChange={handleChange}
        >
          <option value="">Seleccionar motivo</option>
          <option value="devolucion">Devolución</option>
          <option value="vencimiento">Vencimiento</option>
          <option value="mal estado">Mal estado</option>
        </select>

        {formDataSalida.motivo === 'venta' && (
          <>
            <select
              name="idVenta"
              value={formDataSalida.idVenta}
              onChange={handleChange}
            >
              <option value="">Seleccionar venta</option>
              {ventas.map((venta) => (
                <option key={venta.id} value={venta.id}>
                  {venta.Numero}
                </option>
              ))}
            </select>
          </>
        )}

        <input
          type="date"
          name="fechaSalida"
          value={formDataSalida.fechaSalida}
          onChange={handleChange}
        />

        <input
          type="number"
          name="total"
          placeholder="Total"
          value={formDataSalida.total}
          onChange={handleChange}
        />
        
        <button type="button" onClick={agregarSalida}>Agregar Salida</button>
        {/* Botón para cerrar manualmente */}
      
      </form>
    </div>
  );
};

export default RegistrarSalida;
