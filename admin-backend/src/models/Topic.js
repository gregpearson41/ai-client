const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema(
  {
    topic_name: {
      type: String,
      required: [true, 'Topic name is required'],
      trim: true,
      validate: {
        validator: function (v) {
          return !/\s/.test(v);
        },
        message: 'Topic name must not contain spaces'
      }
    },
    topic_label: {
      type: String,
      required: [true, 'Topic label is required'],
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    prompt: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Prompt',
      default: null
    },
    active: {
      type: Boolean,
      default: true
    },
    created_by: {
      type: String,
      required: [true, 'Created by is required'],
      trim: true
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

// Index for faster queries
topicSchema.index({ topic_name: 1 });
topicSchema.index({ topic_label: 1 });
topicSchema.index({ created_by: 1 });
topicSchema.index({ active: 1 });
topicSchema.index({ prompt: 1 });

const Topic = mongoose.model('Topic', topicSchema);

module.exports = Topic;
