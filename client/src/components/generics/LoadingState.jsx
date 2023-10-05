import {Container, Spinner} from "react-bootstrap";

function LoadingState() {

    return (
        <Container>
            <div className="spinner-container"
                 style={{
                     "display": "flex",
                     "justifyContent": "center",
                     "alignItems": "center",
                     "height": "100vh"}}>
                <Spinner animation="border" variant="secondary" role="status"/>
            </div>
        </Container>
    )
}

export default LoadingState