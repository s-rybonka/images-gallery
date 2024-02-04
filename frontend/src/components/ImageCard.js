import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

const ImageCard = ({ image, deleteImage, saveImage }) => {
  return (
    <Card style={{ width: '18rem' }} className="text-center">
      <Card.Img variant="top" src={image.urls.small} />
      <Card.Body>
        <Card.Title>{image.title?.toUpperCase()}</Card.Title>
        <Card.Text>{image.description || image.alt_description}</Card.Text>
        <Button variant="danger" onClick={() => deleteImage(image.id)}>
          Delete
        </Button>{' '}
        {!image.saved && (
          <Button variant="primary" onClick={() => saveImage(image.id)}>
            Save
          </Button>
        )}
      </Card.Body>
      <Card.Footer className="text-center">
        {image.user.portfolio_url ? (
          <Card.Link href={image.user.portfolio_url} target="_blank">
            {image.user?.name}
          </Card.Link>
        ) : (
          image.user.name || 'No author name'
        )}
      </Card.Footer>
    </Card>
  );
};

export default ImageCard;
