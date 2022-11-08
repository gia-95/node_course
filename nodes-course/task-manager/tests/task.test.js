const request = require('supertest')
const app = require('../src/app')
const { userOneId, userOne, setupDatabase, taskThree } = require('./fixtures/db')
const Task = require('../src/models/task')
const { response } = require('../src/app')

beforeEach(setupDatabase)



test('Creao task dell utente loggato.', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'task_test'
        })
        .expect(201)

        const task = await Task.findById(response.body._id)
        expect(task).not.toBeNull()
        expect(task.completed).toBe(false)
})


test('GET tasks for user logged.', async () => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)  //Lo 'userOne' nel setupDatabase crea due tasks.
        .send()
        .expect(200)

        expect(response.body.length).toBe(2)
        expect(response.body[0].owner).toEqual(userOneId.toString())
        expect(response.body[0].description).toEqual('First task')
})

test('Test sicurezza `delete` task', async () => {
    //Lo 'userOne' che c'è nel token non può eliminare il 'taskThree' creato dallo 'userTwo'
    await request(app)
        .delete(`/tasks/${taskThree._id}`)
        .set('Authorization' , `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(404)    // Non lo elimina perchè va a cercare con ID e OWNER.

    const task = Task.findById(taskThree._id)
    expect(task).not.toBeNull()    // Verifico che non lo ha eliminato.
})


