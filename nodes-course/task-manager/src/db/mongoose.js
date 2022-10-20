const mongoose  = require ('mongoose')

//Setup connection to the database
mongoose.connect('mongodb://127.0.0.1/tasks-manager-api', { useNewUrlParser: true, useUnifiedTopology: true })


