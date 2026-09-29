const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', default: null, index: true },
    name: { type: String, required: [true, 'Nome do contato é obrigatório'], trim: true, maxlength: 140 },
    role: { type: String, trim: true, maxlength: 120, default: '' },
    email: { type: String, trim: true, lowercase: true, maxlength: 160, default: '' },
    phone: { type: String, trim: true, maxlength: 40, default: '' },
    whatsapp: { type: String, trim: true, maxlength: 40, default: '' },
    notes: { type: String, trim: true, maxlength: 2000, default: '' },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

contactSchema.index({ owner: 1, name: 1 });
contactSchema.index({ owner: 1, email: 1 });
contactSchema.index({ owner: 1, company: 1, active: 1 });

module.exports = mongoose.model('Contact', contactSchema);
