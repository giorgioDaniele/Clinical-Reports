import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {Alert, Button, Col, Container, Form, Row} from "react-bootstrap"
import PropTypes from "prop-types";



function Login(props) {

    const navigate = useNavigate()

    const [username, setUsername] = useState('balenablu@clinica.com')
    const [password, setPassword] = useState('balenablu')

    const [errorMessage, setErrorMessage] = useState('')

    async function login (credentials) {

        const URL     = 'http://localhost:3001/api/sessions'
        const OPTIONS = {
            method: 'POST',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(credentials)
        }

        const response = await fetch(URL, OPTIONS)
        if (response.ok) {
            setErrorMessage('')
            props.loginSuccessful(await response.json())
        }
        else setErrorMessage('Wrong username or password')
    }
    const handleSubmit = async (event) => {

        ////////////////////////////////////////////////////////////////////////////
        event.preventDefault() // AVOID BROWSER BEHAVIOR
        ////////////////////////////////////////////////////////////////////////////

        setErrorMessage('')
        const credentials = {username, password}

        // VALIDATION PROCESS
        let valid = true
        if (username === '' || password === '') valid = false
        if (valid) await login(credentials)
        else
            setErrorMessage(
                (!credentials.password && !credentials.username) ? 'Please insert a valid username and password' :
                    !credentials.password ? 'Please insert a valid password' :
                        !credentials.username ? 'Please insert a valid username' :
                            null
            )
    }

    return (

        <Container className="vh-100 d-flex align-items-center justify-content-center">
            <Row>
                <Col xs={12}>
                    <h2>Login</h2>
                    <Form onSubmit={handleSubmit}>
                        {errorMessage ? <Alert variant='danger' dismissible onClick={() => setErrorMessage('')}>
                            {errorMessage} </Alert> : ''}

                        <Form.Group controlId='username'>
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type='email'
                                value={username}
                                onChange={event => setUsername(event.target.value)}/>
                        </Form.Group>

                        <Form.Group controlId='password'>
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type='password'
                                value={password}
                                onChange={event => setPassword(event.target.value)}/>
                        </Form.Group>

                        <Button className='my-2' type='submit' variant='outline-success'>Login</Button>
                        <Button className='my-2 mx-2' variant='outline-danger' onClick={() => navigate('/') // RETURN TO THE HOME PAGE
                        }>Cancel</Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}

Login.propTypes = {
    loginSuccessful: PropTypes.func.isRequired
}


export default Login