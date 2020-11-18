var express = require('express');
var router = express.Router();
var bodyParser = require("body-parser");

var userConnectionDb = require("../utility/connectionDB");

var userModel = require("../models/userModel");

var urlencodedParser = bodyParser.urlencoded({
    extended: false
});

router.get("/", async function (req, res) {

    if (req.session.theUser) {

        var savedConnections = await userConnectionDb.getPendingRequestList();

        res.render("adminConsole.ejs", {
            savedConnections: savedConnections,
            currentUser: req.session.theUser
        });
    } else {
        res.render("login_fault.ejs", {
            currentUser: ""
        });
    }
});


module.exports = router;