console.log('Test js')


const weatherForm = document.querySelector('form')
const input = document.querySelector('input')
const msg1 = document.querySelector('#message-1')
const msg2 = document.querySelector('#message-2')
const msg3 = document.querySelector('#message-3')


weatherForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const url = 'http://localhost:3000/weather?address=' + input.value

    fetch(url).then((response) => {
        response.json().then((data) => {
            if (data.error) {
                return msg1.textContent = data.error
            }

            msg1.textContent = 'Località: ' + data.location
            msg2.textContent = 'Meteo: ' + data.forecast
            msg3.textContent = 'Temperatura: ' + data.temperature + '°'
        })
    })


})