const mongoose = require('mongoose')
const validator = require('validator')

const User = mongoose.model('User', {
    name: {
        type: String,
        require: true,
        trim: true
    },
    age: {
        type: Number,
        default: 0
    },
    email: {
        type: String,
        lowercase: true,
        trim: true,
        validate (value) {
            if (!validator.isEmail(value)){
                throw new Error('Formato email non valido!')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
        trim: true,
        validate(value) {
            if (value === 'password') {
                throw new Error('La password non può essere -> password')
            }
        }

    }
})

module.exports = User