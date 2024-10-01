import express from "express";

import jwt from "jsonwebtoken";

import { Plan, User } from "../db-utils/models.js";

const plansRouter = express.Router();

// Create a new post
plansRouter.post("/", async (req, res) => {
    const token = req.headers["authorization"];

    const planData = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findOne({ email: decoded.email });
        const plData = {
            ...planData,
            id: Date.now().toString(),
            userName: decoded.email,
            profilePic: user.image,
        };
        const newPlan = new Post(plData);
        await newPlan.save();

        res.status(201).json({
            message: "Plan Created Successfully",
            newPlan: plData,
        });
    } catch (err) {
        res.status(500).send(err);
    }
});

// Edit a post

// Delete a post
plansRouter.delete("/:planId", async (req, res) => {
    try {
        const planId = req.params.planId; // Corrected from pId to planId
        await Plan.deleteOne({ id: planId });
        res.send({ msg: "Plan Delete Success" });
    } catch (err) {
        console.log(err);
        res.status(500).send({ msg: "Internal Server Error" });
    }
});


// Read all the posts from a the logged in user
plansRouter.get("/", async (req, res) => {
    try {
        const token = req.headers["authorization"];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const plans = await Plan.find(
            { userName: decoded.email },
            { _id: 0, __v: 0 }
        );
        res.send(plans);
    } catch (err) {
        console.log(err);
        res.status(500).send({ msg: "Internal Server Error" });
    }
});

// Read the plans from other users --> to be shown in home page
plansRouter.get("/other-plans", async (req, res) => {
    try {
        const token = req.headers["authorization"];
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
        const plans = await Plan.find(
            { userName: { $ne: decoded.email } },
            { _id: 0, __v: 0 }
        );
        res.send(plans);
    } catch (err) {
        console.log(err);
        res.status(500).send({ msg: "Internal Server Error" });
    }
});

export default plansRouter;
