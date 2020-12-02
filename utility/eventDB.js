var group = require("lodash"); //for grouping events.

var eventModel = require("../models/event");

var getevents = async function getevents() {
  try {
    let result = await eventModel.find({
      eventStatus: 'approved'
    });
    return group.groupBy(result, value => {
      return value.eventTopic;
    });
  } catch (error) {
    console.log("Error while getting all events : " + error);
    return [];
  }
};

var getPendingRequestList = async function getPendingRequestList() {
  try {
    let result = await eventModel.find({
      eventStatus: 'pending'
    });
    return group.groupBy(result, value => {
      return value.hostedby;
    });
  } catch (error) {
    console.log("Error while getting all events : " + error);
    return [];
  }
};

var getevent = async function getevent(eventID) {
  try {
    let result = await eventModel.findOne({
      eventId: eventID
    });
    if (result != null) {
      return result;
    } else {
      return null;
    }
  } catch (error) {
    console.log("Error while getting single event : " + error);
    return null;
  }
};
var updateeventStatus = async function (eventId, status) {
  const result = await eventModel.updateOne({eventId: eventId}, {$set: { "eventStatus": status}
  });
  return result.n > 0 && result.ok == 1;
};

module.exports = {
  getevent: getevent,
  getevents: getevents,
  getPendingRequestList: getPendingRequestList,
  updateeventStatus:updateeventStatus
};