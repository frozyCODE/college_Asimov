const db = require('./config/db');

async function checkTable() {
  try {
    const [rows] = await db.execute('DESCRIBE Eleves');
    console.log('--- ELEVES TABLE STRUCTURE ---');
    rows.forEach(row => {
      console.log(`${row.Field} - ${row.Type}`);
    });
    process.exit(0);
  } catch (err) {
    console.error('Error checking table:', err);
    process.exit(1);
  }
}

checkTable();
