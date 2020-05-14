var express = require('express');
var router = express.Router();
var bodyParser = require("body-parser");
const {
    check,
    validationResult
} = require('express-validator');
var connectionDb = require("../utility/connectionDB");
var userConnectionDb = require("../utility/UserProfileDB");
var userDb = require("../utility/userDB");
var userProfile = require("../utility/userProfileDB");
var userModel = require("../models/userModel");

var urlencodedParser = bodyParser.urlencoded({
    extended: false
});

// To handle the GET request for Login.
router.get('/', function (req, res) {
    if (req.session.theUser == null) {
        res.render('login', {
            errors: null
        });
    } else {
        res.render('index', {
            currentUser: req.session.theUser
        });
    }
});

// To handle the POST request for Login.
router.post("/", urlencodedParser, [
    // Username must be consist of alphanumerics and at least 4 chars long.
    check('username').isAlphanumeric().withMessage('Username field must consists of alphabetical chars')
    .isLength({
        min: 4
    }).withMessage("Username field must be 4 or more characters")
    .not().isEmpty().withMessage('Username  Value Cannot be left blank'),
    // Password must be consist of alphanumerics and at least 6 chars long.
    check('password').isAlphanumeric().withMessage('Password field must consists of alphabetical chars')
    .isLength({
        min: 6
    }).withMessage("Password field must be 6 or more characters")
    .not().isEmpty().withMessage('Username  Value Cannot be left blank')
], async function (req, res) {


    if (req.session.theUser == null) {

        //check for login validation errors.
        var login_errors = validationResult(req);
        if (!login_errors.isEmpty()) {

            console.log(login_errors.array());

            return res.render("login", {
                currentUser: req.session.theUser,
                errors: login_errors.array()
            });

        } else {
            //check if the username exists in the DB.
            var valid_user = await userDb.check_user(req.body.username);

            if (valid_user) {

                var userdetails = await userDb.getUserPassword(req.body.username); // Fetch a user details with username.

                if (userdetails) {
                    //match the password for the user
                    if (req.body.password == userdetails.password) {
                        // load the user details in the session
                        req.session.theUser = userdetails;

                        //fetch the saved connections from DB
                        var savedConnections = await userConnectionDb.getUserConnectionList(
                            req.session.theUser.userId
                        );

                        // Add the list of saved connections to the session object as "currentProfile".
                        req.session.currentProfile = []
                        savedConnections.forEach(value => {
                            req.session.currentProfile.push({
                                ...value.connectionObject,
                                ...{
                                    rsvp: value.rsvp
                                }
                            });
                        });

                        var userProfile = await userConnectionDb.saveUserProfile(
                            req.session.theUser,
                            savedConnections
                        );
                        if (userProfile) {

                            req.session.userProfile = userProfile;
                        }
                        res.render("savedConnections.ejs", {
                            savedConnections: savedConnections,
                            currentUser: req.session.theUser
                        });
                    } else {
                        errors = [{
                            value: "",
                            msg: 'Invalid Password',
                            param: 'password',
                            location: 'body'
                        }];
                        console.log(errors);

                        return res.render("login", {
                            currentUser: req.session.theUser,
                            errors: errors
                        });
                    }

                }
            } else {
                errors = [{
                    value: req.body.username,
                    msg: 'Invalid Username',
                    param: 'username',
                    location: 'body'
                }];
                console.log(errors);

                return res.render("login", {
                    currentUser: req.session.theUser,
                    errors: errors
                });
            }
        }

    }
});


//To handle GET request for saved connections
router.get("/savedConnections", async function (req, res) {

    if (req.session.theUser) {

        var savedConnections = await userConnectionDb.getUserConnectionList(
            req.session.theUser.userId
        );

        res.render("savedConnections.ejs", {
            savedConnections: savedConnections,
            currentUser: req.session.theUser
        });
    } else {
        res.render("login_fault.ejs", {
            currentUser: ""
        });
        // res.render('login');
    }
});

// To handle the sign-out request by user.
router.get("/signout", async function (req, res) {

    req.session.destroy();

    res.render('index', {
        currentUser: ""
    });

});

module.exports = router;