const Project = require('../models/project.model')

module.exports.renderAll = (req, res, next) => {
  Project.find()
    .sort({ createdAt: -1 })
    .populate('user')
    .populate('comments')
    .populate('likes')
    .then((projects) => {
      res.render('projects/wall', {
        projects,
        user: req.currentUser
      })
    })
    .catch(next)
}