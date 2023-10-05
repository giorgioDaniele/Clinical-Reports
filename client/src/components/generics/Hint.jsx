import PropTypes from "prop-types";
import {Button, Modal} from "react-bootstrap";

function Hint(props) {

    return (
        <Modal show={props['isVisible']} onClick={() => props.onAffirmative()}>
            <Modal.Header closeButton>
                <Modal.Title>{props['title']}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>{props['message']}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant='outline-success' onClick={() => props.onAffirmative()}> {props['onAffirmativeLabel']} </Button>
                <Button variant='outline-danger'  onClick={() => props.onNegative()}>  {props['onNegativeLabel']} </Button>
            </Modal.Footer>
        </Modal>
    )
}

Hint.propTypes = {

    title:               PropTypes.string.isRequired,
    isVisible:           PropTypes.bool.isRequired,
    onAffirmativeLabel:  PropTypes.string,
    onNegativeLabel:     PropTypes.string,
    onAffirmative:       PropTypes.func,
    onNegative:          PropTypes.func,
    message:             PropTypes.string
}


export default Hint