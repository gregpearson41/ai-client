const mongoose = require('mongoose');

const promptSchema = new mongoose.Schema(
  {
    prompt_name: {
      type: String,
      required: [true, 'Prompt name is required'],
      trim: true
    },
    prompt: {
      type: String,
      required: [true, 'Prompt is required'],
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    created_by: {
      type: String,
      required: [true, 'Created by is required'],
      trim: true
    },
    chat_engine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ChatEngine',
      default: null
    },
    created_date: {
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

// Indexes for faster queries
promptSchema.index({ prompt_name: 1 });
promptSchema.index({ created_by: 1 });
promptSchema.index({ chat_engine: 1 });

const Prompt = mongoose.model('Prompt', promptSchema);
module.exports = Prompt;
