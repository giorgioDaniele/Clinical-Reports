import {Col, Button, Container} from 'react-bootstrap'
import {useEffect, useState} from "react"
import PropTypes from "prop-types"
import {useNavigate} from "react-router-dom"
import {AiFillCaretLeft} from "react-icons/ai"
import {HiDocumentPlus} from "react-icons/hi2"
import LoadingState from "../generics/LoadingState.jsx"
import DocumentMenu from "../generics/DocumentMenu.jsx";
import {
    BAD_REQUEST,
    createDocumentFromContents, CustomWarning,
    FORBIDDEN, INTERNAL_SERVER_ERROR,
    NetworkResponse, NOT_FOUND,
    OK, OperationResult,
    SERVER_ERROR,
    User
} from "../../utils.js";
import Feedback from "../generics/Feedback.jsx";
import SearchBar from "../generics/SearchBar.jsx";
import Hint from "../generics/Hint.jsx";
import {BsFillGearFill} from "react-icons/bs";


function Portfolio(props) {


    const navigate = useNavigate()

    // VIEW MANAGEMENT
    const [myDocuments, setMyDocuments] = useState([])

    // DELETION MANAGEMENT
    const [documentToDelete, setDocumentToDelete] = useState({title: '', index: 0})
    const [warning, setWarning]                   = useState(new CustomWarning(undefined))
    const [messageOnDeleted, setMessageOnDeleted] = useState(undefined)
    const [documentDeleted, setDocumentDeleted]   = useState('')

    // ADMIN MANAGEMENT (SEARCH DOCUMENTS)
    const [isAdmin, setIsAdmin] = useState(false)
    const [somethingToDisplay, setSomethingToDisplay] = useState(false)
    const [authorSearched, setAuthorSearched] = useState('')
    const [documentsFound, setDocumentsFound] = useState([])

    // UX ALERTS AND ANIMATIONS MANAGEMENT
    const [isLoading, setIsLoading]             = useState(false)
    const [operationResult, setOperationResult] = useState(new OperationResult(undefined, undefined))


    // WHEN MOUNTING DATA, ASK THE DATABASE FOR AN UPDATE
    // THE REQUEST IS AUTHENTICATED, SO I INCLUDE THE CREDENTIALS
    useEffect(() => {

        let userIsAdmin = false

        const URL_ADMINS     = `http://localhost:3001/api/admins`
        const URL_DOCUMENTS  = `http://localhost:3001/api/documents/mine`
        const OPTIONS =  {
            credentials: "include"
        }

        setIsLoading(true)
        ////////////////////////////////////////////////////////////////////////////
        /// REQUEST FOR ADMINS
        fetch(URL_ADMINS, OPTIONS)
            .then(response => response.json()
                .then(payload => new NetworkResponse(response['status'], payload)))
            .then(networkResult => {
                const exitStatus = networkResult['exitStatusCode']
                if(exitStatus  === OK)
                    userIsAdmin = networkResult['payload']['admins'].map(admin => admin['ID']).includes(props['user'].getId())
                if (exitStatus === BAD_REQUEST)
                    setOperationResult(new OperationResult(BAD_REQUEST, networkResult['payload']['error']))
                if (exitStatus === FORBIDDEN)
                    setOperationResult(new OperationResult(FORBIDDEN,   networkResult['payload']['error']))
            })
            .catch((error) => setOperationResult(new OperationResult(SERVER_ERROR, error)))

        ////////////////////////////////////////////////////////////////////////////
        /// REQUEST FOR USER DOCUMENTS
        fetch(URL_DOCUMENTS, OPTIONS)
            .then(response => response.json()
                .then(payload => new NetworkResponse(response['status'], payload)))
            .then(networkResult => {
                const exitStatus = networkResult['exitStatusCode']
                if(exitStatus  === OK)
                    setMyDocuments(networkResult['payload']['documents'].map(contents => createDocumentFromContents(contents)))
                    setIsAdmin(userIsAdmin)
                if (exitStatus === INTERNAL_SERVER_ERROR)
                    setOperationResult(new OperationResult(INTERNAL_SERVER_ERROR, networkResult['payload']['error']))
                if (exitStatus === FORBIDDEN)
                    setOperationResult(new OperationResult(FORBIDDEN, networkResult['payload']['error']))
            })
            .catch((error) => setOperationResult(new OperationResult(SERVER_ERROR, error)))
            .finally(() => setIsLoading(false) )

    }, [documentDeleted])


    function deleteTransaction () {

        const URL     =  `http://localhost:3001/api/documents/${documentToDelete['index']}`
        const OPTIONS = {
            method: "DELETE",
            credentials: "include"
        }

        setIsLoading(true)
        ////////////////////////////////////////////////////////////////////////////
        /// REQUEST FOR DELETE A DOCUMENT
        ////////////////////////////////////////////////////////////////////////////
        fetch(URL, OPTIONS)
            .then(response => response.json()
                .then(payload => new NetworkResponse(response['status'], payload)))
            .then(networkResult => {
                const exitStatus = networkResult['exitStatusCode']
                if(exitStatus === OK)                     setMessageOnDeleted(`Document ${documentToDelete['title']} has been deleted successfully!`)
                if (exitStatus === INTERNAL_SERVER_ERROR) setOperationResult(new OperationResult(INTERNAL_SERVER_ERROR, networkResult['statusText']))
                if (exitStatus === BAD_REQUEST)           setOperationResult(new OperationResult(BAD_REQUEST, networkResult['statusText']))
                if (exitStatus === FORBIDDEN)             setOperationResult(new OperationResult(FORBIDDEN, networkResult['statusText']))
            }).catch((error) => setOperationResult(new OperationResult(SERVER_ERROR, error)))
            .finally(() => {
                setDocumentDeleted(`Document ${documentToDelete['title']} ${documentToDelete['index']} has been processed!`)
                setIsLoading(false)
            })

    }

    // THIS IS USED BY THE SEARCHBAR
    // ACCORDING TO THE CURRENT AUTHOR NAME TYPED BY THE USER,
    // THE SEARCH BAR WILL QUERY THE DATABASE ACCORDINGLY
    const URL = `http://localhost:3001/api/users/${authorSearched}/documents`

    return (

        <Container>
            <Col>
                <Button
                    variant='success'
                    className='my-3 ml-3'
                    onClick={() => navigate('/')}>
                    <AiFillCaretLeft/> Back to Home
                </Button>
                {isAdmin ?
                    <Button
                    variant='success'
                    className='my-3 mx-3'
                    onClick={() => navigate('/customize')}>
                    <BsFillGearFill/> Change Website Name
                    </Button> : null }
                <Button
                    variant='outline-success'
                    className={isAdmin ? 'my-3' : 'my-3 mx-3'}
                    onClick={() => navigate('/new')}>
                    <HiDocumentPlus/> Add a new document
                </Button>
                {(() => {

                    if(isLoading) return (<LoadingState/>)
                    else
                        if(isAdmin) return (<>
                                    <SearchBar
                                        loggedIn={props['loggedIn']}
                                        setDocumentsFound={setDocumentsFound}
                                        setOperationResult={setOperationResult}
                                        setSomethingToDisplay={setSomethingToDisplay}
                                        author={authorSearched}
                                        setAuthor={setAuthorSearched}
                                        setIsLoading={setIsLoading}
                                        request={URL}/>
                            {!somethingToDisplay ?
                                    // SHOW MY DOCUMENTS...
                                    <>
                                        <DocumentMenu
                                            documents={myDocuments}
                                            setDocumentToDelete={setDocumentToDelete}
                                            setWarning={() => setWarning(new CustomWarning('Are you sure?'))}
                                            interactive={true}/>
                                    </> :
                                    // ... OTHERWISE, THEIRS
                                    <>
                                        <DocumentMenu
                                            documents={documentsFound}
                                            setDocumentToDelete={setDocumentToDelete}
                                            setWarning={() => setWarning(new CustomWarning('Are you sure?'))}
                                            interactive={true}/></>}</>)
                        else return (<>
                                    <DocumentMenu
                                        documents={myDocuments}
                                        setDocumentToDelete={setDocumentToDelete}
                                        setWarning={() => setWarning(new CustomWarning('Are you sure?'))}
                                        interactive={true}/></>)
                })()}
            </Col>
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
                isVisible={operationResult['exitStatusCode'] === SERVER_ERROR}
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
            <Hint
                onAffirmativeLabel={'No'}
                onAffirmative={() => {
                    setWarning(new CustomWarning(undefined))
                }}
                onNegativeLabel={'Yes'}
                onNegative={() => {
                    deleteTransaction(documentToDelete['index'])
                    navigate('/portfolio')
                }}
                message={warning['message']}
                title={`Deleting ${documentToDelete['title']}`}
                isVisible={!!warning['message']}/>
            <Feedback
                isVisible={!!messageOnDeleted}
                title={messageOnDeleted ? 'SUCCESS' : 'ERROR'}
                makeDisappear={() => setMessageOnDeleted(undefined)}
                previousView={'portfolio'}
                message={`Document ${documentToDelete['title']} has been deleted successfully!`}
                buttonMessage={'Back to Portfolio'}/>
        </Container>
    )
}

Portfolio.propTypes = {

    user:     PropTypes.instanceOf(User),
    loggedIn: PropTypes.bool.isRequired
}

export default Portfolio
