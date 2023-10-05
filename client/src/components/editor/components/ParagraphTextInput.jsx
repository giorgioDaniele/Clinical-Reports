import {Button, Card, Form} from "react-bootstrap";
import PropTypes from "prop-types";
import {Input} from "../../../utils.js";

function ParagraphTextInput(props) {

    return (
        <div>
            <Card className='my-3' style={{
                backgroundColor:  props['input'].getValue() ? '#00FF000F' : '#FFFF000F' }}>
                <Card.Body>
                    <Card.Title style={{ fontSize: '30px', color: 'darkgray', fontWeight: 'bolder'}}>
                        Paragraph:
                    </Card.Title>
                    <Card.Body>
                        <Form.Group key={props.input.index}>
                            <Form.Control
                                className='mx-auto'
                                as="textarea" rows={20}
                                value={props['input'].getValue()}
                                onChange={ (event) =>
                                    props
                                        .handleInputChange(props['input']
                                            .getIndex(), event.target.value)
                                }/>
                        </Form.Group>
                        <Button
                            className='mt-3'
                            variant="outline-danger"
                            onClick={
                                () => props
                                    .handleRemoveInput(props['input']
                                        .getIndex())
                            }>
                            Remove Paragraph
                        </Button>
                    </Card.Body>
                </Card.Body>
            </Card>
        </div>
    )
}
ParagraphTextInput.propTypes = {

    input:             PropTypes.instanceOf(Input).isRequired,
    handleInputChange: PropTypes.func.isRequired,
    handleRemoveInput: PropTypes.func.isRequired,

}

export default ParagraphTextInput