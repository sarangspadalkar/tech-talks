var express = require('express');
var router = express.Router();
var bodyParser = require("body-parser");

var usereventDb = require("../utility/eventDB");

var userModel = require("../models/userModel");

var urlencodedParser = bodyParser.urlencoded({
    extended: false
});

router.get("/", async function (req, res) {

    if (req.session.theUser) {

        var savedevents = await usereventDb.getPendingRequestList();

        res.render("adminConsole.ejs", {
            savedevents: savedevents,
            currentUser: req.session.theUser
        });
    } else {
        res.render("login_fault.ejs", {
            currentUser: ""
        });
    }
});


module.exports = router;