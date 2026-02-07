const mongoose = require('mongoose');

const systemInfoSchema = new mongoose.Schema(
  {
    companyOwner: {
      type: String,
      required: [true, 'Company owner is required'],
      trim: true
    },
    version: {
      type: String,
      required: [true, 'Version is required'],
      trim: true
    },
    buildNumber: {
      type: String,
      required: [true, 'Build number is required'],
      trim: true
    }
  },
  {
    collection: 'systemInfo',
    toJSON: {
      transform: function (doc, ret) {
        delete ret.__v;
        return ret;
      }
    }
  }
);

const SystemInfo = mongoose.model('SystemInfo', systemInfoSchema);

module.exports = SystemInfo;
