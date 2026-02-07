const mongoose = require('mongoose');

const loginTrackerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    dateTimeStamp: {
      type: Date,
      required: true,
      default: Date.now
    }
  },
  {
    collection: 'loginTracker',
    toJSON: {
      transform: function (doc, ret) {
        delete ret.__v;
        return ret;
      }
    }
  }
);

loginTrackerSchema.index({ userId: 1 });
loginTrackerSchema.index({ dateTimeStamp: -1 });

const LoginTracker = mongoose.model('LoginTracker', loginTrackerSchema);

module.exports = LoginTracker;
