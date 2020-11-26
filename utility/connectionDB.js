var group = require("lodash"); //for grouping connections.

var connectionModel = require("../models/connection");

var getConnections = async function getConnections() {
  try {
    let result = await connectionModel.find({
      connectionStatus: 'approved'
    });
    return group.groupBy(result, value => {
      return value.connectionTopic;
    });
  } catch (error) {
    console.log("Error while getting all connections : " + error);
    return [];
  }
};

var getPendingRequestList = async function getPendingRequestList() {
  try {
    let result = await connectionModel.find({
      connectionStatus: 'pending'
    });
    return group.groupBy(result, value => {
      return value.hostedby;
    });
  } catch (error) {
    console.log("Error while getting all connections : " + error);
    return [];
  }
};

var getConnection = async function getConnection(connectionID) {
  try {
    let result = await connectionModel.findOne({
      connectionId: connectionID
    });
    if (result != null) {
      return result;
    } else {
      return null;
    }
  } catch (error) {
    console.log("Error while getting single connection : " + error);
    return null;
  }
};
var updateConnectionStatus = async function (connectionId, status) {
  const result = await connectionModel.updateOne({connectionId: connectionId}, {$set: { "connectionStatus": status}
  });
  return result.n > 0 && result.ok == 1;
};

module.exports = {
  getConnection: getConnection,
  getConnections: getConnections,
  getPendingRequestList: getPendingRequestList,
  updateConnectionStatus:updateConnectionStatus
};