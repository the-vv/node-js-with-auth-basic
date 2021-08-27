var express = require('express');
var router = express.Router();
const user = require('./userController')
const middlewares = require('../../middlewares/authenticate')

/* GET home page. */
router.get('/', middlewares.verify, (req, res, next) => {
  user.getUser(req.query.id)
  .then(resUr => {
    res.json(resUser);
  })
  .catch(err => {
    res.status(500).send(err);
  })
})

router.post('/login', (req, res, next) => {
  user.login(req.body)
  .then(resUser => {
    res.json(resUser);
  })
  .catch(err => {
    res.status(500).send(err);
  })
})

router.post('/signup', (req, res, next) => {
  user.signup(req.body)
  .then(resUser => {
    res.json(resUser);
  })
  .catch(err => {
    res.status(500).send(err);
  })
})

module.exports = router;
