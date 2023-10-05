import {Card, Form, FormControl} from "react-bootstrap";
import dayjs from "dayjs";
import PropTypes from "prop-types"
import CardText from "../generics/CardText.jsx";
import {Document} from "../../utils.js";

const formatDate = (dateString) => {
    if(dateString)
        return dayjs(dateString, 'YYYY-MM-DD').format('D MMMM YYYY, dddd')
    return dayjs().format('D MMMM YYYY, dddd')

}

function EditorTopHalf(props) {

    return (
        <div>
            <Card className='my-3' style={{
                backgroundColor:  props['document'].getTitle() ? '#00FF000F' : '#FFFF000F' }}>
                <Card.Body>
                    <Card.Title style={{ fontSize: '30px', color: 'darkgray', fontWeight: 'bolder'}}>
                        Title:
                    </Card.Title>
                    <Card.Body>
                        <Form.Group controlId="formName">
                            <FormControl
                                type="text"
                                value={props['document'].getTitle()}
                                onChange={event => props.setTitle(event.target.value)}/>
                        </Form.Group>
                    </Card.Body>
                </Card.Body>
            </Card>
            {
                props['adminEditor'] ?
                    <Card className='my-3'
                          style={{ backgroundColor: props['document'].getPublicationDate() ? '#00FF000F' : '#FFFF000F'}}>
                        <Card.Body>
                            <Card.Title style={{ fontSize: '30px', color: 'darkgray', fontWeight: 'bolder'}}>
                                Author:
                            </Card.Title>
                            <Card.Body>
                                <Form.Group controlId="formName">
                                    <FormControl
                                        type="text"
                                        value={props['document'].getAuthorUsername()}
                                        onChange={event => props.setAuthor(event.target.value)}/>
                                </Form.Group>
                            </Card.Body>
                        </Card.Body>
                    </Card> :  <CardText title={'Author:'} subTitle={props['document'].getAuthorUsername()}/> }

            <CardText title={'Creation Date:'} subTitle={formatDate(props['document'].getCreationDate())}/>
            <Card className='my-3'
                  style={{ backgroundColor:  props['document'].getPublicationDate() ? '#00FF000F' : '#FFFF000F' }}>
                <Card.Body>
                    <Card.Title style={{ fontSize: '30px', color: 'darkgray', fontWeight: 'bolder'}}>
                        Publication Date:
                    </Card.Title>
                    <Card.Body>
                        <Form.Group controlId="formName" className='my-3'>
                            <FormControl
                                type='date'
                                value={
                                    props['document']
                                        .getPublicationDate() ?
                                            props['document']
                                                .getPublicationDate() : ''}
                                onChange={event => props.setPublicationDate(event.target.value)}/>
                        </Form.Group>
                    </Card.Body>
                </Card.Body>
            </Card>
        </div>
    )
}

EditorTopHalf.propTypes = {

    document:           PropTypes.instanceOf(Document).isRequired,
    setTitle:           PropTypes.func.isRequired,
    setPublicationDate: PropTypes.func.isRequired,
    adminEditor:        PropTypes.bool.isRequired,
    setAuthor:          PropTypes.func
}

export default EditorTopHalf