const express = require ('express')
require('./db/mongoose') //To start de connection to db
const taskRouter = require('./routers/task')
const userRouter = require('./routers/user')

const app = express()
// const port = process.env.PORT

//###################### Middleware ###########################


//#####################  Configurazioni  #####################
app.use(express.json())
app.use(taskRouter)
app.use(userRouter)



module.exports = app