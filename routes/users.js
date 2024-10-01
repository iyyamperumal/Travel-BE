import express from "express";
import { User } from "../db-utils/models.js";

const usersRouter = express.Router();

usersRouter.put("/:email", async (req, res) => {
    try {
        const { email } = req.params;
        const updateData = req.body;

        const userObj = await User.findOne({ email });

        if (userObj) {
            await User.updateOne({ email }, { $set: updateData });
            const updatedUser = await User.findOne(
                { email },
                { __v: 0, _id: 0, password: 0 }
            );
            res.send({ msg: "User Updated Successfully", updatedUser });
        } else {
            res.status(404).send({ message: "User Not Found" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

export default usersRouter;
