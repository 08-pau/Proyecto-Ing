const express = require('express');
const app = express();
const mysql = require('mysql2');

const cors = require('cors');
const port = 5002; // Cambia esto
app.use(express.json());
app.use(cors());
// Configuración de la base de datos
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'isa28pau08',
  database: 'belltch__inventory',
});
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});
app.get('/api/roles', (req, res) => {
  const query = 'SELECT * FROM roles';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error retrieving roles:', err.message);
      return res.status(500).json({ message: 'Error retrieving roles', error: err.message });
    }
    console.log("Roles obtenidos:", results); // Log para verificar los roles obtenidos
    res.json(results);
  });
});

// Ruta para agregar un rol
app.post('/api/roles', (req, res) => {
  const { descripcion, nombreRol } = req.body;

  const query = 'INSERT INTO roles (descripcion, nombreRol) VALUES (?, ?)';

  db.query(query, [descripcion, nombreRol], (err, result) => {
    if (err) {
      console.error('Error inserting role:', err);
      return res.status(500).send('Error inserting role');
    }
    res.status(201).send('Role added successfully');
  });
});
// Ruta para actualizar un rol
app.put('/api/roles/:id', (req, res) => {
  const id = req.params.id;
  console.log(req.body); // Esto te permitirá ver lo que se está enviando al servidor.

  if (!id || isNaN(id)) {
    return res.status(400).json({ error: 'ID de rol es requerido y debe ser un número.' });
  }

  const { nombreRol, descripcion } = req.body;

  if (!nombreRol || !descripcion) {
    return res.status(400).json({ error: 'Todos los campos son requeridos.' });
  }

  const query = `UPDATE roles SET nombreRol = ?, descripcion = ? WHERE id = ?`;
  const values = [nombreRol, descripcion, id];

  db.query(query, values, (err) => {
    if (err) {
      console.error('Error updating role:', err);
      return res.status(500).json({ error: 'Error al actualizar rol.' });
    }
    res.status(200).json({ message: 'Rol actualizado exitosamente.' });
  });
});
// Ruta para actualizar el estado de un rol (activo/inactivo)
app.put('/api/roles/:id/status', (req, res) => {
  const { id } = req.params;
  const { activo } = req.body; // espera un valor 1 (activo) o 0 (inactivo)

  const query = 'UPDATE roles SET activo = ? WHERE id = ?';

  db.query(query, [activo, id], (err, result) => {
    if (err) {
      console.error('Error updating role status:', err);
      return res.status(500).send('Error updating role status');
    }
    if (result.affectedRows > 0) {
      res.status(200).send('Role status updated successfully');
    } else {
      res.status(404).send('Role not found');
    }
  });
});
app.put('/api/ventas/estado/:idVenta', (req, res) => {
  const idVenta = req.params.idVenta;
  const { estado } = req.body; // 1 = procesar, 0 = anular

  // Cambiar el estado de la venta
  const updateVentaQuery = `UPDATE ventas SET estado = ? WHERE ID_Venta = ?`;
  db.query(updateVentaQuery, [estado, idVenta], (err, result) => {
    if (err) {
      console.error('Error al actualizar el estado de la venta:', err);
      return res.status(500).json({ message: 'Error al actualizar el estado de la venta.' });
    }

    // Obtener detalles de la venta
    const selectDetallesQuery = `SELECT ID_Producto, Cantidad FROM detalles_venta WHERE ID_Venta = ?`;
    db.query(selectDetallesQuery, [idVenta], (errDetalles, detalles) => {
      if (errDetalles) {
        console.error('Error al obtener los detalles de la venta:', errDetalles);
        return res.status(500).json({ message: 'Estado actualizado pero error al obtener detalles.' });
      }

      // Armar todas las consultas para actualizar el stock
      const stockQueries = detalles.map(({ ID_Producto, Cantidad }) => {
        const operacion = estado === 1 ? '-' : '+'; // restar si se procesa, sumar si se anula
        return new Promise((resolve, reject) => {
          const query = `UPDATE productos SET Stock = Stock ${operacion} ? WHERE ID_Producto = ?`;
          db.query(query, [Cantidad, ID_Producto], (errUpdate) => {
            if (errUpdate) {
              reject(errUpdate);
            } else {
              resolve();
            }
          });
        });
      });

      // Ejecutar todas las actualizaciones de stock
      Promise.all(stockQueries)
        .then(() => {
          res.status(200).json({ message: `Venta ${estado === 1 ? 'procesada' : 'anulada'} y stock actualizado.` });
        })
        .catch((errStock) => {
          console.error('Error actualizando el stock:', errStock);
          res.status(500).json({ message: 'Estado actualizado pero error al actualizar el stock.' });
        });
    });
  });
});




// Ruta para eliminar un rol
app.delete('/api/roles/:id', (req, res) => {
  const id = req.params.id;
  
  db.query('DELETE FROM roles WHERE id = ?', [id], (err) => {
    if (err) {
      console.error('Error deleting role:', err);
      return res.status(500).send('Error deleting role');
    }
    res.send('Role deleted successfully');
  });
});

// Obtener roles usando sólo callbacks, sin promesas
// Ruta para obtener todos los roles
app.get('/api/obtenerRoles', (req, res) => {
  const sql = 'SELECT id, nombreRol FROM roles WHERE activo = 1';

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error al recuperar roles activos:', err);
      return res.status(500).json({ error: 'Error al recuperar roles' });
    }
    res.json(results); // ✅ Solo devuelve roles activos
  });
});



// Ruta para obtener todos los impuestos
app.get('/api/obtenerImpuestos', (req, res) => {
  db.query('SELECT ID_Impuesto, Nombre, Porcentaje FROM impuestos', (err, results) => {
    if (err) {
      console.error('Error al recuperar impuestos:', err);
      return res.status(500).json({ error: 'Error al recuperar impuestos' });
    }
    res.json(results);
  });
});
// Ruta para obtener todos los proveedores
app.get('/api/obtenerProveedores', (req, res) => {
  db.query('SELECT ID_Proveedor, Nombre FROM proveedores', (err, results) => {
    if (err) {
      console.error('Error al recuperar proveedores:', err);
      return res.status(500).json({ error: 'Error al recuperar proveedores' });
    }
    res.json(results);
  });
});

// Ruta para obtener todas las categorías
app.get('/api/obtenerCategorias', (req, res) => {
  db.query('SELECT ID_Categoria, Nombre FROM categorías', (err, results) => {
    if (err) {
      console.error('Error al recuperar categorías:', err);
      return res.status(500).json({ error: 'Error al recuperar categorías' });
    }
    res.json(results);
  });
});



// Ruta para obtener los tipos de promociones
app.get('/api/obtenerTiposPromociones', (req, res) => {
  db.query('SELECT ID_Tipo_Promocion, Descripcion FROM tipo_promocion', (err, results) => {
    if (err) {
      console.error('Error al recuperar tipos de promociones:', err);
      return res.status(500).json({ error: 'Error al recuperar los tipos de promociones' });
    }
    res.json(results);
  });
});

app.post('/api/agregarDescuento', async (req, res) => {
  const { ID_Promocion, Porcentaje_Descuento } = req.body;
  const query = 'INSERT INTO descuentos (ID_Promocion, Porcentaje_Descuento) VALUES (?, ?)';
  
  try {
    const result = await db.query(query, [ID_Promocion, Porcentaje_Descuento]);
    res.status(201).json({ message: 'Descuento agregado exitosamente' });
  } catch (error) {
    console.error('Error al agregar descuento:', error);
    res.status(500).json({ message: 'Error al agregar descuento' });
  }
});
// Endpoint para obtener la lista de productos
app.get('/api/obtenerProductos', (req, res) => {
  const query = 'SELECT ID_Producto, Nombre FROM productos'; // Asegúrate de que esta consulta sea correcta
  db.query(query, (error, results) => {
    if (error) {
      console.error('Error al obtener productos:', error);
      return res.status(500).json({ error: 'Error al obtener productos' });
    }
    res.json(results);
  });
});


