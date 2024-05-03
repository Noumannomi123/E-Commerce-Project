import express from 'express'
import { PORT, mongoDBURL } from './config.js';
import mongoose from 'mongoose';
const app = express();
import { User } from './models/UserModel.js';
import cors from 'cors';
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.post('/user/signup', async (req, res) => {
    try {
        // handle form validation on frontend
        const newUser = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        }
        const user = await User.create(newUser);
        return res.status(201).send(user);
    }
    catch (error) {
        if (error.code === 11000) {
            res.status(400).send({ error: 'User already exists' });
        } else {
            res.status(500).send({ error: 'Error creating user' });
        }
    }
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