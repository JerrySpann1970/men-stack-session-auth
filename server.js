// dependencies
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const dotenv = require("dotenv");
const authController = require("./controllers/auth");
const session = require('express-session');

// init express app
const app = express();

// configure settings
dotenv.config();
const port = process.env.PORT ? process.env.PORT : "3000";

// connect to mongoDB
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// mount middleware
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(morgan('dev'));
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
    })
);
app.use("/auth", authController);

// mount routes
app.get("/", (req, res) => {
    res.render("index.ejs", {
        user: req.session.user,
    });
});


// tell the app to listen
app.listen(port, () => {
    console.log(`The express app is ready on port ${port}!`);
});