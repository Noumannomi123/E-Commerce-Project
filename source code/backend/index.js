import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import { PORT, mongoDBURL, jwtSecret } from './config.js';
import { User } from './models/User.js';
import { Courses } from './models/Courses.js';
import { Admin } from './models/admin.js';
import { Order } from './models/order.js';


const app = express();
app.use(express.json());
app.use(cors());

// Signup endpoint
app.post('/user/signup', async (req, res) => {
    try {
        const { username, email, password, usertype } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ username, email, password: hashedPassword, usertype });
        res.status(201).json(newUser);
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({ error: 'User already exists' });
        } else {
            res.status(500).json({ error: 'Error creating user. Check the parameters' });
        }
    }
});

// Login endpoint
app.post('/user/login', async (req, res) => {
    try {
        const { email, password, usertype } = req.body;
        const user = await User.findOne({ email, usertype });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid password' });
        }
        const token = jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: '1h' });
        res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000 });
        res.status(200).json({ token, username: user.username });
    } catch (error) {
        res.status(500).json({ error: 'Error logging in' });
    }
});
// logout
app.get('/user/logout', (req, res) => {
    // Clear the token from the client's storage
    res.clearCookie('jwt');
    res.status(200).json({ message: 'Logged out successfully' });
})
// Protected route example
// create courses
/* 
instructor creates a course
each course has a teacher_username to identify the course
each course has a count of enrollments
1. auth
*/

app.get('/instructor/courses/:username'/*, authenticateAndCheckUserType*/, async (req, res) => {
    try {// return all courses of teacher
        const courses = await Courses.find({ teacher_username: req.params.username });
        res.status(200).json({ count: courses.length, list: courses });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error retrieving courses' });
    }
});

app.post('/instructor/createCourse'/*, authenticateAndCheckUserType*/, async (req, res) => {
    try {
        const { title, description, price, image, enrollments, courseMaterials } = req.body;
        const username = req.body.teacher_username;

        // Validate the input data
        if (!title || !price || !username) {
            return res.status(400).send({ error: 'Missing required fields' });
        }

        // Create a new course
        const course = await Courses.create({
            title,
            description,
            price,
            image,
            teacher_username: username,
            enrollments,
            courseMaterials
        });

        res.status(201).send(course);
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Error creating course' });
    }
});

app.put('/instructor/updateCourse/:id' /*, authenticateAndCheckUserType*/, async (req, res) => {
    try {//update courses based on course id
        const { title, description, price, image, enrollments, courseMaterials } = req.body;
        const username = req.body.teacher_username;
        const id = req.params.id;

        // Validate the input data
        if (!title || !price || !username) {
            return res.status(400).send({ error: 'Missing required fields' });
        }

        // Update the course
        const course = await Courses.findByIdAndUpdate(id, {
            title,
            description,
            price,
            image,
            teacher_username: username,
            enrollments,
            courseMaterials
        }, { new: true });

        if (!course) {
            return res.status(404).send({ error: 'Course not found' });
        }

        res.status(200).send(course);
        console.log(course);
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Error updating course' });
    }
});

// delete course by id
app.delete('/instructor/deleteCourse/:id' /*, authenticateAndCheckUserType*/, async (req, res) => {
    try {// delete based on course id
        const id = req.params.id;
        const course = await Courses.findByIdAndDelete(id);
        if (!course) {
            return res.status(404).send({ error: 'Course not found' });
        }
        res.status(200).send({ message: 'Course deleted successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Error deleting course' });
    }
});

app.post('/Courses/checkout/:id', async (req, res) => {
    try {
        const { username, course_id, price, status } = req.body;
        const newOrder = await Order.create({ username, course_id, price, status });
        res.status(201).json(newOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating order' });
    }
});

app.post('/admin', async (req, res) => {
    try {
        const { username, password, email } = req.body;
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        const admin = new Admin({ username, password: hashedPassword, email });
        await admin.save();
        res.status(201).json(admin);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating admin' });
    }
});

// Get all admins
app.get('/admin', async (req, res) => {
    try {
        const admins = await Admin.find();
        res.status(200).json(admins);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error getting admins' });
    }
});

// Get admin by ID
app.get('/admin/:id', async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id);
        if (!admin) {
            return res.status(404).json({ error: 'Admin not found' });
        }
        res.status(200).json(admin);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error getting admin' });
    }
});

// Update admin by ID
app.put('/admin/:id', async (req, res) => {
    try {
        const { username, password, email } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const updatedAdmin = await Admin.findByIdAndUpdate(req.params.id, { username, password: hashedPassword, email }, { new: true });
        if (!updatedAdmin) {
            return res.status(404).json({ error: 'Admin not found' });
        }
        res.status(200).json(updatedAdmin);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating admin' });
    }
});

// Delete admin by ID
app.delete('/admin/:id', async (req, res) => {
    try {
        const deletedAdmin = await Admin.findByIdAndDelete(req.params.id);
        if (!deletedAdmin) {
            return res.status(404).json({ error: 'Admin not found' });
        }
        res.status(200).json(deletedAdmin);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting admin' });
    }
});

app.post('/Courses/checkout/:id', async (req, res) => {
    try {
        const { username, price } = req.body;
        const course_id = req.params.id;

        // Check if the course exists
        const course = await Course.findById(course_id);
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        // Create a new order
        const newOrder = await Order.create({ username, course_id, price, status: 'Pending' });

        res.status(201).json(newOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating order' });
    }
});

// Admin approval route
app.put('/admin/orders/:id/approve', async (req, res) => {
    try {
        const orderId = req.params.id;

        // Find the order by ID
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Update the order status to 'Approved'
        order.status = 'Approved';
        await order.save();

        res.status(200).json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error approving order' });
    }
});

// Admin disapproval route
app.put('/admin/orders/:id/disapprove', async (req, res) => {
    try {
        const orderId = req.params.id;

        // Find the order by ID
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Update the order status to 'Disapproved'
        order.status = 'Disapproved';
        await order.save();

        res.status(200).json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error disapproving order' });
    }
});

// Middleware to authenticate token
function authenticateAndCheckUserType(req, res, next) {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ error: 'No token, authorization denied' });
    }

    jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        const userType = decoded.userType;

        // Assuming you have a field called userType in your JWT payload
        if (userType === 'Instructor') {
            // Allow access to instructor API calls
            if (req.url.startsWith('instructor')) {
                return next();
            } else {
                return res.status(403).json({ error: 'Access denied. Only instructors are allowed' });
            }
        } else if (userType === 'Student') {
            // Allow access to student API calls
            if (req.url.startsWith('student')) {
                return next();
            } else {
                return res.status(403).json({ error: 'Access denied. Only students are allowed' });
            }
        } else {
            return res.status(403).json({ error: 'Access denied. Unknown user type' });
        }
    });
}

// Remaining routes...
app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get('/user/getUsers', async (req, res) => {
    try {
        const users = await User.find({});
        return res.status(200).json({
            count: users.length,
            data: users
        });
    }
    catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
});

mongoose
    .connect(mongoDBURL)
    .then(() => {
        console.log('App connected to database');
        app.listen(PORT, () => {
            console.log(`Server on port ${PORT}`);
        });
    })
    .catch(err => console.log(err));
