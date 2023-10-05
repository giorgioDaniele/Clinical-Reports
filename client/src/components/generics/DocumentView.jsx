import {Card, Col} from "react-bootstrap"
import PropTypes from "prop-types"
import { Image } from 'react-bootstrap'
import weekday from 'dayjs/plugin/weekday'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import dayjs from "dayjs"
import CardText from "./CardText.jsx"
import {BASE_URL, Document} from "../../utils.js";


dayjs.extend(weekday);
dayjs.extend(customParseFormat);

const formatDate = (dateString) => {
    return dayjs(dateString, 'YYYY-MM-DD').format('D dddd, MMMM, YYYY')
}

function DocumentView(props) {

    return (
        <Col>
            <CardText title={'Title:'}  subTitle={props['document'].getTitle()}/>
            <CardText title={'Author:'} subTitle={
                props['document'].getAuthorName() + ' (' +  props['document'].getAuthorUsername() + ')'}/>
            <CardText title={'Creation Date:'} subTitle={formatDate(props['document'].getCreationDate())}/>
            <CardText title={'Publication Date:'} subTitle={
                props['document'].getPublicationDate() ? formatDate(props['document'].getPublicationDate()) : ''}/>

            <div>
                {props['document'].getDocumentContents().map((documentContent, index) => {

                    if(documentContent.getMediaType() === 'HEADER')
                        return <CardText key={index} title={'Header:'} subTitle={documentContent.getValue()}/>
                    if(documentContent.getMediaType() === 'TEXT')
                        return <CardText key={index} title={'Paragraph:'} subTitle={documentContent.getValue()}/>
                    if(documentContent.getMediaType() === 'PHOTO') {
                        return <Card key={index} style={{ backgroundColor: 'white', scale: '0.7'}}>
                            <Card.Body>
                                <Card.Body>
                                    <Image
                                        style={{ width: '100%',  height: '100%', borderRadius: '10%'}}
                                        key={index}
                                        src={`http://localhost:3001/api/images/${documentContent.getValue()}`}
                                        alt={documentContent.getValue()}/>
                                </Card.Body>
                            </Card.Body>
                        </Card>
                    }
                })}
            </div>
        </Col>
    )
}

DocumentView.propTypes = {
    document: PropTypes.instanceOf(Document).isRequired,
}

export default DocumentView
