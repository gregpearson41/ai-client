const mongoose = require('mongoose');
const { ROLES } = require('../config/roles');

const roleSchema = new mongoose.Schema(
  {
    role_name: {
      type: String,
      required: [true, 'Role name is required'],
      unique: true,
      trim: true,
      enum: {
        values: Object.values(ROLES),
        message: 'Role name must be one of: ' + Object.values(ROLES).join(', ')
      }
    },
    description: {
      type: String,
      trim: true
    },
    creation_time: {
      type: Date,
      default: Date.now
    }
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        delete ret.__v;
        return ret;
      }
    }
  }
);

const Role = mongoose.model('Role', roleSchema);

module.exports = Role;
