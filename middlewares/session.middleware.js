const User = require('../models/user.model')
const Project = require('../models/project.model')

module.exports.authenticated = (req, res, next) => {
  User.findById(req.session.userId)
    .then(user => {
      if (user) {
        req.currentUser = user
        res.locals.currentUser = user

        next()
      } else {
        res.redirect('/login')
      }
    })
    .catch(next)
}


module.exports.noAuthenticated = (req, res, next) => {
  User.findById(req.session.userId)
    .then((user) => {
      if (user) {
        res.redirect('/')
      } else {
        next()
      }
    })
    .catch(next)
}

module.exports.Owner = (req, res, next) => {
  Project.findById(req.params.id)
    .then(project => {
      if (project.user.toString() === req.currentUser.id.toString()) {
        req.project = project
        next()
      } else {
        res.redirect('/projects')
      }
    })
    .catch(next)
}