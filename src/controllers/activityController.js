const Activity = require('../models/Activity');
const Lead = require('../models/Lead');
const Customer = require('../models/Customer');
const Deal = require('../models/Deal');
const Company = require('../models/Company');
const Contact = require('../models/Contact');

const allowedFields = [
  'type',
  'title',
  'description',
  'occurredAt',
  'scheduledFor',
  'completed',
  'lead',
  'customer',
  'deal',
  'company',
  'contact',
];

const pick = (body) =>
  allowedFields.reduce((data, field) => {
    if (body[field] !== undefined) data[field] = body[field] === '' ? null : body[field];
    return data;
  }, {});

const validateRelations = async (owner, data) => {
  if (!data.lead && !data.customer && !data.deal && !data.company && !data.contact) {
    return {
      ok: false,
      message: 'Relacione a interação a um lead, cliente, negociação, empresa ou contato',
    };
  }

  if (data.lead && !(await Lead.exists({ _id: data.lead, owner }))) {
    return { ok: false, message: 'Lead não encontrado' };
  }

  if (data.customer && !(await Customer.exists({ _id: data.customer, owner, active: true }))) {
    return { ok: false, message: 'Cliente não encontrado' };
  }

  if (data.deal && !(await Deal.exists({ _id: data.deal, owner }))) {
    return { ok: false, message: 'Negociação não encontrada' };
  }

  if (data.company && !(await Company.exists({ _id: data.company, owner, active: true }))) {
    return { ok: false, message: 'Empresa não encontrada' };
  }

  if (data.contact) {
    const contact = await Contact.findOne({ _id: data.contact, owner, active: true });
    if (!contact) return { ok: false, message: 'Contato não encontrado' };
    if (!data.company && contact.company) data.company = contact.company;
  }

  return { ok: true };
};

const populateActivity = (query) =>
  query
    .populate('lead', 'name company stage')
    .populate('customer', 'name company')
    .populate('deal', 'title stage value expectedCloseDate')
    .populate('company', 'name segment')
    .populate('contact', 'name role email phone');

const listActivities = async (req, res) => {
  try {
    const { lead, customer, deal, company, contact, pending } = req.query;
    const filter = { owner: req.user.id };

    if (lead) filter.lead = lead;
    if (customer) filter.customer = customer;
    if (deal) filter.deal = deal;
    if (company) filter.company = company;
    if (contact) filter.contact = contact;
    if (pending === 'true') {
      filter.completed = false;
      filter.scheduledFor = { $ne: null };
    }

    const activities = await populateActivity(
      Activity.find(filter)
        .sort({ occurredAt: -1, createdAt: -1 })
        .limit(150)
    );

    return res.json({ success: true, count: activities.length, data: activities });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Erro ao listar interações' });
  }
};

const createActivity = async (req, res) => {
  try {
    if (!String(req.body.title || '').trim()) {
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

    const populated = await populateActivity(Activity.findById(activity._id));
    return res.status(201).json({
      success: true,
      message: 'Interação registrada',
      data: populated,
    });
  } catch (error) {
    console.error('Erro ao criar interação:', error.message);
    return res.status(400).json({ success: false, message: 'Não foi possível registrar a interação' });
  }
};

const updateActivity = async (req, res) => {
  try {
    const existing = await Activity.findOne({ _id: req.params.id, owner: req.user.id });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Interação não encontrada' });
    }

    const data = pick(req.body);
    const mergedRelations = {
      lead: data.lead !== undefined ? data.lead : existing.lead,
      customer: data.customer !== undefined ? data.customer : existing.customer,
      deal: data.deal !== undefined ? data.deal : existing.deal,
      company: data.company !== undefined ? data.company : existing.company,
      contact: data.contact !== undefined ? data.contact : existing.contact,
    };

    const relation = await validateRelations(req.user.id, mergedRelations);
    if (!relation.ok) return res.status(400).json({ success: false, message: relation.message });

    Object.assign(data, mergedRelations);

    const activity = await populateActivity(
      Activity.findOneAndUpdate(
        { _id: req.params.id, owner: req.user.id },
        data,
        { new: true, runValidators: true }
      )
    );

    return res.json({ success: true, message: 'Interação atualizada', data: activity });
  } catch (error) {
    return res.status(400).json({ success: false, message: 'Não foi possível atualizar a interação' });
  }
};

const deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.id,
    });
    if (!activity) {
      return res.status(404).json({ success: false, message: 'Interação não encontrada' });
    }
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
