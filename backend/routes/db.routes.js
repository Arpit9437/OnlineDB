const express = require('express');
const router = express.Router();
const dbController = require('../controllers/db.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

router.post("/create-table", authMiddleware, dbController.createTable);
router.delete("/delete-table", authMiddleware, dbController.deleteTable);
router.get("/tables", authMiddleware, dbController.listTables);
router.get("/table/:tablename/schema", authMiddleware, dbController.getTableSchema);
router.get("/table/:tablename/data", authMiddleware, dbController.getTableData);
router.post("/run-query", authMiddleware, dbController.runQuery);

module.exports = router;