const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const path = require("path");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const entryRoutes = require("./routes/entryRoutes");
const loggerMiddleware = require("./middleware/loggerMiddleware");

const app = express();

const PORT = process.env.PORT || 3000;

// ===============================
// VIEW ENGINE
// ===============================

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ===============================
// BUILT-IN MIDDLEWARE
// ===============================

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ===============================
// CUSTOM LOGGER MIDDLEWARE
// ===============================

app.use(loggerMiddleware);

// ===============================
// SESSION MIDDLEWARE
// ===============================

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,

        store: MongoStore.create({
            mongoUrl: process.env.MONGODB_URI
        }),

        cookie: {
            maxAge: 1000 * 60 * 60
        }
    })
);

// ===============================
// MAKE USER AVAILABLE TO EJS
// ===============================

app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// ===============================
// DATABASE CONNECTION
// ===============================

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("Connected to Ginhawa MongoDB database.");

        app.listen(PORT, () => {
            console.log(
                `Ginhawa is running at http://localhost:${PORT}`
            );
        });
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error);
    });

// ===============================
// ROUTES
// ===============================

app.get("/", (req, res) => {
    res.render("home");
});

app.use("/auth", authRoutes);
app.use("/entries", entryRoutes);

// ===============================
// 404 HANDLER
// ===============================

app.use((req, res) => {
    res.status(404).send("Page not found.");
});