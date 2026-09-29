const express = require('express');
const { protect } = require('../middleware/auth');
const {
  listDeals,
  getDeal,
  createDeal,
  updateDeal,
  deleteDeal,
} = require('../controllers/dealController');

const router = express.Router();
router.use(protect);

router.get('/', listDeals);
router.post('/', createDeal);
router.get('/:id', getDeal);
router.put('/:id', updateDeal);
router.delete('/:id', deleteDeal);

module.exports = router;
