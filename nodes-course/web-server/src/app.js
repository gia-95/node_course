const express = require ('express')
const path = require('path')
const hbs = require ('hbs')
const forecast = require('./utils/forecast')

//#######################################################################################################

const app = express()

// Definizione path Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handler engine e view location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)


//Setup path of static resurce
app.use(express.static(publicDirectoryPath))



app.get('', (req, res) => {
    res.render('index', {
        title: "Weather page",
        author: "Gianluca"
    })
})

app.get('/help', (req, res) => {
    res.render('helpPage', {
        title: 'Help page',
        name: "Gianluca"
    })
})

app.get('/about', (req, res) => {
    res.render('aboutPage', {
        title: 'About page',
        name: "Gianluca"
    })
})


app.get('/weather', (req, res) => {

    if (!req.query.address) {
        return res.send('Address not specificated.')
    }

    const add = req.query.address

    forecast(add, (error, data) => {
        if (error){
            return res.send({error})
        }

        res.send({
            location: add,
            forecast: data.weather_descriptions[0],
            temperature: data.temperature,
        })
    })


})

//####### Pagine errori #########

//Questa pagina non prende gli stili non so perchè
app.get('/help/*' , (req, res) => {
    res.render('errorPage', {
        title: 'Errpr page',
        name: "Gianluca",
        errorMessage: 'This page of help doesnt exits'
    })
})

app.get('*', (req, res) => {
    res.render('errorPage', {
        title: 'Errpr page',
        name: "Gianluca",
        errorMessage: 'Page not found!'
    })
})


app.listen(3000, () => {
    console.log('Server is listen!')
})
