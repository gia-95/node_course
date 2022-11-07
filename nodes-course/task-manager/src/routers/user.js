const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const {sendWelcomeEmail, sendGoodByEmail} = require('../email/account')


//#################### Config MULTER (per scambio file/images) ###########################################
const upload = multer({
    limits: {
        fileSize: 1000000 //Byte
    },
    fileFilter (req, file, cb) {
        if (!file.originalname.match(/\.(jpg|png|jpeg)$/)) {   //Espressione regolare*
            return cb(new Error('Formato file non valido!'))
        }   

        cb(undefined, true)
    }
})
//###############################################################

router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(500).send({ error: e })
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
        sendGoodByEmail(req.user.email, req.user.name)
        res.send(req.user)
    } catch (e) {
        res.status(500).send({ error: e})
    }
})


router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    //Prima con il pacchetto Sharp, ridimensiono e cast a png l'immagine nel payload di richiesta
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => { //Questo è l'handler per gli errori; se viene generato un errore, 
    res.status(400).send({ error: error.message})    // (in questo caso la filter di 'upload' genera errrore se il formato non è valido)
})                                                   // cattura l'errore e chiama quella callback li


router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send('Avatar utente eliminato correttamente!')
}, (error, req, res, next) => {
    res.status(400).sned({ error: error.message })
})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error('User o avatar non trovato')
        }

        res.set('Content-Type', 'image/png')   // imposti nell'Header il fatto che il contenuto è un'immagine
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send({ error: error.message })
    }
})



module.exports = router