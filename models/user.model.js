const bcrypt = require('bcrypt')
const mongoose = require('mongoose')

const generateRandomToken = () => {
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let token = ''
  for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length)]
  }
  return token
}

const userSchema = new mongoose.Schema(
    {
        email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true,
        },
        username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
        trim: true,
        lowercase: true,
        },
        avatar: {
        type: String,
        },
        password: {
        type: String,
        minlength: 6,
        },
        activation: {
        active: {
            type: Boolean,
            default: false
        },
        token: {
            type: String,
            default: generateRandomToken
        }
        }
    },
    { timestamps: true, toJSON: { virtuals: true } }
  )

userSchema.pre('save', function (next) {
  if (this.isModified('password')) {
    bcrypt.hash(this.password, 10).then((hash) => {
      this.password = hash
      next()
    })
  } else {
    next()
  }
})

userSchema.methods.checkPassword = function (password) {
  return bcrypt.compare(password, this.password)
}

const User = mongoose.model('User', userSchema)

module.exports = User
