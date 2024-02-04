import { Spinner as Loader } from 'react-bootstrap';

const Spinner = () => {
  return (
    <div
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
      }}
    >
      <Loader style={{ position: 'absolute', top: '50%' }} animation="border" />
    </div>
  );
};

export default Spinner;
