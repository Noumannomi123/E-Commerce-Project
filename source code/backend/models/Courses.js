import { Schema } from "mongoose";

const coursesSchema = mongoos.Schema(
    {
        title: { type: String, required: true, unique: true },
        description: { type: String, required: false },
        price: { type: Number, required: true },
        image: { type: String, required: false },
        teacher_id: { type: String, required: true , unique: true, index: true},
        enrollments: { type: Number, required: true },
    },
    {
        timestamps: true,
    }
);

export const Courses = mongoose.model("Courses", coursesSchema, "Courses")