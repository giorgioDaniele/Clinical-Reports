import {Card} from "react-bootstrap";

function CardText (props) {

    return (
        <Card className='my-3'
              style={{ backgroundColor: 'white' }}>
            <Card.Body>
                <Card.Title style={{ fontSize: '30px', color: 'darkgray', fontWeight: 'bolder'}}>
                    {props.title}
                </Card.Title>
                <Card.Subtitle style={{ fontSize: '20px', color: 'black', marginLeft: '16px'}}>
                    {props.subTitle}
                </Card.Subtitle>
            </Card.Body>
        </Card>
    );
}

export default CardText