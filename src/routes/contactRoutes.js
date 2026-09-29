const express = require('express');
const { protect } = require('../middleware/auth');
const c = require('../controllers/contactController');

const router = express.Router();
router.use(protect);
router.get('/', c.listContacts);
router.post('/', c.createContact);
router.get('/:id/overview', c.getContactOverview);
router.get('/:id', c.getContact);
router.put('/:id', c.updateContact);
router.delete('/:id', c.deleteContact);

module.exports = router;
