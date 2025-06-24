const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const Student = require('./models/Student');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/edusphere', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("DB error:", err));

// Test route to check if backend is running
app.get('/api/test', (req, res) => {
  res.json({ message: "API is working" });
});

// Signup route with password hashing
app.post('/api/signup', async (req, res) => {
  try {
    const { name, email, phone, dob, location, password } = req.body;


    const student = new Student({
      name,
      email,
      phone,
      dob,
      location,
      password: password
    });

    await student.save();

    res.status(200).json({ message: "Signup successful" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Signup failed" });
  }
});

// Login route
app.post('/api/login', async (req, res) => {
  try {
    const { phone, password } = req.body;

    const user = await Student.findOne({ phone });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.status(200).json({ message: "Login successful" });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Start server AFTER defining all routes
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
