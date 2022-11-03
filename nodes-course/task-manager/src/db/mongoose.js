const mongoose  = require ('mongoose')

const mongodb_url = process.env.MONGODB_URL

//Setup connection to the database
mongoose.connect(mongodb_url, { useNewUrlParser: true, useUnifiedTopology: true })


