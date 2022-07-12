const express = require('express');
const dotenv = require('dotenv').config();
const {errorHandler} = require('./middleware/errorMiddleware');
const colors = require('colors');
const connectDB = require('./config/db');
const PORT = process.env.PORT || 8000

//Connect to database
connectDB()

const app = express();

// Allows body to be parsed for JSON etc
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(PORT, () => {
  console.log('Server is running on port ' + PORT);
})

//Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use(errorHandler)


app.get('/', (req, res) => {
    res.status(201).send('Hello World');
})

