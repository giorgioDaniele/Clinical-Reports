"use strict"


const OK           = 200
const NOT_FOUND    = 404
const BAD_REQUEST  = 400
const FORBIDDEN    = 401
const INTERNAL_SERVER_ERROR = 500

const sqlite = require("sqlite3")
const crypto = require("crypto")
const dayjs  = require("dayjs");
const fs = require("fs");
const path = require("path");



const dbAllAsync = (db, sql, params = []) => new Promise((resolve, reject) =>
    db.all(sql, params, (error, rows) => error ? reject(error) : resolve(rows)))


const dbRunAsync = (db, sql, params = []) => new Promise((resolve, reject) =>
    db.run(sql, params, error => error ? reject(error) : resolve()))


const dbGetAsync = (db, sql, params = []) => new Promise((resolve, reject) =>
    db.get(sql, params, (error, row) => error ? reject(error) : resolve(row)))

async function groupBy (rows) {

    // I CREATE A JS OBJECT THAT HAS THE SERIAL NUMBER OF THE
    // MEDICAL RECORD AS KEYS AND THE LIST OF CONTENTS AS VALUE
    const groupedElements = rows.reduce((result, element) => {
        const key = JSON.stringify({title: element['title'], ID: element['ID']})
        if (!result[key])
            result[key] = []
        result[key].push(element)
        return result;
    }, {})

    // I EXTRACT THE LIST OF CONTENTS FOR EACH MEDICAL RECORD, ARRANGING EVERYTHING IN A VECTOR:
    // IN THIS WAY, I GET A VECTOR OF VECTORS
    const groupedArray = Object.values(groupedElements)

    // NOW, I SORT THE COLLECTION AS WHOLE BY publication_date
    // BECAUSE THERE IS ALWAYS A CONTENT AT LEAST, IT IS SAFE TO ACCESS [0] DIRECTLY
    // EACH ARRAY
    return [...groupedArray.sort((a, b) => {
        const dateA = a[0]['publication_date'] ? dayjs(a[0]['publication_date'], 'YYYY-MM-DD') : null
        const dateB = b[0]['publication_date'] ? dayjs(b[0]['publication_date'], 'YYYY-MM-DD') : null
        if (!dateA && !dateB) return 0
        else if (!dateA) return 1
        else if (!dateB) return -1
        return dateA.diff(dateB)
    })]
}
async function validateRequest(request, response) {

    // CHECK BODY CONSISTENCY
    ////////////////////////////////////////////////////////////////////////////
    const headerNumber     = request['body']['contents'].filter(content => content['media_type']  === 'HEADER').length
    const paragraphsNumber = request['body']['contents'].filter(content => content['media_type']  === 'TEXT').length
    const photosNumber     = request['body']['contents'].filter(content => content['media_type']  === 'PHOTO').length

    // A) THE DOCUMENT MUST HAVE A HEADER AND A PARAGRAPH/PHOTO, AT LEAST
    if (!(headerNumber >= 1 && (paragraphsNumber >= 1 || photosNumber >= 1)))
        response.status(BAD_REQUEST).json({error: 'The document must have a header and a paragraph/photo, at least'})
    // B) CREATION DATE CANNOT BE BEFORE PUBLICATION
    if(dayjs(request['body']['creation_date']).isAfter(dayjs(request['body']['publication_date'])))
        response.status(BAD_REQUEST).json({error: 'Publication date must be after creation date!'})
    // C) TEST TITLE
    if(request['body']['title'] === '')
        response.status(BAD_REQUEST).json({error: 'Title is missing!'})
    ////////////////////////////////////////////////////////////////////////////
}
async function documentBuilder(applicantID, request) {
    return {
        title:            request['body']['title'],
        userId:           applicantID,
        creation_date:    request['body']['creation_date'],
        publication_date: request['body']['publication_date'],
    }
}
async function contentAdder (database, documentID, request) {
    for (const content of request['body']['contents']) {
        await dbRunAsync(database,
            'INSERT INTO CONTENTS (pageId, media_type, payload) VALUES(?, ?, ?)',
            [documentID, content['media_type'], content['value']])
    }
}
async function checkIfAdmin (applicantID, database, response) {
}



