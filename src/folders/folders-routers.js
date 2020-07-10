const path = require('path');
const express = require('express')
const xss = require('xss')
const FoldersService = require('./folders-service')

const foldersRouter = express.Router()
const jsonParser = express.json()

const serialize = folder => ({
    id: folder.id,
    folder_name: folder.folder_name
})

foldersRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db');
        FoldersService.getAllFolders(knexInstance)
            .then(folders => {
                res.json(folders.map(serialize))
            })
            .catch(next)
        })
    .post()

foldersRouter
    .route('/folder/:folder_id')
    .all()
    .get()
    .delete()
    .patch()

module.exports = foldersRouter