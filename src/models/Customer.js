const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Nome do cliente é obrigatório'],
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
    document: {
      type: String,
      trim: true,
      maxlength: 30,
      default: '',
    },
    segment: {
      type: String,
      trim: true,
      maxlength: 80,
      default: '',
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: '',
    },
    sourceLead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lead',
      default: null,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

customerSchema.index({ owner: 1, name: 1 });
customerSchema.index({ owner: 1, email: 1 });
customerSchema.index({ owner: 1, active: 1 });

module.exports = mongoose.model('Customer', customerSchema);
