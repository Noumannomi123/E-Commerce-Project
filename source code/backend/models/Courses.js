import mongoose from "mongoose";
//import couseRecord from "./course_record.js";
//import couseRecord from "./course_record.js";
//import orders from "./order.js";
const courseMaterialSchema = mongoose.Schema({
    title: { type: String, required: true },
    type: { type: String, enum: ['link'], default: 'link' },
    url: { type: String, required: true }
});

const coursesSchema = mongoose.Schema(
    {
        title: { type: String, required: true, unique: true, index: true },
        description: { type: String, required: false },
        price: { type: Number, required: true },
        image: { type: String, required: false },// path to image
        teacher_username: { type: String, required: true, unique: false, index: true },
        enrolled_students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
        // assignmetns, quizes
        courseMaterials: [courseMaterialSchema]
    },
    {
        timestamps: true,
    }
);
// create a json object of the above schema

export const Courses = mongoose.model("Courses", coursesSchema, "Courses")