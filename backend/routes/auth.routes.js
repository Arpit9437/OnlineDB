const express = require('express');
const authController = require('../controllers/auth.controller');
const {authMiddleware} = require('../middleware/auth.middleware');
const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authMiddleware, authController.login);

module.exports = router;