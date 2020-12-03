//This file is being used to handle all the post request (RSVP, Update, Delete Buttons)

var express = require('express');
var router1 = express.Router();
var bodyParser = require("body-parser");

var urlencodedParser = bodyParser.urlencoded({
    extended: false
});
var eventDb = require("../utility/eventDB");
var userDb = require("../utility/userDB");
var userProfile = require("../utility/userProfileDB");
var userModel = require("../models/userModel");

router1.post("/", urlencodedParser, async function (req, res) {

    // Check if the action is an update request.
    if (req.body.update) {
        if (req.session.theUser) {
            var eventData = await eventDb.getevent(req.body.update);
            if (eventData) {
                res.render("event.ejs", {
                    eventDetails: eventData,
                    currentUser: req.session.theUser
                });

                // if the eventId is not found in the Database, return fault page.
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
            var eventData = await eventDb.getevent(req.body.delete);
            if (eventData) {
                await userProfile.removeUserevent(req.body.delete, req.session.theUser.userId);
                var savedevents = await userProfile.getUsereventList(req.session.theUser.userId);
                res.render("savedevents.ejs", {
                    savedevents: savedevents,
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
            eventId = req.body.rsvp.split(" ")[1]
            await userProfile.saveUserevent(
                rsvp_action,
                eventId,
                req.session.theUser.userId
            );
            var savedevents = await userProfile.getUsereventList(req.session.theUser.userId);
            // console.log("Inside rsvp" + savedevents);

            if (savedevents) {
                res.render("savedevents.ejs", {
                    savedevents: savedevents,
                    currentUser: req.session.theUser
                });
            } else {
                res.render("Error fetching savedevents")
            }
        } else {

            res.render("login_fault.ejs", {
                currentUser: ""
            });
            // res.render('login');
        }

        // If invalid request render the saved event view.
    } else if (req.body.approve) {
        if (req.session.theUser) {
            await eventDb.updateeventStatus(req.body.approve, 'approved');
            var savedevents = await eventDb.getPendingRequestList();
            res.render("adminConsole.ejs", {
                savedevents: savedevents,
                currentUser: req.session.theUser
            });
        } else {
            res.render("login_fault.ejs", {
                currentUser: ""
            });
            // res.render('login');
        }

    } else if (req.body.deny) {
        if (req.session.theUser) {
            await eventDb.updateeventStatus(req.body.deny, 'denied');
            var savedevents = await eventDb.getPendingRequestList();
            res.render("adminConsole.ejs", {
                savedevents: savedevents,
                currentUser: req.session.theUser
            });
        } else {
            res.render("login_fault.ejs", {
                currentUser: ""
            });
            // res.render('login');
        }

    } else if (req.body.deleteEvent) {
        if (req.session.theUser) {
            await eventDb.deleteEvent(req.body.deleteEvent);
            var eventData = await eventDb.getevents();
            if (Object.keys(eventData).length > 0) {
                res.render("events.ejs", {
                    eventData: eventData,
                    currentUser: req.session.theUser
                });
            } else {
                res.send("No events in DB");
            }
        } else {
            res.render("login_fault.ejs", {
                currentUser: ""
            });
        }
    } else {
        res.render("savedevents.ejs", {
            savedevents: savedevents,
            currentUser: req.session.theUser
        });
    }

});



module.exports = router1;