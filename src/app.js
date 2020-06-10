const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

//console.log(__dirname)
//console.log(path.join(__dirname, '../public'))

const app = express()
const port = process.env.PORT || 3000

// define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
      title: 'Weather',
      name: 'Himanshu Mittal'  
    })
})
app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About ME',
        name: 'Himanshu Mittal'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'This is some helpful text.',
        title: 'Help',
        name: 'Himanshu Mittal'
    })
})
app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
             error: 'You must provide an Address!'
         })
     } 
     geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({ error })
        }
        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({ error })
            }
            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })
    
})
app.get('/products', (req, res) => {
    if (!req.query.search) {
       return res.send({
            error: 'You must provide a search term!'
        })
    }
    console.log(req.query.search)
    res.send({
        products: []
    })
})
app.get('/help/*', (req, res) => {
    res.render('404page', {
        title: '404',
        name: 'Himanshu Mittal',
        errorMessage: 'Help article not found.'
})
})
app.get('*', (req, res) => {
    res.render('404page', {
        title: '404',
        name: 'Himanshu Mittal',
        errorMessage: 'Page not found.'
    })
})

app.listen(port, () => {
    console.log('server is up on the ' + port)
})