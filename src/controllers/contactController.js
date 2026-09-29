const Contact = require('../models/Contact');
const Company = require('../models/Company');
const Deal = require('../models/Deal');
const Activity = require('../models/Activity');

const allowedFields = ['company','name','role','email','phone','whatsapp','notes','active'];
const pick = (body) => allowedFields.reduce((data, field) => {
  if (body[field] !== undefined) data[field] = body[field] === '' ? null : body[field];
  return data;
}, {});

const validateCompany = async (owner, companyId) => {
  if (!companyId) return true;
  return Boolean(await Company.exists({ _id: companyId, owner, active: true }));
};

const listContacts = async (req, res) => {
  try {
    const { search, company, active } = req.query;
    const filter = { owner: req.user.id };
    if (company) filter.company = company;
    if (active !== 'all') filter.active = active === 'false' ? false : true;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { role: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }
    const contacts = await Contact.find(filter).populate('company', 'name segment').sort({ updatedAt: -1 });
    return res.json({ success: true, count: contacts.length, data: contacts });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Erro ao listar contatos' });
  }
};

const getContact = async (req, res) => {
  try {
    const contact = await Contact.findOne({ _id: req.params.id, owner: req.user.id }).populate('company', 'name segment');
    if (!contact) return res.status(404).json({ success: false, message: 'Contato não encontrado' });
    return res.json({ success: true, data: contact });
  } catch (error) {
    return res.status(400).json({ success: false, message: 'Contato inválido' });
  }
};

const getContactOverview = async (req, res) => {
  try {
    const contact = await Contact.findOne({ _id: req.params.id, owner: req.user.id }).populate('company', 'name segment website');
    if (!contact) return res.status(404).json({ success: false, message: 'Contato não encontrado' });

    const [deals, activities] = await Promise.all([
      Deal.find({ owner: req.user.id, contact: contact._id }).populate('company', 'name segment').sort({ updatedAt: -1 }),
      Activity.find({ owner: req.user.id, contact: contact._id })
        .populate('company', 'name')
        .populate('deal', 'title stage value')
        .sort({ occurredAt: -1, createdAt: -1 })
        .limit(50),
    ]);

    return res.json({ success: true, data: { contact, deals, activities } });
  } catch (error) {
    return res.status(400).json({ success: false, message: 'Não foi possível carregar a visão 360º do contato' });
  }
};

const createContact = async (req, res) => {
  try {
    const name = String(req.body.name || '').trim();
    if (!name) return res.status(400).json({ success: false, message: 'Informe o nome do contato' });
    const data = pick(req.body);
    if (!(await validateCompany(req.user.id, data.company))) {
      return res.status(400).json({ success: false, message: 'Empresa não encontrada' });
    }
    const contact = await Contact.create({ ...data, name, owner: req.user.id });
    const populated = await Contact.findById(contact._id).populate('company', 'name segment');
    return res.status(201).json({ success: true, message: 'Contato criado com sucesso', data: populated });
  } catch (error) {
    console.error('Erro ao criar contato:', error.message);
    return res.status(400).json({ success: false, message: 'Não foi possível criar o contato' });
  }
};

const updateContact = async (req, res) => {
  try {
    const data = pick(req.body);
    if (data.company !== undefined && !(await validateCompany(req.user.id, data.company))) {
      return res.status(400).json({ success: false, message: 'Empresa não encontrada' });
    }
    const contact = await Contact.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      data,
      { new: true, runValidators: true }
    ).populate('company', 'name segment');
    if (!contact) return res.status(404).json({ success: false, message: 'Contato não encontrado' });
    return res.json({ success: true, message: 'Contato atualizado', data: contact });
  } catch (error) {
    return res.status(400).json({ success: false, message: 'Não foi possível atualizar o contato' });
  }
};

const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      { active: false },
      { new: true }
    );
    if (!contact) return res.status(404).json({ success: false, message: 'Contato não encontrado' });
    return res.json({ success: true, message: 'Contato arquivado', data: contact });
  } catch (error) {
    return res.status(400).json({ success: false, message: 'Não foi possível arquivar o contato' });
  }
};

module.exports = { listContacts, getContact, getContactOverview, createContact, updateContact, deleteContact };
