const pool = require('../config/db');
const {Parser} = require('node-sql-parser');

const parser = new Parser();

function withSchema(userId, tableName) {
    return `user_${userId}.${tableName}`;
}

function rewriteSQLWithSchema(sql, userId) {
  try {
    const ast = parser.astify(sql, { database: 'Postgres' });

    const prefixSchema = (table) => {
      if (!table.db) {
        table.db = `user_${userId}`;
      }
    };

    const walkTables = (node) => {
      if (Array.isArray(node)) {
        node.forEach(walkTables);
      } else if (node && typeof node === 'object') {
        if (node.from) walkTables(node.from);
        if (node.into) walkTables(node.into);
        if (node.table) prefixSchema(node);
        if (node.update) prefixSchema(node.update);
        if (node.delete) prefixSchema(node.delete);
        if (node.join) walkTables(node.join);
        if (node.as && typeof node.as === 'object') walkTables(node.as);
        if (node.expr) walkTables(node.expr);
      }
    };

    walkTables(ast);

    const rewritten = parser.sqlify(ast, { database: 'Postgres' });
    return rewritten;
  } catch (err) {
    console.error('SQL parsing error:', err.message);
    return null;
  }
}

module.exports.createTable = async(req, res) => {
    const {tablename, cols} = req.body;
    const userId = req.user_id;
    if(!userId){
        return res.status(400).json({error : "Sign up req."});
    }
    if(!tablename || !Array.isArray(cols) || cols.length === 0){
        return res.status(400).json({error : "Table name and columns req."});
    }
    
    try{
        const colDefs = cols.map(col => `${col.name} ${col.type}`).join(',');
        const fullTableName = withSchema(userId, tablename);
        const query = `CREATE TABLE ${fullTableName} (${colDefs});`;
        await pool.query(query);
        res.json({mssg : `Table ${tablename} created successfully.`});
    }
    catch(err){
        console.error('Create table error:', err.message);
        res.status(500).json({ error: 'Failed to create table' });
    }
};

module.exports.runQuery = async (req, res) => {
  const { sql } = req.body;
  const userId = req.user_id;

  if (!sql) {
    return res.status(400).json({ error: 'SQL query required' });
  }

  const rewrittenSql = rewriteSQLWithSchema(sql, userId);
  if(!rewrittenSql){
    return res.status(400).json({error : "Invalid or unsupported syntax"});
  }

  try {
    const result = await pool.query(rewrittenSql);
    res.json({ rows: result.rows});
  } catch (err) {
    console.error('Query execution error:', err.message);
    res.status(400).json({ error: 'Query execution failed.' });
  }
};

module.exports.listTables = async (req, res) => {
  const userId = req.user_id;
  const schema = `user_${userId}`;

  try {
    const query = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = $1 AND table_type = 'BASE TABLE'
    `;

    const result = await pool.query(query, [schema]);

    res.json({ tables: result.rows.map(r => r.table_name) });
  } catch (err) {
    console.error('List tables error:', err.message);
    res.status(500).json({ error: 'Failed to list tables' });
  }
};

module.exports.deleteTable = async (req, res) => {
  const { tableName } = req.body;
  const userId = req.user_id;

  if (!tableName) {
    return res.status(400).json({ error: 'Table name is required' });
  }

  try {
    const fullTableName = withSchema(userId, tableName);
    await pool.query(`DROP TABLE IF EXISTS ${fullTableName} CASCADE`);
    res.json({ message: `Table '${tableName}' deleted successfully.` });
  } catch (err) {
    console.error('Delete table error:', err.message);
    res.status(500).json({ error: 'Failed to delete table' });
  }
};


module.exports.getTableSchema = async (req, res) => {
  const userId = req.user_id;
  const { tableName } = req.params;

  if (!tableName) {
    return res.status(400).json({ error: 'Table name is required' });
  }

  try {
    const result = await pool.query(
      `SELECT column_name, data_type
       FROM information_schema.columns
       WHERE table_schema = $1 AND table_name = $2`,
      [`user_${userId}`, tableName]
    );
    res.json({ schema: result.rows });
  } catch (err) {
    console.error('Get table schema error:', err.message);
    res.status(500).json({ error: 'Failed to fetch schema' });
  }
};

module.exports.getTableData = async (req, res) => {
  const userId = req.user_id;
  const { tableName } = req.params;

  if (!tableName) {
    return res.status(400).json({ error: 'Table name is required' });
  }

  try {
    const fullTableName = withSchema(userId, tableName);
    const result = await pool.query(`SELECT * FROM ${fullTableName} LIMIT 100`);
    res.json({ rows: result.rows });
  } catch (err) {
    console.error('Get table data error:', err.message);
    res.status(500).json({ error: 'Failed to fetch table data' });
  }
};

