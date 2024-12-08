import React, { useEffect, useRef } from "react";
import { useLoader } from "@react-three/fiber";
import { OBJLoader } from "three-stdlib";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { MTLLoader } from "three-stdlib";
import * as THREE from "three";

export function Model({ url, mtlUrl, position = [0, 0, 0], rotation = [0, 0, 0], scale, targetSize = 1 }) {
  const ref = useRef();
  let model;

  // Cargar .obj con .mtl (si es un archivo OBJ)
  if (url.endsWith(".obj")) {
    const materials = mtlUrl ? useLoader(MTLLoader, mtlUrl) : null;
    model = useLoader(OBJLoader, url, (loader) => {
      if (materials) {
        materials.preload();
        loader.setMaterials(materials);
      }
    });
  }

  // Cargar .glb (si es un archivo GLB o GLTF)
  if (url.endsWith(".glb") || url.endsWith(".gltf")) {
    model = useLoader(GLTFLoader, url);
  }

  // Ajustar el tamaño automáticamente si no se proporciona escala personalizada
  useEffect(() => {
    if (ref.current && !scale) {
      const box = new THREE.Box3().setFromObject(ref.current); // Calcular límites
      const size = new THREE.Vector3();
      box.getSize(size); // Obtener dimensiones del modelo

      const maxDim = Math.max(size.x, size.y, size.z); // Dimensión más grande
      const scaleFactor = targetSize / maxDim; // Calcular escala necesaria

      ref.current.scale.set(scaleFactor, scaleFactor, scaleFactor); // Aplicar escala uniforme
    }
  }, [model, targetSize, scale]);

  // Si se proporciona una escala personalizada, usarla
  useEffect(() => {
    if (ref.current && scale) {
      ref.current.scale.set(scale[0], scale[1], scale[2]);
    }
  }, [scale]);

  // Renderizar el modelo en el caso de GLB o OBJ
  if (url.endsWith(".glb") || url.endsWith(".gltf")) {
    return <primitive ref={ref} object={model.scene} position={position} rotation={rotation} />;
  } else if (url.endsWith(".obj")) {
    return <primitive ref={ref} object={model} position={position} rotation={rotation} />;
  }

  return null;
}
