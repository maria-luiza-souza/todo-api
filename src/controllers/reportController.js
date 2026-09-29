const mongoose = require('mongoose');
const Lead = require('../models/Lead');
const Deal = require('../models/Deal');

const getReports = async (req, res) => {
  try {
    const ownerId = new mongoose.Types.ObjectId(req.user.id);
    const since = new Date();
    since.setMonth(since.getMonth() - 5);
    since.setDate(1);
    since.setHours(0, 0, 0, 0);

    const [bySource, byStage, lossReasons, monthlyWon, byResponsible] = await Promise.all([
      Lead.aggregate([
        { $match: { owner: ownerId } },
        { $group: { _id: '$source', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Deal.aggregate([
        { $match: { owner: ownerId } },
        { $group: { _id: '$stage', count: { $sum: 1 }, value: { $sum: '$value' } } },
      ]),
      Deal.aggregate([
        { $match: { owner: ownerId, stage: 'perdido', lossReason: { $nin: ['', null] } } },
        { $group: { _id: '$lossReason', count: { $sum: 1 }, value: { $sum: '$value' } } },
        { $sort: { count: -1 } },
        { $limit: 8 },
      ]),
      Deal.aggregate([
        { $match: { owner: ownerId, stage: 'ganho', wonAt: { $gte: since } } },
        {
          $group: {
            _id: { year: { $year: '$wonAt' }, month: { $month: '$wonAt' } },
            count: { $sum: 1 },
            value: { $sum: '$value' },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ]),
      Deal.aggregate([
        { $match: { owner: ownerId } },
        {
          $group: {
            _id: { $ifNull: ['$responsible', 'Sem responsável'] },
            deals: { $sum: 1 },
            won: { $sum: { $cond: [{ $eq: ['$stage', 'ganho'] }, 1, 0] } },
            wonValue: { $sum: { $cond: [{ $eq: ['$stage', 'ganho'] }, '$value', 0] } },
          },
        },
        { $sort: { wonValue: -1 } },
        { $limit: 10 },
      ]),
    ]);

    return res.json({
      success: true,
      data: { bySource, byStage, lossReasons, monthlyWon, byResponsible },
    });
  } catch (error) {
    console.error('Erro nos relatórios:', error.message);
    return res.status(500).json({ success: false, message: 'Erro ao carregar relatórios' });
  }
};

module.exports = { getReports };
