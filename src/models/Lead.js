const mongoose = require('mongoose');

const STAGES = ['novo', 'contato', 'qualificado', 'proposta', 'negociacao', 'ganho', 'perdido'];
const SOURCES = ['site', 'indicacao', 'instagram', 'linkedin', 'evento', 'prospeccao', 'outro'];

const leadSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Nome do lead é obrigatório'],
      trim: true,
      maxlength: 120,
    },
    company: {
      type: String,
      trim: true,
      maxlength: 120,
      default: '',
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: 160,
      default: '',
    },
    phone: {
      type: String,
      trim: true,
      maxlength: 40,
      default: '',
    },
    source: {
      type: String,
      enum: SOURCES,
      default: 'outro',
    },
    stage: {
      type: String,
      enum: STAGES,
      default: 'novo',
      index: true,
    },
    estimatedValue: {
      type: Number,
      min: 0,
      default: 0,
    },
    tags: [{
      type: String,
      trim: true,
      maxlength: 30,
    }],
    notes: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: '',
    },
    lastContactAt: {
      type: Date,
      default: null,
    },
    nextFollowUpAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

leadSchema.index({ owner: 1, stage: 1 });
leadSchema.index({ owner: 1, name: 1 });
leadSchema.index({ owner: 1, email: 1 });

module.exports = mongoose.model('Lead', leadSchema);
module.exports.STAGES = STAGES;
module.exports.SOURCES = SOURCES;
