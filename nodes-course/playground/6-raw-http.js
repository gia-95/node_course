const http = require('http')
const url = 'http://api.weatherstack.com/current?access_key=64bc98981d7d5794010d39e5b8ceb07b&query=40,-75&units=f'

// Praticamente con il modulo 'http' integrato in node.js le cose sono un pò diverse.
// A quanto ho capito: i dati arrivano a 'chunk' ...li aspetto tutti e li metto tutti insieme in --> data 
//  quando hanno finito di arrivare parso la stringa.
// ...per far temrinare la richiesta devi fare --> request.end() - sennò la richiesta rimane 'aperta'
//  (penso per farla stampare)

const request = http.request(url, (response) => {
    let data = ''

    response.on('data', (chunk) => {
        data = data + chunk.toString()
    })

    response.on('end', () => {
        const body = JSON.parse(data)
        console.log(body)
    })

})

request.on('error', (error) => {
    console.log('An error', error)
})

request.end()

