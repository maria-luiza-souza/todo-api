const express = require('express');
const { protect } = require('../middleware/auth');
const {
  listCustomers,
  getCustomer,
  getCustomerOverview,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} = require('../controllers/customerController');

const router = express.Router();
router.use(protect);

router.get('/', listCustomers);
router.post('/', createCustomer);
router.get('/:id/overview', getCustomerOverview);
router.get('/:id', getCustomer);
router.put('/:id', updateCustomer);
router.delete('/:id', deleteCustomer);

module.exports = router;
