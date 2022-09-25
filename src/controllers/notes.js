const NotesRouter = require('express').Router()
const Note = require('../models/note')
const logger = require('../utils/logger')

NotesRouter.get('/', (request, response, next) => {
  logger.info('in get')
  Note.find({}).then(notes => {
    response.json(notes)
  })
    .catch(error => next(error))
})

NotesRouter.get('/:id', (request, response, next) => {
  const id = request.params.id
  Note.findById(id).then(note => {
    if (note) {
      response.json(note)
    } else {
      response.status(404).end()
    }
  })
    .catch(error => next(error))
})

NotesRouter.delete('/:id', (request, response, next) => {
  const id = request.params.id
  response.status(204).end()
  Note.deleteOne({ _id: id })
    .then(() => response.status(204).end())
    .catch(error => next(error))
})

NotesRouter.post('/', (request, response, next) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  })

  note.save().then(savedNote => {
    response.json(savedNote)
  })
    .catch(error => next(error))
})

NotesRouter.put('/api/notes/:id', (request, response, next) => {
  const { content, important } = request.body

  Note.findByIdAndUpdate(
    request.params.id,
    { content, important },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

module.exports = NotesRouter