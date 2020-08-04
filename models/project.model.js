const mongoose = require('mongoose')

require('./user.model')
require('./comment.model')

const projectSchema = new mongoose.Schema(
  { 
    title: {
        type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true, toJSON: { virtuals: true } }
)

projectSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'project',
  justOne: false,
})

projectSchema.virtual('likes', {
  ref: 'Like',
  localField: '_id',
  foreignField: 'project',
  justOne: false
})

const Project = mongoose.model('Project', projectSchema)

module.exports = Project