const { calculateTip, fahrenheitToCelsius, celsiusToFahrenheit, add } = require('../src/math')


// 
test('Dovrebbe calcolare total più tip', () => {
    const total  = calculateTip(10, .3)
    expect(total).toBe(13)
})

test('Dovrebbe calcolare il totale con valore default.', () => {
    const total = calculateTip(10)
    expect(total).toBe(12.5)
})

test('Da Fahreneit a Celsius', () => {
    const celsius = fahrenheitToCelsius(32)
    expect(celsius).toBe(0)
})

test('Da Celsius a Fahreneit', () => {
    const celsius = celsiusToFahrenheit(0)
    expect(celsius).toBe(32)
})


// test('Test "add" function async.', (done) => {
//     add(2,3).then((sum) => {
//         expect(sum).toBe(5)
//         done()
//     })
// })



// test('Test "add" function with async - await', async () => {
//     const sum = await add(10, 20)
//     expect(sum).toBe(30)
// })

