"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Sparkles, RotateCw, ZoomIn, Eye } from "lucide-react";

interface Swatch {
  id: string;
  name: string;
  color: string;
  roughness: number;
  metalness: number;
  specular: string;
}

const FABRIC_SWATCHES: Swatch[] = [
  {
    id: "burgundy-wool",
    name: "Super 160s Burgundy Flannel",
    color: "#4A1216",
    roughness: 0.75,
    metalness: 0.1,
    specular: "#6B1D24",
  },
  {
    id: "midnight-navy",
    name: "Vitale Barberis Midnight Navy",
    color: "#161E2E",
    roughness: 0.7,
    metalness: 0.15,
    specular: "#2D3748",
  },
  {
    id: "camel-cashmere",
    name: "Mongolian Camel Cashmere",
    color: "#C19A6B",
    roughness: 0.85,
    metalness: 0.05,
    specular: "#D4AF37",
  },
  {
    id: "ivory-silk",
    name: "Mulberry Silk Warm Ivory",
    color: "#F9F6F4",
    roughness: 0.35,
    metalness: 0.25,
    specular: "#FFFFFF",
  },
];

export const HeroShowroom3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeSwatch, setActiveSwatch] = useState<Swatch>(FABRIC_SWATCHES[0]);
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isSupported, setIsSupported] = useState<boolean>(true);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Check WebGL availability
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) {
        setIsSupported(false);
        return;
      }
    } catch {
      setIsSupported(false);
      return;
    }

    // 1. Scene setup
    const scene = new THREE.Scene();

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.5, 4.2);

    // 3. Renderer setup with capped pixel ratio (<=2) per /premium-3d-website rules
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // 4. Lighting - Luxury studio 3-point light setup
    const ambientLight = new THREE.AmbientLight(0xfff6ee, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffeedd, 2.5);
    keyLight.position.set(5, 6, 4);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xddeeff, 1.2);
    fillLight.position.set(-5, 2, -2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xc5a880, 2.0); // Gold rim light
    rimLight.position.set(0, 8, -5);
    scene.add(rimLight);

    // 5. 3D Architectural Sartorial Garment & Fabric Silhouette
    const group = new THREE.Group();
    scene.add(group);

    // Torso / Mannequin Body
    const torsoGeometry = new THREE.CylinderGeometry(0.7, 0.5, 2.0, 32, 32);
    const torsoMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(activeSwatch.color),
      roughness: activeSwatch.roughness,
      metalness: activeSwatch.metalness,
    });
    const torsoMesh = new THREE.Mesh(torsoGeometry, torsoMaterial);
    torsoMesh.position.y = 0.2;
    group.add(torsoMesh);

    // Shoulders
    const shoulderGeo = new THREE.CylinderGeometry(0.9, 0.7, 0.4, 32);
    const shoulderMesh = new THREE.Mesh(shoulderGeo, torsoMaterial);
    shoulderMesh.position.y = 1.1;
    group.add(shoulderMesh);

    // Peak Lapels (Architectural Tailoring details)
    const lapelLeftGeo = new THREE.ConeGeometry(0.35, 1.2, 4);
    const lapelLeft = new THREE.Mesh(
      lapelLeftGeo,
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(activeSwatch.specular),
        roughness: 0.5,
        metalness: 0.2,
      })
    );
    lapelLeft.position.set(-0.35, 0.6, 0.55);
    lapelLeft.rotation.set(0.2, -0.3, -0.4);
    group.add(lapelLeft);

    const lapelRight = lapelLeft.clone();
    lapelRight.position.set(0.35, 0.6, 0.55);
    lapelRight.rotation.set(0.2, 0.3, 0.4);
    group.add(lapelRight);

    // Floating Fabric Silk Ribbon Ring / Wave Orbit
    const ringGeo = new THREE.TorusGeometry(1.6, 0.04, 16, 100);
    const goldRingMat = new THREE.MeshStandardMaterial({
      color: 0xc5a880,
      metalness: 0.85,
      roughness: 0.2,
    });
    const ringMesh = new THREE.Mesh(ringGeo, goldRingMat);
    ringMesh.rotation.x = Math.PI / 2.8;
    group.add(ringMesh);

    // Interactive Cloth Swatch Cloth Plane (Waving fabric drape)
    const clothGeo = new THREE.PlaneGeometry(1.8, 1.4, 28, 28);
    const clothMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(activeSwatch.color),
      roughness: activeSwatch.roughness,
      metalness: activeSwatch.metalness,
      side: THREE.DoubleSide,
    });
    const clothMesh = new THREE.Mesh(clothGeo, clothMat);
    clothMesh.position.set(0, -0.8, 0.3);
    clothMesh.rotation.x = -Math.PI / 6;
    group.add(clothMesh);

    // 6. Interactive Drag & Mouse Orbit
    let isDragging = false;
    let previousMouseX = 0;
    let previousMouseY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMouseX = e.clientX;
      previousMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMouseX;
      const deltaY = e.clientY - previousMouseY;

      group.rotation.y += deltaX * 0.008;
      group.rotation.x += deltaY * 0.005;

      previousMouseX = e.clientX;
      previousMouseY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    // Touch Support for mobile devices
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        previousMouseX = e.touches[0].clientX;
        previousMouseY = e.touches[0].clientY;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMouseX;
      const deltaY = e.touches[0].clientY - previousMouseY;

      group.rotation.y += deltaX * 0.01;
      group.rotation.x += deltaY * 0.008;

      previousMouseX = e.touches[0].clientX;
      previousMouseY = e.touches[0].clientY;
    };

    const onTouchEnd = () => {
      isDragging = false;
    };

    container.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    container.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);

    // 7. Animation Loop with Procedural Gentle Fabric Wave
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Slow elegant auto-rotation when user is not manually dragging
      if (isRotating && !isDragging) {
        group.rotation.y += 0.004;
      }

      // Procedural waving fabric vertex displacement (pure mathematical drape)
      const positions = clothGeo.attributes.position;
      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const y = positions.getY(i);
        const z = Math.sin(x * 3 + elapsedTime * 2) * 0.08 + Math.cos(y * 2 + elapsedTime * 1.5) * 0.05;
        positions.setZ(i, z);
      }
      positions.needsUpdate = true;

      // Gentle floating breathing motion
      group.position.y = Math.sin(elapsedTime * 1.2) * 0.06;
      ringMesh.rotation.z += 0.002;

      renderer.render(scene, camera);
    };

    animate();

    // 8. Handle Resize
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener("resize", handleResize);

    // Save references to update material when swatch changes
    (container as unknown as { updateFabric: (swatch: Swatch) => void }).updateFabric = (swatch: Swatch) => {
      const color = new THREE.Color(swatch.color);
      const specular = new THREE.Color(swatch.specular);

      torsoMaterial.color = color;
      torsoMaterial.roughness = swatch.roughness;
      torsoMaterial.metalness = swatch.metalness;

      clothMat.color = color;
      clothMat.roughness = swatch.roughness;
      clothMat.metalness = swatch.metalness;

      (lapelLeft.material as THREE.MeshStandardMaterial).color = specular;
      (lapelRight.material as THREE.MeshStandardMaterial).color = specular;
    };

    return () => {
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);

      container.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);

      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update fabric when activeSwatch changes
  useEffect(() => {
    if (mountRef.current && (mountRef.current as unknown as { updateFabric?: (s: Swatch) => void }).updateFabric) {
      (mountRef.current as unknown as { updateFabric: (s: Swatch) => void }).updateFabric(activeSwatch);
    }
  }, [activeSwatch]);

  return (
    <div className="relative w-full h-[480px] sm:h-[560px] lg:h-[640px] bg-gradient-to-b from-ivory via-ivory-dark to-ivory rounded-2xl overflow-hidden border border-burgundy/15 shadow-2xl flex items-center justify-center">
      {/* 3D Canvas Mount Point */}
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing select-none"
        title="Click & Drag to rotate in 3D"
      />

      {/* Floating 3D Badge */}
      <div className="absolute top-4 left-4 z-20 flex items-center space-x-2 bg-espresso/80 backdrop-blur-md text-ivory px-3.5 py-1.5 rounded-full border border-gold/30 text-xs">
        <span className="w-2 h-2 rounded-full bg-gold animate-ping" />
        <span className="font-semibold tracking-wider text-[11px] uppercase text-gold">
          3D Interactive Atelier Showroom
        </span>
      </div>

      {/* Interactive Controls Overlay */}
      <div className="absolute top-4 right-4 z-20 flex items-center space-x-2">
        <button
          onClick={() => setIsRotating(!isRotating)}
          className={`p-2 rounded-full border backdrop-blur-md transition-colors ${
            isRotating
              ? "bg-burgundy text-gold border-gold/40 shadow-sm"
              : "bg-espresso/70 text-ivory border-ivory/20 hover:text-gold"
          }`}
          title={isRotating ? "Pause Auto-Rotation" : "Enable Auto-Rotation"}
          aria-label="Toggle Auto Rotation"
        >
          <RotateCw className={`w-4 h-4 ${isRotating ? "animate-spin" : ""}`} style={{ animationDuration: "12s" }} />
        </button>
      </div>

      {/* Fabric Swatch Selector Bar */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-[92%] max-w-lg bg-espresso/90 backdrop-blur-md p-3.5 rounded-2xl border border-burgundy/30 shadow-2xl">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-1.5 text-xs text-ivory/90 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span className="text-[11px] uppercase tracking-wider text-gold font-bold">
              Noble Fabric Inspector
            </span>
          </div>
          <span className="text-[10px] text-ivory/60 italic hidden sm:inline">
            Drag to Rotate 360°
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {FABRIC_SWATCHES.map((swatch) => {
            const isActive = activeSwatch.id === swatch.id;
            return (
              <button
                key={swatch.id}
                onClick={() => setActiveSwatch(swatch)}
                className={`flex items-center space-x-2 p-2 rounded-xl border text-left transition-all ${
                  isActive
                    ? "bg-burgundy text-ivory border-gold shadow-md scale-[1.02]"
                    : "bg-espresso/60 text-ivory/80 border-ivory/10 hover:border-gold/40"
                }`}
              >
                <span
                  className="w-4 h-4 rounded-full border border-ivory/30 flex-shrink-0 shadow-inner"
                  style={{ backgroundColor: swatch.color }}
                />
                <span className="text-[10px] font-semibold truncate leading-tight">
                  {swatch.name.split(" ")[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