// Insertar un nuevo usuario (sin promesas)
app.post('/api/usuarios', (req, res) => {
  const { Nombre, Telefono, Email, Usuario, Clave, Rol, NumeroCedula, TipoDocumento, Direccion } = req.body;

  if (!Nombre || !Telefono || !Email || !Usuario || !Clave || !Rol || !NumeroCedula || !TipoDocumento || !Direccion) {
    console.log('Campos faltantes:', req.body);
    return res.status(400).json({ error: 'Todos los campos son requeridos.' });
  }

  const query = 'INSERT INTO usuarios (Nombre, Telefono, Email, Usuario, Clave, idRol, NumeroCedula, TipoDocumento, Direccion) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';

  db.query(query, [Nombre, Telefono, Email, Usuario, Clave, Rol, NumeroCedula, TipoDocumento, Direccion], (err, result) => {
    if (err) {
      // Manejo detallado de errores
      console.error('Error al insertar usuario en la base de datos:', err); // Muestra el objeto de error completo
      return res.status(500).json({ error: 'Error al agregar el usuario', details: err });
    }

    console.log('Usuario agregado exitosamente:', result);
    res.status(201).json({ message: 'Usuario agregado exitosamente.' });
  });
});

// Ruta para eliminar un producto por su ID
app.delete('/api/productos/:id', (req, res) => {
  const { id } = req.params; // Obtiene el ID del producto a eliminar
  db.query('DELETE FROM productos WHERE ID_Producto = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al eliminar el producto' });
    if (results.affectedRows === 0) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json({ message: 'Producto eliminado correctamente' });
  });
});

// Ruta para obtener todos los productos
app.get('/api/ver_productos', (req, res) => {
  db.query('SELECT * FROM productos', (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener productos' });
    res.json(results);
  });
});

// Ruta para editar un producto
app.put('/api/productos/:id', (req, res) => {
  const { id } = req.params; // Obtiene el ID del producto a editar
  const {
    Nombre,
    ID_Categoria,
    ID_Impuesto,
    Stock,
    Imagen_URL,
    Codigo,
    Precio
  } = req.body; // Desestructura el cuerpo de la solicitud

  // Consulta SQL para actualizar el producto
  db.query(
    'UPDATE productos SET Nombre = ?, ID_Categoria = ?, ID_Impuesto = ?, Stock = ?, Imagen_URL = ?, Codigo = ?, Precio = ? WHERE ID_Producto = ?',
    [Nombre, ID_Categoria, ID_Impuesto, Stock, Imagen_URL, Codigo, Precio, id],
    (err, results) => {
      if (err) return res.status(500).json({ error: 'Error al editar el producto' });
      if (results.affectedRows === 0) return res.status(404).json({ error: 'Producto no encontrado' });
      res.json({ message: 'Producto actualizado correctamente' });
    }
  );
});


// Ruta para obtener todas las compras
app.get('/api/compras', (req, res) => {
  db.query('SELECT * FROM compras', (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener compras' });
    res.json(results);
  });
});

// Ruta para obtener todos los usuarios
app.get('/api/usuarios', (req, res) => {
  db.query('SELECT * FROM usuarios', (err, results) => {
    if (err) return res.status(500).json({ error: 'Error retrieving users' });
    res.json(results);
  });
});
app.put('/api/compras/:id', (req, res) => {
  const id = req.params.id;
  const { ID_Proveedor, nombre_producto } = req.body;

  if (!ID_Proveedor || !nombre_producto) {
    return res.status(400).json({ error: 'Proveedor y producto son requeridos.' });
  }

  const query = `
    UPDATE compras 
    SET 
      ID_Proveedor = ?, 
      nombre_producto = ?
    WHERE ID_Compra = ?`;

  const values = [ID_Proveedor, nombre_producto, id];

  db.query(query, values, (err) => {
    if (err) return res.status(500).json({ error: 'Error al actualizar la compra' });
    res.status(200).json({ message: 'Compra actualizada exitosamente.' });
  });
});

app.post('/api/nueva_promocion', async (req, res) => {
  try {
      const nuevaPromocion = req.body; // Asegúrate de que esto contiene la información necesaria.
      const idGenerado = await guardarPromocion(nuevaPromocion); // Llama a la función para guardar la promoción y obtener el ID.
      
      res.status(201).json({ ID_Promocion: idGenerado, ...nuevaPromocion }); // Devuelve el ID junto con los datos de la promoción.
  } catch (error) {
      console.error('Error al guardar la promoción:', error);
      res.status(500).json({ message: 'Error al guardar la promoción.' });
  }
});


app.put('/api/usuarios/:id', (req, res) => {
  const id = req.params.id;
  const { Nombre, Telefono, Email, Direccion } = req.body;

  if (!Nombre || !Telefono || !Email || !Direccion) {
    return res.status(400).json({ error: 'Todos los campos son requeridos.' });
  }

  const query = 'UPDATE usuarios SET Nombre = ?, Telefono = ?, Email = ?, Direccion = ? WHERE ID_Usuario = ?';
  const values = [Nombre, Telefono, Email, Direccion, id];

  db.query(query, values, (err) => {
    if (err) return res.status(500).json({ error: 'Error updating user' });
    res.status(200).json({ message: 'Usuario actualizado exitosamente.' });
  });
});

// Ruta para eliminar un usuario
app.delete('/api/usuarios/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM usuarios WHERE ID_Usuario = ?', [id], (err) => {
    if (err) return res.status(500).send('Error deleting user');
    res.send('User deleted successfully');
  });
});

