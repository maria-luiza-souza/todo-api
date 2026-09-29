const mongoose = require('mongoose');
const Lead = require('../models/Lead');
const Customer = require('../models/Customer');
const Activity = require('../models/Activity');
const Deal = require('../models/Deal');

const OPEN_DEAL_STAGES = ['descoberta', 'qualificacao', 'proposta', 'negociacao'];

const getDashboard = async (req, res) => {
  try {
    const owner = req.user.id;
    const ownerId = new mongoose.Types.ObjectId(owner);
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [
      totalLeads,
      activeLeads,
      customers,
      openDeals,
      wonDeals,
      lostDeals,
      pipeline,
      forecast,
      wonThisMonth,
      byDealStage,
      recentActivities,
      pendingFollowUps,
      overdueFollowUps,
    ] = await Promise.all([
      Lead.countDocuments({ owner }),
      Lead.countDocuments({ owner, stage: { $nin: ['ganho', 'perdido'] } }),
      Customer.countDocuments({ owner, active: true }),
      Deal.countDocuments({ owner, stage: { $in: OPEN_DEAL_STAGES } }),
      Deal.countDocuments({ owner, stage: 'ganho' }),
      Deal.countDocuments({ owner, stage: 'perdido' }),
      Deal.aggregate([
        { $match: { owner: ownerId, stage: { $in: OPEN_DEAL_STAGES } } },
        { $group: { _id: null, value: { $sum: '$value' } } },
      ]),
      Deal.aggregate([
        { $match: { owner: ownerId, stage: { $in: OPEN_DEAL_STAGES } } },
        {
          $group: {
            _id: null,
            value: { $sum: { $multiply: ['$value', { $divide: ['$probability', 100] }] } },
          },
        },
      ]),
      Deal.aggregate([
        { $match: { owner: ownerId, stage: 'ganho', wonAt: { $gte: startOfMonth } } },
        { $group: { _id: null, count: { $sum: 1 }, value: { $sum: '$value' } } },
      ]),
      Deal.aggregate([
        { $match: { owner: ownerId } },
        { $group: { _id: '$stage', count: { $sum: 1 }, value: { $sum: '$value' } } },
      ]),
      Activity.find({ owner })
        .populate('lead', 'name company')
        .populate('customer', 'name company')
        .populate('deal', 'title stage value')
        .sort({ createdAt: -1 })
        .limit(6),
      Activity.countDocuments({
        owner,
        completed: false,
        scheduledFor: { $ne: null },
      }),
      Activity.countDocuments({
        owner,
        completed: false,
        scheduledFor: { $lt: new Date() },
      }),
    ]);

    const totalClosed = wonDeals + lostDeals;
    const conversionRate = totalClosed ? Math.round((wonDeals / totalClosed) * 1000) / 10 : 0;

    return res.json({
      success: true,
      data: {
        totalLeads,
        activeLeads,
        customers,
        openDeals,
        wonDeals,
        lostDeals,
        pipelineValue: pipeline[0]?.value || 0,
        forecastValue: forecast[0]?.value || 0,
        wonThisMonthCount: wonThisMonth[0]?.count || 0,
        wonThisMonthValue: wonThisMonth[0]?.value || 0,
        conversionRate,
        pendingFollowUps,
        overdueFollowUps,
        byDealStage,
        recentActivities,
      },
    });
  } catch (error) {
    console.error('Erro no dashboard:', error.message);
    return res.status(500).json({ success: false, message: 'Erro ao carregar dashboard' });
  }
};

module.exports = { getDashboard };
