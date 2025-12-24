// execute_seeders.js
import { runAllSeeders } from './seeders/index.js';
import pool from './config/db.js'

(async () => {
  try {
    await runAllSeeders();
  } catch (err) {
    console.error('❌ Error running seeders:', err);
  } finally {
    if (pool.end) {
      await pool.end(); 
    }
    process.exit(0);
  }
})();