// Ruta para agregar una categoría
app.post('/api/categorias', (req, res) => {
  const { Nombre, Descripcion, Tipo_Familia, Segmento, Subsegmento, Marca_Preferida, Presentacion_Producto } = req.body;

  // Validar que los campos requeridos no sean undefined
  if (!Nombre || !Tipo_Familia || !Segmento) {
      return res.status(400).json({ error: 'Nombre, Tipo_Familia y Segmento son requeridos.' });
  }

  const query = `
      INSERT INTO categorías (Nombre, Descripcion, Tipo_Familia, Segmento, Subsegmento, Marca_Preferida, Presentacion_Producto) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [Nombre, Descripcion, Tipo_Familia, Segmento, Subsegmento, Marca_Preferida, Presentacion_Producto], (err, result) => {
      if (err) {
          console.error('Error inserting category:', err);
          return res.status(500).json({ error: 'Error inserting category' });
      }
      res.status(201).json({ message: 'Category added successfully' });
  });
});

app.post('/api/verificarCorreo', (req, res) => {
  const { email } = req.body;

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Correo inválido' });
  }

  const correoLimpio = email.trim().toLowerCase();

  db.query(
    'SELECT ID_Usuario FROM usuarios WHERE LOWER(TRIM(Email)) = ?',
    [correoLimpio],
    (err, results) => {
      if (err) {
        console.error('Error verificando correo:', err);
        return res.status(500).json({ error: 'Error del servidor' });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: 'Correo no registrado' });
      }

      res.json({ success: true, userId: results[0].ID_Usuario });
    }
  );
});


app.post('/api/cambiarClave', (req, res) => {
  const { userId, nuevaClave } = req.body;

  db.query('UPDATE usuarios SET Clave = ? WHERE ID_Usuario = ?', [nuevaClave, userId], (err, result) => {
    if (err) {
      console.error('Error actualizando clave:', err);
      return res.status(500).json({ error: 'Error del servidor' });
    }

    res.json({ success: true, message: 'Contraseña actualizada correctamente' });
  });
});

app.post('/api/compras', (req, res) => {
  const {
    ID_Proveedor,
    ID_Producto,
    cantidad_comprada,
    precio_unitario,
    subtotal,
    impuesto,
    total_final,
    fecha_compra
  } = req.body;

  if (
    !ID_Proveedor ||
    !ID_Producto ||
    isNaN(Number(cantidad_comprada)) ||
    isNaN(Number(precio_unitario)) ||
    !subtotal ||
    !impuesto ||
    !total_final ||
    !fecha_compra
  ) {
    return res.status(400).json({ error: 'Todos los campos son requeridos y válidos.' });
  }

  const cantidad = parseInt(cantidad_comprada, 10);

  db.beginTransaction((err) => {
    if (err) return res.status(500).json({ error: 'Error al iniciar transacción.' });

    const queryCompra = `
      INSERT INTO compras 
      (ID_Proveedor, ID_Producto, cantidad_comprada, precio_unitario, subtotal, impuesto, total_final, fecha_compra)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const valoresCompra = [
      ID_Proveedor, ID_Producto, cantidad,
      precio_unitario, subtotal, impuesto, total_final, fecha_compra
    ];

    db.query(queryCompra, valoresCompra, (err) => {
      if (err) {
        return db.rollback(() => res.status(500).json({ error: 'Error al registrar la compra.' }));
      }

      const queryActualizarStock = `
        UPDATE productos SET Stock = Stock + ? WHERE ID_Producto = ?
      `;

      db.query(queryActualizarStock, [cantidad, ID_Producto], (err) => {
        if (err) {
          return db.rollback(() => res.status(500).json({ error: 'Error al actualizar stock.' }));
        }

        // 👉 INSERT en tabla ENTRADAS con motivo 'compra'
        const totalEntrada = cantidad * precio_unitario;
        const queryEntrada = `
          INSERT INTO entradas 
          (ID_Producto, Cantidad, PrecioUnitario, Total, Motivo, FechaEntrada)
          VALUES (?, ?, ?, ?, ?, ?)
        `;

        db.query(queryEntrada, [
          ID_Producto,
          cantidad,
          precio_unitario,
          totalEntrada,
          'compra',
          fecha_compra
        ], (err) => {
          if (err) {
            return db.rollback(() => res.status(500).json({ error: 'Error al registrar entrada.' }));
          }

          db.commit((err) => {
            if (err) {
              return db.rollback(() => res.status(500).json({ error: 'Error al finalizar transacción.' }));
            }

            res.status(201).json({ mensaje: 'Compra, entrada y stock registrados correctamente.' });
          });
        });
      });
    });
  });
});




// Ruta para obtener todas las categorías
app.get('/api/categorias', (req, res) => { 
  const query = 'SELECT * FROM `categorías`'; // Usa backticks para nombres de tablas con caracteres especiales
  
  db.query(query, (err, results) => {
      if (err) {
          console.error('Error retrieving categories:', err.message);
          return res.status(500).json({ message: 'Error retrieving categories', error: err.message });
      }
      res.json(results);
  });
});

// Ruta para actualizar una categoría
app.put('/api/categorias/:id', (req, res) => {
  const id = req.params.id;

  // Validar que el ID no sea undefined o vacío
  if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'ID de categoría es requerido y debe ser un número.' });
  }

  const { Nombre, Descripcion, Tipo_Familia, Segmento, Subsegmento, Marca_Preferida, Presentacion_Producto } = req.body;

  // Validar que los campos requeridos no sean undefined
  if (!Nombre || !Tipo_Familia || !Segmento) {
      return res.status(400).json({ error: 'Nombre, Tipo_Familia y Segmento son requeridos.' });
  }

  const query = `UPDATE \`categorías\` SET Nombre = ?, Descripcion = ?, Tipo_Familia = ?, Segmento = ?, Subsegmento = ?, Marca_Preferida = ?, Presentacion_Producto = ? WHERE ID_Categoria = ?`;
  const values = [Nombre, Descripcion, Tipo_Familia, Segmento, Subsegmento, Marca_Preferida, Presentacion_Producto, id];

  db.query(query, values, (err) => {
      if (err) {
          console.error('Error updating category:', err);
          return res.status(500).json({ error: 'Error al actualizar categoría.' });
      }
      res.status(200).json({ message: 'Categoría actualizada exitosamente.' });
  });
});

