const express = require('express')
const auth = require('../middleware/auth')
const router = new express.Router()
const Task = require('../models/task')
const multer = require('multer')

//###############################################################



//###############################################################

router.post('/tasks', auth, async (req, res) => {
    const task = new Task ({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save()  //Che è come fare task.save().then...
        res.status(201).send(task) //QUESTO CODICE VIENE ESEGUITO SOLO SE LA AWAIT VA A BUON FINE (e ovvimante dopo che viene eseguita)
    } catch (e) {
        res.status(400).send(e) //se la await genera un errore
    }
})


// GET /tasks?completed=(true or false or nothing)
// GET /tasks?limit=10&skip=10 (10 per pagina, parti dal 10 (seconda pagina))
// Get /tasks?orderBy=createdAt:asc   oppure /tasks/orderBy=completed:desc
router.get('/tasks', auth, async (req, res) => {
    try {
        // const tasks = await Task.find({ owner: req.user._id})
        // await req.user.populate('tasks').execPopulate()  //Faccio la stessa cosa di sopra, solo he popolo i task dello user che sta nella request
        
        //Qua un'altra cosa ancora (con il parametro)

        const match = {}
        const sort = {}

        if (req.query.completed) { //Se nella query lho specificato prende il valore (come stringa), senno undefined
            match.completed = req.query.completed === 'true'   //perche lo devo far diventare un booleano
        }

        if (req.query.orderBy) {
            const parts = req.query.orderBy.split(':')
            sort[parts[0]] = parts[1] === 'desc' ? 1 : -1 //Se parts[1] = desc allora 1 sennò -1 (sarebbe ordine cres o decres)
        }

        await req.user.populate({
            path: 'tasks',
            match: match,  //'match' deve essere un ogetto con le propietà su cui voglio filtrare
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        
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