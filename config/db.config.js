const mongoose = require('mongoose')

mongoose.connect( process.env.MONGOLAB_URI, { useNewUrlParser: true })
  .then(() => console.info('Successfully connected to the database Project-Management-Tool'))
  .catch(error => console.error('An error ocurred trying to connect to de database Project-Management-Tool', error))

process.on('SIGINT', function () {
  mongoose.connection.close(function () {
    console.log('Mongoose disconnected on app termination')
    process.exit(0)
  })
})