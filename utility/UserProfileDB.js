var UserConnection = require("../models/userConnection");
var UserProfile = require("../models/userProfileModel");
var Connection = require("../models/connection");
var connectionDb = require("./connectionDB");


// Function to fetch all the user connections.
var getUserConnectionList = async function (userId) {
    try {
        let result = await UserConnection.find({
            userId: userId
        });
        return result;
    } catch (error) {
        console.log("Error while getting all user connections : " + error);
        return [];
    }
};


// Function to add the Connection to the savedConnections list for the User.
var addUserConnection = async function (rsvp, connectionId, userId) {
    try {
        var connectionDetails = await connectionDb.getConnection(connectionId);
        var newConnection = new UserConnection({
            userId: userId,
            connectionObject: connectionDetails,
            rsvp: rsvp
        });
        let result = await newConnection.save();
        if (result == newConnection) {
            console.log("User Connection Added");
            return true;
        } else {
            console.log("User Connection Adding failed");
            return false;
        }
    } catch (error) {
        console.log("Error while saving user connection : " + error);
        return false;
    }
};

// Function to update the rsvp for a  user connection.
var updateConnection = async function (item, rsvpStatus) {
    const result = await UserConnection.updateOne(item, {
        rsvp: rsvpStatus
    });
    return result.n > 0 && result.ok == 1;
};





//User Profile related Operations:
var saveUserProfile = async function (user, userConnectionList) {
    let result;
    try {
        var newUserProfile = new UserProfile({
            userObject: user,
            userConnections: userConnectionList
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


// Function to remove the connection from the userconnection list.
var removeUserConnection = async function (connectionId, userId) {
    // ok: 1 if no errors occurred
    // deletedCount: the number of documents deleted
    try {
        var connectionDetails = await connectionDb.getConnection(connectionId);
        const res = await UserConnection.deleteOne({
            userId: userId,
            connectionObject: connectionDetails
        });
        console.log("Connection deleted.");

        return res.ok > 0 && res.deletedCount > 0;
    } catch (error) {
        console.log("Error while removing user connection : " + error);
        return false;
    }
};

// Function to save the user connection.
var saveUserConnection = async function (rsvp, connectionId, userId) {
    let opResult = false;
    var newConnection = await connectionDb.getConnection(connectionId);
    let element = await UserConnection.findOne({
        userId: userId,
        connectionObject: newConnection
    });
    if (element) {
        //update connection
        opResult = await updateConnection(element, rsvp);
    } else {
        //add connection
        opResult = await addUserConnection(rsvp, connectionId, userId);
    }
    return opResult;
};

//Add a new connection to DB
var addConnection = async function (
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
        let randomId = Math.floor(Math.random() * Math.floor(100000000)); //Generate a 8 digit random Id for the Connection.
        var newConnection = new Connection({
            connectionId: randomId,
            userId: userId,
            connectionName: cName,
            hostedby: hostedby,
            connectionTopic: cTopic,
            connectionDetails: cDetails,
            connectionLocation: cLocation,
            connectionDate: cDate,
            connectionTime: cTime,
            connectionStatus:cStatus
        });
        let result = await newConnection.save();
        if (result == newConnection) {
            console.log("Connection Added");
            return randomId;
        } else {
            console.log("Connection Adding failed");
        }
    } catch (error) {
        console.log("Error while saving connection : " + error);
    }
};


module.exports = {
    addConnection: addConnection,
    saveUserProfile: saveUserProfile,
    getUserConnectionList: getUserConnectionList,
    removeUserConnection: removeUserConnection,
    saveUserConnection: saveUserConnection
};