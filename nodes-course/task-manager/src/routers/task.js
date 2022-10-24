const express = require('express')
const auth = require('../middleware/auth')
const router = new express.Router()
const Task = require('../models/task')


router.post('/tasks', auth, async (req, res) => {
    const task = new Task ({
        ...req.body,
        owner: req.user._id
    })

    console.log(task)

    try {
        await task.save()  //Che è come fare task.save().then...
        res.status(201).send(task) //QUESTO CODICE VIENE ESEGUITO SOLO SE LA AWAIT VA A BUON FINE (e ovvimante dopo che viene eseguita)
    } catch (e) {
        res.status(400).send(e) //se la await genera un errore
    }
})


router.get('/tasks', auth, async (req, res) => {
    try {
        // const tasks = await Task.find({ owner: req.user._id})
        await req.user.populate('tasks').execPopulate()  //Faccio la stessa cosa di sopra, solo he popolo i task dello user che sta nella request
        res.send(req.user.tasks)
    } catch(e) {
        res.status(400).send(e)
    }
})


router.get('/tasks/:id', auth,  async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Task.findOne({ _id, owner: req.user._id})

        if (!task) {
            return res.status(404).send('Errore nella ricerca del task.')
        }

        res.send(task)
    } catch(e) {
        res.status(500).send(e)
    }
})



router.put('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const validFileds = ['description', 'completed']
    const isValid = updates.every((update) => validFileds.includes(update)) //Controlla se la filed passate da modifciare  
                                                                            // esiste (nella lista delle validFileds)
    if (!isValid) {
        return res.status(400).send({ error: 'Nessun aggiornamento. Filed specificata non presente.'})
    }

    try {
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        // Lo faccio a manella senno salta il middleware
        // const task = await Task.findById(req.params.id
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id})

        console.log(task)

        if (!task) {
            res.status(404).send('Errore nel recuper del task.') //il findById non ha trovato niente
        }

        updates.forEach((update) => task[update] = req.body[update])
        await task.save()

        res.send(task)
    } catch(e) {
        res.status(500).send(e)
    }
} )


router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const taskDeleted = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id})

        if (!taskDeleted) {
            return res.status(404).send({ error: "Task da eliminare non trovato."})
        }

        res.send(taskDeleted)
    } catch (e) {
        res.status(500).send()
    }
})







module.exports = router