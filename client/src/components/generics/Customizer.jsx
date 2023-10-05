import {Button, Col, Container, Form, Row} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {AiFillCaretLeft} from "react-icons/ai";

const Customizer = (props) => {

    const navigate = useNavigate()

    return (
        <Container className="vh-100 align-items-center justify-content-center">
            <Row>
                <Col xl={12}>
                        <Button
                            className='my-5'
                            variant='success' onClick={() => navigate('/portfolio')}>
                            <AiFillCaretLeft/> Back to Portfolio
                        </Button>
                    <h2>Website Name</h2>
                    <Form onSubmit={props.handleSubmit}>
                        <Form.Group controlId='username'>
                            <Form.Label>Website name</Form.Label>
                            <Form.Control
                                type='text'
                                value={props.websiteTitle}
                                onChange={event => props.setWebsiteTitle(event.target.value)}/>
                        </Form.Group>

                        <Button className='my-2' type='submit' variant='outline-success'>Submit</Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}

export default Customizer