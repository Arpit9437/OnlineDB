const pool = require('../config/db');

function withSchema(userId, tableName) {
  const schema = `user_${userId}`;
  return `"${schema}"."${tableName}"`;
}

function rewriteSQLWithSchema(sql, userId) {
  const schema = `user_${userId}`;
  const patterns = [
    /\b(FROM|JOIN|INTO)\s+([A-Za-z0-9_".]+(?:\s+AS\s+)?[A-Za-z0-9_"]*)(?:,\s*([A-Za-z0-9_".]+(?:\s+AS\s+)?[A-Za-z0-9_\"]*))*?/gi,
    /\bUPDATE\s+([A-Za-z0-9_".]+)/gi,
    /\bDELETE\s+FROM\s+([A-Za-z0-9_".]+)/gi,
    /\bINSERT\s+INTO\s+([A-Za-z0-9_".]+)/gi,
    /\bALTER\s+TABLE\s+([A-Za-z0-9_".]+)/gi,
    /\bDROP\s+TABLE\s+(?:IF\s+EXISTS\s+)?([A-Za-z0-9_".]+)/gi,
    /\bTRUNCATE\s+TABLE\s+([A-Za-z0-9_".]+)/gi,
  ];

  let out = sql;
  patterns.forEach((re) => {
    out = out.replace(re, (match) => {
      const parts = match.split(/\s+/);
      const kw = parts[0];
      const entries = match.slice(kw.length).trim().split(',');
      const rewritten = entries.map(entry => {
        const trimmed = entry.trim();
        if (trimmed.includes('.')) return trimmed;
        const [tbl, alias] = trimmed.split(/\s+/);
        const qualified = `"${schema}"."${tbl.replace(/"/g, '')}"`;
        return alias ? `${qualified} ${alias}` : qualified;
      }).join(', ');
      return `${kw} ${rewritten}`;
    });
  });

  return out;
}

module.exports.createTable = async (req, res) => {
  const { tablename, cols } = req.body;
  const userId = req.user_id;
  if (!userId) return res.status(400).json({ error: 'Authentication required.' });
  if (!tablename || !Array.isArray(cols) || cols.length === 0) {
    return res.status(400).json({ error: 'Table name and columns are required.' });
  }

  try {
    const columnDefs = cols.map(col => {
      const { name, type, constraints } = col;
      if (!name || !type) throw new Error('Invalid column definition');
      const constraintStr = Array.isArray(constraints)
        ? constraints.join(' ')
        : (typeof constraints === 'string' ? constraints : '');
      return `"${name}" ${type}${constraintStr ? ` ${constraintStr}` : ''}`;
    }).join(', ');

    const fullTableName = withSchema(userId, tablename);
    await pool.query(`CREATE TABLE ${fullTableName} (${columnDefs});`);
    res.json({ message: `Table '${tablename}' created successfully.` });
  } catch (err) {
    console.error('Create table error:', err.message);
    res.status(500).json({ error: 'Failed to create table.' });
  }
};

module.exports.runQuery = async (req, res) => {
  const { sql } = req.body;
  const userId = req.user_id;
  if (!sql) return res.status(400).json({ error: 'SQL query required.' });

  const rewrittenSql = rewriteSQLWithSchema(sql, userId);
  if (!rewrittenSql) return res.status(400).json({ error: 'Invalid or unsupported SQL syntax.' });

  try {
    const result = await pool.query(rewrittenSql);
    res.json({ rows: result.rows });
  } catch (err) {
    console.error('Query execution error:', err.message);
    res.status(400).json({ error: 'Query execution failed.' });
  }
};

module.exports.listTables = async (req, res) => {
  const userId = req.user_id;
  const schema = `user_${userId}`;

  try {
    const result = await pool.query(
      `SELECT table_name FROM information_schema.tables WHERE table_schema = $1 AND table_type = 'BASE TABLE'`,
      [schema]
    );
    res.json({ tables: result.rows.map(r => r.table_name) });
  } catch (err) {
    console.error('List tables error:', err.message);
    res.status(500).json({ error: 'Failed to list tables.' });
  }
};

module.exports.deleteTable = async (req, res) => {
  const { tableName } = req.body;
  const userId = req.user_id;
  if (!tableName) return res.status(400).json({ error: 'Table name is required.' });

  try {
    const fullTableName = withSchema(userId, tableName);
    await pool.query(`DROP TABLE IF EXISTS ${fullTableName} CASCADE;`);
    res.json({ message: `Table '${tableName}' deleted successfully.` });
  } catch (err) {
    console.error('Delete table error:', err.message);
    res.status(500).json({ error: 'Failed to delete table.' });
  }
};

module.exports.getTableSchema = async (req, res) => {
  const userId = req.user_id;
  const { tablename } = req.params;
  if (!tablename) return res.status(400).json({ error: 'Table name is required.' });

  try {
    const result = await pool.query(
      `
      SELECT 
        c.column_name, 
        c.data_type, 
        c.is_nullable, 
        (SELECT 'PRI' FROM information_schema.table_constraints tc 
          JOIN information_schema.key_column_usage kcu 
            ON tc.constraint_name = kcu.constraint_name 
            AND tc.table_schema = kcu.table_schema 
            AND tc.table_name = kcu.table_name
          WHERE tc.table_schema = $1 AND tc.table_name = $2 
            AND tc.constraint_type = 'PRIMARY KEY'
            AND kcu.column_name = c.column_name
          LIMIT 1
        ) AS column_key,
        (
          SELECT 'UNI' FROM information_schema.table_constraints tc 
          JOIN information_schema.key_column_usage kcu 
            ON tc.constraint_name = kcu.constraint_name 
            AND tc.table_schema = kcu.table_schema 
            AND tc.table_name = kcu.table_name
          WHERE tc.table_schema = $1 AND tc.table_name = $2 
            AND tc.constraint_type = 'UNIQUE'
            AND kcu.column_name = c.column_name
          LIMIT 1
        ) AS is_unique
      FROM information_schema.columns c
      WHERE c.table_schema = $1 AND c.table_name = $2
      ORDER BY c.ordinal_position
      `,
      [`user_${userId}`, tablename]
    );
    res.json({ schema: result.rows });
  } catch (err) {
    console.error('Get table schema error:', err.message);
    res.status(500).json({ error: 'Failed to fetch table schema.' });
  }
};

module.exports.getTableData = async (req, res) => {
  const userId = req.user_id;
  const { tablename } = req.params;
  if (!tablename) return res.status(400).json({ error: 'Table name is required.' });

  try {
    const fullTableName = withSchema(userId, tablename);
    const result = await pool.query(`SELECT * FROM ${fullTableName} LIMIT 100;`);
    res.json({ rows: result.rows });
  } catch (err) {
    console.error('Get table data error:', err.message);
    res.status(500).json({ error: 'Failed to fetch table data.' });
  }
};
