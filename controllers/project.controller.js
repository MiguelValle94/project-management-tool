const Project = require('../models/project.model')
const Comment = require('../models/comment.model')
const Like = require('../models/like.model')

module.exports.renderAll = (req, res, next) => {
  Project.find()
    .sort({ createdAt: -1 })
    .populate('user')
    .populate('comments')
    .populate('likes')
    .limit(20)
    .then(projects => {
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

module.exports.renderForm = (req, res, next) => {
  res.render('projects/project-form')
}

module.exports.createProject = (req, res) => {
  const projectData = req.body
  projectData.user = req.currentUser._id
  const project = new Project (projectData)

  project.save()
  .then(() => res.redirect(`/profile/${req.currentUser._id}`))
  .catch(err => console.log(err))
}

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