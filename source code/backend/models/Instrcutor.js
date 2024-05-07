import mongoose from "mongoose";

const instructorSchema = mongoose.model({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
});

export const Instructor = mongoose.model("Instructor", instructorSchema, "Instructor");