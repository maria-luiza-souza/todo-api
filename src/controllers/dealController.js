const Deal = require('../models/Deal');
const Lead = require('../models/Lead');
const Customer = require('../models/Customer');

const probabilityByStage = {
  descoberta: 10,
  qualificacao: 25,
  proposta: 50,
  negociacao: 75,
  ganho: 100,
  perdido: 0,
};

const allowedFields = [
  'title',
  'lead',
  'customer',
  'stage',
  'value',
  'probability',
  'expectedCloseDate',
  'responsible',
  'lossReason',
  'notes',
];

const pick = (body) =>
  allowedFields.reduce((data, field) => {
    if (body[field] !== undefined) data[field] = body[field] === '' ? null : body[field];
    return data;
  }, {});

const validateRelations = async (owner, data) => {
  if (!data.lead && !data.customer) {
    return { ok: false, message: 'Relacione a negociação a um lead ou cliente' };
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

const prepareStageData = (data, existing = null) => {
  const next = { ...data };
  const previousStage = existing?.stage;
  const nextStage = data.stage || previousStage || 'descoberta';

  if (data.stage && data.stage !== previousStage) {
    next.stageChangedAt = new Date();

    if (data.probability === undefined) {
      next.probability = probabilityByStage[nextStage];
    }

    if (nextStage === 'ganho') {
      next.wonAt = new Date();
      next.lostAt = null;
      next.lossReason = '';
    } else if (nextStage === 'perdido') {
      next.lostAt = new Date();
      next.wonAt = null;
    } else {
      next.wonAt = null;
      next.lostAt = null;
      if (nextStage !== 'perdido') next.lossReason = '';
    }
  } else if (!existing && data.probability === undefined) {
    next.probability = probabilityByStage[nextStage];
  }

  return next;
};

const populateDeal = (query) =>
  query
    .populate('lead', 'name company email phone source nextFollowUpAt')
    .populate('customer', 'name company email phone segment active');

const listDeals = async (req, res) => {
  try {
    const { stage, search, lead, customer } = req.query;
    const filter = { owner: req.user.id };

    if (stage) filter.stage = stage;
    if (lead) filter.lead = lead;
    if (customer) filter.customer = customer;
    if (search) filter.title = { $regex: search, $options: 'i' };

    const deals = await populateDeal(
      Deal.find(filter).sort({ updatedAt: -1 })
    );

    return res.json({ success: true, count: deals.length, data: deals });
  } catch (error) {
    console.error('Erro ao listar negociações:', error.message);
    return res.status(500).json({ success: false, message: 'Erro ao listar negociações' });
  }
};

const getDeal = async (req, res) => {
  try {
    const deal = await populateDeal(
      Deal.findOne({ _id: req.params.id, owner: req.user.id })
    );

    if (!deal) return res.status(404).json({ success: false, message: 'Negociação não encontrada' });
    return res.json({ success: true, data: deal });
  } catch (error) {
    return res.status(400).json({ success: false, message: 'Negociação inválida' });
  }
};

const createDeal = async (req, res) => {
  try {
    const title = String(req.body.title || '').trim();
    if (!title) {
      return res.status(400).json({ success: false, message: 'Informe o título da negociação' });
    }

    const data = pick(req.body);
    data.title = title;

    const relation = await validateRelations(req.user.id, data);
    if (!relation.ok) return res.status(400).json({ success: false, message: relation.message });

    const prepared = prepareStageData(data);
    if (prepared.stage === 'perdido' && !String(prepared.lossReason || '').trim()) {
      return res.status(400).json({ success: false, message: 'Informe o motivo da perda' });
    }

    const deal = await Deal.create({ ...prepared, owner: req.user.id });
    const populated = await populateDeal(Deal.findById(deal._id));

    return res.status(201).json({
      success: true,
      message: 'Negociação criada com sucesso',
      data: populated,
    });
  } catch (error) {
    console.error('Erro ao criar negociação:', error.message);
    return res.status(400).json({ success: false, message: 'Não foi possível criar a negociação' });
  }
};

const updateDeal = async (req, res) => {
  try {
    const existing = await Deal.findOne({ _id: req.params.id, owner: req.user.id });
    if (!existing) return res.status(404).json({ success: false, message: 'Negociação não encontrada' });

    const data = pick(req.body);
    const relations = {
      lead: data.lead !== undefined ? data.lead : existing.lead,
      customer: data.customer !== undefined ? data.customer : existing.customer,
    };

    const relation = await validateRelations(req.user.id, relations);
    if (!relation.ok) return res.status(400).json({ success: false, message: relation.message });

    const prepared = prepareStageData(data, existing);
    const nextStage = prepared.stage || existing.stage;
    const nextLossReason =
      prepared.lossReason !== undefined ? prepared.lossReason : existing.lossReason;

    if (nextStage === 'perdido' && !String(nextLossReason || '').trim()) {
      return res.status(400).json({ success: false, message: 'Informe o motivo da perda' });
    }

    const deal = await populateDeal(
      Deal.findOneAndUpdate(
        { _id: req.params.id, owner: req.user.id },
        prepared,
        { new: true, runValidators: true }
      )
    );

    return res.json({ success: true, message: 'Negociação atualizada', data: deal });
  } catch (error) {
    console.error('Erro ao atualizar negociação:', error.message);
    return res.status(400).json({ success: false, message: 'Não foi possível atualizar a negociação' });
  }
};

const deleteDeal = async (req, res) => {
  try {
    const deal = await Deal.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
    if (!deal) return res.status(404).json({ success: false, message: 'Negociação não encontrada' });
    return res.json({ success: true, message: 'Negociação excluída' });
  } catch (error) {
    return res.status(400).json({ success: false, message: 'Não foi possível excluir a negociação' });
  }
};

module.exports = {
  listDeals,
  getDeal,
  createDeal,
  updateDeal,
  deleteDeal,
};
