require('../config/db.config')
const mongoose = require('mongoose')
const faker = require('faker')

const User = require('../models/user.model')
const Project = require('../models/project.model')
const Comment = require('../models/comment.model')


const usersId = []

Promise.all([
  User.deleteMany(),
  Project.deleteMany(),
  Comment.deleteMany()
])
  .then(() => {
    for (let i = 0; i < 20; i++) {
      const user = new User({
        email: faker.internet.email(),
        username: faker.internet.userName(),
        avatar: faker.image.avatar(),
        createdAt: faker.date.past(),
      })

      user.save()
        .then(user => {
          usersId.push(user._id)

          for(let j = 0; j < 20; j++) {
            const project = new Project({
              user: user._id,
              title: faker.lorem.sentence(),
              description: faker.lorem.paragraph(),
              image: faker.random.image(),
              link: faker.internet.url(),
              createdAt: faker.date.past(),
            })

            project.save()
              .then(project => {
                for (let k = 0; k < 10; k++) {
                  const comment = new Comment({
                    user: usersId[Math.floor(Math.random() * usersId.length)],
                    project: project._id,
                    text: faker.lorem.paragraph(),
                    createdAt: faker.date.past(),
                  })

                  comment.save()
                }
              })
          }
        })
    }
  })


process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        console.log('Mongoose default connection disconnected through app termination')
        process.exit(0)
    })
})