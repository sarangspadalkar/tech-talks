var mongoose = require("mongoose");

var eventSchema = new mongoose.Schema({
    eventId: {
        type: String,
        required: [true, "required"]
    },
    userId: {
        type: String,
        required: [true, "required"]
    },
    eventName: {
        type: String,
        required: [true, "required"]
    },
    hostedby: {
        type: String,
        default: "Sarang Padalkar",
        required: [true, "required"]
    },
    eventTopic: {
        type: String,
        required: [true, "required"]
    },
    eventDetails: String,
    eventLocation: String,
    eventDate: String,
    eventTime: String,
    eventImageURL: {
        type: String,
        default: "/assets/Images/man3.png",
        required: [true, "required"]
    },
    eventStatus: {
        type: String,
        default: "pending",
        required: [true, "required"]
    }
});


module.exports = mongoose.model("events", eventSchema);