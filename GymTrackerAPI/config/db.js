import mysql from 'mysql2/promise';
import dbConfig from './db.config.js';

// Crea un pool de conexiones a la base de datos utilizando la configuración importada.
// El pool de conexiones es más eficiente para manejar múltiples conexiones simultáneas.
const pool = mysql.createPool({
  host: dbConfig.host,
  user: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: '-05:00',
  dateStrings: true
});

// Exportamos el pool para que pueda ser utilizado en otros módulos, como los repositorios.
export default pool; 