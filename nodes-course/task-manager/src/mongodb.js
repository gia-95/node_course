//const mongodb = require ('mongodb')
//const MongoClient = mongodb.MongoClient
//const ObjectId = mongodb.ObjectId

const { MongoClient, ObjectId } = require ('mongodb')

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

// const id = new ObjectId()
// console.log(id)
// console.log(id.getTimestamp())

MongoClient.connect(connectionURL, { useNewUrlParser: true, useUnifiedTopology: true  }, (error, client) => {
    if (error) {
        return console.log('Errore connessione a MongoDB!')
    }

    console.log('Connessione a MongoDB effettuata correttamente!')

    const db = client.db(databaseName)
    




})