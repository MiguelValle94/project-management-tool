const Project = require('../models/project.model')
const Comment = require('../models/comment.model')
const Like = require('../models/like.model')

module.exports.newComment = (req, res) => {
    const commentData = req.body
    commentData.user = req.currentUser._id
    commentData.project =  req.params.id
    const comment = new Comment (commentData)
  
    comment.save()
    .then(() => res.redirect(`/projects/${req.params.id}`))
    .catch(err => console.log(err))
  }
  
  module.exports.like = (req, res, next) => {
    const params = { project: req.params.id, user: req.currentUser._id }
  
    Like.findOne(params)
    .then(like => {
      if (like) {
        Like.findByIdAndRemove(like._id)
        .then(() => {
          res.json({ like: -1 })
        })
        .catch(next)
      } else {
        const newLike = new Like(params)
        newLike.save()
        .then(() => {
          res.json({ like: 1 })
        })
        .catch(next)
      }
    })
    .catch(next)
  }