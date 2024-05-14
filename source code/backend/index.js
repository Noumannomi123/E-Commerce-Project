import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import { PORT, mongoDBURL, jwtSecret } from './config.js';
import { User } from './models/User.js';
import { Quiz } from './models/quiz.js';
import { Courses } from './models/Courses.js';
import multer from 'multer';
const upload = multer({ dest: 'uploads/' });

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


// get course by id
app.get('/courses/:id' /*, authenticateAndCheckUserType*/, async (req, res) => {
    try {
        const course = await Courses.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }
        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving course' });
    }
});

app.get('/instructor/courses/:username'/*, authenticateAndCheckUserType*/, async (req, res) => {
    try {// return all courses of teacher 
        const courses = await Courses.find({ teacher_username: req.params.username });
        // get length of courses field "enrollments"
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
        const courseMaterialsArray = Array.isArray(courseMaterials) ? courseMaterials : [courseMaterials];
        // Create a new course
        const course = await Courses.create({
            title,
            description,
            price,
            image,
            teacher_username: username,
            enrollments,
            courseMaterials: courseMaterialsArray
        });

        res.status(201).send(course);
    }
    catch (error) {
        console.log(error);;
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


app.post('instructor/createQuiz', (req, res) => {
    const quiz = new Quiz({
        title: req.body.title,
        courseid: req.body.courseid,
        questions: req.body.questions
    });

    quiz.save()
        .then(result => {
            res.status(201).json({
                message: "Quiz created successfully",
                quiz: result
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

app.get('/quiz/getQuizzes', async (req, res) => {
    try {
        // Find all quizzes
        const quizzes = await Quiz.find();
        if (!quizzes) {
            return res.status(404).json({ error: 'No quizzes found' });
        }
        res.status(200).json(quizzes);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving quizzes' });
    }
});

let uploadedFiles = [];

app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const originalExtension = req.file.originalname.split('.').pop();

    uploadedFiles.push({
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: req.file.path,
        filename: req.file.filename + '.' + originalExtension
    });

    res.send('File uploaded successfully.');
});


// GET route to retrieve uploaded files information
app.get('/files', (req, res) => {
    res.json(uploadedFiles);
    res.send('File uploaded successfully.');
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


app.get('/getCourses', async (req, res) => {
    try {
        const courses = await Courses.find({});
        return res.status(200).json({
            count: courses.length,
            data: courses
        });
    }
    catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: error.message });
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
