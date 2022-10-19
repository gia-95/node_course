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
    

    //   --> INSERIMENTO DI UN DOCUMENTO
    // db.collection('users').insertOne({
    //     name: 'Gianluca',
    //     age: 27
    // })

// ----->    INSERIMENTO DI PIù DOCUMENTI
//    db.collection('tasks').insertMany([
//        {
//            description: "task-3",
//            completed: false
//        },
//        {
//            description: "task-4",
//            completed: true
//        }
//    ], (error, result) => {
//        if (error) {
//            return console.log('Errore inserimento documenti')
//        }
//        console.log(result.insertedCount)
//    })

//   --> FINDONE --> aspetta una callback 
//        (il paramentro id lo devi dare nel costruttore del dell'oggetto ObjectId, sennò non lo torva)
    db.collection('tasks').findOne({ _id: new ObjectId('6350143ec8c90446484705f6') }, (error, task) => {
        if (error){
            return console.log('Errore nel findOne')
        }
        console.log(task)
    })


    //############# IMPORTANTE: find() --> non vuole una callback; torna un contatore, da li o stampo l'array o
    //                          ,ad esempio, chiami il count per contarli e basta, senza portarli in memoria
    // --> FIND --> ritorna un cursore, da li chiami i metodi per stamparli
    db.collection('tasks').find({ completed: true }).toArray((error, array) => {
        console.log(array)
    })

    db.collection('tasks').find({ completed: true }).count((error, count) => {
        if (error) {
            return console.log('Errore nel count')
        }

        console.log(count)
    } )


})