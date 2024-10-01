import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../db-utils/models.js";

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
    const {
        name,
        image,
        id = Date.now(),
        dob,
        email,
        password,
    } = req.body;

    try {

        const existingUser = await User.findOne({ email });


        if (existingUser) {
            return res.status(400).send({ message: "User already exists" });
        }

        // Correct the password hashing using bcrypt.hash instead of bcrypt.hashSync
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            image,
            id,
            dob,
            email,
            password: hashedPassword,
        });
        await newUser.save();



        res.status(201).send({ message: "User registered successfully" });
    } catch (error) {

        res.status(500).send({ message: "Server error", error });
    }
});

// Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Verify that the JWT_SECRET is defined
        if (!process.env.JWT_SECRET) {

            return res.status(500).json({ message: "Internal server error" });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            {
                expiresIn: "5d",
            }
        );

        res.json({
            status: "Login successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                dob: user.dob,
                image: user.image,
            },
        });
    } catch (error) {
        console.log("Server error during login:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

export default router;
