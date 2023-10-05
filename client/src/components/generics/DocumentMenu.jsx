import {Accordion, Button, Col} from "react-bootstrap"
import DocumentView from "./DocumentView.jsx"
import {BsFillPencilFill} from "react-icons/bs";
import {IoTrashBinSharp} from "react-icons/io5";
import {useNavigate} from "react-router-dom";
import PropTypes from "prop-types";
import dayjs from "dayjs";

const formatDate = (dateString) => {
    return dayjs(dateString, 'YYYY-MM-DD').format('D dddd, MMMM, YYYY')
}

function DocumentMenu(props) {

    const navigate = useNavigate()


    return (
        <div className='my-3'>
                <Accordion>
                    {props['documents'].map((document, index) => (
                        <Accordion.Item eventKey={index.toString()} key={index.toString()}>
                            <Accordion.Header>
                                <Col
                                    style={{ fontSize: '30px', color: 'darkgray', fontWeight: 'bolder'}}
                                    className="text-left my-3">
                                    {document.getTitle()}
                                    <div className='mt-1'>
                                        <span style={{fontStyle: "italic", fontSize: '23px'}}>
                                            Author: {document.getAuthorName()}<br/>
                                        </span>
                                        <span style={{fontStyle: "italic", fontSize: '23px'}}>
                                            Creation: {formatDate(document.getCreationDate())}<br/>
                                        </span>
                                        <span style={{fontStyle: "italic", fontSize: '23px'}}>
                                            Publication: {formatDate(document.getPublicationDate())}
                                        </span>
                                    </div>
                                </Col>
                            </Accordion.Header>
                            <Accordion.Body>
                                {
                                    props['interactive'] ?
                                        <Col className="d-flex justify-content-end">
                                            <Button
                                                variant='outline-success'
                                                onClick={() =>
                                                    navigate(`/edit/${document.getId()}`)}>
                                                <BsFillPencilFill/> Edit Document
                                            </Button>
                                            <Button
                                                variant='outline-danger'
                                                className='mx-3'
                                                onClick={() => {
                                                    props.setDocumentToDelete({ index: document.getId(), title: document.getTitle() })
                                                    props.setWarning()
                                                }}>
                                                <IoTrashBinSharp/> Delete Document
                                            </Button>
                                        </Col> : null
                                }
                                <DocumentView document={document}/>
                            </Accordion.Body>
                        </Accordion.Item>
                    ))}
                </Accordion>
        </div>
    )
}


DocumentMenu.propTypes = {

    documents:           PropTypes.array.isRequired,
    setDocumentToDelete: PropTypes.func,
    setWarning:          PropTypes.func,
    interactive:         PropTypes.bool.isRequired,
}

export default DocumentMenu
