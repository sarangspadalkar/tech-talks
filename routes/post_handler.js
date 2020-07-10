//This file is being used to handle all the post request (RSVP, Update, Delete Buttons)

var express = require('express');
var router1 = express.Router();
var bodyParser = require("body-parser");

var urlencodedParser = bodyParser.urlencoded({
    extended: false
});
var connectionDb = require("../utility/connectionDB");
var userDb = require("../utility/userDB");
var userProfile = require("../utility/userProfileDB");
var userModel = require("../models/userModel");

router1.post("/", urlencodedParser, async function (req, res) {

    // Check if the action is an update request.
    if (req.body.update) {
        if (req.session.theUser) {
            var connectionData = await connectionDb.getConnection(req.body.update);
            if (connectionData) {
                res.render("connection.ejs", {
                    connectionDetails: connectionData,
                    currentUser: req.session.theUser
                });

                // if the connectionId is not found in the Database, return fault page.
            } else {
                res.render("fault.ejs", {
                    currentUser: req.session.theUser
                });
            }
        } else {
            res.render("login_fault.ejs", {
                currentUser: ""
            });
            // res.render('login');
        }

        // Check if the action is delete request.
    } else if (req.body.delete) {
        if (req.session.theUser) {
            var connectionData = await connectionDb.getConnection(req.body.delete);
            if (connectionData) {
                await userProfile.removeUserConnection(req.body.delete, req.session.theUser.userId);
                var savedConnections = await userProfile.getUserConnectionList(req.session.theUser.userId);
                res.render("savedConnections.ejs", {
                    savedConnections: savedConnections,
                    currentUser: req.session.theUser
                });
            }
        } else {
            res.render("login_fault.ejs", {
                currentUser: ""
            });
            // res.render('login');
        }

        // Check if the action is RSVP request.
    } else if (req.body.rsvp) {
        if (req.session.theUser) {
            rsvp_action = req.body.rsvp.split(" ")[0]
            connectionId = req.body.rsvp.split(" ")[1]
            await userProfile.saveUserConnection(
                rsvp_action,
                connectionId,
                req.session.theUser.userId
            );
            var savedConnections = await userProfile.getUserConnectionList(req.session.theUser.userId);
            // console.log("Inside rsvp" + savedConnections);

            if (savedConnections) {
                res.render("savedConnections.ejs", {
                    savedConnections: savedConnections,
                    currentUser: req.session.theUser
                });
            } else {
                res.render("Error fetching savedConnections")
            }
        } else {

            res.render("login_fault.ejs", {
                currentUser: ""
            });
            // res.render('login');
        }

        // If invalid request render the saved connection view.
    } else {
        res.render("savedConnections.ejs", {
            savedConnections: savedConnections,
            currentUser: req.session.theUser
        });
    }

});



module.exports = router1;