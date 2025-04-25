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
const db = knex({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
        host: process.env.DATABASE_HOST,
        port: 5432,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PW,
        database: process.env.DATABASE_DB,
    },
});

db.raw('SELECT 1')
    .then(() => {
        console.log('Connected to PostgreSQL');
    })
    .catch(err => {
        console.error('Failed to connect to PostgreSQL:', err);
    });

const app = express();


app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    console.log('Root Route hit');
    res.send({status: "API success"});
})

app.post('/signin', (req, res) => {
    console.log('signin route hit')
    signin.handleSignin(req, res, db, bcrypt)});

app.post('/register', (req,res) => {
    console.log('Register route hit:', req.body);
    register.handleRegister(req, res, db, bcrypt)});

app.get('/profile/:id', (req, res) => {profile.handleProfileGet(req, res, db)});

app.put("/image", (req, res) => {image.handleImage(req, res, db)});

app.post("/imageurl", (req, res) => {image.handleApiCall(req, res)});




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
