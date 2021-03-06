const mongoose = require('mongoose')
const User = require('../models/user.model')
const Project = require('../models/project.model')
const Comment = require('../models/comment.model')
const Like = require('../models/like.model')
const nodemailer = require('../config/nodemailer.config')
const passport = require('passport')


module.exports.renderLogin = (req, res, next) => {
    res.render('users/login')
}

module.exports.Login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (user) {
                user.checkPassword(req.body.password)
                    .then(match => {
                        if (match) {
                            if (user.activation.active) {
                                req.session.userId = user._id
                                res.redirect('/projects')
                            } else {
                                res.render('users/login', {
                                    error: {
                                        validation: {
                                            message: 'Activate your account'
                                        }
                                    }
                                })
                            }
                        } else {
                            res.render('users/login', {
                                error: {
                                    email: {
                                        message: 'User not found'
                                    }
                                }
                            })
                        }
                    })
            } else {
                res.render('users/login', {
                    error: {
                        email: {
                            message: 'User not found',
                        },
                    },
                })
            }
        })
        .catch(next)
}

module.exports.doSocialLogin = (req, res, next) => {
    const passportController = passport.authenticate('slack', (error, user) => {
        if (error) {
            next(error)
        } else {
            req.session.userId = user._id
            res.redirect('/')
        }
    })

    passportController(req, res, next)
}

module.exports.renderSignup = (req, res, next) => {
    res.render('users/signup')
}

module.exports.signup = (req, res, next) => {
    const userParams = req.body
    userParams.avatar = req.file ? req.file.path : null
    const user = new User(userParams)
    console.log(user);

    user.save()
        .then(user => {
            nodemailer.sendValidationEmail(user.email, user.activation.token, user.username)
            res.render('users/login', {
                message: 'Check your email for activation'
            })
        })
        .catch((error) => {
            if (error instanceof mongoose.Error.ValidationError) {
                res.render('users/signup', { error: error.errors, user })
            } else {
                next(error)
            }
        })
        .catch(next)
}

module.exports.activate = (req, res, next) => {
    User.findOne({ 'activation.token': req.params.token })
        .then(user => {
            user.activation.active = true
            user.save()
                .then(user => {
                    res.render('users/login', {
                        message: 'Your account has been activated'
                    })
                })
                .catch(e => next)
        })
        .catch(e => next)
}

module.exports.renderProfile = (req, res, next) => {
    Project.find({ user: req.params.id })
        .sort({ createdAt: -1 })
        .populate('comments')
        .populate('like')
        .then(project => {
            res.render('users/profile', {
                project,
                current: req.currentUser
            })
        })
        .catch(err => console.log(err))
}

module.exports.renderEditProfile = (req, res, next) => {
    User.findById(req.params.id)
        .then(user => {
            res.render('users/edit-profile', { user, current: req.currentUser })
        })
        .catch(err => console.log(err))
}

module.exports.editProfile = (req, res, next) => {
    const { username, email, password } = req.body
    const avatar = req.file ? req.file.path : null
    User.findByIdAndUpdate(req.params.id, { username, email, avatar, password }, { new: true })
        .then(user => {
            req.currentUser = user
            res.redirect(`/profile/${req.currentUser._id}`)
        })
        .catch(e => console.log(e))
}

module.exports.logout = (req, res, next) => {
    req.session.destroy()
    res.redirect('/login')
}