// Ruta para eliminar una categoría
app.delete('/api/categorias/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM `categorías` WHERE ID_Categoria = ?'; // Usa backticks para nombres de tablas con caracteres especiales
  
  db.query(query, [id], (err) => {
      if (err) {
          console.error('Error deleting category:', err);
          return res.status(500).send('Error deleting category');
      }
      res.send('Categoría eliminada exitosamente');
  });
});



  
// Ruta para agregar un proveedor
app.post('/api/proveedores', (req, res) => {
  const { Nombre, Direccion, Telefono, Email, Frecuencia_Visita, Tipo_Documento, Numero_Documento } = req.body;

  const query = 'INSERT INTO proveedores (Nombre, Direccion, Telefono, Email, Frecuencia_Visita, Tipo_Documento, Numero_Documento) VALUES (?, ?, ?, ?, ?, ?, ?)';

  db.query(query, [Nombre, Direccion, Telefono, Email, Frecuencia_Visita, Tipo_Documento, Numero_Documento], (err, result) => {
    if (err) {
      console.error('Error inserting provider:', err);
      return res.status(500).send('Error inserting provider');
    }
    res.status(201).send('Provider added successfully');
  });
});
// Ejemplo en el backend
app.put('/api/productos/:idProducto/actualizar-inventario', async (req, res) => {
  const { idProducto } = req.params;
  const { cantidadVendida } = req.body;

  try {
    // Encuentra el producto por su ID
    const producto = await Producto.findByPk(idProducto);
    if (producto) {
      // Resta la cantidad vendida de la cantidad actual
      producto.cantidadActual -= cantidadVendida;
      await producto.save();
      res.status(200).json({ mensaje: 'Inventario actualizado correctamente' });
    } else {
      res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
  } catch (error) {
    console.error('Error al actualizar el inventario:', error);
    res.status(500).json({ mensaje: 'Error al actualizar el inventario' });
  }
});


// Ruta para agregar un nuevo cliente
app.post('/api/clientes', (req, res) => {
  const { Nombre, Telefono, Email, Tipo_Documento, Numero_Documento, Direccion } = req.body;
  
  // Validar que los campos requeridos no sean undefined o estén vacíos
  if (!Nombre || !Telefono || !Email || !Tipo_Documento || !Numero_Documento || !Direccion) {
      return res.status(400).json({ error: 'Todos los campos son requeridos.' });
  }

  const query = `INSERT INTO clientes (Nombre, Telefono, Email, Tipo_Documento, Numero_Documento, Direccion) VALUES (?, ?, ?, ?, ?, ?)`;
  const values = [Nombre, Telefono, Email, Tipo_Documento, Numero_Documento, Direccion];

  db.query(query, values, (err, result) => {
      if (err) {
          console.error('Error adding client:', err);
          return res.status(500).json({ error: 'Error al agregar cliente.' });
      }
      res.status(201).json({ message: 'Cliente agregado exitosamente.', clientId: result.insertId });
  });
});

  // Ruta para obtener todos los clientes
  app.get('/api/clientes', (req, res) => {
    const query = 'SELECT * FROM clientes';
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error retrieving clients:', err.message);
            return res.status(500).json({ message: 'Error retrieving clients', error: err.message });
        }
        res.json(results);
    });
  });

  app.post('/api/detalles-venta', async (req, res) => {
  const {
    idVenta,
    idProducto,
    cantidad,
    precioUnitario,
    subtotal,
    total,
    impuesto,
    tipoPromocion,
    descripcionPromocion
  } = req.body;

  try {
    const query = `
      INSERT INTO detalles_venta
      (ID_Venta, ID_Producto, Cantidad, Precio, Subtotal, Total, Impuesto, TipoPromocion, DescripcionPromocion)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      idVenta,
      idProducto,
      cantidad,
      precioUnitario,
      subtotal,
      total,
      impuesto,
      tipoPromocion || null,
      descripcionPromocion || null
    ];

    db.query(query, values, (error, results) => {
      if (error) {
        console.error('Error al guardar los detalles de la venta:', error);
        return res.status(500).json({ message: 'Error al guardar los detalles de la venta.' });
      }

      // Ahora registrar automáticamente la salida con motivo "venta"
      const salidaQuery = `
        INSERT INTO salidas (ID_Producto, Cantidad, TipoSalida, FechaSalida, PrecioUnitario, Total)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      const salidaValues = [
        idProducto,
        cantidad,
        'venta',
        new Date(),
        precioUnitario,
        (cantidad * precioUnitario).toFixed(2)
      ];

      db.query(salidaQuery, salidaValues, (errSalida) => {
        if (errSalida) {
          console.error('Error al registrar la salida:', errSalida);
          return res.status(500).json({ message: 'Detalle guardado, pero error al registrar salida.' });
        }

        res.status(201).json({
          message: 'Detalle de venta y salida registrados exitosamente.',
          idDetalleVenta: results.insertId
        });
      });
    });
  } catch (error) {
    console.error('Error en la solicitud:', error);
    res.status(500).json({ message: 'Error al procesar la solicitud.' });
  }
});

  
  app.put('/api/clientes/:id', (req, res) => {
    const id = req.params.id;
  
    // Validar que el ID no sea undefined o vacío
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'ID de cliente es requerido y debe ser un número.' });
    }
  
    const { Nombre, Telefono, Email, Tipo_Documento, Numero_Documento, Direccion } = req.body;
  
    // Validar que los campos requeridos no sean undefined
    if (!Nombre || !Telefono || !Email || !Tipo_Documento || !Numero_Documento || !Direccion) {
      return res.status(400).json({ error: 'Todos los campos son requeridos.' });
    }
  
    const query = `UPDATE clientes SET Nombre = ?, Telefono = ?, Email = ?, Tipo_Documento = ?, Numero_Documento = ?, Direccion = ? WHERE ID_Cliente = ?`;
    const values = [Nombre, Telefono, Email, Tipo_Documento, Numero_Documento, Direccion, id];
  
    db.query(query, values, (err) => {
      if (err) {
        console.error('Error updating client:', err);
        return res.status(500).json({ error: 'Error al actualizar cliente.' });
      }
      res.status(200).json({ message: 'Cliente actualizado exitosamente.' });
    });
  });
  
  app.get('/api/detalles_venta/:idVenta', async (req, res) => {
    const idVenta = req.params.idVenta;
  
    // Usamos una promesa para envolver la consulta
    const query = 'SELECT * FROM detalles_venta WHERE ID_Venta = ?';
  
    try {
      const detalles = await new Promise((resolve, reject) => {
        db.query(query, [idVenta], (err, results) => {
          if (err) {
            reject(err);  // Rechazamos la promesa si hay un error
          } else {
            resolve(results);  // Resolvemos la promesa con los resultados
          }
        });
      });
  
      console.log('Detalles obtenidos:', detalles);  // Verifica qué datos está recibiendo el frontend
  
      if (detalles.length === 0) {
        return res.status(404).json({ error: 'Detalles de venta no encontrados' });
      }
  
      res.status(200).json(detalles);
  
    } catch (error) {
      console.error('Error fetching sale details:', error);
      res.status(500).json({ error: 'Error al obtener detalles de la venta' });
    }
  });
  
  
  
  // Ruta para eliminar un cliente
  app.delete('/api/clientes/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM clientes WHERE ID_Cliente = ?';
    
    db.query(query, [id], (err) => {
        if (err) {
            console.error('Error deleting client:', err);
            return res.status(500).send('Error deleting client');
        }
        res.send('Client deleted successfully');
    });
  });
  

  app.delete('/api/ventas/:id', (req, res) => {
    const { id } = req.params;

    db.beginTransaction(err => {
        if (err) {
            console.error('Error starting transaction:', err);
            return res.status(500).send('Transaction error');
        }

        const deleteDetallesQuery = 'DELETE FROM detalles_venta WHERE ID_Venta = ?';
        db.query(deleteDetallesQuery, [id], (err) => {
            if (err) {
                return db.rollback(() => {
                    console.error('Error deleting detalles de venta:', err);
                    res.status(500).send('Error deleting detalles de venta');
                });
            }

            const deleteVentaQuery = 'DELETE FROM ventas WHERE ID_Venta = ?';
            db.query(deleteVentaQuery, [id], (err) => {
                if (err) {
                    return db.rollback(() => {
                        console.error('Error deleting venta:', err);
                        res.status(500).send('Error deleting venta');
                    });
                }

                db.commit(err => {
                    if (err) {
                        return db.rollback(() => {
                            console.error('Error committing transaction:', err);
                            res.status(500).send('Error finalizing deletion');
                        });
                    }

                    res.send('Venta y detalles eliminados correctamente');
                });
            });
        });
    });
});



  // Ruta para eliminar una compra
app.delete('/api/compras/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM compras WHERE ID_Compra = ?';

  db.query(query, [id], (err) => {
    if (err) {
      console.error('Error deleting purchase:', err);
      return res.status(500).send('Error deleting purchase');
    }
    res.send('Purchase deleted successfully');
  });
});


//----------------------------------
// Ruta para agregar un proveedor
app.post('/api/proveedores', (req, res) => {
  const { Nombre, Direccion, Telefono, Email, Frecuencia_Visita, Tipo_Documento, Numero_Documento } = req.body;

  const query = 'INSERT INTO proveedores (Nombre, Direccion, Telefono, Email, Frecuencia_Visita, Tipo_Documento, Numero_Documento) VALUES (?, ?, ?, ?, ?, ?, ?)';

  db.query(query, [Nombre, Direccion, Telefono, Email, Frecuencia_Visita, Tipo_Documento, Numero_Documento], (err, result) => {
    if (err) {
      console.error('Error inserting provider:', err);
      return res.status(500).send('Error inserting provider');
    }
    res.status(201).send('Provider added successfully');
  });
});

// Ruta para obtener todos los proveedores
app.get('/api/proveedores', (req, res) => {
  const query = 'SELECT * FROM proveedores';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error retrieving providers:', err.message);
      return res.status(500).json({ message: 'Error retrieving providers', error: err.message });
    }
    res.json(results);
  });
});


// Ruta para actualizar un proveedor
app.put('/api/proveedores/:id', (req, res) => {
  const id = req.params.id;
  console.log(req.body);  // Esto te permitirá ver lo que se está enviando al servidor.

  if (!id || isNaN(id)) {
    return res.status(400).json({ error: 'ID de proveedor es requerido y debe ser un número.' });
  }

  const { Nombre, Direccion, Telefono, Email, Frecuencia_Visita, Tipo_Documento, Numero_Documento } = req.body;

  if (!Nombre || !Direccion || !Telefono || !Email || !Frecuencia_Visita || !Tipo_Documento || !Numero_Documento) {
    return res.status(400).json({ error: 'Todos los campos son requeridos.' });
  }

  const query = `UPDATE proveedores SET Nombre = ?, Direccion = ?, Telefono = ?, Email = ?, Frecuencia_Visita = ?, Tipo_Documento = ?, Numero_Documento = ? WHERE ID_Proveedor = ?`;
  const values = [Nombre, Direccion, Telefono, Email, Frecuencia_Visita, Tipo_Documento, Numero_Documento, id];

  db.query(query, values, (err) => {
    if (err) {
      console.error('Error updating provider:', err);
      return res.status(500).json({ error: 'Error al actualizar proveedor.' });
    }
    res.status(200).json({ message: 'Proveedor actualizado exitosamente.' });
  });
});


