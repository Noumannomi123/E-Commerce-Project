// import express from 'express'
// import { PORT, mongoDBURL } from './config.js';
// import mongoose from 'mongoose';
// const app = express();
// import { User } from './models/User.js';
// import cors from 'cors';
// // import { Courses } from './models/Courses.js';
// app.use(express.json());
// app.use(cors());


// app.post('/user/signup', async (req, res) => {
//     try {
//         // handle form validation on frontend
//         const newUser = {
//             username: req.body.username,
//             email: req.body.email,
//             password: req.body.password,
//             usertype: req.body.usertype,
//         }
//         // instructor
//         // if newUser.usertype == ""
//         const user = await User.create(newUser);
//         return res.status(201).send(user);
//     }
//     catch (error) {
//         if (error.code === 11000) {
//             res.status(400).send({ error: 'User already exists' });
//         } else {
//             res.status(500).send({ error: 'Error creating user. Check the parameters' });
//         }
//     }
// });

// app.post('/user/login', async (req, res) => {
//     try {
//         console.log(req.body);
//         if (!req.body.email || !req.body.password) {
//             return res.status(400).send({ error: 'Missing email or password' });
//         }
//         const user = await User.findOne({ email: req.body.email, usertype: req.body.usertype });
//         if (!user) {
//             return res.status(404).send({ error: 'User not found' });
//         }
//         if (user.password !== req.body.password) {
//             return res.status(401).send({ error: 'Invalid password' });
//         }
//         return res.status(200).send(user);
//     }
//     catch (error) {
//         res.status(500).send({ error: 'Error logging in' });
//     }
// });



// // create courses
// app.post('/user/createCourse', async (req, res) => {
//     try {
//         const course = await Course.create(req.body);
//         return res.status(201).send(course);
//     }
//     catch (error) {
//         res.status(500).send({ error: 'Error creating course' });
//     }
// });


// // app.post() to create a course based on a username of teacher


// mongoose
//     .connect(mongoDBURL)
//     .then(() => {
//         console.log('App connected to database');
//         app.listen(PORT, () => {
//             console.log(`Server on port ${PORT}`);
//         });
//     })
//     .catch(err => console.log(err));

import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import { PORT, mongoDBURL, jwtSecret } from './config.js';
import { User } from './models/User.js';
import { Courses } from './models/Courses.js';
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
app.post('/user/createCourse', authenticateAndCheckUserType, async (req, res) => {
    try {
        const course = await Courses.create(req.body);
        return res.status(201).send(course);
    }
    catch (error) {
        res.status(500).send({ error: 'Error creating course' });
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
        req.userId = decoded.userId;

        // Fetch the user from the database based on userId
        User.findById(req.userId, (err, user) => {
            if (err || !user) {
                return res.status(401).json({ error: 'User not found' });
            }
            if (user.usertype !== 'Instructor') {
                return res.status(403).json({ error: 'Access denied. User is not an Instructor' });
            }
            next();
        });
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
