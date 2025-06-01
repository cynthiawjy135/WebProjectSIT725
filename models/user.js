const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: {
      type: String,
      required: false,
    },
    avatar: {
      type: String,
      default: null,
    },

    buyer: {
      type: String,
      default: null,
    },

    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);


module.exports = mongoose.models.User || mongoose.model('User', userSchema);
