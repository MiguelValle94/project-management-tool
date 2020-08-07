const mongoose = require('mongoose')
const User = require('../models/user.model')
const nodemailer = require('../config/nodemailer.config')


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
  
module.exports.renderSignup = (req, res, next) => {
    res.render('users/signup')
}
  
module.exports.signup = (req, res, next) => {
    const userParams = req.body
    //userParams.avatar = req.file.path
    const user = new User(userParams)
  
    user.save()
    .then(user => {
        nodemailer.sendValidationEmail(user.email, user.activation.token, user.username)
        res.render('users/login', {
            message: 'Check your email for activation'
        })
    })
    .catch((error) => {
        if (error instanceof mongoose.Error.ValidationError) {
          res.render("users/signup", { error: error.errors, user });
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
  
module.exports.logout = (req, res, next) => {
    req.session.destroy()
    res.redirect('/login')
}