import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text, Text3D, Loader } from "@react-three/drei";
import { Model } from "./CustomModels";

const App = () => {
  // Todas las rosas salen del mismo punto (misma base).
  // Para que no se encimen, variamos rotación y deformamos escala (no uniforme).
  const roseBasePosition = [6.5, 9, 9];

  const bouquet = [
    { rotation: [0.12, 0.78, 0.5], scale: [0.2, 0.2, 0.2] },
  ];

  return (
    <>
      <Canvas camera={{ position: [0, 0, 150], fov: 50 }}>
        <Suspense fallback={null}>
          {/* Controles para mover la cámara manualmente */}
          <OrbitControls />
          {/* Iluminación */}
          <ambientLight intensity={1.8} />
          <directionalLight position={[10, 10, 5]} intensity={2.2} />
          <directionalLight position={[-10, 5, 10]} intensity={1.2} />
          <pointLight position={[0, 30, 60]} intensity={1.5} />

          {/* Ramo de rosas (mismo modelo con variaciones) */}
          {bouquet.map((t, idx) => (
            <Model
              key={`rose-${idx}`}
              url={"/ROSE.obj"}
              mtlUrl={"/ROSE.mtl"}
              position={roseBasePosition}
              rotation={t.rotation}
              scale={t.scale}
            />
          ))}

          {/* Modelo de Freddy al lado de la flor */}
          <Model url={"/withered_foxy.glb"} position={[0, -10, 0]} rotation={[0, 0, 0]} targetSize={40} />

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
            Te mando una rosa con
            <meshStandardMaterial color="#fff" /> {/* Material para el texto */}
          </Text3D>
          <Text3D
            font="/helvetiker_regular.typeface.json" // Ruta al archivo JSON de la fuente
            size={5} // Tamaño del texto
            heiight={2} // Grosor del texto
            bevelEnabled // Activa el bisel
            bevelThickness={0.1} // Grosor del bisel
            bevelSize={0.3} // Tamaño del bisel
            bevelSegments={10} // Resolución del bisel
            position={[-10, 30, 0]} // Posición del texto en el espacio 3D
          >
            Foxy
            <meshStandardMaterial color="#ff0000ff" /> {/* Material para el texto */}
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
            (Si no te gusta, te odioare)
            <meshStandardMaterial color="rgba(255, 255, 255, 1)" /> {/* Material para el texto */}
          </Text3D>
        </Suspense>
      </Canvas>

      {/* Fallback/loader mientras cargan los modelos */}
      <Loader dataInterpolation={p => `Espera un momento mi amor... ${p.toFixed(0)}%`} />
    </>
  );
};

export default App;
