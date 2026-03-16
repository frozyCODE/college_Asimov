const db = require('./config/db');
async function test() {
  const [rows] = await db.execute("SELECT * FROM Options");
  console.log(rows);
  process.exit(0);
}
test();
