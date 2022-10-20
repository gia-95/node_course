const mongoose = require('mongoose')

const Task = mongoose.model('task', {
    description: {
        type: String,
        require: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    }
})

module.exports = Task