const express = require('express');
const { protect } = require('../middleware/auth');
const { getAgenda } = require('../controllers/agendaController');

const router = express.Router();
router.use(protect);
router.get('/', getAgenda);

module.exports = router;
