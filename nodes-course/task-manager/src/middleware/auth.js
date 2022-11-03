const User = require('../models/user')
const jwt = require('jsonwebtoken')

const auth = async (req, res, next ) => {
    try{
        const token = req.header('Authorization').replace('Bearer ', '')
        const decode = jwt.verify(token, process.env.JWT_SECRET)

        const user = await User.findOne({ _id: decode._id, 'tokens.token': token })  //Verifico sia che esiste un utente con quell'ID
                                                                                  // sia che il token sta nella lista dei token dell'utente


        if(!user) {
            throw new Error()
        }

        req.token = token
        req.user = user
        next()
    } catch (e) {
        res.status(500).send('Please authentication!')
    }


}

module.exports = auth