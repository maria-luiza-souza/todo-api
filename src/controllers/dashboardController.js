const Lead = require('../models/Lead');
const Customer = require('../models/Customer');
const Activity = require('../models/Activity');

const getDashboard = async (req, res) => {
  try {
    const owner = req.user.id;
    const activeStages = ['novo', 'contato', 'qualificado', 'proposta', 'negociacao'];

    const [
      totalLeads,
      activeLeads,
      wonLeads,
      customers,
      pipeline,
      byStage,
      recentActivities,
      pendingFollowUps,
    ] = await Promise.all([
      Lead.countDocuments({ owner }),
      Lead.countDocuments({ owner, stage: { $in: activeStages } }),
      Lead.countDocuments({ owner, stage: 'ganho' }),
      Customer.countDocuments({ owner, active: true }),
      Lead.aggregate([
        { $match: { owner: new (require('mongoose').Types.ObjectId)(owner), stage: { $in: activeStages } } },
        { $group: { _id: null, value: { $sum: '$estimatedValue' } } },
      ]),
      Lead.aggregate([
        { $match: { owner: new (require('mongoose').Types.ObjectId)(owner) } },
        { $group: { _id: '$stage', count: { $sum: 1 }, value: { $sum: '$estimatedValue' } } },
      ]),
      Activity.find({ owner })
        .populate('lead', 'name company')
        .populate('customer', 'name company')
        .sort({ createdAt: -1 })
        .limit(6),
      Activity.countDocuments({
        owner,
        completed: false,
        scheduledFor: { $ne: null },
      }),
    ]);

    const conversionRate = totalLeads ? Math.round((wonLeads / totalLeads) * 1000) / 10 : 0;

    return res.json({
      success: true,
      data: {
        totalLeads,
        activeLeads,
        wonLeads,
        customers,
        pipelineValue: pipeline[0]?.value || 0,
        conversionRate,
        pendingFollowUps,
        byStage,
        recentActivities,
      },
    });
  } catch (error) {
    console.error('Erro no dashboard:', error.message);
    return res.status(500).json({ success: false, message: 'Erro ao carregar dashboard' });
  }
};

module.exports = { getDashboard };
