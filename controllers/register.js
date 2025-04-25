const handleRegister = (req, res, db, bcrypt) => {
    console.log("registration recieved:", req.body);
    const { email, name, password } = req.body;
    if(!email || !name || !password) {
        console.log('Missing fields');
        return res.status(400).json('incorrect form submission');
    }
    const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return trx('users')
                    .returning('*')
                    .insert({
                        email: loginEmail[0].email,
                        name: name,
                        joined: new Date(),
                        entries: 0
                    }).then(user => {
                        console.log('User successfully registered:', user[0]);
                        res.json(user[0]);
                    })
            })
            .then(trx.commit)
            .catch(trx.rollback)
    })
        .catch(err => {
            console.error('registreation error', err);
            res.status(400).json("unable to register")
        });
}

module.exports = {
    handleRegister
}