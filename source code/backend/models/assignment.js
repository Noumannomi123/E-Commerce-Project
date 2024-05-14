import mongoose from "mongoose";
const Schema = mongoose.Schema;

const assignmentSchema = new Schema({
    title: {
        type: String,
        required: true
    }, 
    courseid :{type: String, required: true},
    questions: [
        {
            question: {   type: String, required: true},
            answer: { type: String, required: false}
        }
    ]
});

export const Assignment = mongoose.model('Assignment', assignmentSchema, 'Assignment');