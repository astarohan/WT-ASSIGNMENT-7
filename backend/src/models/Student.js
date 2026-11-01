const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 60
  },

  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true
  },

  prn: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    match: /^\d{12}$/
  },

  mobile: {
    type: String,
    required: true,
    trim: true,
    match: /^[6-9]\d{9}$/
  },

  course: {
    type: String,
    required: true,
    enum: ['B.Tech', 'M.Tech', 'BCA', 'MCA']
  },

  department: {
    type: String,
    trim: true,
    default: 'Computer Engineering'
  },

  year: {
    type: Number,
    min: 1,
    max: 5,
    default: 1
  }

}, { timestamps: true });

module.exports = mongoose.model('Student', schema);
