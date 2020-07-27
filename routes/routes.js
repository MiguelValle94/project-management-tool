const express = require('express')
const router = express.Router()
const multer = require('multer')

router.get('/', (req, res, next) =>  res.render('index'))

module.exports = router