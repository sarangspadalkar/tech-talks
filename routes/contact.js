var express = require('express');
var router1 = express.Router();

router1.get('/', function (req, res) {
    res.render('contact', {
        currentUser: req.session.theUser
    });
});

module.exports = router1;