import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import './VideoFeed.css';


// TODO: 
// [] add bootstrap alert if solution is non valid
const VideoFeed = ({solution}) => {
    const videoRef = useRef(null);
    const [scanningComplete, setScanningComplete] = useState(false);

    useEffect(() => {
        if (!scanningComplete) {
            videoRef.current.src = "http://localhost:8000/video_feed";
        }
        else {
            window.location.reload()
        }
    }, [scanningComplete]);

    const handleKeyPress = async (e) => {
        if (e.key === 'Enter') {
            try {
                await axios.post("http://localhost:8000/key_press", {
                    key: "enter"
                }, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
            } catch (error) {
                console.error("Error on key press:", error);
            }
        }
    }

    const handleButtonPress = async () => {
            try {
                await axios.post("http://localhost:8000/key_press", {
                    key: "enter"
                }, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
            } catch (error) {
                console.error("Error on button press:", error);
            }
        
    }

    const checkScanningComplete = async () => {
        if (!scanningComplete) {
            try {
                const response = await axios.post("http://localhost:8000/stop_video", {}, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                if (response.data === true) {
                    setScanningComplete(true);
                }
            } catch (error) {
                console.error("Error stopping video:", error);
            }
        }
    };

    useEffect(() => {
        window.addEventListener('keypress', handleKeyPress);
        return () => {
            window.removeEventListener('keypress', handleKeyPress);
        };
    }, []);


    useEffect(() => {
        const interval = setInterval(checkScanningComplete, 1000);
        return () => clearInterval(interval);
    }, [scanningComplete]);


    // useEffect(() => {
    //     async function fetchSolution() {
    //       try {
    //         if (startVideo) {
    //           const response = await axios.get('http://127.0.0.1:8000/solution');
    //           setSolution(response.data);
    //         }
    //       } catch (error) {
    //         console.error('Error fetching solution:', error.response.data);
    //         // console.error(error.response.data);
    //       }
    //     }
    //     console.log(`solution: ${solution}`)
    
    //       fetchSolution();
        
    //   }, [startVideo]);

    return (
        <div className='col-sm-12 col-md-6'>
            <div className="video-capture-container border border-white">

            
            {scanningComplete ? (
                solution ? <p>Scanning complete.</p> : 
                <>
                    <img ref={videoRef} width="100%" height="100%" alt="Video"/>
                </>
            ) : (
                <>
                <img ref={videoRef} width="100%" height="100%" alt="Video" className="rounded-top"/>
                <div className="scan-btn-container d-flex justify-content-center">
                    <Button variant="danger" onClick={() => handleButtonPress()} className="scanButton"></Button>
                </div>
                </>
            )}
            </div>
            <h3>Directions</h3>
            <p>
            <ol>
               <li>Position the cube face in the outlined grid on the screen.
                    <ul>
                        <li>The color listed in the bottom text in all caps above the grid is the face to scan (look at the center square)</li>
                        <li>Orientate it so that the center square on the top face matches the color listed in the top text above the grid in parentheses</li>
                        <li>TIP: make sure you are in a well-lit area or else the colors may be detected incorrectly</li>
                    </ul>
                </li>
                <li>Lock in the face's colors by pressing the enter/return key or pressing the red button below the video feed.</li>
                <li>Repeat for all six faces, orientating it correctly with respect to the text above the grid.</li>
            </ol>
            </p>
        </div>
    );
};

export default VideoFeed;
