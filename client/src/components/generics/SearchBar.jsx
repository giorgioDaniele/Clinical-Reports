import {Button, Col, Form} from "react-bootstrap";
import {AiOutlineFileSearch} from "react-icons/ai";
import PropTypes from "prop-types";
import {
    createDocumentFromContents,
    INTERNAL_SERVER_ERROR,
    NetworkResponse, OK, OperationResult
} from "../../utils.js";

function SearchBar(props) {


    const handleSubmit = (event) => {

        ////////////////////////////////////////////////////////////////////////////
        event.preventDefault()     // AVOID BROWSER BEHAVIOR
        ////////////////////////////////////////////////////////////////////////////

        if (props['author']) {

            props.setIsLoading(true)
            fetch(props['request'], {credentials: "include"})
                .then(response => response.json()
                    .then(payload => new NetworkResponse(response['status'], payload)))
                .then(networkResult => {

                    const exitStatus = networkResult['exitStatusCode']
                    if (exitStatus === INTERNAL_SERVER_ERROR)
                        props.setOperationResult(new OperationResult(INTERNAL_SERVER_ERROR, networkResult['statusText']))
                    if(exitStatus === OK) {
                        props.setDocumentsFound(networkResult['payload']['documents']
                            .map(contents => createDocumentFromContents(contents)))
                        props.setSomethingToDisplay(true)
                    }
                })
                .catch((error) => props.setOperationResult(new OperationResult(INTERNAL_SERVER_ERROR, error)))
                .finally(()    => props.setIsLoading(false))
        } else { props.setSomethingToDisplay(false) }
    }

    return (
        <Form className="d-flex" onSubmit={handleSubmit}>
            <Col xl={10}>
                <Form.Control
                    type='text'
                    placeholder='Search by author name'
                    value={props['author']}
                    onChange={event => props.setAuthor(event['target']['value'])}/>
            </Col>
            <Col xl={2} className='mx-2'>
                <Button
                    type='submit'
                    variant='outline-success'>
                    Search <AiOutlineFileSearch/>
                </Button>
            </Col>
        </Form>
    )
}

SearchBar.propTypes = {

    loggedIn:                PropTypes.bool.isRequired,
    setDocumentsFound:       PropTypes.func.isRequired,
    setOperationResult:      PropTypes.func.isRequired,
    setSomethingToDisplay:   PropTypes.func.isRequired,
    author:                  PropTypes.string.isRequired,
    setAuthor:               PropTypes.func.isRequired,
    setIsLoading:            PropTypes.func.isRequired,
    request:                 PropTypes.string.isRequired,

}

export default SearchBar