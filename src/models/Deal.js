const mongoose = require('mongoose');

const STAGES = ['descoberta', 'qualificacao', 'proposta', 'negociacao', 'ganho', 'perdido'];

const dealSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Título da negociação é obrigatório'],
      trim: true,
      maxlength: 160,
    },
    lead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lead',
      default: null,
      index: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      default: null,
      index: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      default: null,
      index: true,
    },
    contact: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contact',
      default: null,
      index: true,
    },
    stage: {
      type: String,
      enum: STAGES,
      default: 'descoberta',
      index: true,
    },
    value: {
      type: Number,
      min: 0,
      default: 0,
    },
    probability: {
      type: Number,
      min: 0,
      max: 100,
      default: 10,
    },
    expectedCloseDate: {
      type: Date,
      default: null,
    },
    responsible: {
      type: String,
      trim: true,
      maxlength: 100,
      default: 'Eu',
    },
    lossReason: {
      type: String,
      trim: true,
      maxlength: 240,
      default: '',
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: '',
    },
    stageChangedAt: {
      type: Date,
      default: Date.now,
    },
    wonAt: {
      type: Date,
      default: null,
    },
    lostAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

dealSchema.index({ owner: 1, stage: 1 });
dealSchema.index({ owner: 1, expectedCloseDate: 1 });
dealSchema.index({ owner: 1, updatedAt: -1 });

module.exports = mongoose.model('Deal', dealSchema);
module.exports.STAGES = STAGES;
