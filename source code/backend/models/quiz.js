//add quiz schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const quizSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    questions: [
        {
            question: {   type: String, required: true},
            options: [
                {
                    option: {
                        type: String,
                        required: true
                    },
                    isCorrect: {
                        type: Boolean,
                        required: true
                    }
                }
            ]
        }
    ]
});
