import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/Header';
import Search from './components/Search';
import Spinner from './components/Spinner';
import axios from 'axios';
import { Col, Container, Row } from 'react-bootstrap';
import Card from './components/ImageCard';
import Welcome from './components/Welcome';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [word, setWord] = useState('');
  const [images, setImages] = useState([]);
  const [loader, setLoader] = useState(true);
  const getSavedImages = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:5050/images');
      setImages(res.data || []);
      setLoader(false);
    } catch (e) {
      toast.error(`Unexpected Error!`);
    }
  };
  useEffect(() => {
    (async () => {
      await getSavedImages();
    })();
    toast.success('Saved images downloaded!');
  }, []);
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    setWord('');
    try {
      const res = await axios.get(
        `http://127.0.0.1:5050/new-image/?query=${word}`,
      );
      toast.info(`New image ${word.toUpperCase()} was found!`);
      setImages([{ ...res.data, title: word }, ...images]);
    } catch (e) {
      toast.error(`Unexpected Error!`);
    }
  };
  const handleDeleteImage = async (id) => {
    try {
      const res = await axios.delete(`http://127.0.0.1:5050/images/${id}`);
      if (res.data?.deleted_img_id) {
        setImages(images.filter((image) => image.id !== id));
        toast.warning(`Image was ${res.data.title} deleted!`);
      }
    } catch (e) {
      toast.error(e.message);
    }
  };

  const handleSaveImage = async (id) => {
    const imageToSave = images.find((img) => img.id === id);
    imageToSave.saved = true;
    try {
      const res = await axios.post('http://127.0.0.1:5050/images', imageToSave);
      console.log('here');
      console.log(res.data?.id);
      if (res.data.id) {
        toast.info(`Image ${imageToSave.title} was saved!`);
        setImages(
          images.map((img) => (img.id === id ? { ...img, saved: true } : img)),
        );
      }
    } catch (e) {}
  };
  return (
    <div className="App">
      <Header title="Images Gallery" />
      {loader ? (
        <Spinner />
      ) : (
        <Search
          word={word}
          setWord={setWord}
          handleSubmit={handleSearchSubmit}
        />
      )}
      {!loader && (
        <Container className="mt-4">
          <Row xs={1} md={2} lg={3}>
            {images.length ? (
              images.map((image, idx) => {
                return (
                  <Col key={idx} className="pb-3">
                    <Card
                      image={image}
                      deleteImage={handleDeleteImage}
                      saveImage={handleSaveImage}
                    />
                  </Col>
                );
              })
            ) : (
              <Welcome />
            )}
          </Row>
        </Container>
      )}
      <ToastContainer position="bottom-right" />
    </div>
  );
}
export default App;