// Ruta para eliminar un proveedor
app.delete('/api/proveedores/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM proveedores WHERE ID_Proveedor = ?';

  db.query(query, [id], (err) => {
    if (err) {
      console.error('Error deleting provider:', err);
      return res.status(500).send('Error deleting provider');
    }
    res.send('Provider deleted successfully');
  });
});







// Obtener todos los métodos de pago
app.get('/api/metodos_pago', (req, res) => {
  const query = 'SELECT * FROM metodos_pago';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error retrieving métodos de pago:', err.message);
      return res.status(500).json({ message: 'Error retrieving métodos de pago', error: err.message });
    }
    res.json(results);
  });
});

// Ruta para agregar un método de pago
app.post('/api/metodos_pago', (req, res) => {
  const { nombre, activo } = req.body;

  const query = 'INSERT INTO metodos_pago (Nombre) VALUES (?)';
  db.query(query, [nombre, activo], (err, results) => {
    if (err) {
      console.error('Error adding método de pago:', err.message);
      return res.status(500).json({ message: 'Error adding método de pago', error: err.message });
    }
    res.status(201).json({ id: results.insertId, nombre, activo });
  });
});

// Ruta para actualizar un método de pago
app.put('/api/metodos_pago/:id', (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;  // Solo obtenemos 'nombre' desde el cuerpo de la petición

  const query = 'UPDATE metodos_pago SET Nombre = ? WHERE ID_Metodo_Pago = ?';  // Elimina la coma extra
  db.query(query, [nombre, id], (err, results) => {  // Solo pasamos 'nombre' e 'id'
    if (err) {
      console.error('Error updating método de pago:', err.message);
      return res.status(500).json({ message: 'Error updating método de pago', error: err.message });
    }
    res.json({ message: 'Método de pago updated successfully' });
  });
});


// Ruta para actualizar el estado de un método de pago (activo/inactivo)
app.put('/api/metodos_pago/:id/status', (req, res) => {
  const { id } = req.params;
  const { activo } = req.body; // espera un valor 1 (activo) o 0 (inactivo)

  const query = 'UPDATE metodos_pago SET activo = ? WHERE ID_Metodo_Pago = ?';

  db.query(query, [activo, id], (err, result) => {
    if (err) {
      console.error('Error updating payment method status:', err);
      return res.status(500).send('Error updating payment method status');
    }
    if (result.affectedRows > 0) {
      res.status(200).send('Payment method status updated successfully');
    } else {
      res.status(404).send('Payment method not found');
    }
  });
});


app.post('/api/productos', (req, res) => {
  // Obtener los datos del cuerpo de la solicitud (req.body)
  const { 
    nombre, 
    precio, 
    stock, 
    codigo, 
    idCategoria, 
    idImpuesto, 
    tipoPromocion, 
  } = req.body;

  // Query para insertar el producto en la tabla productos
  const productoQuery = `INSERT INTO productos (Nombre, Precio, Stock, Codigo, ID_Categoria, ID_Impuesto) 
                         VALUES (?, ?, ?, ?, ?, ?)`;
  
  // Ejecutar la consulta para insertar el producto
  db.query(productoQuery, [nombre, precio, stock, codigo, idCategoria, idImpuesto], (err, result) => {
    if (err) {
      console.error('Error al agregar el producto:', err.message);
      return res.status(500).json({ message: 'Error al agregar el producto', error: err.message });
    }
else {
      // Si no hay promoción, retornar éxito directo
      res.json({ message: 'Producto agregado correctamente sin promoción' });
    }
  });
});


// Ruta para obtener todas las ventas
app.get('/api/VERventas', (req, res) => {
  const query = 'SELECT * FROM ventas';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener ventas:', err);
      res.status(500).json({ error: 'Error al obtener las ventas' });
      return;
    }
    res.status(200).json(results);
  });
});

app.get('/api/detalles_venta/:idVenta', async (req, res) => {
  const idVenta = req.params.idVenta;

  try {
    const query = 'SELECT * FROM detalles_venta WHERE ID_Venta = ?'; // Asegúrate de ajustar esto a tu base de datos
    const detalles = await db.query(query, [idVenta]);
    res.json(detalles);
  } catch (error) {
    console.error('Error fetching sale details:', error);
    res.status(500).send('Error al obtener detalles de la venta.');
  }
});

app.get('/api/ver_productos', (req, res) => {
  db.query('SELECT Nombre, Stock, Precio FROM productos', (error, results) => {
    if (error) throw error;
    res.json(results);
  });
});


// Ruta para obtener todos los clientes
app.get('/api/obtenerClientes', (req, res) => {
  db.query('SELECT ID_Cliente, Nombre FROM clientes', (err, results) => {
    if (err) {
      console.error('Error al recuperar clientes:', err);
      return res.status(500).json({ error: 'Error al recuperar clientes' });
    }
    res.json(results);
  });
});

// Ruta para obtener todos los usuarios
app.get('/api/obtenerUsuarios', (req, res) => {
  db.query('SELECT ID_Usuario, Nombre FROM usuarios', (err, results) => {
    if (err) {
      console.error('Error al recuperar usuarios:', err);
      return res.status(500).json({ error: 'Error al recuperar usuarios' });
    }
    res.json(results);
  });
});

