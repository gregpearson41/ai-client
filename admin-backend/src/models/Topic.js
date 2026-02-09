const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema(
  {
    topic_name: {
      type: String,
      required: [true, 'Topic name is required'],
      trim: true
    },
    description: {
      type: String,
      trim: true
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
topicSchema.index({ created_by: 1 });
topicSchema.index({ active: 1 });

const Topic = mongoose.model('Topic', topicSchema);

module.exports = Topic;
