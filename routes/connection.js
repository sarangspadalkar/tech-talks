/*
This file is used for managing the routes to the connection page. 
*/
var express = require('express');
var router1 = express.Router();
var moment = require("moment");
var bodyParser = require("body-parser");
var validator = require('validator');


const {
    check,
    validationResult
} = require('express-validator');
var connectionDb = require("../utility/connectionDB");
var userDb = require("../utility/userDB");
var userProfileDb = require("../utility/userProfileDB");


var urlencodedParser = bodyParser.urlencoded({
    extended: false
});


router1.get("/", async function (req, res) {

    // Check if the connectionId is passed in the req query and if the passed connectionId is valid.
    if (validator.isNumeric(req.query.connectionId)) {

        var connectionData = await connectionDb.getConnection(
            req.query.connectionId
        );

        if (connectionData) {
            res.render("connection.ejs", {
                connectionDetails: connectionData,
                currentUser: req.session.theUser
            });

            // if the connectionId is not found in the Database , return fault page.
        } else {
            res.render("fault.ejs", {
                currentUser: req.session.theUser
            });
        }

        // If connectionId is not passed in the req query or connection Id did not pass the validation, render all the connections.
    } else {
        var connectionData = await connectionDb.getConnections();
        if (Object.keys(connectionData).length > 0) {
            res.render("connections.ejs", {
                connectionData: connectionData,
                currentUser: req.session.theUser
            });
        }
    }
});

router1.get("/newConnection", async function (req, res) {

    if (req.session.theUser) {
        res.render("newConnection.ejs", {
            currentUser: req.session.theUser,
            errors: null
        });

    } else {
        res.render("login_fault.ejs", {
            currentUser: ""
        });

    }
});

router1.post("/newConnection", urlencodedParser, [

    check('Topic').custom((value) => {
        if (!value.split(' ').every(function (word) {
                return validator.isAlphanumeric(word);
            })) {

            throw new Error('Topic field must consists of alphabetical chars.')
            return false;
        }
        return true;
    }).not().isEmpty().withMessage('Topic  Value Cannot be left blank'),

    check('Name').custom((value) => {
        if (!value.split(' ').every(function (word) {
                return validator.isAlphanumeric(word);
            })) {

            throw new Error('Name field must consists of alphabetical chars.')
            return false;
        }
        return true;
    }).not().isEmpty().withMessage('Name  Value Cannot be left blank'),
    check('Details').custom((value) => {
        if (!value.split(' ').every(function (word) {
                return validator.isAlphanumeric(word);
            })) {

            throw new Error('Details field must consists of alphabetical chars.')
            return false;
        }
        return true;
    }).not().isEmpty().withMessage('Details  Value Cannot be left blank'),
    check('Where').custom((value) => {
        if (!value.split(' ').every(function (word) {
                return validator.isAlphanumeric(word);
            })) {

            throw new Error('Where field must consists of alphabetical chars.')
            return false;
        }
        return true;
    }).not().isEmpty().withMessage('Where  Value Cannot be left blank'),
    check('When').custom((value) => {
        var dtStart = new Date;
        var dtEnd = new Date(value);
        // console.log(dtStart, dtEnd);
        if (dtEnd - dtStart < 0) {

            throw new Error('Event Time cannot be in the Past.')
            return false;
        }
        return true;
    }).not().isEmpty().withMessage('Event time Value Cannot be left blank'),
], async function (req, res) {

    if (req.session.theUser) {
        var errors = validationResult(req);
        if (!errors.isEmpty()) {

            return res.render("newConnection.ejs", {
                currentUser: req.session.theUser,
                errors: errors.array()
            });

        } else {
            var host = String(req.session.theUser.firstName + " " + req.session.theUser.lastName);
            var connectionId = await userProfileDb.addConnection(req.session.theUser.userId,
                req.body.Name,
                host,
                req.body.Topic,
                req.body.Details,
                req.body.Where,
                moment(req.body.When).format("MMMM Do YYYY"),
                moment(req.body.When).format("h:mm a")
            );

            //For adding new connection to creators saved connections.
            await userProfileDb.saveUserConnection(
                "Yes",
                connectionId,
                req.session.theUser.userId
            );
            var savedConnections = await userProfileDb.getUserConnectionList(req.session.theUser.userId);

            if (savedConnections) {
                res.render("savedConnections.ejs", {
                    savedConnections: savedConnections,
                    currentUser: req.session.theUser
                });
            } else {
                res.render("Error fetching savedConnections")
            }
        }
        ///End

    } else {
        res.render("login_fault.ejs", {
            currentUser: ""
        });

    }
});

module.exports = router1;