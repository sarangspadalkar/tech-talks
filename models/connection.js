var mongoose = require("mongoose");

var connectionSchema = new mongoose.Schema({
    connectionId: {
        type: String,
        required: [true, "required"]
    },
    userId: {
        type: String,
        required: [true, "required"]
    },
    connectionName: {
        type: String,
        required: [true, "required"]
    },
    hostedby: {
        type: String,
        default: "Sarang Padalkar",
        required: [true, "required"]
    },
    connectionTopic: {
        type: String,
        required: [true, "required"]
    },
    connectionDetails: String,
    connectionLocation: String,
    connectionDate: String,
    connectionTime: String,
    connectionImageURL: {
        type: String,
        default: "/assets/Images/man3.png",
        required: [true, "required"]
    },
});


module.exports = mongoose.model("Connections", connectionSchema);