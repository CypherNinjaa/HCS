const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function checkMigration() {
  try {
    // Check if migration succeeded
    const migrationResult = await pool.query(
      "SELECT * FROM migrations WHERE filename = '009_create_teachers_table.sql'"
    );
    console.log('Migration record:', migrationResult.rows[0]);
    
    // Check if table exists
    const tableResult = await pool.query(
      "SELECT to_regclass('teachers') as exists"
    );
    console.log('Table exists:', tableResult.rows[0].exists !== null);
    
    pool.end();
  } catch (error) {
    console.error('Error:', error.message);
    pool.end();
  }
}

checkMigration();
