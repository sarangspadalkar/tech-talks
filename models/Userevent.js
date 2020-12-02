var mongoose = require("mongoose");

var usereventSchema = new mongoose.Schema({
    userId: String,
    eventObject: {
        type: Object,
        required: [true, "required"]
    },
    rsvp: {
        type: String,
        required: [true, "required"]
    }
});
module.exports = mongoose.model("Userevent", usereventSchema);