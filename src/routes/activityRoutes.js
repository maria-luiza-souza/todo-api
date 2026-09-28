const express = require('express');
const { protect } = require('../middleware/auth');
const {
  listActivities,
  createActivity,
  updateActivity,
  deleteActivity,
} = require('../controllers/activityController');

const router = express.Router();
router.use(protect);

router.get('/', listActivities);
router.post('/', createActivity);
router.put('/:id', updateActivity);
router.delete('/:id', deleteActivity);

module.exports = router;
