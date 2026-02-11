const mongoose = require('mongoose');

const chatEngineSchema = new mongoose.Schema(
  {
    engine_name: {
      type: String,
      required: [true, 'Engine name is required'],
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    creation_date: {
      type: Date,
      default: Date.now
    },
    api_key: {
      type: String,
      required: [true, 'API key is required'],
      trim: true
    },
    chat_apiUrl: {
      type: String,
      trim: true
    },
    active: {
      type: Boolean,
      default: true
    }
  },
  {
    collection: 'chat_engine',
    toJSON: {
      transform: function (doc, ret) {
        delete ret.__v;
        return ret;
      }
    }
  }
);

// Indexes for faster queries
chatEngineSchema.index({ engine_name: 1 });
chatEngineSchema.index({ active: 1 });

const ChatEngine = mongoose.model('ChatEngine', chatEngineSchema);
module.exports = ChatEngine;
