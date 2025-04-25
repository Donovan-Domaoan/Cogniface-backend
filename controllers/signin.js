const handleSignin = (req, res, db, bcrypt) => {
    console.log('Signin request received:', req.body);
    const { email, password } = req.body;
    console.log('signin request', email);
    if (!email || !password) {
        return res.status(400).json('incorrect form submission');
    }
    db.select('email', 'hash').from('login')
        .where('email', '=', email)
        .then(data => {
            if (data.length) {
                const isValid = bcrypt.compareSync(password, data[0].hash);
                if (isValid) {
                    return db.select('*').from('users')
                        .where('email', '=', email)
                        .then(user => {
                            console.log('Signin success:', user[0]);
                            res.json(user[0]);
                        })
                } else {
                    console.log('Wrong credentials (bad password)');
                    res.status(400).json('wrong credentials');
                }
            } else {
                console.log('Wrong credentials (no email found)');
                res.status(400).json('wrong credentials');
            }
        })
        .catch(err => {
            console.error('Signin failed:', err);
            res.status(400).json('unable to signin');
        });
};

module.exports = {
    handleSignin
}