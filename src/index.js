const personRouter = require('./personRouter');
const noteRouter = require('./noteRouter');

const express = require('express');
const morgan = require('morgan')
const cors = require("cors");

const app = express()
const PORT = process.env.PORT || 3001

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.use(cors())
app.use(express.json());
app.use(express.static('build'));

app.use('/api/persons', personRouter);

app.use('/api/notes', noteRouter);

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
});