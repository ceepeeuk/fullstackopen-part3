const PersonRouter = require('express').Router()

const Person = require('../models/person')

PersonRouter.get('/', (req, res) => {
  Person.find().then(persons => res.json(persons))
})

PersonRouter.get('/:id', (req, res, next) => {
  const id = req?.params?.id
  Person.findById(id).then((person) => {
    if (person) {
      res.json(person)
    } else {
      res.status(404).end()
    }
  })
    .catch(error => next(error))
})

PersonRouter.delete('/:id', (req, res) => {
  const id = req.params.id
  res.status(204).end()
  Person.deleteOne({ _id: id }).then(() => res.status(204).end())
})

PersonRouter.put('/:id', (req, res, next) => {
  const id = req.params.id
  res.status(204).end()
  Person.updateOne(
    { _id: id },
    { number: req.body.number },
    { runValidators: true })
    .then(() => res.status(201).end())
    .catch(error => next(error))
})

PersonRouter.post('/', async (req, res, next) => {
  if (!req.body || !req.body.name || !req.body.number) {
    return res.status(400).send({ error: 'name and number mandatory' })
  }

  const existing = await Person.findOne({ name: req.body.name })

  if (existing) {
    return res.status(400).send({ error: 'name must be unique' })
  }

  const person = new Person({ ...req.body })
  return person.save()
    .then(() => res.status(201).json(person))
    .catch(error => next(error))
})

PersonRouter.get('/info', async (req, res) => {
  const count = await Person.count()
  res.send(`<div>Phonebook has info for ${count.length} people.</div>
        <div>&nbsp;</div>
        <div>${new Date().toString()}</div>
    `)
})

module.exports = PersonRouter