const express = require('express');
let persons = require('./persons.json');
const router = express.Router();

router.get('/', (req, res) => {
    res.json(persons)
});

router.get('/:id', (req, res) => {
    const person = persons.find(p => p.id === Number(req?.params?.id));
    if (person) {
        res.json(person)
    } else {
        res.status(404).end();
    }
});

router.delete('/:id', (req, res) => {
    persons = persons.filter(p => p.id !== Number(req?.params?.id));
    res.status(204).end();
});

const generatePersonId = () => {
    const min = Math.ceil(persons.length + 1);
    const max = Math.floor(10000);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

router.post('/', (req, res) => {
    if (!req.body || !req.body.name || !req.body.number) {
        return res.status(400).send({ error: 'name and number mandatory'});
    }

    const existing = persons.find(p => p.name === req.body.name);

    if (existing) {
        return res.status(400).send({ error: 'name must be unique' });
    }

    const person = {
        id: generatePersonId(),
        ...req.body,
    };

    persons = persons.concat(person);
    // res.status(201).end(person);
    res.status(201).json(person);
});

router.get('/info', (req, res) => {
    res.send(`<div>Phonebook has info for ${persons.length} people.</div>
        <div>&nbsp;</div>
        <div>${new Date().toString()}</div>
    `);
})

module.exports = router;