// Ruta para obtener todos los métodos de pago
app.get('/api/obtenerMetodosPago', (req, res) => {
  db.query('SELECT ID_Metodo_Pago, NombreMetodo FROM metodos_pago', (err, results) => {
    if (err) {
      console.error('Error al recuperar métodos de pago:', err);
      return res.status(500).json({ error: 'Error al recuperar métodos de pago' });
    }
    res.json(results);
  });
});
// POST /api/ventas
app.post('/api/ventas', (req, res) => {
  const { idCliente, idUsuario, idMetodoPago, fecha } = req.body;

  // Obtener el último número de venta
  db.query('SELECT MAX(Numero) AS maxNumero FROM ventas', (err, results) => {
    if (err) {
      console.error('Error al obtener el último número de venta:', err);
      return res.status(500).json({ error: 'Error al obtener el último número de venta' });
    }

    const numero = ((results[0].maxNumero || 0) * 1) + 1; // Multiplica por 1 para asegurarse de que sea numérico

    // Insertar la venta
    const insertQuery = `
      INSERT INTO ventas (ID_Cliente, ID_Usuario, ID_Metodo_Pago, Fecha, Numero)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
      insertQuery,
      [idCliente, idUsuario, idMetodoPago, fecha, numero.toString()],
      (err, resultado) => {
        if (err) {
          console.error('Error al crear venta:', err);
          return res.status(500).json({ error: 'Error al crear la venta' });
        }

        res.status(201).json({
          idVenta: resultado.insertId,
          numero: numero,
        });
      }
    );
  });
});
app.put('/api/ventas/:idVenta/estado', (req, res) => {
  const { idVenta } = req.params;
  const { estado_venta } = req.body;

  console.log(`Actualizando venta con ID ${idVenta} a estado ${estado_venta}`);  // Log para verificar

  const updateQuery = `
    UPDATE ventas
    SET estado = ?
    WHERE ID_Venta = ?
  `;

  db.query(updateQuery, [estado_venta, idVenta], (err, results) => {
    if (err) {
      console.error('Error al actualizar la venta:', err);
      return res.status(500).json({ error: 'Error al actualizar la venta' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Venta no encontrada' });
    }

    console.log('Venta actualizada:', results);  // Verifica que la venta se actualizó correctamente
    res.status(200).json({ mensaje: 'Estado de la venta actualizado' });
  });
});



// Iniciar el servidor
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.get('/api/ventas/:id', (req, res) => {
  const saleId = req.params.id;
  console.log(`Solicitando datos para la venta con ID: ${saleId}`);

  // Consulta de la venta
  db.query(`
    SELECT 
      v.ID_Venta,
      v.Fecha,
      v.Numero,
      c.Nombre AS Cliente,
      u.Usuario AS Usuario,
      mp.Nombre AS Metodo_Pago
    FROM ventas v
    JOIN clientes c ON v.ID_Cliente = c.ID_Cliente
    JOIN usuarios u ON v.ID_Usuario = u.ID_Usuario
    JOIN metodos_pago mp ON v.ID_Metodo_Pago = mp.ID_Metodo_Pago
    WHERE v.ID_Venta = ?
  `, [saleId], (err, ventas) => {
    if (err) {
      console.error('Error en la consulta de ventas:', err);
      return res.status(500).json({ error: 'Error al obtener los datos de la venta' });
    }

    if (ventas.length === 0) {
      return res.status(404).json({ error: 'Venta no encontrada' });
    }

    const venta = ventas[0];

    // Consulta para los detalles de la venta
    db.query(`
      SELECT 
        p.Nombre AS Nombre_Producto,
        dv.Cantidad,
        dv.Precio,
        dv.Impuesto,
        dv.Subtotal,
        dv.Total
      FROM detalles_venta dv
      JOIN productos p ON dv.ID_Producto = p.ID_Producto
      WHERE dv.ID_Venta = ?
    `, [saleId], (err, detalles) => {
      if (err) {
        console.error('Error en la consulta de detalles de venta:', err);
        return res.status(500).json({ error: 'Error al obtener los detalles de la venta' });
      }

      const total = detalles.reduce((sum, d) => sum + parseFloat(d.Subtotal), 0);
      const totalTax = detalles.reduce((sum, d) => sum + parseFloat(d.Impuesto), 0);
      const totalPay = detalles.reduce((sum, d) => sum + parseFloat(d.Total), 0);

      res.json({
        ...venta,
        items: detalles,
        total,
        totalTax,
        totalPay
      });
      });
    });
  });

// Endpoint en Node.js para reducir el stock de un producto
// Ruta para reducir el stock
app.put('/api/productos/:idProducto/reducir-stock', (req, res) => {
  const { idProducto } = req.params;
  const { cantidadReducir } = req.body;

  // Consulta para reducir el stock
  db.query(
    'UPDATE productos SET Stock = Stock - ? WHERE ID_Producto = ? AND Stock >= ?',
    [cantidadReducir, idProducto, cantidadReducir],
    (error, result) => {
      if (error) {
        console.error('Error al reducir el stock:', error);
        return res.status(500).json({ message: 'Error al reducir el stock' });
      }

      if (result.affectedRows === 0) {
        return res.status(400).json({ message: 'Stock insuficiente o producto no encontrado' });
      }

      res.status(200).json({ message: 'Stock reducido exitosamente' });
    }
  );
});
// Ruta para actualizar el estado de un usuario (activo/inactivo)
app.put('/api/usuarios/estado/:id', (req, res) => {
  const { id } = req.params;
  const { activo } = req.body; // espera 1 (activo) o 0 (inactivo)

  const query = 'UPDATE usuarios SET activo = ? WHERE ID_Usuario = ?';

  db.query(query, [activo, id], (err, result) => {
    if (err) {
      console.error('Error al actualizar el estado del usuario:', err);
      return res.status(500).send('Error al actualizar el estado');
    }
    if (result.affectedRows > 0) {
      res.status(200).send('Estado del usuario actualizado correctamente');
    } else {
      res.status(404).send('Usuario no encontrado');
    }
  });
});

app.post('/api/salidas', (req, res) => {
  let { idProducto, cantidad, tipoSalida, fechaSalida, precioUnitario, total } = req.body;

  if (!idProducto || !cantidad || !tipoSalida || !fechaSalida || !precioUnitario || !total) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  tipoSalida = tipoSalida.trim();
  const tiposValidos = ['devolucion', 'vencimiento', 'mal estado', 'venta'];

  if (!tiposValidos.includes(tipoSalida)) {
    return res.status(400).json({ message: 'Tipo de salida inválido.' });
  }

  // 1. Insertar en salidas
  const insertQuery = `
    INSERT INTO salidas (ID_Producto, Cantidad, TipoSalida, FechaSalida, PrecioUnitario, Total)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(insertQuery, [idProducto, cantidad, tipoSalida, fechaSalida, precioUnitario, total], (err) => {
    if (err) {
      console.error('Error al registrar la salida:', err);
      return res.status(500).json({ message: 'Error al registrar la salida' });
    }

    // 2. Reducir stock del producto
    const updateStockQuery = `
      UPDATE productos SET Stock = Stock - ? WHERE ID_Producto = ?
    `;

    db.query(updateStockQuery, [cantidad, idProducto], (errorUpdate) => {
      if (errorUpdate) {
        console.error('Error al actualizar el stock:', errorUpdate);
        return res.status(500).json({ message: 'Salida registrada, pero error al actualizar el stock.' });
      }

      res.status(201).json({ message: 'Salida registrada y stock actualizado correctamente.' });
    });
  });
});

app.post('/api/entradas', (req, res) => {
  let { cantidad, motivo, fechaEntrada, total, precioUnitario, idProducto } = req.body;

  if (!cantidad || !motivo || !fechaEntrada || !total || !precioUnitario || !idProducto) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  cantidad = parseInt(cantidad);
  idProducto = parseInt(idProducto);

  if (typeof motivo === 'string') {
    motivo = motivo.trim().toLowerCase();
  } else {
    return res.status(400).json({ message: 'El motivo es inválido' });
  }

  const motivosValidos = [
    'compra',
    'devolucion_cliente',
    'ajuste_positivo',
    'recuperacion',

  ];

  if (!motivosValidos.includes(motivo)) {
    return res.status(400).json({ message: 'Motivo de entrada no válido' });
  }

  // Primero registrar la entrada
  const insertEntrada = `
    INSERT INTO entradas 
    (ID_Producto, Cantidad, PrecioUnitario, Total, Motivo, FechaEntrada) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(insertEntrada, [idProducto, cantidad, precioUnitario, total, motivo, fechaEntrada], (err) => {
    if (err) {
      console.error('Error al registrar la entrada:', err);
      return res.status(500).json({ message: 'Error al registrar la entrada' });
    }

    // Luego actualizar el stock del producto
    const updateStock = `
      UPDATE productos
      SET Stock = Stock + ?
      WHERE ID_Producto = ?
    `;

    db.query(updateStock, [cantidad, idProducto], (err2) => {
      if (err2) {
        console.error('Error al actualizar el stock:', err2);
        return res.status(500).json({ message: 'Entrada registrada pero no se pudo actualizar el stock' });
      }

      res.status(201).json({ message: 'Entrada registrada y stock actualizado correctamente' });
    });
  });
});


app.get('/api/entradas', (req, res) => {
  const sql = `
    SELECT e.ID_Entrada, e.Cantidad, e.Motivo, e.FechaEntrada, e.Total, p.Nombre AS NombreProducto
    FROM entradas e
    INNER JOIN productos p ON e.ID_Producto = p.ID_Producto
    ORDER BY e.FechaEntrada DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error al obtener las entradas:', err);
      return res.status(500).json({ message: 'Error al obtener las entradas' });
    }

    res.json(results);
  });
});

