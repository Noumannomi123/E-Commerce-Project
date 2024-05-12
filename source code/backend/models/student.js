// create a class of student with elements of username, email, password, courses_enrolled, order_history

const mongoose = require('mongoose');
import Courses from "./Courses.js";
import User from "./User.js";
import Order from "./order.js";

const Schema = mongoose.Schema;

const studentSchema = new Schema({
    username: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    courses_enrolled: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Courses', required: true }],
    order_history: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true }]
});

const Student = mongoose.model('Student', studentSchema, 'Student');
module.exports = Student;