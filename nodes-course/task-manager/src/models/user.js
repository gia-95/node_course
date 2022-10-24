const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require ('jsonwebtoken')
const Task = require('./task')

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
    },
    tokens: [{
        token: {
            type: String,
            require: true
        }
    }]
})

//Per la referenza: nel Task lho messo proprio come variabile,
//  qua utilizzo una VIRTUAL PROPERTIES che fa la stessa cosa
// Permette a mongoose di capire quale relazione
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

// --> .methods <-- per le istanze individuali
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, 'chiavesegreta')
    
    user.tokens = user.tokens.concat({ token: token })

    await user.save()
    return token
}

// --> .statics <-- per i metodi chiamati su 'User' (maiuscolo)
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

userSchema.methods.getPublicProfile = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}

//Serve per definire cosa stampre ogni volta che fai JSON.stringify(object) --> casta l'oggetto in stringa, con i parametri modificati nella funzione
// (questa cosa viene fatto quando vengono reinoltrate le risposte alle API)
userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}


// MIDDLEWARE: Esegue questo codice ogni volta prima di 'save()'
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

//MIDDLEWARE: Quando viene eliminato uno user, elimina i sui task
userSchema.pre('remove', async function (next) {
    const user = this

    await Task.deleteMany({ owner: user._id })

    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User