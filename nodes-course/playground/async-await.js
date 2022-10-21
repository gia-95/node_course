const add = (a, b) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve (a+b)
        }, 2000)
    })
}


// await add(..,..) restituisce una variabile come .then(var)
// (then() lo metti ancora dopo, questa funzione async ha il return)
const doWork = async () => {
    const sum1 = await add(1, 99)
    console.log('sum1: ' + sum1)
    const sum2 = await add(sum1, 50)
    console.log('sum2: ' + sum2)
    const sum3 = await add(sum2, 1)
    return sum3
}


doWork().then((result) => {
    console.log('Result', result)
}).catch((e) => {
    console.log('e', e)
})