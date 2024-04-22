const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
require('dotenv').config();

const app = express();

const PORT = process.env.PORT;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const mongourl = process.env.MONGO_URL;

mongoose.connect(mongourl)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});

const User = mongoose.model('User', userSchema);

// CREATE (POST)
app.post('/users', (req, res) => {
    const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });
    newUser.save()
        .then((user) => res.status(201).json(user))
        .catch(err => res.status(400).json({ message: err.message }));
});

// READ ALL (GET)
app.get('/users', (req, res) => {
    User.find({})
        .then(users => res.json(users))
        .catch(err => res.status(500).json({ message: err.message }));
});

// READ ONE (GET)
app.get('/users/:id', (req, res) => {
    const userId = req.params.id;
    User.findById(userId)
        .then(user => {
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            res.json(user);
        })
        .catch(err => res.status(400).json({ message: err.message }));
});

// UPDATE (PUT)
app.put('/users/:id', (req, res) => {
    const userId = req.params.id;
    const updateData = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    };
    User.findByIdAndUpdate(userId, updateData, { new: true })
        .then(updatedUser => {
            if (!updatedUser) {
                return res.status(404).json({ message: "User not found" });
            }
            res.json(updatedUser);
        })
        .catch(err => res.status(400).json({ message: err.message }));
});

// DELETE
app.delete('/users/:id', (req, res) => {
    const userId = req.params.id;
    User.findByIdAndDelete(userId)
        .then(deletedUser => {
            if (!deletedUser) {
                return res.status(404).json({ message: "User not found" });
            }
            res.status(204).send(); // No content to send back
        })
        .catch(err => res.status(400).json({ message: err.message }));
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

