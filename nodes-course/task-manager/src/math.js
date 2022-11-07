const calculateTip = (total, tipP = .25) => total + (total * tipP)    // 0.25 è il valore di defautl


const fahrenheitToCelsius = (temp) => {
    return (temp - 32) / 1.8
}

const celsiusToFahrenheit = (temp) => {
    return (temp * 1.8) + 32
}

const add = (a, b) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve (a+b)
        }, 2000)
    })
}

module.exports = {
    calculateTip,
    fahrenheitToCelsius,
    celsiusToFahrenheit,
    add
}
