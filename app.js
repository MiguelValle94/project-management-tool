require('dotenv').config()
const express = require('express')
const logger = require('morgan')
const path = require('path')
const cookieParser = require('cookie-parser')

require('./config/db.config')
require('./config/hbs.config')
const session = require('./config/session.config')

const app = express()

app.use(express.urlencoded({ extended: false })) //Request Object as strings or arrays
app.use(express.static(path.join(__dirname, 'public'))) //Static files
app.use(logger('dev'))
app.use(cookieParser()) //Parse Cookie header and populate req.cookies
app.use(session) //Cookies

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')

const router = require('./routes/routes.js')
app.use('/', router)

app.listen(process.env.PORT, () => {
  console.log('Connected to', process.env.PORT)
})