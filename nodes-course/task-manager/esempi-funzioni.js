
    //   --> INSERIMENTO DI UN DOCUMENTO
    // db.collection('users').insertOne({
    //     name: 'Gianluca',
    //     age: 27
    // })

// ----->    INSERIMENTO DI PIù DOCUMENTI
//    db.collection('tasks').insertMany([
//        {
//            description: "task-1",
//            completed: false
//        },
//        {
//            description: "task-2",
//            completed: false
//        }
//    ], (error, result) => {
//        if (error) {
//            return console.log('Errore inserimento documenti')
//        }
//        console.log(result.insertedCount)
//    })

//   --> FINDONE --> aspetta una callback 
//        (il paramentro id lo devi dare nel costruttore del dell'oggetto ObjectId, sennò non lo torva)
    // db.collection('tasks').findOne({ _id: new ObjectId('6350143ec8c90446484705f6') }, (error, task) => {
    //     if (error){
    //         return console.log('Errore nel findOne')
    //     }
    //     console.log(task)
    // })


    //############# IMPORTANTE: find() --> non vuole una callback; torna un contatore, da li o stampo l'array o
    //                          ,ad esempio, chiami il count per contarli e basta, senza portarli in memoria
    // --> FIND --> ritorna un cursore, da li chiami i metodi per stamparli
    // db.collection('tasks').find({ completed: true }).toArray((error, array) => {
    //     console.log(array)
    // })

    // db.collection('tasks').find({ completed: true }).count((error, count) => {
    //     if (error) {
    //         return console.log('Errore nel count')
    //     }

    //     console.log(count)
    // } )



        //UPDATE --> usando Promise
    // (Vedi la doc per gli operatori dell'update)
    // db.collection('tasks').updateMany(
    //     {
    //         completed: false
    //     },{
    //         $set:
    //         {
    //             completed: true        
    //         }
    //     }
    // ).then((result) => {
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(error)
    // })


        //DeleteOne...
    // db.collection('tasks').deleteOne(
    //     {
    //        description: 'task-2' 
    //     }
    // ).then((result) => {
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(error)
    // })