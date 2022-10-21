const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
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
        unique: true,  //Da un errore (non interpretabile) se ci sono due mail uguale (quando provo a salvarlo)
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

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error ('Errore nel login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Errore nel login.')
    }

    return user
}


// MIDDLEWARE: Esegue questo codice ogni volta prima di 'save()'
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User