require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const massive = require('massive')
const session = require('express-session')
const ac = require('./controllers/authController')
const tc = require('./controllers/treasureController')
const auth = require('./middleware/authMiddleware')

const { CONNECTION_STRING, SERVER_PORT: PORT, SESSION_SECRET } = process.env

const app = express()

massive(CONNECTION_STRING).then(db => {
    app.set('db', db)
    console.log('db connected')
})

app.use(bodyParser.json())
app.use(session({
    secret: SESSION_SECRET,
    resave: true,
    saveUninitialized: false
}))

app.post('/auth/login', ac.login)
app.post('/auth/register', ac.register)
app.get('/auth/logout', ac.logout)

app.get('/api/treasure/dragon', tc.dragonTreasure)
app.get('/api/treasure/user', auth.usersOnly, tc.getMyTreasure)
app.get('/api/treasure/all', auth.adminsOnly, tc.getAllTreasure)

app.post('/api/treasure/user', auth.usersOnly, tc.addMyTreasure)

app.listen(PORT, () => {
    console.log('Listening on port', PORT)
})