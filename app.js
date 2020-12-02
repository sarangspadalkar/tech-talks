var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var router = express.Router();
var mongoose = require("mongoose");
const port = 8084;
app.set("view engine", "ejs");
app.set('views', __dirname + '/views');

//set the path for static resources to be accessible
app.use("/assets", express.static(__dirname + '/assets'));

//setting secret for express session
var session = require("express-session");

app.use(session({
    secret: "MySecretId",
    proxy: true,
    resave: true,
    saveUninitialized: true
}));
//Database Connection.
var initializeDb = async function () {
    try {
        mongoose.connect("mongodb+srv://admin-user:P@ssword123@cluster0.fy5hu.mongodb.net/tech-talks-db?retryWrites=true&w=majority", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        var db = mongoose.connection;
        db.on("error", console.error.bind(console, "connection error:"));
        db.once("open", function () {
            // we're connected!
            console.log("We're connected to tech-talks-db!");
        });
    } catch (error) {
        console.log("Error while establishing database connection : " + error);
    }
};

//Establish DB connection.
initializeDb();


// Below we are importing all the routing configurations into different variables.
var index = require(__dirname + "/routes/index");
var login = require(__dirname + "/routes/login");
var signup = require(__dirname + "/routes/signup");
var event = require(__dirname + "/routes/event");
var events = require(__dirname + "/routes/events");
var contact = require(__dirname + "/routes/contact");
var about = require(__dirname + "/routes/about");
var postreq = require(__dirname + "/routes/post_handler");
var admin = require(__dirname + "/routes/adminConsole");



//Below we are routing the requests towards corresponding routes.
app.use("/postreq", postreq); //This route is used to handle all the post requests(RSVP(YES,NO,MAYBE), UPDATE and DELETE buttons).
app.use("/", index); //This route is used for home page.
app.use("/login", login); //This route is used for login page.
app.use("/signup", signup); //This route is used for signup page.
app.use("/event", event); //This route is used for event page.
app.use("/events", events); //This route is used for events page.
app.use("/about", about); //This route is used for about page.
app.use("/contact", contact); //This route is used for contact page.
app.use("/admin", admin);



app.listen(port); //Application listens at 8084 port.
console.log(`App running on http://localhost:${port}`);