const Company = require('../models/Company');
const Contact = require('../models/Contact');
const Deal = require('../models/Deal');
const Activity = require('../models/Activity');

const allowedFields = ['name','legalName','document','segment','website','email','phone','notes','active'];
const pick = (body) => allowedFields.reduce((data, field) => {
  if (body[field] !== undefined) data[field] = body[field];
  return data;
}, {});

const listCompanies = async (req, res) => {
  try {
    const { search, active } = req.query;
    const filter = { owner: req.user.id };
    if (active !== 'all') filter.active = active === 'false' ? false : true;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { legalName: { $regex: search, $options: 'i' } },
        { document: { $regex: search, $options: 'i' } },
        { segment: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    const companies = await Company.find(filter).sort({ updatedAt: -1 });
    return res.json({ success: true, count: companies.length, data: companies });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Erro ao listar empresas' });
  }
};

const getCompany = async (req, res) => {
  try {
    const company = await Company.findOne({ _id: req.params.id, owner: req.user.id });
    if (!company) return res.status(404).json({ success: false, message: 'Empresa não encontrada' });
    return res.json({ success: true, data: company });
  } catch (error) {
    return res.status(400).json({ success: false, message: 'Empresa inválida' });
  }
};

const getCompanyOverview = async (req, res) => {
  try {
    const company = await Company.findOne({ _id: req.params.id, owner: req.user.id });
    if (!company) return res.status(404).json({ success: false, message: 'Empresa não encontrada' });

    const [contacts, deals, activities] = await Promise.all([
      Contact.find({ owner: req.user.id, company: company._id, active: true }).sort({ name: 1 }),
      Deal.find({ owner: req.user.id, company: company._id })
        .populate('contact', 'name role email phone')
        .sort({ updatedAt: -1 }),
      Activity.find({ owner: req.user.id, company: company._id })
        .populate('contact', 'name role')
        .populate('deal', 'title stage value')
        .sort({ occurredAt: -1, createdAt: -1 })
        .limit(50),
    ]);

    return res.json({ success: true, data: { company, contacts, deals, activities } });
  } catch (error) {
    return res.status(400).json({ success: false, message: 'Não foi possível carregar a visão 360º da empresa' });
  }
};

const createCompany = async (req, res) => {
  try {
    const name = String(req.body.name || '').trim();
    if (!name) return res.status(400).json({ success: false, message: 'Informe o nome da empresa' });
    const company = await Company.create({ ...pick(req.body), name, owner: req.user.id });
    return res.status(201).json({ success: true, message: 'Empresa criada com sucesso', data: company });
  } catch (error) {
    console.error('Erro ao criar empresa:', error.message);
    return res.status(400).json({ success: false, message: 'Não foi possível criar a empresa' });
  }
};

const updateCompany = async (req, res) => {
  try {
    const company = await Company.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      pick(req.body),
      { new: true, runValidators: true }
    );
    if (!company) return res.status(404).json({ success: false, message: 'Empresa não encontrada' });
    return res.json({ success: true, message: 'Empresa atualizada', data: company });
  } catch (error) {
    return res.status(400).json({ success: false, message: 'Não foi possível atualizar a empresa' });
  }
};

const deleteCompany = async (req, res) => {
  try {
    const company = await Company.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      { active: false },
      { new: true }
    );
    if (!company) return res.status(404).json({ success: false, message: 'Empresa não encontrada' });
    await Contact.updateMany({ owner: req.user.id, company: company._id }, { $set: { active: false } });
    return res.json({ success: true, message: 'Empresa e contatos vinculados foram arquivados', data: company });
  } catch (error) {
    return res.status(400).json({ success: false, message: 'Não foi possível arquivar a empresa' });
  }
};

module.exports = { listCompanies, getCompany, getCompanyOverview, createCompany, updateCompany, deleteCompany };
