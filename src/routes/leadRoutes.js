const express = require('express');
const { protect } = require('../middleware/auth');
const {
  listLeads,
  getLead,
  createLead,
  updateLead,
  deleteLead,
  convertLead,
} = require('../controllers/leadController');

const router = express.Router();
router.use(protect);

router.get('/', listLeads);
router.post('/', createLead);
router.post('/:id/convert', convertLead);
router.get('/:id', getLead);
router.put('/:id', updateLead);
router.delete('/:id', deleteLead);

module.exports = router;
