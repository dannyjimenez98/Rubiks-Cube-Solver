import React from 'react';
import Alert from 'react-bootstrap/Alert';

export default function ErrorMessage({ errorMessage, setShowErrorMsg }) {
  return (
    <div className="container-fluid ">
        <div className="col-md-6 offset-md-3 col-sm-12">
          <Alert variant="warning" onClose={() => setShowErrorMsg(false)} dismissible>
          <Alert.Heading>{errorMessage}</Alert.Heading>
          <p>Please try again.</p>
          </Alert>
        </div>
    </div>
  )
}
