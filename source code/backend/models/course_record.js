const mongoose = require('mongoose');

import Courses from "./Courses.js";
import User from "./User.js";

const Schema = mongoose.Schema;

const courseRecordSchema = new Schema({
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Courses', required: true },
    enrolled_students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
    completed: { type: Boolean, required: true }
});

const CourseRecord = mongoose.model('CourseRecord', courseRecordSchema, 'CourseRecord');
module.exports = CourseRecord;