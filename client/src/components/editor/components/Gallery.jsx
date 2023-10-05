import {useEffect, useState} from "react";
import {Button, Card, Col, Image, Row} from 'react-bootstrap';
import PropTypes from "prop-types";
import {BASE_URL} from "../../../utils.js";

function Gallery(props) {

    const [selectedImage, setSelectedImage] = useState('')
    const [images, setImages]               = useState([''])

    const handleImageClick = (image) => {
        setSelectedImage(image)
        props.handleInputChange(props.input.index, image)
    }

    useEffect(() => {

        const URL = `http://localhost:3001/api/images`

        fetch(URL)
            .then(response => response.json())
            .then(json => {
                setImages(json)
            })

    }, [])

    return (

        <div>
            <Card className='my-3' style={{ backgroundColor: 'white' }}>
                <Card.Body>
                    <Card.Title style={{ fontSize: '30px', color: 'darkgray', fontWeight: 'bolder'}}>
                        Picture:
                    </Card.Title>
                    <Card.Body>
                        <Row>
                            {images.map((image, index) => (
                                <Col key={index}>
                                    <Image
                                        style={{ width: '280px', height: '200px', borderRadius: '10%'}}
                                        key={index}
                                        src={`http://localhost:3001/api/images/${image}`}
                                        alt={image.toString()}
                                        className={`${selectedImage === image ? 'selected-image' : ''} my-2`}
                                        onClick={() => handleImageClick(image)} thumbnail={true}/>
                                </Col>
                            ))}
                        </Row>
                        <Button
                            className='mt-2'
                            variant="outline-danger"
                            onClick={() => props.handleRemoveInput(props.input.index)}>
                            Remove Photo
                        </Button>
                    </Card.Body>
                </Card.Body>
            </Card>
        </div>
    )
}
export default Gallery

Gallery.propTypes = {

    handleRemoveInput: PropTypes.func.isRequired,
    input:             PropTypes.object.isRequired,
    handleInputChange: PropTypes.func.isRequired,

}
