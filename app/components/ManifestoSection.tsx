"use client";

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as THREE from 'three';
import { builders } from './FlowerBuilders';

const MANIFESTO = [
  {
    id: 0,
    title: '서사가 있는 디자인',
    subtitle: '작업물에 스토리를 담아야 한다.',
    description: '단순하게 보기 좋은 결과물을 만드는 것이 아니라, 그 안에 반드시 나만의 스토리를 담아야 한다. 무의미한 나열보다는 이야기가 있는 작업을 지향하며, 사용자가 디자인을 통해서 하나의 이야기를 읽을 수 있도록 한다.',
    treeType: 0,
    accent: '#587850',
  },
  {
    id: 1,
    title: '부끄럽지 않은 작업물',
    subtitle: '당당하게 설명할 수 있어야 한다.',
    description: '아무리 멋진 작업물이더라도, 설명하기 부끄럽지 않은 작업물을 좋다고 생각하지 않는다. 본인의 작업물을 창작할 때 또한 마찬가지이며, 미적으로 떨어지더라도 의도가 명확하며 남들에게 알리기 부끄럽지 않은 작업물이어야 한다.',
    treeType: 1,
    accent: '#8c7a6b',
  },
  {
    id: 2,
    title: '느림의 미학',
    subtitle: '조급함보다 완성도를.',
    description: '빠르게 변하는 트렌드나 조급함에 쫓겨서 완성도 낮은 결과물을 내놓지 말아야 한다. 작업의 시작부터 결말까지 본인의 주관과 철학을 잃지 않고 밀고 나가는 것이 중요하다.',
    treeType: 2,
    accent: '#628a5c',
  },
  {
    id: 3,
    title: '경계 없는 융합',
    subtitle: '낯선 연결로 새로운 시너지를.',
    description: '서로 다른 색깔이나 얼핏 보기 연결성 없어 보이는 요소들을 융합하는 데서 즐거움을 찾는다. 이러한 이질적인 결합을 통해서 기존에 없던 새로운 시각적 경험과 시너지를 만들어내는 것이 작업의 방향성이다.',
    treeType: 3,
    accent: '#a38f78',
  },
];

function ThreeFlowerViewer({ type, growth }: { type: number, growth: number }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const flowerRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const w = mount.clientWidth;
    const h = mount.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const frustumH = 6;
    const aspect = w / h;
    const camera = new THREE.OrthographicCamera(
      -frustumH * aspect / 2, frustumH * aspect / 2,
      frustumH / 2, -frustumH / 2, 0.1, 200
    );
    camera.position.set(0, 2, 12);
    camera.lookAt(0, 2, 0);

    scene.add(new THREE.AmbientLight(0xfff8f0, 1.2));
    const sun = new THREE.DirectionalLight(0xfff5e8, 1.0);
    sun.position.set(10, 20, 12);
    scene.add(sun);

    // Build flower with base size 1.5
    const flower = builders[type](1.5);
    flower.position.set(0, -1, 0); // Rooted slightly below center
    flower.scale.setScalar(0);
    flower.userData.phase = Math.random() * Math.PI * 2;
    flower.userData.sway = 0.008 + Math.random() * 0.012;
    flower.userData.swaySpeed = 0.3 + Math.random() * 0.3;
    scene.add(flower);
    flowerRef.current = flower;

    let raf: number;
    const t0 = performance.now();
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = (performance.now() - t0) / 1000;
      
      if (flowerRef.current) {
        const { phase, sway, swaySpeed } = flowerRef.current.userData;
        flowerRef.current.rotation.z = Math.sin(t * swaySpeed + phase) * sway;
        // Face forward
        flowerRef.current.rotation.y = 0;
      }

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const nw = mount.clientWidth, nh = mount.clientHeight;
      const a = nw / nh;
      renderer.setSize(nw, nh);
      camera.left = -frustumH * a / 2; camera.right = frustumH * a / 2;
      camera.top = frustumH / 2; camera.bottom = -frustumH / 2;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
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
  }, [type]);

  // Handle growth prop updates continuously
  useEffect(() => {
    if (flowerRef.current) {
      flowerRef.current.scale.setScalar(growth);
    }
  }, [growth]);

  return <div ref={mountRef} className="w-full h-full pointer-events-none" />;
}

