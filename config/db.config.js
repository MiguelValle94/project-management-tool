const mongoose = require('mongoose')
const MONGOLAB_URI = process.env.MONGOLAB_URI || 'mongodb://127.0.0.1:27017/project-management-tool'

mongoose.connect(MONGOLAB_URI, { useNewUrlParser: true })
  .then(() => console.info('Successfully connected to the database Project-Management-Tool'))
  .catch(error => console.error('An error ocurred trying to connect to de database Project-Management-Tool', error))

process.on('SIGINT', function () {
  mongoose.connection.close(function () {
    console.log('Mongoose disconnected on app termination')
    process.exit(0)
  })
})