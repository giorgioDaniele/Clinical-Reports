import { Navbar, Container, Button } from "react-bootstrap"
import {useNavigate} from "react-router-dom"
import PropTypes from "prop-types"
import {useEffect, useState} from "react";
import {BASE_URL} from "../../utils.js";

function NavigationBar(props) {

    const navigate = useNavigate()

    const name = props.user && props.user.name


    return (
        <Navbar style={{backgroundSize: '0', backgroundColor: '#5cb85c'}}>
            <Container fluid>
                <Navbar.Brand className='fs-2'>
                    <Navbar.Text style={{fontSize: 'larger', fontWeight: 'bold', color: '#ffffff'}}>
                        {props.title}
                    </Navbar.Text>
                </Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                    {!name ?
                        <Button className='mx-2' variant='outline-dark' onClick={() => navigate('/login')}>
                            <Navbar.Text style={{fontSize: 'large', fontWeight: 'bold', color: '#ffffff'}}>
                                Login
                            </Navbar.Text>
                        </Button>
                        :
                        <>
                            <Button className='mx-2' variant='outline-dark' onClick={() => {
                                props.logout()
                                navigate('/')
                            }}>
                                <Navbar.Text style={{fontSize: 'large', fontWeight: 'bold', color: '#ffffff'}}>
                                    Logout
                                </Navbar.Text>
                            </Button>
                        </>
                    }
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}
NavigationBar.propTypes = {
    user: PropTypes.object,
    logout: PropTypes.func.isRequired
}
export default NavigationBar;
