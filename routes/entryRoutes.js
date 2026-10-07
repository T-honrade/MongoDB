const express = require("express");

const WellnessEntry = require("../models/WellnessEntry");
const requireLogin = require("../middleware/authMiddleware");

const router = express.Router();

// ===============================
// DASHBOARD
// ===============================

router.get("/dashboard", requireLogin, async (req, res) => {
    try {
        const entries = await WellnessEntry.find({
            user: req.session.user.id
        }).sort({
            createdAt: -1
        });

        res.render("dashboard", {
            entries
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Unable to load dashboard.");
    }
});

// ===============================
// CREATE ENTRY
// ===============================

router.post("/create", requireLogin, async (req, res) => {
    try {
        const {
            activity,
            mood,
            notes
        } = req.body;

        const entry = new WellnessEntry({
            user: req.session.user.id,
            activity,
            mood,
            notes
        });

        await entry.save();

        res.redirect("/entries/dashboard");
    } catch (error) {
        console.error(error);
        res.status(500).send("Unable to create entry.");
    }
});

// ===============================
// EDIT PAGE
// ===============================

router.get(
    "/edit/:id",
    requireLogin,
    async (req, res) => {
        try {
            const entry = await WellnessEntry.findOne({
                _id: req.params.id,
                user: req.session.user.id
            });

            if (!entry) {
                return res.status(404).send("Entry not found.");
            }

            res.render("edit-entry", {
                entry
            });
        } catch (error) {
            console.error(error);
            res.status(500).send("Unable to load entry.");
        }
    }
);

// ===============================
// UPDATE ENTRY
// ===============================

router.post(
    "/update/:id",
    requireLogin,
    async (req, res) => {
        try {
            const {
                activity,
                mood,
                notes
            } = req.body;

            await WellnessEntry.findOneAndUpdate(
                {
                    _id: req.params.id,
                    user: req.session.user.id
                },
                {
                    activity,
                    mood,
                    notes
                }
            );

            res.redirect("/entries/dashboard");
        } catch (error) {
            console.error(error);
            res.status(500).send("Unable to update entry.");
        }
    }
);

// ===============================
// DELETE ENTRY
// ===============================

router.post(
    "/delete/:id",
    requireLogin,
    async (req, res) => {
        try {
            await WellnessEntry.findOneAndDelete({
                _id: req.params.id,
                user: req.session.user.id
            });

            res.redirect("/entries/dashboard");
        } catch (error) {
            console.error(error);
            res.status(500).send("Unable to delete entry.");
        }
    }
);

module.exports = router;