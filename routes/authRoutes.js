const express = require("express");
const bcrypt = require("bcryptjs");

const User = require("../models/User");

const router = express.Router();

// ===============================
// REGISTER PAGE
// ===============================

router.get("/register", (req, res) => {
    res.render("register", {
        error: null
    });
});

// ===============================
// REGISTER USER
// ===============================

router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.render("register", {
                error: "Please complete all fields."
            });
        }

        const existingUser = await User.findOne({
            email
        });

        if (existingUser) {
            return res.render("register", {
                error: "Email is already registered."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword
        });

        await user.save();

        res.redirect("/auth/login");
    } catch (error) {
        console.error(error);

        res.render("register", {
            error: "Something went wrong during registration."
        });
    }
});

// ===============================
// LOGIN PAGE
// ===============================

router.get("/login", (req, res) => {
    res.render("login", {
        error: null
    });
});

// ===============================
// LOGIN USER
// ===============================

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({
            email
        });

        if (!user) {
            return res.render("login", {
                error: "Invalid email or password."
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.render("login", {
                error: "Invalid email or password."
            });
        }

        req.session.user = {
            id: user._id,
            name: user.name,
            email: user.email
        };

        res.redirect("/entries/dashboard");
    } catch (error) {
        console.error(error);

        res.render("login", {
            error: "Something went wrong during login."
        });
    }
});

// ===============================
// LOGOUT
// ===============================

router.get("/logout", (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            console.error(error);
        }

        res.redirect("/");
    });
});

module.exports = router;