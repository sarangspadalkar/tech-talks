var group = require("lodash"); //for grouping connections.
var User = require("../models/userModel");

var getUser = async function getUser(user_Id) {
  try {
    var result = await User.findOne({
      userId: user_Id
    });
    return result;
  } catch (error) {
    console.log("Error while getting user : " + error);
    return [];
  }
};

var getUserPassword = async function getUserPassword(username) {
  try {
    var result = await User.findOne({
      username: username
    });

    return result;
  } catch (error) {
    console.log("Error while getting user based on username: " + error);
    return [];
  }
};

var check_user = async function check_user(username) {
  try {
    var result = await User.findOne({
      username: username
    });
    if (result) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log("Error while getting user based on username: " + error);
    return false;
  }
};

module.exports = {
  getUserPassword: getUserPassword,
  getUser: getUser,
  check_user: check_user
};