const express = require('express')
const router = new express.Router()
const User = require('../model/user')

router.post('/users', (req, res) => {
    const user = new User(req.body)

    user.save().then(() => {
        res.status(201).send(user)
    }).catch((e) => {
        console.log(e)
        res.status(400).send(e)
    })
})


router.put('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    try {
        const user = await User.findById(req.params.id)

        updates.forEach((update) => user[update] = req.body[update])
        await user.save()

        if (!user) {
            return res.status(404).send()
        }

        res.send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/login', (req, res) => {
    try {
        const user = User.findByCredentials(req.body.email, req.body.password)
        console.log(user)
        res.send(user)
    } catch(e) {
        res.status(400).send(e)
    }
})


module.exports = router