app.get('/api/ventas', (req, res) => {
  db.query('SELECT ID_Venta as id, Numero FROM ventas', (err, results) => {
    if (err) {
      console.error('Error al obtener ventas:', err);
      return res.status(500).json({ message: 'Error al obtener las ventas' });
    }
    res.json(results);
  });
});




app.get('/api/salidas', (req, res) => {
  
 
  const query = 'SELECT * FROM salidas'; // Consultar todas las salidas
  
    db.query(query, (err, results) => {
      if (err) {
        
    
  console.error('Error al obtener las salidas:', err.message);
        return res.status(500).json({ message: 'Error al obtener las salidas', error: err.message });
      }
      res.json(results); // Responder con los resultados de la consulta
    });
  });




  //HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH//
  // Endpoint para obtener los clientes
  app.get('/api/VERRclientes', (req, res) => {
    db.query('SELECT ID_Cliente, Nombre FROM clientes', (err, results) => {
      if (err) {
        console.error('Error al obtener los clientes:', err);
        return res.status(500).json({ error: 'Error al obtener los clientes' });
      }
      
      // Si no hay resultados, devolver un mensaje adecuado
      if (results.length === 0) {
        return res.status(404).json({ message: 'No se encontraron clientes' });
      }
      
      // Si la consulta fue exitosa, retornamos los resultados
      res.json(results);
    });
  });
  

  app.get('/api/VERRusuarios', (req, res) => {
  const sql = 'SELECT ID_Usuario, Nombre FROM usuarios WHERE activo = 1';

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error al obtener los usuarios:', err);
      return res.status(500).json({ error: 'Error al obtener los usuarios' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No se encontraron usuarios activos' });
    }

    res.json(results); // ✅ Solo usuarios activos
  });
});

