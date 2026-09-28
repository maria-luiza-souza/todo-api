const Activity = require('../models/Activity');
const Lead = require('../models/Lead');
const Customer = require('../models/Customer');

const allowedFields = [
  'type',
  'title',
  'description',
  'occurredAt',
  'scheduledFor',
  'completed',
  'lead',
  'customer',
];

const pick = (body) =>
  allowedFields.reduce((data, field) => {
    if (body[field] !== undefined) data[field] = body[field] || null;
    return data;
  }, {});

const validateRelations = async (owner, data) => {
  if (!data.lead && !data.customer) {
    return { ok: false, message: 'Relacione a interação a um lead ou cliente' };
  }

  if (data.lead) {
    const lead = await Lead.exists({ _id: data.lead, owner });
    if (!lead) return { ok: false, message: 'Lead não encontrado' };
  }

  if (data.customer) {
    const customer = await Customer.exists({ _id: data.customer, owner, active: true });
    if (!customer) return { ok: false, message: 'Cliente não encontrado' };
  }

  return { ok: true };
};

const listActivities = async (req, res) => {
  try {
    const { lead, customer, pending } = req.query;
    const filter = { owner: req.user.id };

    if (lead) filter.lead = lead;
    if (customer) filter.customer = customer;
    if (pending === 'true') {
      filter.completed = false;
      filter.scheduledFor = { $ne: null };
    }

    const activities = await Activity.find(filter)
      .populate('lead', 'name company stage')
      .populate('customer', 'name company')
      .sort({ occurredAt: -1, createdAt: -1 })
      .limit(100);

    return res.json({ success: true, count: activities.length, data: activities });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Erro ao listar interações' });
  }
};

const createActivity = async (req, res) => {
  try {
    if (!req.body.title || !String(req.body.title).trim()) {
      return res.status(400).json({ success: false, message: 'Informe o título da interação' });
    }

    const data = pick(req.body);
    const relation = await validateRelations(req.user.id, data);
    if (!relation.ok) return res.status(400).json({ success: false, message: relation.message });

    const activity = await Activity.create({ ...data, owner: req.user.id });

    if (data.lead) {
      await Lead.updateOne(
        { _id: data.lead, owner: req.user.id },
        { $set: { lastContactAt: new Date() } }
      );
    }

    const populated = await Activity.findById(activity._id)
      .populate('lead', 'name company stage')
      .populate('customer', 'name company');

    return res.status(201).json({ success: true, message: 'Interação registrada', data: populated });
  } catch (error) {
    console.error('Erro ao criar interação:', error.message);
    return res.status(400).json({ success: false, message: 'Não foi possível registrar a interação' });
  }
};

const updateActivity = async (req, res) => {
  try {
    const data = pick(req.body);
    if (data.lead || data.customer) {
      const relation = await validateRelations(req.user.id, data);
      if (!relation.ok) return res.status(400).json({ success: false, message: relation.message });
    }

    const activity = await Activity.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      data,
      { new: true, runValidators: true }
    )
      .populate('lead', 'name company stage')
      .populate('customer', 'name company');

    if (!activity) return res.status(404).json({ success: false, message: 'Interação não encontrada' });
    return res.json({ success: true, message: 'Interação atualizada', data: activity });
  } catch (error) {
    return res.status(400).json({ success: false, message: 'Não foi possível atualizar a interação' });
  }
};

const deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
    if (!activity) return res.status(404).json({ success: false, message: 'Interação não encontrada' });
    return res.json({ success: true, message: 'Interação excluída' });
  } catch (error) {
    return res.status(400).json({ success: false, message: 'Não foi possível excluir a interação' });
  }
};

module.exports = {
  listActivities,
  createActivity,
  updateActivity,
  deleteActivity,
};
