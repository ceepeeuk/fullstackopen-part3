let persons = require('./persons.json')
const express = require('express');
const morgan = require('morgan')

const app = express()
const port = 3001

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.get('/api/persons', (req, res) => {
    res.json(persons)
});

app.get('/api/persons/:id', (req, res) => {
   const person = persons.find(p => p.id === Number(req?.params?.id));
   if (person) {
       res.json(person)
   } else {
       res.status(404).end();
   }
});

app.delete('/api/persons/:id', (req, res) => {
   persons = persons.filter(p => p.id !== Number(req?.params?.id));
   res.status(204).end();
});

function generateId() {
    const min = Math.ceil(persons.length + 1);
    const max = Math.floor(10000);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

app.post('/api/persons', (req, res) => {
    if (!req.body || !req.body.name || !req.body.number) {
        return res.status(400).send({ error: 'name and number mandatory'});
    }

    const existing = persons.find(p => p.name === req.body.name);

    if (existing) {
        return res.status(400).send({ error: 'name must be unique' });
    }

    const person = {
        id: generateId(),
       ...req.body,
   };

    persons = persons.concat(person);
   res.status(201).end();
});

app.get('/info', (req, res) => {
    res.send(`<div>Phonebook has info for ${persons.length} people.</div>
        <div>&nbsp;</div>
        <div>${new Date().toString()}</div>
    `);
})
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});