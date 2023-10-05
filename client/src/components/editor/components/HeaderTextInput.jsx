import {Button, Card, Form} from "react-bootstrap";
import PropTypes from "prop-types";

function HeaderTextInput(props) {

    return (
        <div>
            <Card className='my-3' style={{
                backgroundColor: props.input.value ? '#00FF000F' : '#FFFF000F'
            }}>
                <Card.Body>
                    <Card.Title style={{ fontSize: '30px', color: 'darkgray', fontWeight: 'bolder'}}>
                        Header:
                    </Card.Title>
                    <Card.Body>
                        <Form.Group key={props.input.index}>
                            <Form.Control
                                className='mx-auto'
                                as="textarea" rows={10}
                                value={props.input.value}
                                onChange={(event) => props.handleInputChange(props.input.index, event.target.value)}/>
                        </Form.Group>
                        <Button
                            className='mt-3'
                            variant="outline-danger"
                            onClick={() => props.handleRemoveInput(props.input.index)}>
                            Remove Header
                        </Button>
                    </Card.Body>
                </Card.Body>
            </Card>
        </div>
    )
}
HeaderTextInput.propTypes = {

    input:             PropTypes.object.isRequired,
    handleInputChange: PropTypes.func.isRequired,
    handleRemoveInput: PropTypes.func.isRequired,

}

export default HeaderTextInput