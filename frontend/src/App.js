import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RubiksCube from './components/RubiksCube';
import VideoFeed from './components/VideoFeed';
import solvedState from './customClasses/solvedState';
import Header from './components/Header';
import Button from 'react-bootstrap/Button';
import ErrorMessage from './components/ErrorMessage';


function App() {
  const [cubeState, setCubeState] = useState(null);
  const [solution, setSolution] = useState(null);
  const [startVideo, setStartVideo] = useState(false);
  const [scanningComplete, setScanningComplete] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showErrorMsg, setShowErrorMsg] = useState(false);

  const reset = () => {
    setCubeState(null);
    setSolution(null);
    setScanningComplete(false);
    setStartVideo(false);
    setErrorMessage(null);
    setShowErrorMsg(false);
  }

  useEffect(() => {
    const fetchCubeState = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/cube_state');
        setCubeState(response.data);
      } catch (error) {
        console.error('Error fetching cube state:', error);
      }
    }

    if (scanningComplete) {
      fetchCubeState();
    }
  }, [scanningComplete]);
  
  useEffect(() => {
    const fetchSolution = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/solution');
        if (response.data) {
          if (JSON.stringify(cubeState) !== JSON.stringify(solvedState)) {
            setSolution(response.data);
            setErrorMessage(null);  // Clear any previous error messages
          } else {
            reset();
            setErrorMessage('Cube already solved. ');
            setShowErrorMsg(true);
          }
        } else {
          throw new Error('No valid solution found');
        }
      } catch (error) {
        console.error('Error fetching solution:', error);
        reset();
        setErrorMessage('No valid solution found. ');
        setShowErrorMsg(true);
      }
    }

    if (scanningComplete && cubeState) {
      fetchSolution();
    }
  }, [scanningComplete, cubeState]);



  return (
    <div className="App">
      <Header />
      {errorMessage && showErrorMsg ?
        <ErrorMessage errorMessage={errorMessage} setShowErrorMsg={setErrorMessage} />
        : null
      }
      {solution && (JSON.stringify(cubeState) !== JSON.stringify(solvedState))
        ?
          <>
            <div className="d-flex justify-content-center"><Button variant="primary" onClick={() => reset()}>Rescan</Button></div>
            <RubiksCube cubeState={cubeState} solution={solution.split(" ")} />
          </>
        : <div className="d-flex justify-content-center">
            {!startVideo
                  ? <div className="d-flex m-5"><Button variant="primary" onClick={() => setStartVideo(true)}>Start Scanning</Button></div> 
                  : <VideoFeed setScanningComplete={setScanningComplete} setErrorMessage={setErrorMessage} setShowErrorMsg={setShowErrorMsg} />
            }
          </div>
      }
    </div>
  );
}

export default App;