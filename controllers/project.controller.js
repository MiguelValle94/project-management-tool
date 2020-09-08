const Project = require('../models/project.model')
const Comment = require('../models/comment.model')
const Like = require('../models/like.model')

module.exports.renderAll = (req, res, next) => {
  const criteria = {}

  if (req.query.search) {
    res.locals.search = req.query.search
    criteria['$or'] = [
      { name: new RegExp(req.query.search, "i") },
      { ['title']: new RegExp(req.query.search, "i") },
    ]
  }

  Project.find(criteria)
    .sort({ createdAt: -1 })
    .populate('user')
    .populate('comments')
    .populate('likes')
    .then(projects => {
      res.render('projects/wall', { projects, current: req.currentUser })
    })
    .catch(next)
}

module.exports.renderProject = (req, res, next) => {

  Project.findById(req.params.id)
    .populate('user')
    .populate({
      path: 'comments',
      options: {
        sort: {
          createdAt: -1
        }
      },
      populate: 'user'
    })
    .then(project => {
      res.render('projects/project', {
        project,
        current: req.currentUser
      })
    })
    .catch(next)
}

module.exports.renderEditForm = (req, res, next) => {
  Project.findById(req.params.id)
    .then(project => {
      res.render('projects/edit-form', { project, current: req.currentUser })
    })
}

module.exports.edit = (req, res, next) => {
  const { title, description, link } = req.body
  const image = req.file ? req.file.path : null
  Project.findByIdAndUpdate(req.params.id, { title, description, link, image }, { new: true })
    .then(() => res.redirect(`/profile/${req.currentUser._id}`))
    .catch(e => console.log(e))
}

module.exports.renderCreateForm = (req, res, next) => {
  res.render('projects/project-form')
}

module.exports.createProject = (req, res) => {
  const projectData = req.body
  projectData.user = req.currentUser._id
  projectData.image = req.file ? req.file.path : null
  const project = new Project(projectData)

  project.save()
    .then(() => res.redirect(`/profile/${req.currentUser._id}`))
    .catch(err => console.log(err))
}

module.exports.deleteProject = (req, res, next) => {
  Project.findByIdAndRemove(req.params.id)
    .then(() => res.redirect('/projects'))
    .catch(e => console.log(e))
}