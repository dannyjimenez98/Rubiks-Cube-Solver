import React from 'react'

export default function Directions() {
  return (
    <>
        <h3>Directions</h3>
            <div>
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
            </div>
    </>
  )
}
