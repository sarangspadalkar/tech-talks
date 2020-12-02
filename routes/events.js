var express = require('express');
var router1 = express.Router();
var eventDb = require("../utility/eventDB");

router1.get("/", async function (req, res) {
    // Fetch all the events from the Database.
    var eventData = await eventDb.getevents();
    if (Object.keys(eventData).length > 0) {
        res.render("events.ejs", {
            eventData: eventData,
            currentUser: req.session.theUser
        });
    } else {
        res.send("No events in DB");
    }
});


module.exports = router1;