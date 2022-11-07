const request = require('supertest')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const app = require('../src/app')
const User = require('../src/models/user')


const userOneId = new mongoose.Types.ObjectId()

const userOne = {
    _id: userOneId,
    name: "Gianluca",
    email: "gianluca@example.it",
    password: "MyPass123456!",
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }]
}

beforeEach( async () => {
    await User.deleteMany()
    await new User(userOne).save()
})

test('Test add a new user.', async () => {
    const response = await request(app).post('/users').send({
        name: "Marco",
        email: "marco@marco.it",
        password: "MyPass123456!"
    }).expect(201)


    // Test verifica aggiunta
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    //Test verifica struttura risposta e password non in chairo
    expect(response.body).toMatchObject({
        user: {
            name: 'Marco',
            email: 'marco@marco.it'
        },
        token: user.tokens[0].token
    })
    expect(user.password).not.toBe('MyPass12345!')
})


test('Login with existing user.', async () => {
   const response = await request(app).post('/users/login').send({
        email: 'gianluca@example.it',
        password: 'MyPass123456!'
    }).expect(200)

    //Test dell'aggiunta del nuovo token
    const user = await User.findById(userOneId)
    expect(user).not.toBeNull()
    expect(response.body.token).toBe(user.tokens[1].token)
})


test('Login not succesfull (user not existis).', async () => {
    await request(app).post('/users/login').send({
        email: 'gianluca@example.it',
        password: 'passwordSbagliata'
    }).expect(400)
})

test('Test get profile (/users/me).', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Test login errata per autenticazione errata (mancanza token)', async () => {
    await request(app)
        .post('/users/me')
        .send()
        .expect(404)
})


test('Delete account.', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

        // Verifico utente eliminato
        const user = await User.findById(userOneId)
        expect(user).toBeNull()
})

test('Not delete account for unauthentication (mancanza token).', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})


test('Upload avatar image.', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/barca.jpg')
         .expect(200)

    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Update the name filed.', async () => {
    await request(app)
        .put('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'Jess'
        })
        .expect(200)

        const user = await User.findById(userOneId)
        expect(user.name).toEqual('Jess')
})
