import express from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import authRoutes from "./routes/auth.js";
import cors from "cors";
import mongooseConnect from "./db-utils/mongoose-connect.js";
import usersRouter from "./routes/users.js";
import plansRouter from "./routes/plans.js";
import router from "./routes/auth.js";

dotenv.config();

const app = express();
const PORT = 8000;

// Middleware
app.use(express.json());
app.use(cors());

const authAllApi = (req, res, next) => {
    try {
        const token = req.headers["authorization"];
        jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (err) {
        console.log(err.message);
        // err
        res.status(403).send({ msg: "Unauthorized" });
    }
};

// Routes
//app.use("/apis/auth", authRoutes);
app.use("/apis/users", authAllApi, usersRouter);
app.use("/apis/plans", plansRouter);

app.use("/apis", router);

// Connect to MongoDB
await mongooseConnect();

app.listen(PORT, () => {
    console.log("App listening on port " + PORT);
});
