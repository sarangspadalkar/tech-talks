var mongoose = require("mongoose");

var userConnectionSchema = new mongoose.Schema({
    userId: String,
    connectionObject: {
        type: Object,
        required: [true, "required"]
    },
    rsvp: {
        type: String,
        required: [true, "required"]
    }
});
module.exports = mongoose.model("UserConnection", userConnectionSchema);