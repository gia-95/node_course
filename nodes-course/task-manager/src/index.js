const express = require ('express')
require('./db/mongoose') //To start de connection to db
const taskRouter = require('./routers/task')
const userRouter = require('./routers/user')

const app = express()

//###################### Middleware ###########################


//#####################  Configurazioni  #####################
app.use(express.json())
app.use(taskRouter)
app.use(userRouter)



app.listen(3000, () => {
    console.log('Server is up on port 3000.')
})


// const Task = require('./models/task')
// const User = require('./models/user')

// const main = async () => {
//     const user = await User.findById('635691050dd5003e5883eb67')
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks)
// }

// main()