// Endpoint para obtener todos los productos con precio incluido
app.get('/api/productos', (req, res) => {
  const query = `
    SELECT 
      ID_Producto, 
      Nombre, 
      Precio
    FROM productos;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener los productos:', err);
      return res.status(500).json({ error: 'Error al obtener los productos' });
    }

    res.json(results); // ✅ Ahora incluye también el precio
  });
});

// Endpoint para obtener el detalle del producto
app.get('/api/producto/:id', (req, res) => {
  const { id } = req.params;  // Aquí capturamos el ID del producto
  const query = `
    SELECT 
      p.ID_Producto, 
      p.Nombre, 
      p.Precio, 
      p.ID_Impuesto,
      IFNULL(i.Porcentaje, 0) AS Impuesto
    FROM productos p
    LEFT JOIN impuestos i ON p.ID_Impuesto = i.ID_Impuesto
    WHERE p.ID_Producto = ?;
  `;

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error al obtener el producto:', err);
      return res.status(500).json({ error: 'Error al obtener el producto' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(results[0]);  // Devolvemos el producto con precio e impuesto
  });
});

  

 // Esta es la ruta que falta
app.get('/api/ventas/cliente/:idCliente', async (req, res) => {
  const { idCliente } = req.params;
  try {
    const [ventas] = await conexion.execute('SELECT * FROM ventas WHERE id_cliente = ?', [idCliente]);
    res.json(ventas);
  } catch (error) {
    console.error('Error al obtener ventas del cliente:', error);
    res.status(500).json({ error: 'Error al obtener ventas del cliente' });
  }
});
app.get('/factura/:id', (req, res) => {
  const idVenta = req.params.id;

  const sql = `
    SELECT 
      v.ID_Venta,
      v.Numero,
      v.Fecha,
      v.estado,
      c.Nombre AS Cliente,
      mp.Nombre AS MetodoPago,
      u.Nombre AS Usuario,
      p.Nombre AS Producto,
      dv.Precio,
      dv.Cantidad,
      dv.Subtotal,
      dv.Impuesto,
      dv.Total,
      dv.TipoPromocion,
      dv.DescripcionPromocion
    FROM ventas v
    JOIN clientes c ON v.ID_Cliente = c.ID_Cliente
    LEFT JOIN metodos_pago mp ON v.ID_Metodo_Pago = mp.ID_Metodo_Pago
    JOIN usuarios u ON v.ID_Usuario = u.ID_Usuario
    LEFT JOIN detalles_venta dv ON v.ID_Venta = dv.ID_Venta
    LEFT JOIN productos p ON dv.ID_Producto = p.ID_Producto
    WHERE v.ID_Venta = ?
  `;

  db.query(sql, [idVenta], (err, results) => {
    if (err) {
      console.error('Error en consulta:', err);
      return res.status(500).json({ error: 'Error al obtener la factura.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Factura no encontrada.' });
    }

    const encabezado = {
      ID_Venta: results[0].ID_Venta,
      Numero: results[0].Numero,
      Fecha: results[0].Fecha,
      Estado: results[0].estado, // 👈 Estado 0 o 1
      Cliente: results[0].Cliente,
      MetodoPago: results[0].MetodoPago || 'No especificado',
      Usuario: results[0].Usuario,
      Productos: [],
      Subtotal: 0,
      Impuesto: 0,
      Total: 0
    };

    results.forEach(row => {
      if (row.Producto) {
        encabezado.Productos.push({
          Nombre: row.Producto,
          Precio: parseFloat(row.Precio),
          Cantidad: row.Cantidad,
          Subtotal: parseFloat(row.Subtotal),
          Impuesto: parseFloat(row.Impuesto),
          Total: parseFloat(row.Total),
          TipoPromocion: row.TipoPromocion,
          DescripcionPromocion: row.DescripcionPromocion
        });

        encabezado.Subtotal += parseFloat(row.Subtotal);
        encabezado.Impuesto += parseFloat(row.Impuesto);
        encabezado.Total += parseFloat(row.Total);
      }
    });

    res.json(encabezado);
  });
});



// Endpoint para obtener los productos
app.get('/api/VERRmetodos_pago', (req, res) => {
  db.query('SELECT ID_Metodo_Pago, Nombre FROM metodos_pago WHERE activo = 1', (err, results) => {
    if (err) {
      console.error('Error al obtener los métodos de pago:', err);
      return res.status(500).json({ error: 'Error al obtener los métodos de pago' });
    }
    res.json(results); // ✅ solo métodos activos
  });
});



app.post('/api/descuentos', (req, res) => {
  const { ID_Producto, descuento, fecha_inicio, fecha_fin, precio_descontado } = req.body;

  // Calcular monto de descuento
  const monto_descuento = (descuento / 100) * precio_descontado;  // Usamos el precio descontado calculado

  const query = 
    `INSERT INTO descuentos (ID_Producto, Porcentaje_Descuento, Monto_descuento, Precio_Descontado, Fecha_Inicio, Fecha_Fin)
    VALUES (?, ?, ?, ?, ?, ?)`
  ;
  
  db.query(query, [ID_Producto, descuento, monto_descuento, precio_descontado, fecha_inicio, fecha_fin], (err, result) => {
    if (err) {
      console.error('Error al agregar descuento:', err);
      return res.status(500).json({ error: 'Hubo un error al agregar el descuento' });
    }
    res.status(200).json({ message: 'Descuento agregado con éxito' });
  });
});

app.post('/api/promociones', (req, res) => {
  console.log("📦 Datos recibidos en el servidor:", req.body);

  const { fecha_inicio, fecha_fin, tipo_promocion } = req.body;

  if (!fecha_inicio || !fecha_fin || !tipo_promocion) {
    console.log("❌ Faltan campos:", { fecha_inicio, fecha_fin, tipo_promocion });
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  const query = `
    INSERT INTO promociones (Fecha_Inicio, Fecha_Fin, Tipo_Promocion)
    VALUES (?, ?, ?)
  `;

  db.query(query, [fecha_inicio, fecha_fin, tipo_promocion], (err, result) => {
    if (err) {
      console.error('❌ Error al insertar la promoción:', err);
      return res.status(500).json({ error: 'Error al guardar promoción' });
    }

    console.log("✅ Promoción guardada con ID:", result.insertId);
    res.status(200).json({
      message: 'Promoción guardada con éxito',
      idPromocion: result.insertId
    });
  });
});

app.post('/api/promociones/detalle', (req, res) => {
  console.log("📩 Detalle de promoción recibido:", req.body);

  const {
    ID_Promocion,
    ID_Producto,
    tipo_promocion,
    producto_relacionado,
    precio_combo
  } = req.body;

  // Validación básica
  if (!ID_Promocion || !ID_Producto || !tipo_promocion || !producto_relacionado) {
    return res.status(400).json({ error: 'Faltan datos obligatorios en el detalle de promoción' });
  }

  // Consulta SQL para insertar el detalle en productos_combo
  const query = `
    INSERT INTO productos_combo (ID_Producto, PrecioCombo, Producto_Combo_ID, ID_Promocion)
    VALUES (?, ?, ?, ?)
  `;

  db.query(query, [ID_Producto, precio_combo, producto_relacionado, ID_Promocion], (err, result) => {
    if (err) {
      console.error('❌ Error al insertar detalle de promoción:', err);
      return res.status(500).json({ error: 'Error al guardar el detalle de promoción' });
    }

    console.log("✅ Detalle de promoción guardado con ID:", result.insertId);
    res.status(200).json({
      message: 'Detalle de promoción guardado exitosamente',
      idProductoCombo: result.insertId
    });
  });
});

app.post('/api/promociones/detalle-producto-gratis', (req, res) => {
  console.log("📩 Detalle producto gratis recibido:", req.body);

  const {
    ID_Promocion,
    Producto_ID,
    Producto_Gratis_ID
  } = req.body;

  // Validación básica
  if (!ID_Promocion || !Producto_ID || !Producto_Gratis_ID) {
    console.log("❌ Faltan campos:", { ID_Promocion, Producto_ID, Producto_Gratis_ID });
    return res.status(400).json({ error: 'Faltan datos obligatorios en el detalle de producto gratis' });
  }

  // Consulta SQL para insertar en promociones_producto_gratis
  const query = `
    INSERT INTO promociones_producto_gratis (ID_Promocion, Producto_ID, Producto_Gratis_ID)
    VALUES (?, ?, ?)
  `;

  db.query(query, [ID_Promocion, Producto_ID, Producto_Gratis_ID], (err, result) => {
    if (err) {
      console.error('❌ Error al insertar detalle de producto gratis:', err);
      return res.status(500).json({ error: 'Error al guardar el detalle de producto gratis' });
    }

    console.log("✅ Detalle producto gratis guardado con ID:", result.insertId);
    res.status(200).json({
      message: 'Detalle de promoción producto gratis guardado exitosamente',
      idProductoGratis: result.insertId
    });
  });
});


// --------------------------------------------------------------------------------------------------------------------------------------------Suponiendo que usas un ORM o una consulta directa a la base de datos:
app.get('/api/productos/:id', (req, res) => {
  const { id } = req.params;
  // Lógica para buscar el producto en la base de datos por ID
  db.query('SELECT * FROM productos WHERE ID_Producto = ?', [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error en la consulta a la base de datos' });
    }
    if (result.length > 0) {
      return res.json(result[0]); // Devuelve el producto encontrado
    } else {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
  });
});

app.get('/api/promociones/:idProducto', (req, res) => {
  const { idProducto } = req.params;

  // 1. Descuento
  db.query("SELECT * FROM descuentos WHERE ID_Producto = ?", [idProducto], (err, descuentoResults) => {
    if (err) {
      console.error("Error al consultar descuentos:", err);
      return res.status(500).json({ error: "Error al obtener promociones" });
    }

    // 2. Producto Gratis
    db.query(`
      SELECT pg.* FROM promociones_producto_gratis pg
      JOIN promociones p ON p.ID_Promocion = pg.ID_Promocion
      WHERE pg.Producto_ID = ?
    `, [idProducto], (err, productoGratisResults) => {
      if (err) {
        console.error("Error al consultar producto gratis:", err);
        return res.status(500).json({ error: "Error al obtener promociones" });
      }

      // 3. Combo
      db.query(`
        SELECT pc.* FROM productos_combo pc
        JOIN promociones p ON p.ID_Promocion = pc.ID_Promocion
        WHERE pc.ID_Producto = ?
      `, [idProducto], (err, comboResults) => {
        if (err) {
          console.error("Error al consultar combo:", err);
          return res.status(500).json({ error: "Error al obtener promociones" });
        }

        // 4. Enviar respuesta
        res.json({
          descuento: descuentoResults.length > 0 ? descuentoResults[0] : null,
          producto_gratis: productoGratisResults.length > 0 ? productoGratisResults[0] : null,
          combo: comboResults.length > 0 ? comboResults[0] : null
        });
      });
    });
  });
});


app.post('/api/register', async (req, res) => {
  const {
    Nombre,
    Direccion,
    Telefono,
    Email,
    Usuario,
    Clave,
    NumeroCedula,
    TipoDocumento,
    idRol
  } = req.body;

  // Validar que todos los campos estén presentes
  if (
    !Nombre || !Direccion || !Telefono || !Email || !Usuario ||
    !Clave || !NumeroCedula || !TipoDocumento || !idRol
  ) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
  }

  try {
    // Verifica si el nombre de usuario o correo ya existen
    const [existe] = await connection.query(
      'SELECT * FROM usuarios WHERE Usuario = ? OR Email = ?',
      [Usuario, Email]
    );

    if (existe.length > 0) {
      return res.status(409).json({ error: 'Usuario o correo ya registrado.' });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(Clave, 10);

    // Insertar el nuevo usuario
    await connection.query(`
      INSERT INTO usuarios 
        (Nombre, Direccion, Telefono, Email, Usuario, Clave, NumeroCedula, TipoDocumento, idRol, activo)
      VALUES 
        (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `, [
      Nombre,
      Direccion,
      Telefono,
      Email,
      Usuario,
      hashedPassword,
      NumeroCedula,
      TipoDocumento,
      idRol
    ]);

    res.status(201).json({ mensaje: 'Usuario registrado correctamente.' });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ error: 'Error interno al registrar el usuario.' });
  }
});

app.post('/api/register', (req, res) => {
  const {
    Nombre, Telefono, Email, Usuario, Clave,
    Rol, NumeroCedula, TipoDocumento, Direccion
  } = req.body;

  if (!Nombre || !Telefono || !Email || !Usuario || !Clave || !Rol || !NumeroCedula || !TipoDocumento || !Direccion) {
    return res.status(400).json({ error: 'Todos los campos son requeridos.' });
  }

  const query = `
    INSERT INTO usuarios (Nombre, Telefono, Email, Usuario, Clave, idRol, NumeroCedula, TipoDocumento, Direccion, activo)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
  `;

  db.query(query, [Nombre, Telefono, Email, Usuario, Clave, Rol, NumeroCedula, TipoDocumento, Direccion], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al agregar usuario', details: err });
    res.status(201).json({ message: 'Usuario agregado exitosamente.' });
  });
});
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT * FROM usuarios WHERE Email = ? AND Clave = ?';
  db.query(sql, [email, password], (err, result) => {
    if (err) return res.status(500).json({ success: false, error: 'Error en el servidor' });

    if (result.length > 0) {
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  });
});

