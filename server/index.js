'use strict';

const OK           = 200
const NOT_FOUND    = 404
const BAD_REQUEST  = 400
const FORBIDDEN    = 401
const INTERNAL_SERVER_ERROR = 500


const express = require('express')
const morgan  = require("morgan")
const cors    = require('cors')
const path    = require('path')
const fs      = require('fs')

const passport = require('passport')
const dayjs    = require("dayjs")
const Database = require("./database")

const { body, validationResult } = require("express-validator")
const { initAuthentication, isAuthenticated } = require("./authentication")
const { getSystemAdmins } = require("./dao")
const {dbAllAsync} = require("./database");

// INIT EXPRESS
const expressServer = new express()
// OPEN DATABASE
const database      = new Database("./resources/database.db")
// SELECT A PORT
const port = 3001

// SET UP THE MIDDLEWARES
expressServer.use(morgan('dev'))
expressServer.use(express.json())

// SET UP CORS
const corsOptions = { origin: 'http://localhost:5173', credentials: true }
expressServer.use(cors(corsOptions))

initAuthentication(expressServer, database);



// LOGIN
expressServer.post('/api/sessions',
    body("username", "username is not a valid email").isEmail(),
    body("password", "password must be a non-empty string").isString().notEmpty(), (request, response, next) => {

        const err     = validationResult(request)
        const errList = [];
        if (!err.isEmpty()) {
            errList.push(...err.errors.map(e => e.msg))
            return response.status(BAD_REQUEST).json({errors: errList});
        }
        passport.authenticate('local', (error, user, info) => {
            if (error) return next(error)
            if (!user) return response.status(FORBIDDEN).json({error: info})
            request.login(user, (err) => {
                if (err) return next(err)
                return response.status(OK).json(request['user'])
            })
        }) (request, response, next)
    })

// LOGOUT
expressServer.delete('/api/sessions', isAuthenticated, (request, response) =>
    request.logout( () => { response.end() })
)

/**********************************************************************************************************************/
expressServer.get('/api/sorted-documents/:index', async (request, response) => {
    await database.currentDocument(request, response, request['params']['index'])
})
expressServer.get('/api/users/:name/documents', async (request, response) => {
    await database.onRequestDocumentsOfUserWithName(request, response, request['params']['name'])
})
expressServer.get('/api/documents/mine', isAuthenticated, async (request, response) => {
    await database.onRequestPersonalDocuments(request, response, request['user']['ID'])
})
expressServer.get('/api/admins', async (request, response) => {
    await database.onRequestAdmins(request, response)
})
expressServer.delete('/api/documents/:id', isAuthenticated, async (request, response) => {
    await database.onDeleteDocument(request, response,
        request['params']['id'], request['user']['ID'], request['user']['username'])
})
expressServer.post('/api/documents', isAuthenticated, async (request, response) => {
    await database.onAddDocument(request, response, request['user']['ID'], request['user']['username'])
})
expressServer.put('/api/documents/:id', isAuthenticated, async (request, response) => {
    await database.onEditDocument(request, response, request['params']['id'],
        request['user']['ID'], request['user']['username'])
})
expressServer.get('/api/documents/:id', async (request, response) => {
   await database.onRequestDocument(request, response, request['params']['id'])
})
/**********************************************************************************************************************/


// Define a static route for serving image files
expressServer.use('/api/images', express.static('resources/images'))
// Define a route to get all image files
expressServer.get('/api/images', async (request, response) => {
    await database.onRequestImages(request, response)
})


expressServer.get('/api/website-name', async function (request, response) {
    await database.onReadWebsiteName(request, response)
})
expressServer.put('/api/website-name', isAuthenticated, async function (request, response) {
    await database.onWriteWebsiteName(request, response, request['user']['ID'], request['body']['text'])
})
/**********************************************************************************************************************/


expressServer.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
})
