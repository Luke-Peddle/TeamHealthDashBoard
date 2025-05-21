const express = require("express");
const userRoutes = require('./routes/users');
const clearCacheRoute = require('./routes/clearCache');
const projectRoutes = require('./routes/project');
const sprintRoutes = require('./routes/sprint');
const storyCardRoutes = require('./routes/storyCard');
const velocityRoutes = require('./routes/velocity');
const oncallRoutes = require('./routes/oncall')



const cors = require('cors');


const app = express();
app.use(express.json()); 

app.use(cors());


app.use('/api/users', userRoutes);
app.use('/api/cache', clearCacheRoute);
app.use('/api/project', projectRoutes);
app.use('/api/sprint', sprintRoutes);
app.use('/api/storyCard', storyCardRoutes);
app.use('/api/velocity', velocityRoutes);
app.use('/api/oncall', oncallRoutes);



app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Express backend for Next.js application' });
  });

app.get('/', (req, res) =>{
    console.log("here")
});

app.listen(4000);