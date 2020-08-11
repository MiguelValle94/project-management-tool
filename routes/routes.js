const express = require('express')
const router = express.Router()
const fileUploader = require('../config/cloudinary.config')
const projectController = require('../controllers/project.controller')
const userController = require('../controllers/user.controller')
const sessionMiddleware = require('../middlewares/session.middleware')

router.get('/', (req, res) => res.redirect('/projects'))

router.get('/login', sessionMiddleware.noAuthenticated, userController.renderLogin)
router.post('/login', sessionMiddleware.noAuthenticated, userController.Login)
router.get('/signup', sessionMiddleware.noAuthenticated, userController.renderSignup)
router.post('/signup', sessionMiddleware.noAuthenticated, fileUploader.single('avatar'), userController.signup)
router.get('/activate/:token', userController.activate)


router.get('/projects',  sessionMiddleware.authenticated, projectController.renderAll)
router.get('/projects/:id', sessionMiddleware.authenticated, projectController.renderProject)
router.post('/projects/:id/like', sessionMiddleware.authenticated, projectController.like)
router.post('/new-comment/:id', sessionMiddleware.authenticated, projectController.newComment)

router.post('/logout', sessionMiddleware.authenticated, userController.logout)

module.exports= router