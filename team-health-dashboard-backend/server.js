const express = require("express");
const userRoutes = require('./routes/users');
const cors = require('cors');


const app = express();
app.use(express.json()); 

app.use(cors());


app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Express backend for Next.js application' });
  });

app.get('/', (req, res) =>{
    console.log("here")
});

app.listen(4000);