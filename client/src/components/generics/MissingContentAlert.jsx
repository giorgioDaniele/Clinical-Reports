import {useState} from "react";
import {Alert, Container} from "react-bootstrap";
import PropTypes from "prop-types";

function MissingContentAlert (props)  {

    const [showAlert, setShowAlert] = useState(true)

    const handleClose = () => {
        props.onClose()
        setShowAlert(false)
    }

    return (
        showAlert && (
            <Container>
                <Alert variant='danger' onClose={handleClose} dismissible className='my-4'>
                    <Alert.Heading>Missing contents</Alert.Heading>
                    <p>Please add some contents!</p>
                </Alert>
            </Container>
        )
    )
}

MissingContentAlert.propTypes = {

    onClose: PropTypes.func.isRequired,

}
export default MissingContentAlert