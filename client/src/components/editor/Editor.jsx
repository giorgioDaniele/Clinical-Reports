import {Button, Col, Container, Form, Row} from "react-bootstrap"
import {useEffect, useState} from "react"
import {useNavigate, useParams} from "react-router-dom"
import EditorTopHalf from "./EditorTopHalf.jsx"
import EditorBottomHalf from "./EditorBottomHalf.jsx"
import PropTypes from "prop-types"
import {AiFillCaretLeft, AiFillPicture} from "react-icons/ai"
import {HiDocumentPlus} from "react-icons/hi2"
import {BsTextParagraph} from "react-icons/bs"
import LoadingState from "../generics/LoadingState.jsx"
import {
    BAD_REQUEST,
    createDocumentFromContents, CustomError, CustomWarning,
    Document,
    DocumentAuthor, FORBIDDEN,
    Input, INTERNAL_SERVER_ERROR, netRequest,
    NOT_FOUND, OperationResult, toHTTPBodyRequest, User
} from "../../utils.js";
import Feedback from "../generics/Feedback.jsx";
import dayjs from "dayjs";
import MissingContentAlert from "../generics/MissingContentAlert.jsx";
import Hint from "../generics/Hint.jsx";


function Editor(props) {

    // INPUT FORMS
    const [documentInEdit, setDocumentInEdit] = useState(
        new Document(0, '',
            new DocumentAuthor(
                props['mode'] === 'NEW DOCUMENT' ? `${props['user'].getName()}` : '',
                props['mode'] === 'NEW DOCUMENT' ? `${props['user'].getUsername()}` : ''),
                props['mode'] === 'NEW DOCUMENT' ?  dayjs() : '', '', []))

    // FORM MANAGEMENT
    const [inputs, setInputs] = useState([])


    // UX ALERTS AND ANIMATIONS MANAGEMENT
    const [isLoading, setIsLoading]             = useState(false)
    const [operationResult, setOperationResult] = useState(new OperationResult(undefined, undefined))



    function setTitle(title) {
        const newDocument =
            new Document(
                documentInEdit.getId(),
                title,
                new DocumentAuthor(documentInEdit.getAuthorName(), documentInEdit.getAuthorUsername()),
                documentInEdit.getCreationDate(),
                documentInEdit.getPublicationDate(),
                documentInEdit.getDocumentContents())
        setDocumentInEdit(newDocument)
    }
    function setPublicationDate(publicationDate) {
        const newDocument =
            new Document(
                documentInEdit.getId(),
                documentInEdit.getTitle(),
                new DocumentAuthor(documentInEdit.getAuthorName(), documentInEdit.getAuthorUsername()),
                documentInEdit.getCreationDate(),
                publicationDate,
                documentInEdit.getDocumentContents())
        setDocumentInEdit(newDocument)
    }
    function setDocumentAuthor(authorUsername) {
        const newDocument =
            new Document(
                documentInEdit.getId(),
                documentInEdit.getTitle(),
                new DocumentAuthor(documentInEdit.getAuthorName(), authorUsername),
                documentInEdit.getCreationDate(),
                documentInEdit.getPublicationDate(),
                documentInEdit.getDocumentContents())
        setDocumentInEdit(newDocument)
    }

    const navigate = useNavigate()
    const params   = useParams()

    // ADMIN MANAGEMENT
    const [isAdmin, setIsAdmin] = useState(false)


    useEffect(() => {

        const URL_ADMINS         = `http://localhost:3001/api/admins`
        const URL_DOCUMENT       = `http://localhost:3001/api/documents/${params['id']}`
        const OPTIONS =  {
            credentials: "include"
        }

        function onSuccessAdmins (networkResult) {
            setIsAdmin(networkResult['payload']['admins'].map(admin => admin['ID']).includes(props['user'].getId()))
        }
        function onFailureAdmins(networkResult) {
            setOperationResult(new OperationResult(networkResult['exitStatusCode'], networkResult['payload']['error']))
        }
        function onError (error) {
            setOperationResult(new OperationResult(INTERNAL_SERVER_ERROR, error))
        }
        function onStartLoading() {
            setIsLoading(true)
        }
        function onEndLoading() {
            setIsLoading(false)
        }
        function onSuccessDocument (networkResult) {
            setDocumentInEdit(createDocumentFromContents(networkResult['payload']['contents']))
            setInputs(networkResult['payload']['contents'].map((content, indexContent) => {
                return new Input(indexContent, content['media_type'], content['payload'])
            }))
        }
        function onFailureDocument(networkResult) {
            setOperationResult(new OperationResult(networkResult['exitStatusCode'], networkResult['payload']['error']))
        }

        if (props['mode'] === 'EDIT DOCUMENT') {
            /// REQUEST FOR ADMINS
            netRequest(URL_ADMINS, OPTIONS, onSuccessAdmins, onFailureAdmins, onError, onStartLoading, () => {})
            /// REQUEST FOR A DOCUMENT
            netRequest(URL_DOCUMENT, OPTIONS, onSuccessDocument, onFailureDocument, onError, () => {}, onEndLoading)
        }

    }, [])


    function addTransaction()  {


        const body = toHTTPBodyRequest(
            new Document(
            documentInEdit.getId(),
            documentInEdit.getTitle(),
            new DocumentAuthor(
                documentInEdit.getAuthorName(),
                documentInEdit.getAuthorUsername()),
            dayjs(documentInEdit.getCreationDate()).format('YYYY-MM-DD').toString(),
            dayjs(documentInEdit.getPublicationDate()).format('YYYY-MM-DD').toString(), []), inputs)

        console.log(body)


        const URL     =  `http://localhost:3001/api/documents`
        const OPTIONS =  {
            method: 'POST',
            credentials: "include",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body)
        }

        function onStartLoading() {
            setIsLoading(true)
        }
        function onEndLoading ()  {
            setIsLoading(false)
        }
        function onSuccess (networkResult) {
            setMessageOnAdded(`Document ${documentInEdit.getTitle()} has been added successfully!`)
        }
        function onFailure(networkResult) {
            setOperationResult(new OperationResult(networkResult['exitStatusCode'], networkResult['payload']['error']))
        }
        function onError (error) {
            setOperationResult(new OperationResult(INTERNAL_SERVER_ERROR, error))
        }
        netRequest(URL, OPTIONS, onSuccess, onFailure, onError, onStartLoading, onEndLoading)

    }
    function editTransaction() {

        const body = toHTTPBodyRequest(
            new Document(
                documentInEdit.getId(),
                documentInEdit.getTitle(),
                new DocumentAuthor(
                    documentInEdit.getAuthorName(),
                    documentInEdit.getAuthorUsername()),
                dayjs(documentInEdit.getCreationDate()).format('YYYY-MM-DD').toString(),
                dayjs(documentInEdit.getPublicationDate()).format('YYYY-MM-DD').toString(), []), inputs)

        ////////////////////////////////////////////////////////////////////////////
        /// REQUEST FOR EDIT A DOCUMENT
        ////////////////////////////////////////////////////////////////////////////
        const URL     =  `http://localhost:3001/api/documents/${params['id']}`
        const OPTIONS =  {
            method: 'PUT',
            credentials: "include",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body)
        }

        function onStartLoading() {
            setIsLoading(true)
        }
        function onEndLoading ()  {
            setIsLoading(false)
        }
        function onSuccess (networkResult) {
            setMessageOnEdited(`Document ${documentInEdit.getTitle()} has been added successfully!`)
        }
        function onFailure(networkResult) {
            setOperationResult(new OperationResult(networkResult['exitStatusCode'], networkResult['payload']['error']))
        }
        function onError (error) {
            setOperationResult(new OperationResult(INTERNAL_SERVER_ERROR, error))
        }
        netRequest(URL, OPTIONS, onSuccess, onFailure, onError, onStartLoading, onEndLoading)

    }


    // UPLOADING MANAGEMENT
    const [messageOnEdited, setMessageOnEdited] = useState(undefined)
    // ADDING MANAGEMENT
    const [messageOnAdded, setMessageOnAdded]   = useState(undefined)

    // ERROR AND WARNING MANAGEMENT
    const [error,   setError]     = useState(new CustomError(undefined))
    const [warning, setWarning]   = useState(new CustomWarning(undefined))
    const [missingContents, setMissingContents] = useState(false)


    function submit(event) {

        ////////////////////////////////////////////////////////////////////////////
        event.preventDefault() // AVOID BROWSER BEHAVIOR
        ////////////////////////////////////////////////////////////////////////////


        // CHECK BODY CONSISTENCY
        ////////////////////////////////////////////////////////////////////////////
        const documentCreationDate    = documentInEdit.getCreationDate()
        const documentPublicationDate = documentInEdit.getPublicationDate()
        const documentTitle           = documentInEdit.getTitle()


        const headerNumber     = inputs.filter(content => content.getMediaType()  === 'HEADER').length
        const paragraphsNumber = inputs.filter(content => content.getMediaType()  === 'TEXT').length
        const photosNumber     = inputs.filter(content => content.getMediaType()  === 'PHOTO').length

        // A) THE DOCUMENT MUST HAVE A HEADER AND A PARAGRAPH/PHOTO, AT LEAST
        if (!(headerNumber >= 1 && (paragraphsNumber >= 1 || photosNumber >= 1)))
            setError(new CustomError('Document must have a header and a paragraph/photo, at least'))
        // B) DATE MUST BE CONSISTENT
        else if(dayjs(documentPublicationDate).isBefore(dayjs(documentCreationDate)))
            setError(new CustomError('Publication date must be after creation date'))
        // C) TEST TITLE
        else if(documentTitle === '')
            setError(new CustomError('Document title is missing'))
        // D) HEADERS SHOULD NOT BE EMPTY
        else if(inputs.filter(content => content.getMediaType()  === 'HEADER' && content['value'] === '').length > 0)
            setWarning(new CustomWarning('Header should be not empty'))
        // E) TEXT SHOULD NOT BE EMPTY
        else if(inputs.filter(content => content.getMediaType()  === 'TEXT' && content['value'] === '').length > 0)
            setWarning(new CustomWarning('Header should be not empty'))
        // F) PHOTO SHOULD NOT BE EMPTY
        else if(inputs.filter(content => content.getMediaType()  === 'PHOTO' && content['value'] === '').length > 0)
            setWarning(new CustomWarning('Header should be not empty'))
        ////////////////////////////////////////////////////////////////////////////
        else props['mode'] === 'NEW DOCUMENT' ? addTransaction() : editTransaction()
    }

    return (

        <Container>
            <Row className=''>
                {(() => {
                    if (isLoading)
                        return (<LoadingState/>)
                    else return (
                        <Col>
                            {missingContents ? <MissingContentAlert onClose={() => setMissingContents(false)}/> : null}
                            <Form onSubmit={submit}>
                                <Col>
                                    <Button
                                        variant='success'
                                        className='my-3 ml-3'
                                        onClick={() => navigate('/portfolio')}>
                                        <AiFillCaretLeft/> Back to Portfolio
                                    </Button>
                                    <Button
                                        variant='outline-success'
                                        className='my-3 mx-3'
                                        type='submit'>
                                        <HiDocumentPlus/> {props['mode'] === 'NEW DOCUMENT' ? 'Upload Document' : 'Upload Edit'}
                                    </Button>
                                </Col>
                                <EditorTopHalf
                                    document={documentInEdit}
                                    adminEditor={isAdmin}
                                    setAuthor={setDocumentAuthor}
                                    setTitle={setTitle}
                                    setPublicationDate={setPublicationDate}/>
                                <EditorBottomHalf
                                    inputs={inputs}
                                    handleInputChange={handleInputChange}
                                    handleRemoveInput={handleRemoveInput}
                                    moveDown={moveDown}
                                    moveUp={moveUp}/>
                            </Form>
                        </Col>
                    )
                })()}
            </Row>
            <div className='my-5'>
                <Row className='d-flex justify-content-center'>
                    <Col xl={3}>
                        <Button variant="outline-success" onClick={addParagraph}>
                            <BsTextParagraph/> Add New Paragraph
                        </Button>
                    </Col>
                    <Col xl={3}>
                        <Button variant="outline-success" onClick={addPhoto}>
                            Add New Photo <AiFillPicture/>
                        </Button>
                    </Col>
                    <Col xl={3}>
                        <Button variant="outline-success" onClick={addHeader}>
                            Add New Header <BsTextParagraph/>
                        </Button>
                    </Col>
                </Row>
            </div>
            {/* ERROR MANAGEMENT */ }
            <Feedback
                title={'Something went wrong'}
                isVisible={operationResult['exitStatusCode'] === NOT_FOUND}
                message={operationResult['message']}
                makeDisappear={() => setOperationResult(new OperationResult(undefined, undefined))}
                previousView={''} buttonMessage={'Back to Home'}/>
            <Feedback
                title={'Something went wrong'}
                isVisible={operationResult['exitStatusCode'] === INTERNAL_SERVER_ERROR}
                message={operationResult['message']}
                makeDisappear={() => setOperationResult(new OperationResult(undefined, undefined))}
                previousView={''} buttonMessage={'Back to Home'}/>
            <Feedback
                title={'Something went wrong'}
                isVisible={operationResult['exitStatusCode'] === FORBIDDEN}
                message={operationResult['message']}
                makeDisappear={() => setOperationResult(new OperationResult(undefined, undefined))}
                previousView={''} buttonMessage={'Back to Home'}/>
            <Feedback
                title={'Caution'}
                isVisible={operationResult['exitStatusCode'] === BAD_REQUEST}
                message={operationResult['message']}
                makeDisappear={() => setOperationResult(new OperationResult(undefined, undefined))}
                previousView={'portfolio'}
                buttonMessage={'Back to Portfolio'}/>
            {/* WARNINGS */}
            <Hint
                onAffirmativeLabel={'Back to Editor'}
                onAffirmative={() => {
                    setWarning(new CustomWarning(undefined))
                }}
                onNegativeLabel={'Continue anyway'}
                onNegative={() => {
                    if (props['mode'] === 'NEW DOCUMENT')
                        addTransaction()
                    if (props['mode'] === 'EDIT DOCUMENT')
                        editTransaction()
                    navigate('/portfolio')
                }}
                message={`${warning['message']}`}
                title={'Warning'}
                isVisible={!!warning['message']}/>
            {/* ERRORS */}
            <Hint
                onAffirmativeLabel={'Back to Editor'}
                onAffirmative={() => {
                    setError(new CustomError(undefined))
                }}
                onNegativeLabel={'Back to Home'}
                onNegative={() => {
                    navigate('/')
                }}
                message={`${error['message']}`}
                title={'Error'}
                isVisible={!!error['message']}/>
            {/* OPERATION COMPLETED MANAGEMENT */ }
            <Feedback
                isVisible={!!messageOnEdited}
                title={messageOnEdited ? 'SUCCESS' : 'ERROR'}
                makeDisappear={() => setMessageOnEdited(undefined)}
                previousView={'portfolio'}
                message={`Document ${documentInEdit.getTitle()} has been edited successfully!`}
                buttonMessage={'Back to Portfolio'}/>
            <Feedback
                isVisible={!!messageOnAdded}
                title={messageOnAdded ? 'SUCCESS' : 'ERROR'}
                makeDisappear={() => setMessageOnAdded(undefined)}
                previousView={'portfolio'}
                message={`Document ${documentInEdit.getTitle()} has been added successfully!`}
                buttonMessage={'Back to Portfolio'}/>
        </Container>
    )

    function handleInputChange(index, value) {
        const newInputs = inputs.map((input) => {
            if (input.getIndex() === index)
                return new Input(input.getIndex(), input.getMediaType(), value)
            else
                return input
        })
        setInputs(newInputs)
    }
    function addParagraph() {
        setInputs(inputs => [...inputs, new Input(inputs.length, 'TEXT', '')])
    }
    function addPhoto() {
        setInputs(inputs => [...inputs, new Input(inputs.length, 'PHOTO', '')])
    }
    function addHeader() {
        setInputs(inputs => [...inputs, new Input(inputs.length, 'HEADER', '')])
    }
    function handleRemoveInput(index) {
        const newInputs = [...inputs.filter(input => input['index'] !== index)]
        setInputs(newInputs)
    }
    function swap(arr, index1, index2) {
        const length = arr.length
        // CALCULATE THE WRAPPED INDICES
        const i1 = (index1 + length) % length
        const i2 = (index2 + length) % length
        const temp = arr[i1]
        arr[i1] = arr[i2]
        arr[i2] = temp
        return arr
    }
    function moveUp(index) {
        let currentDisposition = [...inputs]
        currentDisposition = swap(currentDisposition, index, index - 1)
        setInputs(() => [...currentDisposition])
    }
    function moveDown(index) {
        let currentDisposition = [...inputs];
        currentDisposition = swap(currentDisposition, index, index + 1)
        setInputs(() => [...currentDisposition])
    }

}

Editor.propTypes = {

    user: PropTypes.instanceOf(User),
    mode: PropTypes.string.isRequired,

}

export default Editor
