const request = require('request')

// Rome
// lat: 41.902782
// lon: 12.496366

const forecast = (lat, lon, callback) => {

    const url = 'http://api.weatherstack.com/current?access_key=64bc98981d7d5794010d39e5b8ceb07b&query=' + lat + ',' + lon
    console.log(url)

    request({url: url, json: true}, (error, response) => {

        if (error) {
            callback('Impossibile connettersi a internet', undefined)
        } else if (response.body.error) {
            callback('Errore nel passaggio parametri', undefined)
        } else {
            callback(undefined, response.body.current.temperature)
        }
    })
}


module.exports = forecast