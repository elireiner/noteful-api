const path = require('path');
const express = require('express')
const xss = require('xss')
const NotesService = require('./notes-service')

const notesRouter = express.Router()
const jsonParser = express.json()

const sanitize = note => ({
    id: note.id,
    note_name: note.note_name,
    content: note.content,
    folder: note.folder
})

notesRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db');
        NotesService.getAllNotes(knexInstance)
            .then(notes => {

                res.json(notes.map(sanitize))
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const { note_name, content, folder } = req.body;
        const newNote = { note_name, content, folder };

        for (const [key, value] of Object.entries(newNote)) {
            if (value == null) {
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body` }
                })
            }
        }

        NotesService.insertNote(
            req.app.get('db'),
            newNote
        )

            .then(note => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${note.id}`))
                    .json(sanitize(note))
            })
            .catch(next)
    })

notesRouter
    .route('/:note_id')
    .all((req, res, next) => {
        NotesService.getById(
            req.app.get('db'),
            req.params.note_id
        )
            .then(note => {
                if (!note) {
                    return res.status(404).json({
                        error: { message: `Note does not exist` }
                    })
                }
                res.note = note;
                next()
            })
            .catch(next)

    })
    .get((req, res, next) => {
        res.json({
            id: res.note.id,
            note_name: xss(res.note.note_name), // sanitize title
            content: xss(res.note.content), // sanitize title
            folder: res.note.folder 
        })
    })
    .delete((req, res, next) => {
        NotesService.deleteNote(req.app.get('db'),
            req.params.note_id)
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })
    .patch(jsonParser, (req, res, next) => {
        const { note_name, content, folder } = req.body;
        const noteToUpdate = { note_name, content, folder };
     
        const numberOfValues = Object.values(noteToUpdate).filter(Boolean).length
        if (numberOfValues === 0) {
            return res.status(400).json({
                error: {message: `Request body must contain either note_name, content, or folder`}
            })
        }
        
        NotesService.updateNote(
            req.app.get('db'),
            req.params.note_id,
            noteToUpdate
        )

            .then(numRowsAffected => {
                res.status(204).end()
            })

            .catch(next)
    })

module.exports = notesRouter