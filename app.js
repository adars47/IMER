const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const mongoose = require("mongoose")
const exphbs = require('express-handlebars')
const path = require('path')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const connectDB = require('./config/db')
const bodyParser = require("body-parser");

dotenv.config({ path: './config/config.env'})


//passport

require('./config/passport')(passport)

connectDB()

const app = express()

if(process.env.NODE_ENV == "development")
{
    app.use(morgan('dev'))
}

//UI
app.engine('.hbs', exphbs.engine({defaultLayout: 'main' ,extname: '.hbs'}));
app.set('view engine','.hbs');

//Session
app.use(session({
    secret: 'choclate rain',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create(
    {    
        mongoUrl: process.env.MONGO_URI}
    )
}))

//passport middleware
app.use(passport.initialize())
app.use(passport.session())


app.use(express.static(path.join(__dirname,"public")))

//to read post data
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use('/',require('./routes/index'))
app.use('/auth',require('./routes/auth'))

const PORT = process.env.port || 5000

app.listen(PORT, console.log("SERVER STARTED"))