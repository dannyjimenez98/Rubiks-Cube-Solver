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


  useEffect(() => {
    async function fetchCubeState() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/cube_state');
        setCubeState(response.data);
      } catch (error) {
        console.error('Error fetching cube state:', error);
      }
    }

    fetchCubeState();
  }, []);

  console.log(cubeState)

  useEffect(() => {
    async function fetchSolution() {
      try {
        // if (scanningComplete) {
          const response = await axios.get('http://127.0.0.1:8000/solution');
          setSolution(response.data);
        // }
      } catch (error) {
        console.error('Error fetching solution:', error.response.data);
        // console.error(error.response.data);
      }
    }
    console.log(`solution: ${solution}`)

      fetchSolution();
    
  }, []);
  

  return (
    <div className="App">
      <Home/>
     
      {/* <div className="d-flex justify-content-center">
          {!startVideo 
          ? <Button variant="primary" onClick={() => setStartVideo(true)}>Start Video</Button>
          : 
          <>
          {console.log(solution)}
              <VideoFeed solution={solution} scanningComplete={scanningComplete} setScanningComplete={setScanningComplete}/>
            </>
          }
        </div> */}
      

      {solution 
        ?
        <>
            {(JSON.stringify(cubeState) !== JSON.stringify(solvedState)) ? <RubiksCube cubeState={cubeState} solution={solution.split(" ")} /> 
            : 
            <div className='d-flex justify-content-center'>
            {/* <div class="alert alert-warning alert-dismissible fade show" role="alert">
            <strong>Cube already solved!</strong> Please try again.
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div> */}
            <span>Cube already solved</span>
            <Button variant="primary" onClick={() => setSolution(false)}>Restart</Button>
            </div>}
        </> 
        : 

        <div className="d-flex justify-content-center">
          {!startVideo 
          ? <Button variant="primary" onClick={() => setStartVideo(true)}>Start Video</Button>
          : 
            <>
              <VideoFeed solution={solution}/>
            </>
          }
        </div>
  }
    </div>
  );
}

export default App;
