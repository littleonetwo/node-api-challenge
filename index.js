require('dotenv').config();
//setup our middleware requirements
const express = require('express');
const helmet = require('helmet');
const logger = require('./middleware/logger.js');


//setup our server
const server = express();
const port = process.env.PORT || 5000;

//add routers
const projectRoutes = require('./routers/projectRouter.js');
const actionRoutes = require('./routers/actionRouter.js');

//build out server dependencies
server.use(helmet());
server.use(express.json());
server.use(logger('short'));



server.use('/api/project', projectRoutes);
server.use('/api/action', actionRoutes);


//if nothing is found throw up an error
server.use(function(req, res) {
  res.status(404).json({errorMessage:"This site does not currently exist!"});
})

//choose a port to work out of should be at end of file
server.listen(4000, () => console.log(`\n***Server running on http://localhost:${port}***\n`));
