import {Button, Col, Row} from "react-bootstrap";
import Gallery from "./components/Gallery.jsx";
import {AiFillCaretDown, AiFillCaretUp} from "react-icons/ai";
import PropTypes from "prop-types";
import HeaderTextInput from "./components/HeaderTextInput.jsx";
import ParagraphTextInput from "./components/ParagraphTextInput.jsx";

function EditorBottomHalf(props) {

    return (
        <Col>
            <div>
                <Row>
                    <Col> {
                        props['inputs'].map((input, index) => {
                            if(input.getMediaType() === 'HEADER')
                                return <div key={input.getIndex()}>
                                <HeaderTextInput
                                    key={input.getIndex()}
                                    input={input}
                                    handleInputChange={props.handleInputChange}
                                    handleRemoveInput={props.handleRemoveInput}/>
                                    <Col>
                                        <Button
                                            variant='outline-success'
                                            className='my-3 ml-3'
                                            onClick={() => {props.moveUp(index)}}>
                                            <AiFillCaretUp/> Move this content above
                                        </Button>
                                        <Button
                                            variant='outline-success'
                                            className='my-3 mx-3'
                                            onClick={() => {props.moveDown(index)}}>
                                            Move this content below <AiFillCaretDown/>
                                        </Button>
                                    </Col>
                                </div>
                            if(input.getMediaType() === 'TEXT')
                                return  <div key={input['index']}>
                                    <ParagraphTextInput
                                        key={input.getIndex()}
                                        input={input}
                                        handleInputChange={props.handleInputChange}
                                        handleRemoveInput={props.handleRemoveInput}/>
                                    <Col>
                                        <Button
                                            variant='outline-success'
                                            className='my-3 ml-3'
                                            onClick={() => {props.moveUp(index)}}>
                                            <AiFillCaretUp/> Move this content above
                                        </Button>
                                        <Button
                                            variant='outline-success'
                                            className='my-3 mx-3'
                                            onClick={() => {props.moveDown(index)}}>
                                            Move this content below <AiFillCaretDown/>
                                        </Button>
                                    </Col>
                                </div>
                            if(input.getMediaType() === 'PHOTO')
                                return  <div key={input['index']}>
                                    <Gallery
                                        key={input.getIndex()}
                                        handleRemoveInput={props.handleRemoveInput}
                                        input={input}
                                        handleInputChange={props.handleInputChange}/>
                                    <Col>
                                    <Button
                                        variant='outline-success'
                                        className='my-3 ml-3'
                                        onClick={() => {props.moveUp(index)}}>
                                        <AiFillCaretUp/> Move this content above
                                    </Button>
                                    <Button
                                        variant='outline-success'
                                        className='my-3 mx-3'
                                        onClick={() => {props.moveDown(index)}}>
                                        Move this content below <AiFillCaretDown/>
                                    </Button>
                                </Col>
                                </div>
                            })
                        }
                        </Col>
                    </Row>
                </div>
        </Col>
    )
}

EditorBottomHalf.propTypes = {

    inputs:            PropTypes.array.isRequired,
    handleInputChange: PropTypes.func.isRequired,
    handleRemoveInput: PropTypes.func.isRequired,
    moveUp:            PropTypes.func.isRequired,
    moveDown:          PropTypes.func.isRequired,

}

export default EditorBottomHalf