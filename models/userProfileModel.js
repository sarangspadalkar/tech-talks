var mongoose = require("mongoose");

var userProfileSchema = new mongoose.Schema({
    userObject: {
        type: Object,
        required: [true, "required"]
    },
    userevents: {
        type: Array,
        required: [true, "required"]
    }
});

module.exports = mongoose.model("UserProfile", userProfileSchema);