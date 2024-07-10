import React from 'react'
import cube_pic from "../Rubik's_cube.png";

export default function Header() {

  return (
    <>
    <div className="container-fluid">
        <div className="col-sm-12 col-lg-12 d-flex p-2 justify-content-center my-3">
            <div className="px-2 mr-2">
            <img src={cube_pic} alt="" height={40}/>
            </div>
            <div className="d-flex align-items-center">
            <h2>Rubik's Cube Solver</h2>
            </div>
            <div className="px-2 mr-2">
            <img src={cube_pic} alt="" height={40}/>
            </div>
        </div>
    </div>
    </>
)
}
