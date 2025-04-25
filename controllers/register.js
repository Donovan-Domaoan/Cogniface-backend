const handleRegister = (req, res, db, bcrypt) => {
    console.log("registration received:", req.body);
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
        console.log('Missing fields');
        return res.status(400).json({ error: 'incorrect form submission' });
    }

    const hash = bcrypt.hashSync(password);

    db.transaction(trx => {
        console.log('Starting transaction...');
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            console.log('Inserted into login:', loginEmail);
            return trx('users')
                .returning('*')
                .insert({
                    email: loginEmail[0].email,
                    name: name,
                    joined: new Date(),
                    entries: 0
                })
                .then(user => {
                    console.log('Inserted into users:', user);
                    if (user && user[0]) {
                        res.json(user[0]);
                    } else {
                        res.status(500).json({ error: 'User creation failed' });
                    }
                });
        })
        .then(trx.commit)
        .catch(error => {
            console.error('Transaction failed:', error);
            trx.rollback();
            res.status(500).json({ error: 'Transaction error' });
        });
    }).catch(err => {
        console.error('Registration error:', err);
        res.status(400).json({ error: "unable to register" });
    });
};
 
module.exports = {
    handleRegister
}