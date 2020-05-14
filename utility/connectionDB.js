var group = require("lodash"); //for grouping connections.

var connectionModel = require("../models/connection");

var getConnections = async function getConnections() {
  try {
    let result = await connectionModel.find();
    return group.groupBy(result, value => {
      return value.connectionTopic;
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


module.exports = {
  getConnection: getConnection,
  getConnections: getConnections
};