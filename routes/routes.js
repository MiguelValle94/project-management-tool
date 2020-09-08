const express = require('express')
const router = express.Router()
const fileUploader = require('../config/cloudinary.config.js')
const projectController = require('../controllers/project.controller')
const userController = require('../controllers/user.controller')
const commentController = require('../controllers/comment.controller')
const sessionMiddleware = require('../middlewares/session.middleware')
const passport = require('passport')

router.get('/', (req, res) => res.redirect('/projects'))

router.get('/login', sessionMiddleware.noAuthenticated, userController.renderLogin)
router.post('/login', sessionMiddleware.noAuthenticated, userController.Login)
router.get('/auth/slack', sessionMiddleware.noAuthenticated, userController.doSocialLogin)
router.get('/signup', sessionMiddleware.noAuthenticated, userController.renderSignup)
router.post('/signup', sessionMiddleware.noAuthenticated, fileUploader.single('avatar'), userController.signup)
router.get('/activate/:token', userController.activate)

router.get('/projects', sessionMiddleware.authenticated, projectController.renderAll)
router.get('/projects/:id', sessionMiddleware.authenticated, projectController.renderProject)
router.get('/projects/:id/edit', sessionMiddleware.authenticated, sessionMiddleware.Owner, projectController.renderEditForm)
router.post('/projects/:id/edit', sessionMiddleware.authenticated, sessionMiddleware.Owner, fileUploader.single('image'), projectController.edit)
router.get('/new-project', sessionMiddleware.authenticated, projectController.renderCreateForm)
router.post('/new-project', sessionMiddleware.authenticated, fileUploader.single('image'), projectController.createProject)
router.post('/new-comment/:id', sessionMiddleware.authenticated, commentController.newComment)
router.post('/projects/:id/like', sessionMiddleware.authenticated, commentController.like)
router.post('/delete/:id', sessionMiddleware.authenticated, sessionMiddleware.Owner, projectController.deleteProject)

router.get('/profile/:id', sessionMiddleware.authenticated, userController.renderProfile)
router.get('/profile/:id/edit', sessionMiddleware.authenticated, userController.renderEditProfile)
router.post('/profile/:id/edit', sessionMiddleware.authenticated, fileUploader.single('avatar'), userController.editProfile)

router.post('/logout', sessionMiddleware.authenticated, userController.logout)

module.exports = router