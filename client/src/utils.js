'use strict'


export const BASE_URL     =  'http://localhost:3001/api'
export const OK           =   200
export const SERVER_ERROR =   503
export const NOT_FOUND    =   404
export const BAD_REQUEST  =   400
export const CREATED      =   201
export const FORBIDDEN    =   401
export const INTERNAL_SERVER_ERROR = 500


export function User(id, name, username) {

    this.ID       = id
    this.name     = name
    this.username = username

    this.getId       = () => this.ID
    this.getName     = () => this.name
    this.getUsername = () => this.username

}
export function DocumentContent(mediaType, value) {

    this.mediaType = mediaType
    this.value     = value

    this.getMediaType = () => this.mediaType
    this.getValue     = () => this.value

}
export function DocumentAuthor(name, username) {

    this.name        = name
    this.username    = username
    this.getName     = () => this.name
    this.getUsername = () => this.username

}
export function Document(id, title, author, creationDate, publicationDate, documentContents) {

    this.ID = id
    this.title  = title
    this.author = author
    this.creationDate = creationDate
    this.publicationDate = publicationDate
    this.documentContents = documentContents

    this.getId                  = () => this.ID
    this.getTitle               = () => this.title
    this.getAuthorName          = () => this.author.getName()
    this.getAuthorUsername      = () => this.author.getUsername()
    this.getDocumentContents    = () => this.documentContents
    this.getPublicationDate     = () => this.publicationDate
    this.getCreationDate        = () => this.creationDate

}
export function Input(index, mediaType, value) {

    this.index = index
    this.mediaType = mediaType
    this.value = value

    this.getIndex     = () => this.index
    this.getMediaType = () => this.mediaType
    this.getValue     = () => this.value

}
export function NetworkResponse (exitStatusCode, payload) {

    this.exitStatusCode = exitStatusCode
    this.payload        = payload
}
export function OperationResult (exitStatusCode, message) {
    this.exitStatusCode = exitStatusCode
    this.message        = message
}
export function CustomWarning(message) {
    this.message = message
}
export function CustomError(message) {
    this.message = message
}


export function  createDocumentFromContents (contents) {

    const ID              = contents[0]['ID']
    const title           = contents[0]['title']
    const name            = contents[0]['name']
    const username        = contents[0]['username']
    const publicationDate = contents[0]['publication_date']
    const creationDate    = contents[0]['creation_date']

    let documentContents = []
    contents.forEach(content => {
        if (content['media_type'] === 'HEADER')
            documentContents = [...documentContents, new DocumentContent('HEADER', content['payload'])]
        if (content['media_type'] === 'TEXT')
            documentContents = [...documentContents, new DocumentContent('TEXT', content['payload'])]
        if (content['media_type'] === 'PHOTO')
            documentContents = [...documentContents, new DocumentContent('PHOTO', content['payload'])]
    })

    return new Document(ID, title, new DocumentAuthor(name, username), creationDate, publicationDate, documentContents)
}
export function toHTTPBodyRequest (document, inputs) {

    const body = {
        "ID": document.getId(),
        "title": document.getTitle(),
        "author": {
            "name":     document.getAuthorName(),
            "username": document.getAuthorUsername(),
        },
        "creation_date":    document.getCreationDate(),
        "publication_date": document.getPublicationDate(),
        "contents":        [],
    }
    // RETRIEVE THE ARRAY IN THE OBJECT
    const contents = body["contents"]
    inputs.forEach(input => {
        // CREATE A NEW OBJECT TO INSERT
        const newObject = {
            media_type: input.getMediaType(),
            value:      input.getValue()
        }
        // PUSH THE NEW OBJECT IN THE ARRAY
        contents.push(newObject)
    })
    return body
}

export function netRequest(URL, OPTIONS, onSuccess, onFailure, onError, onStartLoading, onEndLoading) {

    onStartLoading()
    fetch(URL, OPTIONS)
        .then(response => response.json()
            .then(payload => new NetworkResponse(response['status'], payload)))
        .then(networkResult => {
            const exitStatus = networkResult['exitStatusCode']
            if (exitStatus === INTERNAL_SERVER_ERROR) onFailure(networkResult)
            if (exitStatus === BAD_REQUEST)           onFailure(networkResult)
            if (exitStatus === NOT_FOUND)             onFailure(networkResult)
            if(exitStatus === OK)                     onSuccess(networkResult)
        })
        .catch((error) => onError(error))
        .finally(() => onEndLoading())
}
