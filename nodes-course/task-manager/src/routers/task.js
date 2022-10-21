const express = require('express')
const router = new express.Router()
const Task = require('../model/task')


router.post('/tasks', async (req, res) => {
    const task = new Task(req.body)

 // Così è con PROMISE-CHAINING (nanche se non ci sta una chainig)
    // task.save().then(() => {
    //     res.status(201).send(task)
    // }).catch((e) => {
    //     res.status(400).send(e)
    // })

    try {
        await task.save()  //Che è come fare task.save().then...
        res.status(201).send(task) //QUESTO CODICE VIENE ESEGUITO SOLO SE LA AWAIT VA A BUON FINE (e ovvimante dopo che viene eseguita)
    } catch (e) {
        res.status(400).send(e) //se la await genera un errore
    }
})


router.get('/tasks', async (req, res) => {
    // Task.find({}).then((tasks) => {
    //     res.send(tasks)
    // }).catch((e) => {
    //     res.status(500)
    // })

    try {
        const tasks = await Task.find({})
        res.send(tasks)
    } catch(e) {
        res.status(400).send(e)
    }
})


router.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id
    // Task.findById(_id).then((task) => {
    //     if (!task) {
    //         return res.status(400).send('Nessun task trovato.')
    //     }
        
    //     res.send(task)
    // }).catch((e) => {
    //     res.status(500)
    // })

    try {
        const task = await Task.findById(_id)

        if (!task) {
            return res.status(404).send('Task con questo id non trovato.')
        }

        res.send(task)
    } catch(e) {
        res.status(500).send(e)
    }
})



router.put('/tasks/:id', async (req, res) => {
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
        const task = await Task.findById(req.params.id)

        updates.forEach((update) => task[update] = req.body[update])
        await task.save()

        if (!task) {
            res.status(404).send('Task con id specificato non trovato.') //il findById non ha trovato niente
        }

        res.send(task)
    } catch(e) {
        res.status(500).send(e)
    }
} )


router.delete('/tasks/:id', async (req, res) => {
    try {
        const taskDeleted = await Task.findByIdAndDelete(req.params.id)

        if (!taskDeleted) {
            return res.status(404).send({ error: "Task da eliminare non trovato."})
        }

        res.send(taskDeleted)
    } catch (e) {
        res.status(500).send()
    }
})







module.exports = router