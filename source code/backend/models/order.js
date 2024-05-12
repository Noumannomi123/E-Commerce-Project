// write a class of order with elements of order_id, username, course_id, price, status

import mongoose from "mongoose";
import { Courses } from "./Courses.js";
import { User } from "./User.js";

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    order_id: { type: String, required: true },
    username: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Courses', required: true },
    price: { type: Number, required: true },
    status: { type: String, required: true }
});

export const Order = mongoose.model('Order', orderSchema, 'Order');