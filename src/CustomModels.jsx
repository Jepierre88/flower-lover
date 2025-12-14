import React, { useEffect, useMemo, useRef } from "react";
import { useLoader } from "@react-three/fiber";
import { OBJLoader } from "three-stdlib";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { MTLLoader } from "three-stdlib";
import * as THREE from "three";

function createLinearGradientTexture({
  width = 256,
  height = 256,
  stops = [
    { offset: 0, color: "#8A4CAE" },
    { offset: 1, color: "#FF6FB5" },
  ],
  direction = "y", // 'x' | 'y'
} = {}) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  const gradient =
    direction === "x"
      ? ctx.createLinearGradient(0, 0, width, 0)
      : ctx.createLinearGradient(0, 0, 0, height);

  for (const { offset, color } of stops) {
    gradient.addColorStop(offset, color);
  }

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
  return texture;
}

export function Model({ url, mtlUrl, position = [0, 0, 0], rotation = [0, 0, 0], scale, targetSize = 1 }) {
  const ref = useRef();
  let model;

  const isObj = url.endsWith(".obj");
  const isGltf = url.endsWith(".glb") || url.endsWith(".gltf");

  // Cargar .obj con .mtl (si es un archivo OBJ)
  if (isObj) {
    const materials = mtlUrl ? useLoader(MTLLoader, mtlUrl) : null;
    model = useLoader(OBJLoader, url, loader => {
      if (materials) {
        materials.preload();
        loader.setMaterials(materials);
      }
    });
  }

  // Cargar .glb (si es un archivo GLB o GLTF)
  if (isGltf) {
    model = useLoader(GLTFLoader, url);
  }

  // IMPORTANTE: useLoader cachea y devuelve el mismo Object3D.
  // Para renderizar varias instancias (ramo), debemos clonar por componente.
  const object = useMemo(() => {
    if (!model) return null;

    const cloned = isGltf ? model.scene.clone(true) : model.clone(true);

    cloned.traverse(child => {
      if (!child.isMesh) return;
      if (Array.isArray(child.material)) {
        child.material = child.material.map(m => (m?.clone ? m.clone() : m));
      } else if (child.material?.clone) {
        child.material = child.material.clone();
      }
    });

    return cloned;
  }, [model, isGltf]);

  // Ajustar el tamaño automáticamente si no se proporciona escala personalizada
  useEffect(() => {
    if (ref.current && object && !scale) {
      // Medimos el tamaño con escala neutra para que cambiar targetSize
      // funcione correctamente (si no, se mide ya escalado).
      const prevScale = ref.current.scale.clone();
      ref.current.scale.set(1, 1, 1);
      ref.current.updateWorldMatrix(true, true);

      const box = new THREE.Box3().setFromObject(ref.current); // Calcular límites
      const size = new THREE.Vector3();
      box.getSize(size); // Obtener dimensiones del modelo

      const maxDim = Math.max(size.x, size.y, size.z); // Dimensión más grande
      const scaleFactor = maxDim > 0 ? targetSize / maxDim : 1; // Calcular escala necesaria

      ref.current.scale.set(scaleFactor, scaleFactor, scaleFactor); // Aplicar escala uniforme

      // Si algo falla en el cálculo, al menos restauramos.
      if (!Number.isFinite(scaleFactor) || scaleFactor <= 0) {
        ref.current.scale.copy(prevScale);
      }
    }
  }, [object, targetSize, scale]);

  // Si se proporciona una escala personalizada, usarla
  useEffect(() => {
    if (ref.current && scale) {
      ref.current.scale.set(scale[0], scale[1], scale[2]);
    }
  }, [scale]);

  // Cambiar materiales a azul para OBJ
  useEffect(() => {
    if (object && isObj) {
      const layerGradient = createLinearGradientTexture({
        direction: "y",
        stops: [
          { offset: 0, color: "#7b00ffff" },
          { offset: 0.5, color: "#4900ffff" },
          { offset: 1, color: "#e91717ff" },
        ],
      });

      const circleGradient = createLinearGradientTexture({
        direction: "y",
        stops: [
          { offset: 0, color: "#6bae4cff" },
          { offset: 0.55, color: "#496400ff" },
          { offset: 1, color: "#2bff00ff" },
        ],
      });

      object.traverse(child => {
        console.log(child.name);
        if (child.isMesh) {
          if (child.name === "Simple_GP_Layer_Mesh") {
            // Rojo con gradientes morados
            child.material.color = new THREE.Color("#ffffff");
            child.material.map = layerGradient;
            child.material.needsUpdate = true;
          }
          if (child.name === "Circle") {
            // THREE.Color no soporta gradientes; para eso usamos un texture map.
            // Dejamos el color en blanco para no teñir el mapa.
            child.material.color = new THREE.Color("#ffffff");
            child.material.map = circleGradient;
            child.material.needsUpdate = true;
          }
        }
      });
    }
  }, [object, isObj]);

  // Renderizar el modelo en el caso de GLB o OBJ
  if (isGltf) {
    return object ? <primitive ref={ref} object={object} position={position} rotation={rotation} /> : null;
  } else if (isObj) {
    return object ? <primitive ref={ref} object={object} position={position} rotation={rotation} /> : null;
  }

  return null;
}
