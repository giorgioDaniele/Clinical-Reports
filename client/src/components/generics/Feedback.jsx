import {Button, Modal} from "react-bootstrap"
import PropTypes from "prop-types";
import {useNavigate} from "react-router-dom";

function Feedback(props) {

    const navigate = useNavigate()


    return (
        <Modal show={props['isVisible']} onClick={() => {
                   props.makeDisappear()
                   navigate(`/${props['previousView']}`)
               }}>
            <Modal.Header closeButton>
                <Modal.Title>{props['title']}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p> {props['message']} </p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant='outline-success' onClick={() => {
                        props.makeDisappear()
                        navigate(`/${props['previousView']}`)
                    }}>
                    {props['buttonMessage']}
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

Feedback.propTypes = {

    isVisible:      PropTypes.bool.isRequired,
    title:          PropTypes.string.isRequired,
    message:        PropTypes.string,
    makeDisappear:  PropTypes.func.isRequired,
    previousView:   PropTypes.string.isRequired,
    buttonMessage:  PropTypes.string.isRequired,
}

export default Feedback
