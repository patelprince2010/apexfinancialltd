const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (like HTML, CSS)
app.use(express.static(path.join(__dirname)));

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/myformdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define a schema and model
const formSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  subject: String,
  message: String,
  mobile: String,
});

const Form = mongoose.model('Form', formSchema);

// POST route to handle form submission
app.post('/submit', async (req, res) => {
  const { firstname, lastname, subject, message, mobile } = req.body;
  
  const newForm = new Form({ firstname, lastname, subject, message, mobile });

  try {
    await newForm.save();
    // Redirect to success page
    res.redirect('/success');
  } catch (error) {
    res.status(500).json({ message: 'Error saving form data', error });
  }
});

// Success page route
app.get('/success', (req, res) => {
  res.sendFile(path.join(__dirname, 'success.html'));
});

// Serve index.html when accessing the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});