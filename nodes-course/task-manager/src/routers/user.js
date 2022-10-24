const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const auth = require('../middleware/auth')

router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        const token = await user.generateAuthToken()

        res.status(201).send({ user, token })
    } catch (e) {
        res.status(500).send(e)
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()

        res.send( { user: user.getPublicProfile(), token }) //se metto solo -user- ho gia il metodo toJSON che lo modifica, lo lascio per avere anche questa verisone
    } catch(e) {
        res.status(400).send(e)
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })

        console.log(req.token);

        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send({ error: e})
    }
})

//Cancelli tutto l'array di tokens
// (se entro con due dispositivi, pc e mobile, e esco solo da pc (/users/logout), sono comuqnue autenticato con mobile.
//   Cos invece mi disloggo da tutto)
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []

        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send({ error: e })
    }
})

router.get('/users/me', auth, (req, res) => {
    res.send(req.user)
})


router.put('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        res.status(400).send('Is not valid operation (invalid fields)')
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.delete()
        res.send(req.user)
    } catch (e) {
        res.status(400).send({ error: e})
    }
})




module.exports = router