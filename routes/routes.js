const express = require('express')
const router = express.Router()
const multer = require('multer')
const uploads = multer({ dest: './public/uploads' })
const projectController = require('../controllers/project.controller')
const userController = require('../controllers/user.controller')
const sessionMiddleware = require('../middlewares/session.middleware')

router.get('/', (req, res) => res.redirect('/projects'))

router.get('/login', userController.renderLogin)
// router.post('/login', userController.Login)
// router.get('/signup', userController.renderSignup)
// router.post('/users', uploads.single('avatar'), userController.signup)
// router.get('/activate/:token', userController.activateUser)
// router.post('/logout', sessionMiddleware.authenticated, userController.logout)

router.get('/projects', sessionMiddleware.authenticated, projectController.renderAll)
// router.get('/projects/:id', sessionMiddleware.authenticated, projectController.renderProject)
// router.post('/projects/:id/like', sessionMiddleware.authenticated, projectController.like)

module.exports= router