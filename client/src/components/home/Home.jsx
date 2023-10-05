import {useEffect, useState} from "react";
import {Row} from "react-bootstrap";
import PropTypes from "prop-types";
import {
    BAD_REQUEST,
    createDocumentFromContents,
    Document,
    DocumentAuthor, INTERNAL_SERVER_ERROR, netRequest, NOT_FOUND, OperationResult, User
} from "../../utils.js";
import LoadingState from "../generics/LoadingState.jsx";
import Feedback from "../generics/Feedback.jsx";
import LeftSection from "./components/LeftSection.jsx";
import RightSection from "./components/RightSection.jsx";


function Home (props) {

    // CURRENT PAGE MANAGEMENT
    const [currentNumberOfDocument, setCurrentNumberOfDocument] = useState(1)
    const [currentDocument, setCurrentDocument]  = useState(new Document(0, '', new DocumentAuthor('', ''), '', '', []))
    const [totalDocuments, setTotalDocuments]    = useState(10)


    const nextPage = () => {
        if(currentNumberOfDocument < totalDocuments)
            setCurrentNumberOfDocument((currentNumberOfPage) => currentNumberOfPage + 1)
    }
    const previousPage = () => {
        if(currentNumberOfDocument >= 2)
            setCurrentNumberOfDocument((currentNumberOfPage) => currentNumberOfPage - 1)
    }

    // WHEN LOGGING IN AND OUT, GET THE NUMBER OF CURRENT PAGE BACK TO 1
    useEffect(() => {
        setCurrentNumberOfDocument(1)
    }, [props.loggedIn])


    // SEARCH DOCUMENT MANAGEMENT
    const [documentsFound,     setDocumentsFound]     = useState([])
    const [somethingToDisplay, setSomethingToDisplay] = useState(false)
    const [authorSearched,     setAuthorSearched]     = useState('')


    // UX ALERTS AND ANIMATIONS MANAGEMENT
    const [isLoading, setIsLoading] = useState(false)
    const [operationResult, setOperationResult] = useState(new OperationResult(undefined, undefined))

    // WHEN SCROLLING, ASK THE DATABASE FOR AN UPDATE
    // THE REQUEST IS NOT AUTHENTICATED, SO I DO NOT INCLUDE THE CREDENTIALS
    useEffect(() => {

            const URL     = `http://localhost:3001/api/sorted-documents/${currentNumberOfDocument}`
            const OPTIONS =  {
                credentials: "include"
            }

            function onSuccess (networkResult) {
                setCurrentDocument(createDocumentFromContents(networkResult['payload']['contents']))
                setTotalDocuments(networkResult['payload']['size'])
            }
            function onFailure (networkResult) {
                setOperationResult(new OperationResult(networkResult['exitStatusCode'], networkResult['payload']['error']))
            }
            function onError  (error) {
                setOperationResult(new OperationResult(INTERNAL_SERVER_ERROR, error))
            }
            function onStartLoading () {
                setIsLoading(true)
            }
            function onEndLoading() {
                setIsLoading(false)
            }

            netRequest(URL, OPTIONS, onSuccess, onFailure, onError, onStartLoading, onEndLoading)

    }, [currentNumberOfDocument, props.user])


    return (
        <div className='p-5'>
                {(() => {
                    if(isLoading) return (<LoadingState/>)
                    else {
                        // IF THE USER IS NOT LOGGED IN, DO NOT SHOW THE RIGHT SECTION...
                        if (!props['loggedIn']) return (
                            <LeftSection
                                setIsLoading={setIsLoading}
                                setSomethingToDisplay={setSomethingToDisplay}
                                setOperationResult={setOperationResult}
                                setDocumentsFound={setDocumentsFound}
                                previousPage={previousPage}
                                nextPage={nextPage}
                                currentNumberOfDocument={currentNumberOfDocument}
                                totalDocuments={totalDocuments}
                                loggedIn={props['loggedIn']}
                                currentDocument={currentDocument}
                                documents={somethingToDisplay ? documentsFound: []}
                                mode={somethingToDisplay ? 'RESULTS VIEW' : 'SIMPLE VIEW'}
                                authorSearched={authorSearched}
                                setAuthorSearched={setAuthorSearched}/>)
                        // ... OTHERWISE, YES
                        else return (
                            <Row>
                                <LeftSection
                                    setIsLoading={setIsLoading}
                                    setSomethingToDisplay={setSomethingToDisplay}
                                    setOperationResult={setOperationResult}
                                    setDocumentsFound={setDocumentsFound}
                                    previousPage={previousPage}
                                    nextPage={nextPage}
                                    currentNumberOfDocument={currentNumberOfDocument}
                                    totalDocuments={totalDocuments}
                                    loggedIn={props['loggedIn']}
                                    currentDocument={currentDocument}
                                    documents={somethingToDisplay ? documentsFound: []}
                                    mode={somethingToDisplay ? 'RESULTS VIEW' : 'SIMPLE VIEW'}
                                    authorSearched={authorSearched}
                                    setAuthorSearched={setAuthorSearched}/>
                                <RightSection user={props['user']}/>
                            </Row>)
                    }
                })()}
            <Feedback
                title={'Something went wrong'}
                isVisible={operationResult['exitStatusCode'] === INTERNAL_SERVER_ERROR}
                message={operationResult['message']}
                makeDisappear={() => setOperationResult(new OperationResult(undefined, undefined))}
                previousView={''}
                buttonMessage={'Back to Home'}/>
            <Feedback
                title={'Something went wrong'}
                isVisible={operationResult['exitStatusCode'] === BAD_REQUEST}
                message={operationResult['message']}
                makeDisappear={() => setOperationResult(new OperationResult(undefined, undefined))}
                previousView={''}
                buttonMessage={'Back to Home'}/>
            <Feedback
                title={'Something went wrong'}
                isVisible={operationResult['exitStatusCode'] === NOT_FOUND}
                message={operationResult['message']}
                makeDisappear={() => setOperationResult(new OperationResult(undefined, undefined))}
                previousView={''}
                buttonMessage={'Back to Home'}/>
        </div>
    )
}

Home.propTypes = {

    loggedIn: PropTypes.bool.isRequired,
    user:     PropTypes.instanceOf(User),

}

export default Home
