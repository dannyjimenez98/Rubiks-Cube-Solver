import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const Cubie = ({ position, colors }) => {
  const edgesGeometry = new THREE.EdgesGeometry(new THREE.BoxGeometry(1, 1, 1));
  const edgesMaterial = new THREE.LineBasicMaterial({ color: "#000000" });
  const cubieRef = useRef();

  return (
    <>
      <mesh position={position} ref={cubieRef} material={colors}>
        <boxGeometry args={[0.97, 0.97, 0.97]} />
      </mesh>
      <lineSegments geometry={edgesGeometry} material={edgesMaterial} />
    </>
  );
};

export default Cubie;