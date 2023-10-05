import {Button, Col, Row} from "react-bootstrap";
import {AiFillCaretLeft, AiFillCaretRight} from "react-icons/ai";
import DocumentView from "../../generics/DocumentView.jsx";
import PropTypes from "prop-types";
import {
    Document
} from "../../../utils.js";
import DocumentMenu from "../../generics/DocumentMenu.jsx";
import SearchBar from "../../generics/SearchBar.jsx";

function LeftSection(props) {


    const URL = `http://localhost:3001/api/users/${props['authorSearched']}/documents`

    return (
        <Col xl={props['loggedIn'] ? 10 : 12}>
                <Row>
                    <Col xl={3} className="text-start">
                        <Button
                            variant='success' onClick={() => props.previousPage()}
                            style={{opacity: (props['currentNumberOfDocument'] === 1) ? 0.5 : 1}}
                            disabled={(props['currentNumberOfDocument'] === 1)}>
                            <AiFillCaretLeft/> Go Previous
                        </Button>
                    </Col>
                    <Col xl={6}>
                        <SearchBar
                            loggedIn={props['loggedIn']}
                            setDocumentsFound={props.setDocumentsFound}
                            setOperationResult={props.setOperationResult}
                            setSomethingToDisplay={props.setSomethingToDisplay}
                            author={props['authorSearched']}
                            setAuthor={props.setAuthorSearched}
                            setIsLoading={props.setIsLoading}
                            request={URL}/>
                    </Col>
                    <Col xl={3} className="text-end">
                        <Button
                            variant='success' onClick={() => props.nextPage()}
                            style={{opacity: (props['currentNumberOfDocument'] === props['totalDocuments']) ? 0.5 : 1}}
                            disabled={(props['currentNumberOfDocument'] === props['totalDocuments'])}>
                            Go Next <AiFillCaretRight/>
                        </Button>
                    </Col>
                </Row>
                {
                    props['mode'] === 'SIMPLE VIEW' ?
                        <DocumentView document={props['currentDocument']} loggedIn={props['loggedIn']}/> :
                        <DocumentMenu documents={props['documents']} interactive={false}/>
                }
            </Col>
    )
}

LeftSection.propTypes = {

    authorSearched:          PropTypes.string.isRequired,
    setAuthorSearched:       PropTypes.func.isRequired,
    setIsLoading:            PropTypes.func.isRequired,
    setDocumentsFound:       PropTypes.func.isRequired,
    previousPage:            PropTypes.func.isRequired,
    nextPage:                PropTypes.func.isRequired,
    currentNumberOfDocument: PropTypes.number.isRequired,
    totalDocuments:          PropTypes.number.isRequired,
    loggedIn:                PropTypes.bool.isRequired,
    currentDocument:         PropTypes.instanceOf(Document).isRequired,
    mode:                    PropTypes.string.isRequired,
    documents:               PropTypes.array.isRequired,
    setOperationResult:      PropTypes.func.isRequired,
    setSomethingToDisplay:   PropTypes.func.isRequired,

}

export default LeftSection