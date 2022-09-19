require('dotenv').config()
const mongoose = require('mongoose')
const express = require('express');
const morgan = require('morgan')
const cors = require("cors");

const personRouter = require('./personRouter');
const noteRouter = require('./noteRouter');

const app = express()
const PORT = process.env.PORT || 3001

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.use(cors())
app.use(express.json());
app.use(express.static('build'));

app.use('/api/persons', personRouter);

app.use('/api/notes', noteRouter);

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }
    else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }
    next(error)
}
app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
});