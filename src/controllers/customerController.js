const Customer = require('../models/Customer');
const Activity = require('../models/Activity');

const allowedFields = ['name', 'company', 'email', 'phone', 'document', 'segment', 'notes', 'active'];

const pick = (body) =>
  allowedFields.reduce((data, field) => {
    if (body[field] !== undefined) data[field] = body[field];
    return data;
  }, {});

const listCustomers = async (req, res) => {
  try {
    const { search, active } = req.query;
    const filter = { owner: req.user.id };

    if (active !== 'all') filter.active = active === 'false' ? false : true;

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { document: { $regex: search, $options: 'i' } },
      ];
    }

    const customers = await Customer.find(filter).sort({ updatedAt: -1 });
    return res.json({ success: true, count: customers.length, data: customers });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Erro ao listar clientes' });
  }
};

const getCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOne({ _id: req.params.id, owner: req.user.id });
    if (!customer) return res.status(404).json({ success: false, message: 'Cliente não encontrado' });
    return res.json({ success: true, data: customer });
  } catch (error) {
    return res.status(400).json({ success: false, message: 'Cliente inválido' });
  }
};

const createCustomer = async (req, res) => {
  try {
    if (!req.body.name || !String(req.body.name).trim()) {
      return res.status(400).json({ success: false, message: 'Informe o nome do cliente' });
    }

    const customer = await Customer.create({ ...pick(req.body), owner: req.user.id });
    return res.status(201).json({ success: true, message: 'Cliente criado com sucesso', data: customer });
  } catch (error) {
    console.error('Erro ao criar cliente:', error.message);
    return res.status(400).json({ success: false, message: 'Não foi possível criar o cliente' });
  }
};

const updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      pick(req.body),
      { new: true, runValidators: true }
    );

    if (!customer) return res.status(404).json({ success: false, message: 'Cliente não encontrado' });
    return res.json({ success: true, message: 'Cliente atualizado', data: customer });
  } catch (error) {
    return res.status(400).json({ success: false, message: 'Não foi possível atualizar o cliente' });
  }
};

const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      { active: false },
      { new: true }
    );

    if (!customer) return res.status(404).json({ success: false, message: 'Cliente não encontrado' });

    await Activity.updateMany(
      { owner: req.user.id, customer: customer._id },
      { $set: { completed: true } }
    );

    return res.json({ success: true, message: 'Cliente arquivado', data: customer });
  } catch (error) {
    return res.status(400).json({ success: false, message: 'Não foi possível arquivar o cliente' });
  }
};

module.exports = {
  listCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};
