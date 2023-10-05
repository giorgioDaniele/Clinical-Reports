import {Alert, Container} from "react-bootstrap";

function NotFound() {
    return (
        <Container>
            <Alert variant="danger" className="mt-3">
                <h4>Page Not Found</h4>
                <p>The requested page could not be found.</p>
            </Alert>
        </Container>
    )
}
export default NotFound