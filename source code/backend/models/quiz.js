//add quiz schema
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const quizSchema = new Schema({
    title: {
        type: String,
        required: true
    }, 
    courseid :{type: String, required: true},
    questions: [
        {
            question: {   type: String, required: true},
            a:{ type: String, required: true},
            b:{ type: String, required: true},
            c:{ type: String, required: true},
            d:{ type: String, required: true},
            correct: { type: String, required: true}
        }
    ]
});


export const Quiz = mongoose.model('Quiz', quizSchema, 'Quiz');
