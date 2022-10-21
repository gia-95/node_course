require('../src/db/mongoose')
const Task = require('../src/model/task')

//########################## CANCELLA DOC BY ID E CONTA ##########################

//Promise-chaining --> per non fare callbacak annidate
// Task.findByIdAndDelete('63511d3e0efc79087fb90bc0').then((result) => {
//     console.log(result)
//     return Task.countDocuments({ completed: false })
// }).then((count) => {
//     console.log(count + ' documents incopleted.')
// }).catch((e) => {
//     console.log('Error' , e)
// })


//Stessa cosa con async/await
const deleteTaskAndCount = async (_id) => {
    const task = await Task.findByIdAndDelete(_id)
    const count = await Task.countDocuments({ completed: false })
    return count
} //vorrei restituire un oggetto sia con task eliminato che con coutn,
  // ma NON ci riesco!


deleteTaskAndCount('63525e1bb0ed25076d8b3968').then((count) => {
    console.log(count + ' tasks incompleted.')
}).catch((e) => {
    console.log('e', e)
})
