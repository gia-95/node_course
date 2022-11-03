const express = require ('express')
require('./db/mongoose') //To start de connection to db
const taskRouter = require('./routers/task')
const userRouter = require('./routers/user')

const app = express()
const port = process.env.PORT

//###################### Middleware ###########################


//#####################  Configurazioni  #####################
app.use(express.json())
app.use(taskRouter)
app.use(userRouter)





app.listen(port, () => {
    console.log('Server is up on port ' + port)
})


// const Task = require('./models/task')
// const User = require('./models/user')

// const main = async () => {
//     const user = await User.findById('635691050dd5003e5883eb67')
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks)
// }

// main()