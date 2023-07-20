// imports
require('dotenv').config()
const express = require("express")

const mongoose = require('mongoose')
const connectToDB = require('./database/database')

const cors = require('cors')
const logger = require('morgan')


const app = express()

let PORT = process.env.PORT || 3001

const songsController = require('./controllers/songs')

// connect to database

const db = mongoose.connection

connectToDB()

db.on('error', err => console.log(err.message + ' is Mongod not running?'))
db.on('disconnected', () => console.log('mongo disconnected'))

// middleware

app.use(logger('dev'))
app.use(express.json())

app.use(express.urlencoded())

app.use(cors({ origin: '*' }))

app.use(express.urlencoded({ extended: false }))

// routes

app.use('/songs', songsController)

// listen

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})