import mongoose from "mongoose";
const Schema = mongoose.Schema;

// Define the user schema
const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    image: {
        type: String,
        default: "",
    },
    id: {
        type: String,
        required: true,
        unique: true,
    },
    dob: {
        type: Date,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+\@.+\..+/, "Please enter a valid email address"],
    },
}, {
    timestamps: true,
});

const planSchema = new Schema({
    place: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: "",
    },
    country: {
        type: String,
        required: true,
    },
    placeId: {
        type: String,
        required: true,
        unique: true,
    },
    days: {
        type: Number,
        required: true,
        validate: {
            validator: function (value) {
                // Ensure 'days' is greater than 0
                return value > 0;
            },
            message: "Days must be greater than 0.",
        },
    },
    startDate: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
                // Ensure the start date is in the future
                return value > Date.now();
            },
            message: "Start date must be in the future.",
        },
    },
});

// Compile the schema into a model
const User = mongoose.model("User", userSchema);
const Plan = mongoose.model("Plan", planSchema);
export { User, Plan };
