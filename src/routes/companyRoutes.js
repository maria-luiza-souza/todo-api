const express = require('express');
const { protect } = require('../middleware/auth');
const c = require('../controllers/companyController');

const router = express.Router();
router.use(protect);
router.get('/', c.listCompanies);
router.post('/', c.createCompany);
router.get('/:id/overview', c.getCompanyOverview);
router.get('/:id', c.getCompany);
router.put('/:id', c.updateCompany);
router.delete('/:id', c.deleteCompany);

module.exports = router;
