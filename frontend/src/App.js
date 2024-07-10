import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RubiksCube from './components/RubiksCube';
import VideoFeed from './components/VideoFeed';
import solvedState from './customClasses/solvedState';
import Home from './components/Home';
import Button from 'react-bootstrap/Button';

function App() {
  const [cubeState, setCubeState] = useState(null);
  const [solution, setSolution] = useState(null);
  const [startVideo, setStartVideo] = useState(false);
  const [scanningComplete, setScanningComplete] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    async function fetchCubeState() {
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
    async function fetchSolution() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/solution');
        if (response.data) {
          if (JSON.stringify(cubeState) !== JSON.stringify(solvedState)) {
            setSolution(response.data);
            setErrorMessage(null);  // Clear any previous error messages
          } else {
            setErrorMessage('Cube already solved. Please try again.');
            setScanningComplete(false);
            setStartVideo(false);  // Restart the video feed
          }
        } else {
          throw new Error('No valid solution found');
        }
      } catch (error) {
        console.error('Error fetching solution:', error);
        setErrorMessage('No valid solution found. Please try again.');
        setScanningComplete(false);
        setStartVideo(false);  // Restart the video feed
      }
    }

    if (scanningComplete && cubeState) {
      fetchSolution();
    }
  }, [scanningComplete, cubeState]);

  return (
    <div className="App">
      <Home />
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {solution 
        ?
          <RubiksCube cubeState={cubeState} solution={solution.split(" ")} />
        : <div className="d-flex justify-content-center">
            {!startVideo 
              ? <Button variant="primary" onClick={() => setStartVideo(true)}>Start Video</Button>
              : <VideoFeed setScanningComplete={setScanningComplete} setErrorMessage={setErrorMessage} />
            }
          </div>
      }
    </div>
  );
}

export default App;