const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: [true, 'Nome da empresa é obrigatório'], trim: true, maxlength: 160 },
    legalName: { type: String, trim: true, maxlength: 180, default: '' },
    document: { type: String, trim: true, maxlength: 30, default: '' },
    segment: { type: String, trim: true, maxlength: 100, default: '' },
    website: { type: String, trim: true, maxlength: 240, default: '' },
    email: { type: String, trim: true, lowercase: true, maxlength: 160, default: '' },
    phone: { type: String, trim: true, maxlength: 40, default: '' },
    notes: { type: String, trim: true, maxlength: 2000, default: '' },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

companySchema.index({ owner: 1, name: 1 });
companySchema.index({ owner: 1, document: 1 });
companySchema.index({ owner: 1, active: 1 });

module.exports = mongoose.model('Company', companySchema);
