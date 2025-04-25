const handleRegister = (req, res, db, bcrypt) => {
    console.log("Registration received:", req.body);
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
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
            console.log('Login insert returned:', loginEmail);
            return trx('users')
                .returning('*')
                .insert({
                    email: loginEmail[0].email,
                    name: name,
                    joined: new Date(),
                    entries: 0
                });
        })
        .then(user => {
            console.log('User insert returned:', user);
            if (user && user[0]) {
                res.json(user[0]);
            } else {
                res.status(500).json({ error: 'User creation failed' });
            }
        })
        .then(trx.commit)
        .catch(err => {
            console.error('Transaction failed, rolling back:', err);
            trx.rollback();
            res.status(500).json({ error: 'Transaction failed' });
        });
    })
    .catch(err => {
        console.error('Outer error in registration:', err);
        res.status(400).json("unable to register");
    });
}

 
module.exports = {
    handleRegister
}