import { SolutionStepCounter } from './SolutionStepCounter';
import React, { useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import Cubie from "./Cubie";
import Matrix2D from "../customClasses/Matrix2D";

const colors = {
    "WHITE": "#ffffff",
    "RED": "#b71234",
    "GREEN": "#009b48",
    "BLUE": "#0046ad",
    "YELLOW": "#ffd500",
    "ORANGE": "#ff5800",
  };
  
const RubiksCube = ({cubeState, solution}) => {
    
    const cubeMapping = [
        // Blue face
        [
        null,
        colors[cubeState["left"][6]],
        null,
        colors[cubeState["down"][6]],
        null,
        colors[cubeState["back"][8]],
        ],
        [null, null, null, colors[cubeState["down"][7]], null, colors[cubeState["back"][7]]],
        [
        colors[cubeState["right"][8]],
        null,
        null,
        colors[cubeState["down"][8]],
        null,
        colors[cubeState["back"][6]],
        ],
        [null, colors[cubeState["left"][3]], null, null, null, colors[cubeState["back"][5]]],
        [null, null, null, null, null, colors[cubeState["back"][4]]],
        [colors[cubeState["right"][5]], null, null, null, null, colors[cubeState["back"][3]]],
        [
        null,
        colors[cubeState["left"][0]],
        colors[cubeState["up"][0]],
        null,
        null,
        colors[cubeState["back"][2]],
        ],
        [null, null, colors[cubeState["up"][1]], null, null, colors[cubeState["back"][1]]],
        [
        colors[cubeState["right"][2]],
        null,
        colors[cubeState["up"][2]],
        null,
        null,
        colors[cubeState["back"][0]],
        ],
        // MIDDLE
        [null, colors[cubeState["left"][7]], null, colors[cubeState["down"][3]], null, null],
        [null, null, null, colors[cubeState["down"][4]], null, null],
        [colors[cubeState["right"][7]], null, null, colors[cubeState["down"][5]], null, null],
        [null, colors[cubeState["left"][4]], null, null, null, null],
        [null, null, null, null, null, null], // CORE
        [colors[cubeState["right"][4]], null, null, null, null, null],
        [null, colors[cubeState["left"][1]], colors[cubeState["up"][3]], null, null, null],
        [null, null, colors[cubeState["up"][4]], null, null, null],
        [colors[cubeState["right"][1]], null, colors[cubeState["up"][5]], null, null, null],
        // Green Face
        [
        null,
        colors[cubeState["left"][8]],
        null,
        colors[cubeState["down"][0]],
        colors[cubeState["front"][6]],
        null,
        ],
        [null, null, null, colors[cubeState["down"][1]], colors[cubeState["front"][7]], null],
        [
        colors[cubeState["right"][6]],
        null,
        null,
        colors[cubeState["down"][2]],
        colors[cubeState["front"][8]],
        null,
        ],
        [null, colors[cubeState["left"][5]], null, null, colors[cubeState["front"][3]], null],
        [null, null, null, null, colors[cubeState["front"][4]], null],
        [colors[cubeState["right"][3]], null, null, null, colors[cubeState["front"][5]], null],
        [
        null,
        colors[cubeState["left"][2]],
        colors[cubeState["up"][6]],
        null,
        colors[cubeState["front"][0]],
        null,
        ],
        [null, null, colors[cubeState["up"][7]], null, colors[cubeState["front"][1]], null],
        [
        colors[cubeState["right"][0]],
        null,
        colors[cubeState["up"][8]],
        null,
        colors[cubeState["front"][2]],
        null,
        ],
    ];

const [cubies, setCubies] = useState(
cubeMapping.map((colors, index) => ({
    position: [
    (index % 3) - 1,
    Math.floor((index % 9) / 3) - 1,
    Math.floor(index / 9) - 1,
    ],
    colors
}))
);
const cubieRefs = useRef([]);

useEffect(() => {
cubieRefs.current = cubieRefs.current
    .slice(0, cubies.length)
    .map((_, i) => cubieRefs.current[i] || React.createRef());
}, [cubies.length]);

const rotateCubie = (cubie, index, dir, axis) => {
let newPosition = [...cubie.position];
let newColors = [...cubie.colors];
const m = new Matrix2D();

const translateIndex =
    axis === "x" ? [1, 2] : axis === "y" ? [0, 2] : [0, 1];
const rotateAngle =
    dir === "double"
    ? Math.PI
    : dir === "clockwise"
    ? index < 0
        ? Math.PI / 2
        : -Math.PI / 2
    : index < 0
    ? -Math.PI / 2
    : Math.PI / 2;

m.rotate(rotateAngle);
m.translate(
    Math.round(cubie.position[translateIndex[0]]),
    Math.round(cubie.position[translateIndex[1]])
);

if (axis === "x") {
    newPosition = [
    cubie.position[0],
    Math.round(m.elements[2]),
    Math.round(m.elements[5]),
    ];
} else if (axis === "y") {
    newPosition = [
    Math.round(m.elements[2]),
    cubie.position[1],
    Math.round(m.elements[5]),
    ];
} else {
    newPosition = [
    Math.round(m.elements[2]),
    Math.round(m.elements[5]),
    cubie.position[2],
    ];
}

if (axis === "x") {
    if (dir === "clockwise") {
    newColors =
        index < 0
        ? [
            cubie.colors[0],
            cubie.colors[1],
            cubie.colors[5],
            cubie.colors[4],
            cubie.colors[2],
            cubie.colors[3],
            ]
        : [
            cubie.colors[0],
            cubie.colors[1],
            cubie.colors[4],
            cubie.colors[5],
            cubie.colors[3],
            cubie.colors[2],
            ];
    } else if (dir === "counterclockwise"){
    newColors =
        index < 0
        ? [
            cubie.colors[0],
            cubie.colors[1],
            cubie.colors[4],
            cubie.colors[5],
            cubie.colors[3],
            cubie.colors[2],
            ]
        : [
            cubie.colors[0],
            cubie.colors[1],
            cubie.colors[5],
            cubie.colors[4],
            cubie.colors[2],
            cubie.colors[3],
            ];
    } else {
        newColors = [
            cubie.colors[0],
            cubie.colors[1],
            cubie.colors[5],
            cubie.colors[4],
            cubie.colors[2],
            cubie.colors[3],
            ];
        newColors = [
            newColors[0],
            newColors[1],
            newColors[5],
            newColors[4],
            newColors[2],
            newColors[3],
        ]
    }
} else if (axis === "y") {
    if (dir === "clockwise") {
    newColors =
        index > 0
        ? [
            cubie.colors[4],
            cubie.colors[5],
            cubie.colors[2],
            cubie.colors[3],
            cubie.colors[1],
            cubie.colors[0],
            ]
        : [
            cubie.colors[5],
            cubie.colors[4],
            cubie.colors[2],
            cubie.colors[3],
            cubie.colors[0],
            cubie.colors[1],
            ];
    } else  if (dir === "counterclockwise"){
    newColors =
        index > 0
        ? [
            cubie.colors[5],
            cubie.colors[4],
            cubie.colors[2],
            cubie.colors[3],
            cubie.colors[0],
            cubie.colors[1],
            ]
        : [
            cubie.colors[4],
            cubie.colors[5],
            cubie.colors[2],
            cubie.colors[3],
            cubie.colors[1],
            cubie.colors[0],
            ];
    } else {
        newColors = [
            cubie.colors[4],
            cubie.colors[5],
            cubie.colors[2],
            cubie.colors[3],
            cubie.colors[1],
            cubie.colors[0],
            ];
        newColors = [
            newColors[4],
            newColors[5],
            newColors[2],
            newColors[3],
            newColors[1],
            newColors[0],
        ]
    }
} else {
    if (dir === "clockwise") {
    newColors =
        index < 0
        ? [
            cubie.colors[3],
            cubie.colors[2],
            cubie.colors[0],
            cubie.colors[1],
            cubie.colors[4],
            cubie.colors[5],
            ]
        : [
            cubie.colors[2],
            cubie.colors[3],
            cubie.colors[1],
            cubie.colors[0],
            cubie.colors[4],
            cubie.colors[5],
            ];
    } else  if (dir === "counterclockwise"){
    newColors =
        index < 0
        ? [
            cubie.colors[2],
            cubie.colors[3],
            cubie.colors[1],
            cubie.colors[0],
            cubie.colors[4],
            cubie.colors[5],
            ]
        : [
            cubie.colors[3],
            cubie.colors[2],
            cubie.colors[0],
            cubie.colors[1],
            cubie.colors[4],
            cubie.colors[5],
            ];
    } else {
        newColors = [
            cubie.colors[3],
            cubie.colors[2],
            cubie.colors[0],
            cubie.colors[1],
            cubie.colors[4],
            cubie.colors[5],
            ]
        newColors = [
            newColors[3],
            newColors[2],
            newColors[0],
            newColors[1],
            newColors[4],
            newColors[5],
        ]
    }
}

return { ...cubie, position: newPosition, colors: newColors };
};

const turn = (index, dir, axis) => {
const newCubies = cubies.map((cubie) => {
    if (
    (axis === "x" && cubie.position[0] === index) ||
    (axis === "y" && cubie.position[1] === index) ||
    (axis === "z" && cubie.position[2] === index)
    ) {
    return rotateCubie(cubie, index, dir, axis);
    }
    return cubie;
});

setCubies(newCubies);

cubieRefs.current.forEach((ref, index) => {
    if (ref.current) {
    ref.current.position.set(...newCubies[index].position);
    }
});
};

const turnX = (index, dir) => turn(index, dir, "x");
const turnY = (index, dir) => turn(index, dir, "y");
const turnZ = (index, dir) => turn(index, dir, "z");

const showCurrentMove = (currentStep) => {
switch(currentStep.toString()) {
    case "R":
        turnX(1, "clockwise")
        break;
    case "R'":
        turnX(1, "counterclockwise")
      break;
    case "R2":
        turnX(1, "double")
        break
    case "L":
        turnX(-1, "clockwise")
        break;
    case "L'":
        turnX(-1, "counterclockwise")
      break;
    case "L2":
        turnX(-1, "double")
        break
    case "U":
        turnY(1, "counterclockwise")
        break;
    case "U'":
        turnY(1, "clockwise")
      break;
    case "U2":
        turnY(1, "double")
        break
    case "D":
        turnY(-1, "counterclockwise")
        break;
    case "D'":
        turnY(-1, "clockwise")
      break;
    case "D2":
        turnY(-1, "double")
        break
    case "F":
        turnZ(1, "clockwise")
        break;
    case "F'":
        turnZ(1, "counterclockwise")
        break;
    case "F2":
        turnZ(1, "double")
        break
    case "B":
        turnZ(-1, "clockwise")
        break;
    case "B'":
        turnZ(-1, "counterclockwise")
        break;
    case "B2":
        turnZ(-1, "double")
        break
    default:
      console.log(`NOT WORKING: ${typeof currentStep.toString()}`)
  }
}

const showPreviousMove = (prevStep) => {
    switch(prevStep.toString()) {
        case "R":
            turnX(1, "counterclockwise")
            break;
            case "R'":
            turnX(1, "clockwise")
            break;
        case "R2":
            turnX(1, "double")
            break
        case "L":
            turnX(-1, "counterclockwise")
            break;
        case "L'":
            turnX(-1, "clockwise")
            break;
        case "L2":
            turnX(-1, "double")
            break
        case "U":
            turnY(1, "clockwise")
            break;
        case "U'":
            turnY(1, "counterclockwise")
            break;
        case "U2":
            turnY(1, "double")
            break
        case "D":
            turnY(-1, "clockwise")
            break;
        case "D'":
            turnY(-1, "counterclockwise")
            break;
        case "D2":
            turnY(-1, "double")
            break
        case "F":
            turnZ(1, "counterclockwise")
            break;
        case "F'":
            turnZ(1, "clockwise")
            break;
        case "F2":
            turnZ(1, "double")
            break
        case "B":
            turnZ(-1, "counterclockwise")
            break;
        case "B'":
            turnZ(-1, "clockwise")
            break;
        case "B2":
            turnZ(-1, "double")
            break
        default:
            console.log(`NOT WORKING: ${typeof prevStep.toString()}`)
        }

}

return (
<>
<SolutionStepCounter showPreviousMove={showPreviousMove} showCurrentMove={showCurrentMove} solution={solution} />
    <Canvas style={{height: '60vh', background: 'black'}}>
    <ambientLight intensity={2.5} />
    <pointLight position={[10, 10, 10]} />
    {cubies.map((cubie, index) => (
        <Cubie
        key={index}
        position={cubie.position}
        colors={cubie.colors.map((color) =>
            color
            ? new THREE.MeshStandardMaterial({ color })
            : new THREE.MeshStandardMaterial({ color: "#000000" })
        )}
        ref={cubieRefs.current[index]}
        />
    ))}
    <OrbitControls />
    </Canvas>
</>
);
};
export default RubiksCube;
