const express = require('express');
const bodyParser = require('body-parser');
const { userInfo } = require('os');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const { log } = require('console');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const DATABASE_DB = process.env.DATABASE_DB
const DATABASE_HOST = process.env.DATABASE_HOST
const DATABASE_PW = process.env.DATABASE_PW
const DATABASE_USER = process.env.DATABASE_USER




const db = knex({
    client: 'pg',
    connection: {
        host: DATABASE_HOST,
        port: 5432,
        user: DATABASE_USER,
        password: DATABASE_PW,
        database: DATABASE_DB,
    },
});


const app = express();


app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send({status: "success"});
})

app.post('/signin', (req, res) => {signin.handleSignin(req, res, db, bcrypt)});

app.post('/register', (req,res) => {register.handleRegister(req, res, db, bcrypt)});

app.get('/profile/:id', (req, res) => {profile.handleProfileGet(req, res, db)});

app.put("/image", (req, res) => {image.handleImage(req, res, db)});

app.post("/imageurl", (req, res) => {image.handleApiCall(req, res)});




app.listen(3000, () => {
    console.log('app runnin');
})
