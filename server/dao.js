'use strict';

const sqlite = require('sqlite3')
const dayjs  = require('dayjs')
const crypto = require('crypto')

// OPEN THE DATABASE
const db = new sqlite.Database('./resources/database.db', (error) => {
    if(error) throw error
});



/*
function groupBy (rows) {

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

function getUser (email, password)  {
    return new Promise((resolve, reject) => {
        const QUERY  = 'SELECT * FROM USERS WHERE email = ?'
        const PARAMS = [email]
        db.get(QUERY, PARAMS, (err, row) => {
            if (err) reject(err)
            else if (row === undefined) resolve(false)
            else {
                const user = {ID: row.ID, username: row.email, name: row.name}
                const salt = row.salt
                crypto.scrypt(password, salt, 32, (err, hashedPassword) => {
                    if (err) reject(err)
                    const passwordHex = Buffer.from(row.password, 'hex')
                    if(!crypto.timingSafeEqual(passwordHex, hashedPassword))
                        resolve(false)
                    else { resolve(user) }
                })
            }
        })
    })
}
function getUserById (ID)  {
    return new Promise((resolve, reject) => {
        const QUERY  = 'SELECT * FROM USERS WHERE ID = ?'
        const PARAMS = [ID]
        db.get(QUERY, PARAMS, (err, row) => {
            if (err)
                reject(err)
            else if (row === undefined)
                resolve({error: 'User not found.'})
            else {
                const user = {ID: row.ID, username: row.email, name: row.name}
                resolve(user)
            }
        });
    });
}
function getUserByUsername (username)  {
    return new Promise((resolve, reject) => {
        const QUERY  =
            'SELECT USERS.ID, USERS.email as username ' +
            'FROM USERS WHERE USERS.email = ?;'
        const PARAMS = [username]
        db.all(QUERY, PARAMS, function (error, rows) {
            if(!error) {
                resolve(rows[0])
            } else {  reject() }
        })
    })
}
/*
function getCurrentDocument (ID, mode)  {
    return new Promise((resolve, reject) => {
        // THIS QUERY SELECTS ALL THE DOCUMENTS THAT HAVE BEEN PUBLISHED (THE PUBLICATION DATE
        // IS TODAY OR IN THE PAST) IF THE USER IS NOT AUTHENTICATED
        // OTHERWISE, IT SELECTS ALL THE DOCUMENTS
        //db.close()
        const PARAMS = []
        const QUERY =

            `SELECT PAGES.title, PAGES.ID, PAGES.publication_date, PAGES.creation_date,
            USERS.name, USERS.email as username, CONTENTS.media_type, CONTENTS.payload

            FROM PAGES
            INNER JOIN CONTENTS ON PAGES.ID = CONTENTS.pageId
            INNER JOIN USERS ON PAGES.userId = USERS.ID

            ${mode === 'not_authenticated' ?
                'WHERE PAGES.publication_date IS NOT NULL AND PAGES.publication_date <= DATE(\'now\') ' +
                'ORDER BY PAGES.publication_date ASC' : ''}`
        // RUN THE QUERY
        //db.close() //DISABLE THIS COMMENT FOR TEST A SERVICE DISRUPTION
        db.all(QUERY, PARAMS, function (error, rows) {
            if (!error) {
                const groupedData = groupBy(rows)
                resolve({size: groupedData.length, contents: groupedData[ID - 1]})
            } else { reject() }
        })
    })
}
function getDocumentsByUserID (ID)  {
    //db.close() //DISABLE THIS COMMENT FOR TEST A SERVICE DISRUPTION
    return new Promise((resolve, reject) => {

        const QUERY  = '' +
            'SELECT PAGES.ID, ' +
            'PAGES.title, ' +
            'PAGES.publication_date, ' +
            'PAGES.creation_date, ' +
            'USERS.name, ' +
            'USERS.email as username, ' +
            'CONTENTS.media_type, ' +
            'CONTENTS.payload ' +

            'FROM PAGES ' +
            'INNER JOIN CONTENTS ON PAGES.ID = CONTENTS.pageId ' +
            'INNER JOIN USERS ON PAGES.userId = USERS.ID WHERE USERS.ID = ?'
        const PARAMS =  [ID]

        db.all(QUERY, PARAMS, function (error, rows) {
            if(!error) {
                const groupedData = groupBy(rows)
                resolve({size: groupedData.length, documents: groupedData})
            } else { reject() }
        })
    })
}
function getSystemAdmins ()  {
    return new Promise((resolve, reject) => {
        const QUERY  = 'SELECT ADMINS.ID FROM ADMINS'
        const PARAMS = []
        db.all(QUERY, PARAMS, function (error, rows) {
            error ? reject() : resolve({admins: rows})
        })
    })
}
function getDocumentByID (ID)  {

    return new Promise((resolve, reject) => {
        const QUERY =
            'SELECT PAGES.title, ' +
            'PAGES.ID, ' +
            'PAGES.publication_date, ' +
            'PAGES.creation_date, ' +
            'USERS.name, ' +
            'USERS.email as username, ' +
            'CONTENTS.media_type, ' +
            'CONTENTS.payload ' +

            'FROM PAGES ' +
            'INNER JOIN CONTENTS ON PAGES.ID = CONTENTS.pageId ' +
            'INNER JOIN USERS ON PAGES.userId = USERS.ID ' +
            'WHERE PAGES.ID = ?;'
        const PARAMS = [ID]
        db.all(QUERY, PARAMS, function (error, rows) {
            if(!error) {
                resolve({contents: rows})
            } else {  reject() }
        })
    })
}


function deleteDocumentByID(ID) {

    const QUERY = 'DELETE FROM PAGES WHERE ID = ?'
    const PARAMS = [ID]
    return new Promise((resolve, reject) => {
        db.run(QUERY, PARAMS, function (error) {
            if(!error) {
                resolve(this.lastID)
            } else reject()
        })
    })
}
function addDocument (document) {
    const QUERY  = 'INSERT INTO PAGES (title, userId, creation_date, publication_date) VALUES(?, ?, DATE(?), DATE(?))'
    const PARAMS = [document['title'], document['userId'], document['creation_date'], document['publication_date']]
    return new Promise((resolve, reject) => {
        db.run(QUERY, PARAMS, function (error) {
            if(!error) {
                resolve(this.lastID)
            } else reject()
        })
    })
}
function addContentToDocument (content)  {

    return new Promise((resolve, reject) => {
        const QUERY  = 'INSERT INTO CONTENTS (pageId, media_type, payload) VALUES(?, ?, ?)'
        const PARAMS = [content['pageId'], content['media_type'], content['payload']]
        db.run(QUERY, PARAMS, function (error) {
            if(!error) {
                resolve(this.lastID)
            } else reject()
        })
    })
}
function removeContentsFromDocument  (ID)  {
    return new Promise((resolve, reject) => {

        const QUERY  = 'DELETE FROM CONTENTS WHERE CONTENTS.pageId = ?'
        const PARAMS = [ID]
        db.all(QUERY, ID, function (error, rows) {
            if(!error) {
                resolve(rows)
            } else reject()
        })
    })
}


function getDocumentsOfAuthor (name, withPublicationDate)  {
    //db.close() //DISABLE THIS COMMENT FOR TEST A SERVICE DISRUPTION
    return new Promise((resolve, reject) => {
        // THIS QUERY SELECTS ALL THE DOCUMENTS RELATED TO A USER
        const PARAMS = [name]
        const QUERY  =

            `SELECT PAGES.title, PAGES.ID, PAGES.publication_date, PAGES.creation_date,
            USERS.name, USERS.email as username, CONTENTS.media_type, CONTENTS.payload 
            
            FROM PAGES
            INNER JOIN CONTENTS ON PAGES.ID = CONTENTS.pageId 
            INNER JOIN USERS ON PAGES.userId = USERS.ID
            
            ${withPublicationDate === 'JUST_PUBLISHED' ?
                'WHERE USERS.name LIKE \'%\' || ? || \'%\' AND PAGES.publication_date <= DATE(\'now\')' :
                'WHERE USERS.name LIKE \'%\' || ? || \'%\''}`

        db.all(QUERY, PARAMS, function (error, rows) {
            if(!error) {
                const groupedData = groupBy(rows)
                resolve({size: groupedData.length, documents: groupedData})
            } else { reject() }
        })
    })
}

function writeWebsiteName(newName) {
    return new Promise((resolve, reject) => {
        const PARAMS = [newName]
        const QUERY  = `UPDATE WEBSITE SET text = ?`
        db.run(QUERY, PARAMS, function(error) {
            error ? reject() : resolve()
        })
    })
}
function readWebsiteName() {
    return new Promise((resolve, reject) => {
        const PARAMS = []
        const QUERY = `SELECT text FROM WEBSITE`
        db.all(QUERY, PARAMS, function (error, rows) {
            console.log(rows)
            error ? reject() : resolve(rows[0]['text'])
        })
    })
} */

/*
module.exports = {
    getSystemAdmins,
    getUserByUsername,
    getDocumentsOfAuthor,
    getDocumentByID,
    getDocumentsByUserID,
    //getCurrentDocument,
    getUser,
    getUserById,
    addContentToDocument,
    addDocument,
    //countDocumentInTheSystem,
    deleteDocumentByID,
    removeContentsFromDocument,
    readWebsiteName,
    writeWebsiteName
} */