function Database(dbname) {


    this.database = new sqlite.Database(dbname, err => { if (err) throw err })

    /**
     * Authenticate a user from their email and password
     * @param email email of the user to authenticate
     * @param password password of the user to authenticate
     * @returns a Promise that resolves to the user object {id, email, name}
     */
    this.getUser = (email, password) => new Promise((resolve, reject) => {

        dbGetAsync(this.database, 'SELECT * FROM USERS WHERE email = ?', [email])
            .then(user => {
                if (!user) resolve(false)
                crypto.scrypt(password, user['salt'], 32, (error, hashedPassword) => {
                    if (error) reject(error)
                    const passwordHex = Buffer.from(user['password'], 'hex')
                    if (!crypto.timingSafeEqual(passwordHex, hashedPassword)) resolve(false)
                    else resolve({ID: user['ID'], username: user['email'], name: user['name']})
                })
            }).catch(e => reject(e))
    })

    /**
     * Retrieve the user with the specified id
     * @param ID the id of the user to retrieve
     * @returns a Promise that resolves to the user object {id, email, name}
     */
    this.getUserByID = async ID => {
        const user = await dbGetAsync(this.database, 'SELECT * FROM USERS WHERE ID = ?', [ID])
        return {ID: user['ID'], username: user['email'], name: user['name']}
    }

    /**
     * Retrieve the current at index ID document according the publication date
     * @param request
     * @param response
     * @param ID the document index
     * @returns a list of contents
     */
    this.currentDocument = async function (request, response, ID) {

      async function continueTo (request, database) {
          return request.isAuthenticated() ?
              await dbAllAsync(database,
                    `SELECT 
                        PAGES.title, 
                        PAGES.ID, 
                        PAGES.publication_date,
                        PAGES.creation_date,
                        USERS.name, 
                        USERS.email as username, 
                        CONTENTS.media_type, 
                        CONTENTS.payload
                        FROM PAGES
                        INNER JOIN CONTENTS ON PAGES.ID = CONTENTS.pageId
                        INNER JOIN USERS ON PAGES.userId = USERS.ID`, []) :
                 await dbAllAsync(database,
                    `SELECT 
                        PAGES.title, 
                        PAGES.ID,
                        PAGES.publication_date, 
                        PAGES.creation_date,
                        USERS.name, 
                        USERS.email as username, 
                        CONTENTS.media_type, 
                        CONTENTS.payload
                        FROM PAGES
                        INNER JOIN CONTENTS ON PAGES.ID  = CONTENTS.pageId
                        INNER JOIN USERS ON PAGES.userId = USERS.ID
                        WHERE PAGES.publication_date IS NOT NULL 
                        AND 
                        PAGES.publication_date <= DATE(\'now\')`, [])
        }

        // CHECK FOR REQUEST CONSISTENCY
        if(!ID)     response.status(BAD_REQUEST).json({error: 'Missing index'})
        if(ID <= 0) response.status(BAD_REQUEST).json({error: 'Negative index are not valid'})

        try {
            const dbCount  = await dbGetAsync(this.database, 'SELECT COUNT(*) AS documentsCount FROM PAGES', [])
            if(ID > dbCount['documentsCount']) response.status(NOT_FOUND).json({error: 'Document not found'})
            const dbRows    = await continueTo(request, this.database)
            const documents = await groupBy(dbRows)
            response.status(OK).json({size: documents.length, contents: documents[ID - 1]})
        } catch (error) { response.status(INTERNAL_SERVER_ERROR).json({error: 'SQLite internal error'}) }
    }

    /**
     * Retrieve the documents associated to a user with name
     * @param request
     * @param response
     * @param name
     * @returns a list of documents, where each document is a list of contents
     */
    this.onRequestDocumentsOfUserWithName = async function (request, response, name) {

        async function continueTo (request, database, name) {
            return request.isAuthenticated() ?
                await dbAllAsync(database,
                    `SELECT 
                        PAGES.title,
                        PAGES.ID, 
                        PAGES.publication_date, 
                        PAGES.creation_date,
                        USERS.name, 
                        USERS.email as username, 
                        CONTENTS.media_type, 
                        CONTENTS.payload
                        FROM PAGES 
                        INNER JOIN CONTENTS ON PAGES.ID = CONTENTS.pageId
                        INNER JOIN USERS ON PAGES.userId = USERS.ID
                        WHERE USERS.name LIKE \'%\' || ? || \'%\'`, [name]) :
                await dbAllAsync(database,
                    `SELECT 
                        PAGES.title, 
                        PAGES.ID, 
                        PAGES.publication_date, 
                        PAGES.creation_date,
                        USERS.name, 
                        USERS.email as username, 
                        CONTENTS.media_type, 
                        CONTENTS.payload
                        FROM PAGES 
                        INNER JOIN CONTENTS ON PAGES.ID = CONTENTS.pageId
                        INNER JOIN USERS ON PAGES.userId = USERS.ID 
                        WHERE 
                        USERS.name LIKE \'%\' || ? || \'%\' 
                            AND PAGES.publication_date <= DATE(\'now\')`, [name])
        }

        try {
            const dbRows    = await continueTo(request, this.database, name)
            const documents = await groupBy(dbRows)
            response.status(OK).json({size: documents.length, documents: documents})
        } catch (error) { response.status(INTERNAL_SERVER_ERROR).json({error: 'SQLite internal error'}) }
    }

    /**
     * Retrieve the documents associated to the logged user
     * @param request
     * @param response
     * @param applicantID
     * @returns a list of documents, where each document is a list of contents
     */
    this.onRequestPersonalDocuments = async function (request, response, applicantID) {

        async function continueTo (request, database, ID) {
            return await dbAllAsync(database,
                `SELECT 
                    PAGES.ID,
                    PAGES.title,
                    PAGES.publication_date, 
                    PAGES.creation_date,
                    USERS.name,
                    USERS.email as username, 
                    CONTENTS.media_type, 
                    CONTENTS.payload
                    FROM PAGES 
                    INNER JOIN CONTENTS ON PAGES.ID = CONTENTS.pageId 
                    INNER JOIN USERS ON PAGES.userId = USERS.ID WHERE USERS.ID = ?`, [ID])
        }

        try {
            const dbRows    = await continueTo(request, this.database, applicantID)
            const documents = await groupBy(dbRows)
            response.status(OK).json({size: documents.length, documents: documents})
        } catch (error) { response.status(INTERNAL_SERVER_ERROR).json({error: 'SQLite internal error'}) }
    }

    /**
     * Delete the document with documentID
     * @param request
     * @param response
     * @param documentID
     * @param applicantID
     * @param applicantUsername
     * @returns a message of success
     */
    this.onDeleteDocument = async function (request, response, documentID, applicantID, applicantUsername) {

        try {
            const documentContents = await dbAllAsync(this.database,
                `SELECT 
                    PAGES.title,
                    PAGES.ID,
                    PAGES.publication_date,
                    PAGES.creation_date,
                    USERS.name,
                    USERS.email as username,
                    CONTENTS.media_type,
                    CONTENTS.payload
                    FROM PAGES
                    INNER JOIN CONTENTS ON PAGES.ID = CONTENTS.pageId
                    INNER JOIN USERS ON PAGES.userId = USERS.ID
                    WHERE PAGES.ID = ?`, [documentID])
            // DOCUMENT NOT FOUND
            if (documentContents.length === 0)
                response.status(NOT_FOUND).json({message: `Document ID = ${documentID} does not exists!`})

            const documentOwner = documentContents[0]['username']
            if(documentOwner !==  applicantUsername) {
                const dbAdminResult = await dbAllAsync(this.database, 'SELECT ADMINS.ID FROM ADMINS', [])
                if(!dbAdminResult.map(admin => admin['ID']).includes(applicantID))
                    response.status(FORBIDDEN).json({error: 'You are not an admin'})
            }
            // DELETE
            await dbRunAsync(this.database, 'DELETE FROM PAGES WHERE ID = ?', [documentID])
            return response.status(OK).json({ message: 'DONE' })
        } catch (error) { response.status(INTERNAL_SERVER_ERROR).json({error: 'SQLite internal error'}) }
    }

    /**
     * Add a new document into the system
     * @param request
     * @param response
     * @param applicantID
     * @param applicantUsername
     * @returns a message if successful
     */
    this.onAddDocument = async function (request, response, applicantID, applicantUsername) {

        try {
            // CHECK BODY CONSISTENCY
            ////////////////////////////////////////////////////////////////////////////
            await validateRequest(request, response)
            ////////////////////////////////////////////////////////////////////////////
            const newDocument = await documentBuilder(applicantID, request)

            // ADD THE NEW DOCUMENT
            await dbRunAsync(this.database,
                `INSERT INTO PAGES (title, userId, creation_date, publication_date)
                        VALUES(?, ?, DATE(?), DATE(?))`,
                    [newDocument['title'], applicantID, newDocument['creation_date'], newDocument['publication_date']])
            // GET THE LAST ID
            const dbResult = await dbGetAsync(this.database, 'SELECT MAX(ID) AS maxID FROM PAGES', [])
            // ADD NEW CONTENTS ASSOCIATED TO THE PREVIOUS DOCUMENT
            await contentAdder(this.database, dbResult['maxID'], request)
            response.status(OK).json({message: 'DONE'})
        } catch (error) { response.status(INTERNAL_SERVER_ERROR).json({ error: 'SQLite internal error'}) }

    }

    /**
     * Retrieve system admins
     * @param request
     * @param response
     * @returns a list of admins, namely IDs
     */
    this.onRequestAdmins = async function (request, response) {

        try {
            const dbResult = await dbAllAsync(this.database, 'SELECT ADMINS.ID FROM ADMINS', [])
            response.status(OK).json({admins: dbResult})
        } catch (error) { response.status(INTERNAL_SERVER_ERROR).json({error: 'SQLite internal error'}) }
    }

    /**
     * Retrieve a document by ID
     * @param request
     * @param response
     * @param ID
     * @returns the list of document contents
     */
    this.onRequestDocument = async function (request, response, ID) {

        try {
            const documentContents = await dbAllAsync(this.database,
                `SELECT 
                   PAGES.title,
                   PAGES.ID,
                   PAGES.publication_date,
                   PAGES.creation_date,
                   USERS.name,
                   USERS.email as username,
                   CONTENTS.media_type,
                   CONTENTS.payload
                   FROM PAGES
                   INNER JOIN CONTENTS ON PAGES.ID = CONTENTS.pageId
                   INNER JOIN USERS ON PAGES.userId = USERS.ID
                   WHERE PAGES.ID = ?`, [ID])
                // DOCUMENT NOT FOUND
                if (documentContents.length === 0)
                    response.status(NOT_FOUND).json({message: `Document ID = ${ID} does not exists!`})
                console.log(documentContents)
                response.status(OK).json({contents: documentContents})
        } catch (error) { response.status(INTERNAL_SERVER_ERROR).json({error: 'SQLite internal error'}) }
    }

    /**
     * Edit a document by ID
     * @param request
     * @param response
     * @param documentID
     * @param applicantID
     * @param applicantUsername
     * @returns a message if sucessfull
     */
    this.onEditDocument = async function (request, response, documentID, applicantID, applicantUsername) {


        async function onContinue(database, ID) {

            try {
                // CREATE A NEW DOCUMENT
                const newDocument = await documentBuilder(ID, request)
                // ADD THE NEW DOCUMENT
                await dbRunAsync(database,
                    `INSERT INTO PAGES (title, userId, creation_date, publication_date)
                            VALUES(?, ?, DATE(?), DATE(?))`,
                    [newDocument['title'], ID, newDocument['creation_date'], newDocument['publication_date']])
                // GET THE LAST ID
                const dbResult = await dbGetAsync(database, 'SELECT MAX(ID) AS maxID FROM PAGES', [])
                // ADD NEW CONTENTS ASSOCIATED TO THE PREVIOUS DOCUMENT
                await contentAdder(database, dbResult['maxID'], request)
                response.status(OK).json({message: 'DONE'})
            } catch (e) { response.status(INTERNAL_SERVER_ERROR).json({error: 'SQLite internal error'}) }
        }


        try {

            const documentContents = await dbAllAsync(this.database, `SELECT 
                   PAGES.title,
                   PAGES.ID,
                   PAGES.publication_date,
                   PAGES.creation_date,
                   USERS.name,
                   USERS.email as username,
                   CONTENTS.media_type,
                   CONTENTS.payload
                   FROM PAGES
                   INNER JOIN CONTENTS ON PAGES.ID = CONTENTS.pageId
                   INNER JOIN USERS ON PAGES.userId = USERS.ID
                   WHERE PAGES.ID = ?`, [documentID])
            // DOCUMENT NOT FOUND
            if (documentContents.length === 0)
                response.status(NOT_FOUND).json({message: `Document ID = ${documentID} does not exists!`})

            const previousDocumentOwner = documentContents[0]['username']
            const newDocumentOwner      = request['body']['author']['username']

            if(previousDocumentOwner !== newDocumentOwner) {
                const dbAdminResult = await dbAllAsync(this.database, 'SELECT ADMINS.ID FROM ADMINS', [])
                if(!dbAdminResult.map(admin => admin['ID']).includes(applicantID))
                    response.status(FORBIDDEN).json({error: 'You are not an admin'})
            }
            else await validateRequest(request, response)


            console.log('VALIDATION OKAY')
            //await removeContentsFromDocument(documentID)
            console.log('DELETION DOCUMENT OKAY')
            // NO ADMIN OPERATION
            if(previousDocumentOwner === newDocumentOwner) {
                // DELETE DOCUMENT
                await dbRunAsync(this.database, 'DELETE FROM PAGES WHERE ID = ?', [documentID])
                await onContinue(this.database, applicantID)
            }
            // ADMIN OPERATION
            else {
                const newOwner = await dbGetAsync(this.database,
                    `SELECT USERS.ID, 
                        USERS.email as username 
                            FROM USERS WHERE USERS.email = ?`, [newDocumentOwner])
                console.log(newOwner)
                if(newOwner) {
                    // DELETE DOCUMENT
                    await dbRunAsync(this.database, 'DELETE FROM PAGES WHERE ID = ?', [documentID])
                    await onContinue(this.database, newOwner['ID'])
                }
                else response.status(NOT_FOUND).json({error: `Username ${newDocumentOwner} does not exist!`})
            }
        } catch (error) { response.status(INTERNAL_SERVER_ERROR).json({error: 'SQLite internal error'}) }
    }

    this.onWriteWebsiteName = async function (request, response, applicantID, newName) {
        try {
            await checkIfAdmin(applicantID, this.database)
            const name = await dbRunAsync(this.database, `UPDATE WEBSITE SET text = ?`, [newName])
            response.status(OK).json({text: name})
        } catch (error) { response.status(INTERNAL_SERVER_ERROR).json({error: 'SQLite internal error'}) }
    }
    this.onReadWebsiteName  = async function (request, response) {
        try {
            const dbResult = await dbGetAsync(this.database, `SELECT text FROM WEBSITE`, [])
            response.status(OK).json({text: dbResult['text']})
        } catch (error) { response.status(INTERNAL_SERVER_ERROR).json({error: 'SQLite internal error'}) }
    }

    this.onRequestImages = async function (request, response) {

        fs.readdir('resources/images', (error, files) => {
            if (error)  response.status(INTERNAL_SERVER_ERROR).json({error: 'SQLite internal error'})
            else {
                const imageFiles = files.filter(file => {
                    const fileExtension = path.extname(file);
                    return ['.jpg', '.jpeg', '.png', '.gif'].includes(fileExtension.toLowerCase())
                })
                response.json(imageFiles)
            }
        })
    }
}

module.exports = Database;
