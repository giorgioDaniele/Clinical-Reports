import {Button, Card, Col} from "react-bootstrap"
import PropTypes from "prop-types"
import {useNavigate} from "react-router-dom";
import {FaUserTie} from "react-icons/fa";


function Profile(props) {


    const navigate = useNavigate()

    return (
        <Col>
            <Card className='text-center'>
                <Card.Body>
                    <FaUserTie size={'100px'} className='mb-5'/>
                    <Card.Title>{props.name}</Card.Title>
                    <Card.Text>{props.username}</Card.Text>
                    <Col className='mt-4'>
                        <Button
                            variant='success'
                            className='w-100 mb-2'
                            size='lg'
                            onClick={() => {navigate('/portfolio')} }>
                            My Area
                        </Button>
                    </Col>
                </Card.Body>
            </Card>
        </Col>
    )
}
Profile.propTypes = {

    name:     PropTypes.string.isRequired,
    username: PropTypes.string.isRequired

}

export default Profile
