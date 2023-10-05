import {Col} from "react-bootstrap";
import Profile from "./Profile.jsx";
import PropTypes from "prop-types";
import {User} from "../../../utils.js";

function RightSection(props) {

    return (
        <Col xl={2}>
                <Profile
                    name={props['user'].getName()}
                    username={props['user'].getUsername()}/>
        </Col>
    )

}

RightSection.propTypes = {

    user: PropTypes.instanceOf(User).isRequired,

}

export default RightSection