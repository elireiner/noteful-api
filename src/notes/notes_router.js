const express = require('express')
const xss = require('xss')
const NotesService = require('./notes-service')

const notesRouter = express.Router()
const jsonParser = express.json()

const serialize = note => ({
    id: note.id,
    note_name: note.note_name
})

notesRouter
    .route('/')
    .get()
    .post()

notesRouter
    .route('/note/:note_id')
    .all()
    .get()
    .delete()
    .patch()

module.exports = notesRouter