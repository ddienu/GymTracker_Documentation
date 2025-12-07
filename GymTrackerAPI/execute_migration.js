import { runMigration, rollbackMigration } from './migrations/migration.js';

async function main() {
  try {
    // Phase 1: Always attempt a rollback first to ensure a clean slate
    console.log('--- Phase 1: Dropping database for a clean start ---');
    await rollbackMigration();

    // Phase 2: Run the main migration
    console.log('\n--- Phase 2: Running migration ---');
    const result = await runMigration();
    
    if (result.success) {
      console.log('\nMigration completed successfully.');
      process.exit(0); // Success
    } else {
      console.error('\nMigration failed:', result.error);
      process.exit(1); // Failure
    }
  } catch (err) {
    console.error('\nCritical error executing the migration process:', err);
    process.exit(1); // Failure
  }
}

main(); 