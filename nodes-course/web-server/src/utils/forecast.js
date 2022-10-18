const request = require('request')

// Rome
// lat: 41.902782
// lon: 12.496366

const forecast = (address, callback) => {

    const url = 'http://api.weatherstack.com/current?access_key=64bc98981d7d5794010d39e5b8ceb07b&query='+ address


    request({url: url, json: true}, (error, response) => {

        if (error) {
            callback('Impossibile connettersi a internet', undefined)
        } else if (response.body.error) {
            callback('Località non trovata...', undefined)
        } else {
            callback(undefined, response.body.current)
        }
    })
}


module.exports = forecast