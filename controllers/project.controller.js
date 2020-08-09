const Project = require('../models/project.model')
const Comment = require('../models/comment.model')

module.exports.renderAll = (req, res, next) => {
  Project.find()
    .sort({ createdAt: -1 })
    .populate('user')
    .populate('comments')
    .populate('likes')
    .limit(20)
    .then((projects) => {
      res.render('projects/wall', {
        projects,
        current: req.currentUser
      })
    })
    .catch(next)
}

module.exports.renderProject= (req, res, next) => {

  Project.findById(req.params.id)
  .populate('user')
  .populate('comments')
  .populate({ 
    path: 'comments',
    populate: {
      path: 'user',
      model: 'User'
    }
  })
  .then(project => {
    res.render('projects/project', {
      project,
      current: req.currentUser
    })
  })
  .catch(next)
}

module.exports.newComment = (req, res) => {
  const commentData = req.body
  commentData.user = req.session.currentUser._id
  commentData.project =  req.params.id
  const comment = new Comment (commentData)

  comment.save()
  .then(() => res.redirect(`/project/${req.params.id}`))
  .catch(err => console.log(err))
}