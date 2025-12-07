import app from './app.js';

// Usamos el puerto definido en las variables de entorno, o el 3000 como valor por defecto.
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto: ${PORT}`);
  //console.log(`API de productos disponible en http://localhost:${PORT}/api/productos`);
});
