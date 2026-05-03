"use client";

import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { motion, AnimatePresence } from "motion/react";
import { COLORS, builders } from './FlowerBuilders';

export default function ForestIntro({ onComplete }: { onComplete: () => void }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [flowerCount, setFlowerCount] = useState(0);
  const [isReady, setIsReady] = useState(false);

  // Ready state becomes active when the user has planted a few trees
  useEffect(() => {
    if (flowerCount >= 3) {
      setIsReady(true);
    }
  }, [flowerCount]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let w = mount.clientWidth, h = mount.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(COLORS.bg);
    scene.fog = new THREE.FogExp2(COLORS.bg, 0.025);

    const frustumH = 8;
    const aspect = w / h;
    const camera = new THREE.OrthographicCamera(
      -frustumH * aspect / 2, frustumH * aspect / 2,
      frustumH / 2, -frustumH / 2, 0.1, 200
    );
    camera.position.set(0, 2.5, 12);
    camera.lookAt(0, 2.5, 0);

    scene.add(new THREE.AmbientLight(0xfff8f0, 1.2));
    const sun = new THREE.DirectionalLight(0xfff5e8, 1.0);
    sun.position.set(10, 20, 12);
    scene.add(sun);

    // Decorative visible ground
    const decorGround = new THREE.Mesh(
      new THREE.PlaneGeometry(100, 100),
      new THREE.MeshBasicMaterial({ color: 0xeae3d4 })
    );
    decorGround.rotation.x = -Math.PI / 2;
    decorGround.position.y = -0.05;
    scene.add(decorGround);

    const flowers: { mesh: THREE.Group; targetScale: number }[] = [];

    const onClick = (e: MouseEvent | PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      const clientX = (e as any).touches ? (e as any).touches[0].clientX : e.clientX;
      if (clientX === undefined) return;
      
      const mouseX = ((clientX - rect.left) / w) * 2 - 1;
      
      const aspect = w / h;
      const camRight = frustumH * aspect / 2;
      const worldX = mouseX * camRight;
      const worldZ = (Math.random() - 0.5) * 8; // Random depth so they don't look flat
      
      const typeIndex = Math.floor(Math.random() * 4);
      const s = 0.5 + Math.random() * 1.0; // Random scale for diverse heights (0.5 to 1.5)
      const flower = builders[typeIndex](s);
      
      flower.position.set(worldX, -1.5, worldZ);
      flower.scale.setScalar(0);
      
      flower.userData.phase = Math.random() * Math.PI * 2;
      flower.userData.sway = 0.008 + Math.random() * 0.012;
      flower.userData.swaySpeed = 0.3 + Math.random() * 0.3;
      
      scene.add(flower);
      flowers.push({ mesh: flower, targetScale: 1 });
      
      setFlowerCount(prev => prev + 1);
    };

    const canvas = renderer.domElement;
    canvas.addEventListener("pointerdown", onClick);
    canvas.style.cursor = "pointer";

    const onResize = () => {
      w = mount.clientWidth; h = mount.clientHeight;
      const a = w / h;
      renderer.setSize(w, h);
      camera.left = -frustumH * a / 2; camera.right = frustumH * a / 2;
      camera.top = frustumH / 2; camera.bottom = -frustumH / 2;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    const t0 = performance.now();
    let raf: number;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = (performance.now() - t0) / 1000;

      flowers.forEach(f => {
        const mesh = f.mesh;
        // Face camera
        const dx = camera.position.x - mesh.position.x;
        const dz = camera.position.z - mesh.position.z;
        mesh.rotation.y = Math.atan2(dx, dz);
        
        // Sway
        const { phase, sway, swaySpeed } = mesh.userData;
        mesh.rotation.z = Math.sin(t * swaySpeed + phase) * sway;

        // Grow
        mesh.scale.x += (f.targetScale - mesh.scale.x) * 0.08;
        mesh.scale.y += (f.targetScale - mesh.scale.y) * 0.08;
        mesh.scale.z += (f.targetScale - mesh.scale.z) * 0.08;
      });

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("pointerdown", onClick);
      window.removeEventListener("resize", onResize);
      scene.traverse(obj => { 
        if (obj instanceof THREE.Mesh) { 
          obj.geometry.dispose(); 
          (Array.isArray(obj.material) ? obj.material : [obj.material]).forEach(m => { if ('dispose' in m) m.dispose(); }); 
        } 
      });
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center">
      <div ref={mountRef} className="absolute inset-0" />
      
      {/* Title Graphic Overlay */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none mix-blend-multiply opacity-80 z-10 w-full flex justify-center">
        <h1 className="font-sans font-medium text-[#587850] text-7xl tracking-[0.2em] px-4 lowercase filter drop-shadow-sm">
          manifesto
        </h1>
      </div>

      {/* Intro Footer overlay - "Click to plant" indicator */}
      <AnimatePresence>
        {!isReady && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-24 left-1/2 -translate-x-1/2 pointer-events-none z-10"
          >
            <p className="text-[#587850]/70 uppercase tracking-[0.3em] text-[10px] bg-white/40 px-4 py-1.5 rounded-full backdrop-blur-sm shadow-sm border border-[#587850]/10">
              Click anywhere to plant a seed
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isReady && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
            className="absolute bottom-32 left-1/2 -translate-x-1/2 z-20"
          >
            <button
              onClick={onComplete}
              className="px-8 py-3.5 bg-[#587850] text-white/95 text-sm font-medium tracking-widest uppercase rounded-full shadow-[0_8px_20px_rgba(88,120,80,0.25)] hover:shadow-[0_8px_25px_rgba(88,120,80,0.35)] hover:-translate-y-1 transition-all duration-300 border border-[#4a6d4b] backdrop-blur-md"
            >
              ENTER PORTFOLIO
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-10" style={{ background: "linear-gradient(to bottom, transparent, #f5f3ee)" }} />
    </div>
  );
}
