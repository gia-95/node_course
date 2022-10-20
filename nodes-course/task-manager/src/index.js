const express = require ('express')
const User = require('./model/user')
const Task = require('./model/task')
require('./db/mongoose') //To start de connection to db


//#####################  Configurazioni  #####################
const app = express()
app.use(express.json())


//#####################  End-point  #####################
app.post('/user', (req, res) => {
    const user = new User(req.body)

    user.save().then(() => {
        res.status(201).send(user)
    }).catch((e) => {
        console.log(e)
        res.status(400).send(e)
    })
})

app.post('/tasks', (req, res) => {
    const task = new Task(req.body)

    task.save().then(() => {
        res.status(201).send(task)
    }).catch((e) => {
        res.status(400).send(e)
    })
})



app.get('/tasks', (req, res) => {
    Task.find({}).then((tasks) => {
        res.send(tasks)
    }).catch((e) => {
        res.status(500)
    })
})

app.get('/tasks/:id', (req, res) => {
    const _id = req.params.id

    Task.findById(_id).then((task) => {
        if (!task) {
            return res.status(400).send('Nessun task trovato.')
        }
        
        res.send(task)
    }).catch((e) => {
        res.status(500)
    })
})





app.listen(3000, () => {
    console.log('Server is up on port 3000.')
})