export default function ManifestoSection() {
  const [growths, setGrowths] = useState([0, 0, 0, 0]);
  const pressingRef = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startGrowing = useCallback((id: number) => {
    pressingRef.current = id;
    if (intervalRef.current !== null) return;
    intervalRef.current = setInterval(() => {
      const idx = pressingRef.current;
      if (idx === null) {
        clearInterval(intervalRef.current!);
        intervalRef.current = null;
        return;
      }
      setGrowths(prev => {
        if (prev[idx] >= 1) return prev;
        const next = [...prev];
        next[idx] = Math.min(1, next[idx] + 0.009);
        return next;
      });
    }, 16);
  }, []);

  const stopGrowing = useCallback(() => {
    pressingRef.current = null;
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <section id="manifesto" className="h-[100dvh] w-full flex flex-col items-center border-b border-[#1A1A1A]/10 select-none overflow-hidden touch-none relative">
      <div className="pt-20 md:pt-28 pb-6 md:pb-10 text-center w-full z-20 shrink-0">
        <h2 className="text-3xl md:text-5xl font-sans font-medium tracking-widest text-[#587850]">MANIFESTO</h2>
        <p className="mt-4 text-sm text-[#1A1A1A]/60 tracking-wider">가치관이 피어나는 과정</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 w-full flex-1 min-h-0 relative">
        {MANIFESTO.map((item) => {
          const g = growths[item.id];
          const isGrown = g >= 0.88;
          const circumference = 2 * Math.PI * 18;

          return (
            <div
              key={item.id}
              className="relative flex flex-col items-center justify-end border-r border-[#1A1A1A]/10 last:border-r-0 h-full"
              style={{ cursor: 'crosshair' }}
              onPointerDown={() => startGrowing(item.id)}
              onPointerUp={stopGrowing}
              onPointerLeave={stopGrowing}
              onPointerCancel={stopGrowing}
            >
              <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-700"
                style={{
                  background: `radial-gradient(ellipse at bottom, ${item.accent}14 0%, transparent 65%)`,
                  opacity: g,
                }}
              />

              <AnimatePresence>
                {isGrown && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="absolute top-0 left-0 right-0 px-4 pt-5 pb-6 pointer-events-none"
                    style={{
                      background: `linear-gradient(to bottom, ${item.accent}1a 0%, transparent 100%)`,
                    }}
                  >
                    <p
                      className="font-serif italic text-xs md:text-sm mb-2 opacity-80"
                      style={{ color: '#2C3E28' }}
                    >
                      {item.subtitle}
                    </p>
                    <p
                      className="text-[10px] md:text-xs leading-relaxed break-keep"
                      style={{ color: '#1A1A1A', opacity: 0.7 }}
                    >
                      {item.description}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="relative w-full flex justify-center" style={{ height: '45vh' }}>
                <div style={{ width: '100%', maxWidth: '140px', height: '100%' }}>
                  <ThreeFlowerViewer type={item.treeType} growth={g} />
                </div>
              </div>

              <div className="relative z-10 w-full px-3 pb-8 pt-2 flex flex-col items-center gap-2">
                <svg width="40" height="40" viewBox="0 0 40 40">
                  <circle cx="20" cy="20" r="18" fill="none" stroke="rgba(26,26,26,0.1)" strokeWidth="1.5" />
                  <circle
                    cx="20" cy="20" r="18"
                    fill="none"
                    stroke={item.accent}
                    strokeWidth="1.5"
                    strokeDasharray={`${g * circumference} ${circumference}`}
                    strokeLinecap="round"
                    style={{ transform: 'rotate(-90deg)', transformOrigin: '20px 20px', opacity: 0.65 }}
                  />
                </svg>

                <p
                  className="text-center font-serif text-xs md:text-sm leading-snug transition-opacity duration-500"
                  style={{ color: '#1A1A1A', opacity: 0.5 + g * 0.5 }}
                >
                  {item.title}
                </p>

                <AnimatePresence>
                  {g < 0.02 && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-[#1A1A1A]/40 text-[10px] text-center absolute bottom-2 w-full left-0 tracking-widest"
                    >
                      길게 누르세요
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
