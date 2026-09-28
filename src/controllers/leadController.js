const Lead = require('../models/Lead');
const Customer = require('../models/Customer');
const Activity = require('../models/Activity');

const allowedFields = [
  'name',
  'company',
  'email',
  'phone',
  'source',
  'stage',
  'estimatedValue',
  'notes',
  'lastContactAt',
  'nextFollowUpAt',
];

const pick = (body) =>
  allowedFields.reduce((data, field) => {
    if (body[field] !== undefined) data[field] = body[field];
    return data;
  }, {});

const listLeads = async (req, res) => {
  try {
    const { stage, source, search } = req.query;
    const filter = { owner: req.user.id };

    if (stage) filter.stage = stage;
    if (source) filter.source = source;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const leads = await Lead.find(filter).sort({ updatedAt: -1 });
    return res.json({ success: true, count: leads.length, data: leads });
  } catch (error) {
    console.error('Erro ao listar leads:', error.message);
    return res.status(500).json({ success: false, message: 'Erro ao listar leads' });
  }
};

const getLead = async (req, res) => {
  try {
    const lead = await Lead.findOne({ _id: req.params.id, owner: req.user.id });
    if (!lead) return res.status(404).json({ success: false, message: 'Lead não encontrado' });
    return res.json({ success: true, data: lead });
  } catch (error) {
    return res.status(400).json({ success: false, message: 'Lead inválido' });
  }
};

const createLead = async (req, res) => {
  try {
    if (!req.body.name || !String(req.body.name).trim()) {
      return res.status(400).json({ success: false, message: 'Informe o nome do lead' });
    }

    const lead = await Lead.create({ ...pick(req.body), owner: req.user.id });
    return res.status(201).json({ success: true, message: 'Lead criado com sucesso', data: lead });
  } catch (error) {
    console.error('Erro ao criar lead:', error.message);
    return res.status(400).json({ success: false, message: 'Não foi possível criar o lead' });
  }
};

const updateLead = async (req, res) => {
  try {
    const lead = await Lead.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      pick(req.body),
      { new: true, runValidators: true }
    );

    if (!lead) return res.status(404).json({ success: false, message: 'Lead não encontrado' });
    return res.json({ success: true, message: 'Lead atualizado', data: lead });
  } catch (error) {
    console.error('Erro ao atualizar lead:', error.message);
    return res.status(400).json({ success: false, message: 'Não foi possível atualizar o lead' });
  }
};

const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
    if (!lead) return res.status(404).json({ success: false, message: 'Lead não encontrado' });

    await Activity.deleteMany({ owner: req.user.id, lead: lead._id });
    return res.json({ success: true, message: 'Lead excluído' });
  } catch (error) {
    return res.status(400).json({ success: false, message: 'Não foi possível excluir o lead' });
  }
};

const convertLead = async (req, res) => {
  try {
    const lead = await Lead.findOne({ _id: req.params.id, owner: req.user.id });
    if (!lead) return res.status(404).json({ success: false, message: 'Lead não encontrado' });

    const existing = await Customer.findOne({
      owner: req.user.id,
      sourceLead: lead._id,
      active: true,
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Este lead já foi convertido em cliente',
        data: existing,
      });
    }

    const customer = await Customer.create({
      owner: req.user.id,
      sourceLead: lead._id,
      name: lead.name,
      company: lead.company,
      email: lead.email,
      phone: lead.phone,
      notes: lead.notes,
      segment: req.body.segment || '',
    });

    lead.stage = 'ganho';
    lead.lastContactAt = new Date();
    await lead.save();

    await Activity.create({
      owner: req.user.id,
      lead: lead._id,
      customer: customer._id,
      type: 'nota',
      title: 'Lead convertido em cliente',
      description: 'Conversão registrada pelo LeadFlow CRM.',
      completed: true,
    });

    return res.status(201).json({
      success: true,
      message: 'Lead convertido em cliente',
      data: { lead, customer },
    });
  } catch (error) {
    console.error('Erro ao converter lead:', error.message);
    return res.status(400).json({ success: false, message: 'Não foi possível converter o lead' });
  }
};

module.exports = {
  listLeads,
  getLead,
  createLead,
  updateLead,
  deleteLead,
  convertLead,
};
