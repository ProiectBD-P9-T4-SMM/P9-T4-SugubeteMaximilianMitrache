const db = require('./src/db');

async function checkFullSchema() {
  try {
    const tablesResult = await db.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
    
    for (const row of tablesResult.rows) {
      const tableName = row.table_name;
      console.log("\n--- Table: " + tableName + " ---");
      const columnsResult = await db.query("SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = '" + tableName + "' ORDER BY ordinal_position");
      columnsResult.rows.forEach(col => {
        console.log("  " + col.column_name + ": " + col.data_type + " (" + col.is_nullable + ")");
      });
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    process.exit(0);
  }
}

checkFullSchema();
