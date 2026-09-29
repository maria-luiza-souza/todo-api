const Activity = require('../models/Activity');

const populate = (query) => query
  .populate('lead', 'name company')
  .populate('customer', 'name company')
  .populate('deal', 'title stage value')
  .populate('company', 'name segment')
  .populate('contact', 'name role');

const getAgenda = async (req, res) => {
  try {
    const now = new Date();
    const startToday = new Date(now);
    startToday.setHours(0, 0, 0, 0);
    const endToday = new Date(now);
    endToday.setHours(23, 59, 59, 999);
    const endWeek = new Date(endToday);
    endWeek.setDate(endWeek.getDate() + 7);

    const [overdue, today, upcoming, later, completed] = await Promise.all([
      populate(Activity.find({ owner: req.user.id, completed: false, scheduledFor: { $lt: startToday } }).sort({ scheduledFor: 1 }).limit(50)),
      populate(Activity.find({ owner: req.user.id, completed: false, scheduledFor: { $gte: startToday, $lte: endToday } }).sort({ scheduledFor: 1 }).limit(50)),
      populate(Activity.find({ owner: req.user.id, completed: false, scheduledFor: { $gt: endToday, $lte: endWeek } }).sort({ scheduledFor: 1 }).limit(50)),
      populate(Activity.find({ owner: req.user.id, completed: false, scheduledFor: { $gt: endWeek } }).sort({ scheduledFor: 1 }).limit(50)),
      populate(Activity.find({ owner: req.user.id, completed: true, scheduledFor: { $ne: null } }).sort({ scheduledFor: -1 }).limit(20)),
    ]);

    return res.json({
      success: true,
      data: {
        counts: { overdue: overdue.length, today: today.length, upcoming: upcoming.length, later: later.length },
        overdue, today, upcoming, later, completed,
      },
    });
  } catch (error) {
    console.error('Erro na agenda:', error.message);
    return res.status(500).json({ success: false, message: 'Erro ao carregar agenda' });
  }
};

module.exports = { getAgenda };
