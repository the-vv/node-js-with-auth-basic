const user = require('../routes/user/userController');

module.exports = {
    verify: (req, res, next) => {
        if (req.body.token) {
            let token = req.body.token
            user.getUser({ token })
                .then(usr => {
                    if (usr.success === true) {
                        console.log('USER VERIFIED');
                        next();
                    }
                    else {
                        res.status(403).json({ err: true, status: 'Authentication Error' });
                    }
                })
                .catch(err => {
                    res.status(403).json({ err, status: 'Authentication Error' });
                })
        }
        else {
            res.status(403).json({ err: true, status: 'Authentication Error' });
        }
    }
}