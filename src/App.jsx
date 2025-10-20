import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text, Text3D } from "@react-three/drei";
import { Model } from "./CustomModels";

const App = () => {
  return (
    <Canvas camera={{ position: [0, 0, 150], fov: 50 }}>
      {/* Controles para mover la cámara manualmente */}
      <OrbitControls />
      {/* Iluminación */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />

      {/* Modelo de la rosa */}
      <Model
        url={"/ROSE.obj"}
        mtlUrl={"/ROSE.mtl"}
        position={[0, 5, 0]}
        rotation={[0.1,1,0.5]}
        scale={[1, 1, 1]} // Aumenta la escala
      />


        <Text3D
          font="/helvetiker_regular.typeface.json" // Ruta al archivo JSON de la fuente
          size={5} // Tamaño del texto
          heiight={2} // Grosor del texto
          bevelEnabled // Activa el bisel
          bevelThickness={0.1} // Grosor del bisel
          bevelSize={0.3} // Tamaño del bisel
          bevelSegments={10} // Resolución del bisel
          position={[-35, 40, 0]} // Posición del texto en el espacio 3D
        >
          Para ti, mi princesa {"<3"}
          <meshStandardMaterial color="#fff" /> {/* Material para el texto */}
        </Text3D>

      {/* Texto 3D con @react-three/drei */}
      <Text3D
          font="/helvetiker_regular.typeface.json" // Ruta al archivo JSON de la fuente
          size={5} // Tamaño del texto
          height={2} // Grosor del texto

          bevelEnabled // Activa el bisel
          bevelThickness={0.3} // Grosor del bisel
          bevelSize={0.3} // Tamaño del bisel
          bevelSegments={10} // Resolución del bisel
          position={[-43, -20, 0]} // Posición del texto en el espacio 3D
        >
          (Si no te gustan, te odioare)
          <meshStandardMaterial color="#fff" /> {/* Material para el texto */}
        </Text3D>
    </Canvas>
  );
};

export default App;
