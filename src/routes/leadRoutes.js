const express = require('express');
const { protect } = require('../middleware/auth');
const {
  listLeads,
  getLead,
  getLeadOverview,
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
router.get('/:id/overview', getLeadOverview);
router.get('/:id', getLead);
router.put('/:id', updateLead);
router.delete('/:id', deleteLead);

module.exports = router;
