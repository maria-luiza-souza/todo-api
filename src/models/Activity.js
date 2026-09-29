const mongoose = require('mongoose');

const TYPES = ['ligacao', 'whatsapp', 'email', 'reuniao', 'nota', 'followup'];

const activitySchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: TYPES,
      default: 'nota',
    },
    title: {
      type: String,
      required: [true, 'Título da interação é obrigatório'],
      trim: true,
      maxlength: 160,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: '',
    },
    occurredAt: {
      type: Date,
      default: Date.now,
    },
    scheduledFor: {
      type: Date,
      default: null,
    },
    completed: {
      type: Boolean,
      default: true,
    },
    lead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lead',
      default: null,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      default: null,
    },
    deal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Deal',
      default: null,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      default: null,
    },
    contact: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contact',
      default: null,
    },
  },
  { timestamps: true }
);

activitySchema.index({ owner: 1, createdAt: -1 });
activitySchema.index({ owner: 1, lead: 1 });
activitySchema.index({ owner: 1, customer: 1 });
activitySchema.index({ owner: 1, deal: 1 });
activitySchema.index({ owner: 1, company: 1 });
activitySchema.index({ owner: 1, contact: 1 });
activitySchema.index({ owner: 1, scheduledFor: 1, completed: 1 });

module.exports = mongoose.model('Activity', activitySchema);
module.exports.TYPES = TYPES;
