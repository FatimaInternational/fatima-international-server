const express = require('express');
const cors = require('cors');

const UsersRouter = require('./routes/users/users.router')
const shipmentsRouter = require('./routes/shipments/shipments.router')
const stagesRouter = require('./routes/stages/stages.router')

const app = express();

app.use(cors());   
app.use(express.json());

app.use('/users',UsersRouter)
app.use('/shipments',shipmentsRouter)
app.use('/stages',stagesRouter)

module.exports = app;