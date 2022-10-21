const express = require ('express')
const User = require('./model/user')
require('./db/mongoose') //To start de connection to db
const taskRouter = require('./routers/task')
const userRouter = require('./routers/user')


//#####################  Configurazioni  #####################
const app = express()
app.use(express.json())
app.use(taskRouter)
app.use(userRouter)


const jwt = require('jsonwebtoken')


const myFunction = () => {
    const token = jwt.sign({ _id: 'abc123' }, 'chiavesegreta', { expiresIn: '1 day'})
    console.log(token)

    const data = jwt.verify(token, 'chiavesegreta')
    console.log(data)
}

myFunction()


app.listen(3000, () => {
    console.log('Server is up on port 3000.')
})