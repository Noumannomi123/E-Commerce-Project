import mongoose from "mongoose";

const instructorSchema = mongoose.model({
    username: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
});

export const Instructor = mongoose.model("Instructor", instructorSchema, "Instructor");