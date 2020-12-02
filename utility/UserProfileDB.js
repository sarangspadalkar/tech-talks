var Userevent = require("../models/userevent");
var UserProfile = require("../models/userProfileModel");
var event = require("../models/event");
var eventDb = require("./eventDB");


// Function to fetch all the user events.
var getUsereventList = async function (userId) {
    try {
        let result = await Userevent.find({
            userId: userId
        });
        return result;
    } catch (error) {
        console.log("Error while getting all user events : " + error);
        return [];
    }
};


// Function to add the event to the savedevents list for the User.
var addUserevent = async function (rsvp, eventId, userId) {
    try {
        var eventDetails = await eventDb.getevent(eventId);
        var newevent = new Userevent({
            userId: userId,
            eventObject: eventDetails,
            rsvp: rsvp
        });
        let result = await newevent.save();
        if (result == newevent) {
            console.log("User event Added");
            return true;
        } else {
            console.log("User event Adding failed");
            return false;
        }
    } catch (error) {
        console.log("Error while saving user event : " + error);
        return false;
    }
};

// Function to update the rsvp for a  user event.
var updateevent = async function (item, rsvpStatus) {
    const result = await Userevent.updateOne(item, {
        rsvp: rsvpStatus
    });
    return result.n > 0 && result.ok == 1;
};





//User Profile related Operations:
var saveUserProfile = async function (user, usereventList) {
    let result;
    try {
        var newUserProfile = new UserProfile({
            userObject: user,
            userevents: usereventList
        });
        result = await newUserProfile.save();
        if (result == newUserProfile) {
            console.log("User profile Added");
            result = true;
        } else {
            console.log("User profile Adding failed");
            result = false;
        }
    } catch (error) {
        console.log("Error while saving User profile : " + error);
        result = false;
    }
    return result;
};


// Function to remove the event from the userevent list.
var removeUserevent = async function (eventId, userId) {
    // ok: 1 if no errors occurred
    // deletedCount: the number of documents deleted
    try {
        var eventDetails = await eventDb.getevent(eventId);
        const res = await Userevent.deleteOne({
            userId: userId,
            eventObject: eventDetails
        });
        console.log("event deleted.");

        return res.ok > 0 && res.deletedCount > 0;
    } catch (error) {
        console.log("Error while removing user event : " + error);
        return false;
    }
};

// Function to save the user event.
var saveUserevent = async function (rsvp, eventId, userId) {
    let opResult = false;
    var newevent = await eventDb.getevent(eventId);
    let element = await Userevent.findOne({
        userId: userId,
        eventObject: newevent
    });
    if (element) {
        //update event
        opResult = await updateevent(element, rsvp);
    } else {
        //add event
        opResult = await addUserevent(rsvp, eventId, userId);
    }
    return opResult;
};

//Add a new event to DB
var addevent = async function (
    userId,
    cName,
    hostedby,
    cTopic,
    cDetails,
    cLocation,
    cDate,
    cTime,
    cStatus
) {
    try {
        let randomId = Math.floor(Math.random() * Math.floor(100000000)); //Generate a 8 digit random Id for the event.
        var newevent = new event({
            eventId: randomId,
            userId: userId,
            eventName: cName,
            hostedby: hostedby,
            eventTopic: cTopic,
            eventDetails: cDetails,
            eventLocation: cLocation,
            eventDate: cDate,
            eventTime: cTime,
            eventStatus:cStatus
        });
        let result = await newevent.save();
        if (result == newevent) {
            console.log("event Added");
            return randomId;
        } else {
            console.log("event Adding failed");
        }
    } catch (error) {
        console.log("Error while saving event : " + error);
    }
};


module.exports = {
    addevent: addevent,
    saveUserProfile: saveUserProfile,
    getUsereventList: getUsereventList,
    removeUserevent: removeUserevent,
    saveUserevent: saveUserevent
};