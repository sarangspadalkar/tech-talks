/*
This file is used for managing the routes to the event page. 
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
var eventDb = require("../utility/eventDB");
var userDb = require("../utility/userDB");
var userProfileDb = require("../utility/userProfileDB");


var urlencodedParser = bodyParser.urlencoded({
    extended: false
});


router1.get("/", async function (req, res) {

    // Check if the eventId is passed in the req query and if the passed eventId is valid.
    if (validator.isNumeric(req.query.eventId)) {

        var eventData = await eventDb.getevent(
            req.query.eventId
        );

        if (eventData) {
            res.render("event.ejs", {
                eventDetails: eventData,
                currentUser: req.session.theUser
            });

            // if the eventId is not found in the Database , return fault page.
        } else {
            res.render("fault.ejs", {
                currentUser: req.session.theUser
            });
        }

        // If eventId is not passed in the req query or event Id did not pass the validation, render all the events.
    } else {
        var eventData = await eventDb.getevents();
        if (Object.keys(eventData).length > 0) {
            res.render("events.ejs", {
                eventData: eventData,
                currentUser: req.session.theUser
            });
        }
    }
});

router1.get("/newevent", async function (req, res) {

    if (req.session.theUser) {
        res.render("newevent.ejs", {
            currentUser: req.session.theUser,
            errors: null
        });

    } else {
        res.render("login_fault.ejs", {
            currentUser: ""
        });

    }
});

router1.post("/newevent", urlencodedParser, [

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

            return res.render("newevent.ejs", {
                currentUser: req.session.theUser,
                errors: errors.array()
            });

        } else {
            
            var host = String(req.session.theUser.firstName + " " + req.session.theUser.lastName);
            if (req.session.theUser.isAdmin){
                await userProfileDb.addevent(req.session.theUser.userId,
                    req.body.Name,
                    host,
                    req.body.Topic,
                    req.body.Details,
                    req.body.Where,
                    moment(req.body.When).format("MMMM Do YYYY"),
                    moment(req.body.When).format("h:mm a"),
                    "approved"
                );
            }else{
                await userProfileDb.addevent(req.session.theUser.userId,
                    req.body.Name,
                    host,
                    req.body.Topic,
                    req.body.Details,
                    req.body.Where,
                    moment(req.body.When).format("MMMM Do YYYY"),
                    moment(req.body.When).format("h:mm a")
                );
            }
            

            //For adding new event to creators saved events.
            // await userProfileDb.saveUserevent(
            //     "Yes",
            //     eventId,
            //     req.session.theUser.userId
            // );
            var savedevents = await userProfileDb.getUsereventList(req.session.theUser.userId);

            if (savedevents) {
                res.render("savedevents.ejs", {
                    savedevents: savedevents,
                    currentUser: req.session.theUser
                });
            } else {
                res.render("Error fetching savedevents")
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