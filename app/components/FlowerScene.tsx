"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { motion, AnimatePresence } from "motion/react";
import { C, builders, buildSmall, buildGroundLeaf, buildGrass } from './FlowerBuilders';

function MiniFlowerViewer({ type }: { type: number }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const w = mount.clientWidth, h = mount.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    
    const aspect = w / h;
    const frustumH = 3.7;
    const camera = new THREE.OrthographicCamera(
      -frustumH * aspect / 2, frustumH * aspect / 2,
      frustumH / 2, -frustumH / 2, 0.1, 100
    );
    camera.position.set(0, 1.55, 10);
    camera.lookAt(0, 1.55, 0);

    scene.add(new THREE.AmbientLight(0xfff8f0, 1.2));
    const sun = new THREE.DirectionalLight(0xfff5e8, 1.0);
    sun.position.set(5, 10, 8);
    scene.add(sun);

    const flower = builders[type](1.2);
    flower.position.set(0, -0.2, 0);
    scene.add(flower);

    let raf: number;
    let t0 = performance.now();
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = (performance.now() - t0) / 1000;
      flower.rotation.y = Math.sin(t * 1.5) * 0.15; // Gentle 3D sway
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      scene.traverse(obj => { if (obj instanceof THREE.Mesh) { obj.geometry.dispose(); (Array.isArray(obj.material) ? obj.material : [obj.material]).forEach(m => { if ('dispose' in m) m.dispose(); }); } });
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, [type]);

  return <div ref={mountRef} className="w-full h-full" />;
}

const MANIFESTO = [
  { title: '서사가 있는 디자인', sub: '작업물에 스토리를 담아야 한다.', desc: '단순하게 보기 좋은 결과물을 만드는 것이 아니라, 그 안에 반드시 나만의 스토리를 담아야 한다. 무의미한 나열보다는 이야기가 있는 작업을 지향하며, 사용자가 디자인을 통해서 하나의 이야기를 읽을 수 있도록 한다.' },
  { title: '부끄럽지 않은 작업물', sub: '당당하게 설명할 수 있어야 한다.', desc: '아무리 멋진 작업물이더라도, 설명하기 부끄럽지 않은 작업물을 좋다고 생각하지 않는다. 본인의 작업물을 창작할 때 또한 마찬가지이며, 미적으로 떨어지더라도 의도가 명확하며 남들에게 알리기 부끄럽지 않은 작업물이어야 한다.' },
  { title: '느림의 미학', sub: '조급함보다 완성도를.', desc: '빠르게 변하는 트렌드나 조급함에 쫓겨서 완성도 낮은 결과물을 내놓지 말아야 한다. 작업의 시작부터 결말까지 본인의 주관과 철학을 잃지 않고 밀고 나가는 것이 중요하다.' },
  { title: '경계 없는 융합', sub: '낯선 연결로 새로운 시너지를.', desc: '서로 다른 색깔이나 얼핏 보기 연결성 없어 보이는 요소들을 융합하는 데서 즐거움을 찾는다. 이러한 이질적인 결합을 통해서 기존에 없던 새로운 시각적 경험과 시너지를 만들어내는 것이 작업의 방향성이다.' },
];

export default function FlowerScene() {
  const mountRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const [selectedManifesto, setSelectedManifesto] = useState<number | null>(null);

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
    scene.background = new THREE.Color(C.bg);
    scene.fog = new THREE.FogExp2(C.bg, 0.025);

    const frustumH = 8;
    const aspect = w / h;
    const camera = new THREE.OrthographicCamera(
      -frustumH * aspect / 2, frustumH * aspect / 2,
      frustumH / 2, -frustumH / 2, 0.1, 200
    );
    camera.position.set(0, 2.5, 12);
    const lookTarget = new THREE.Vector3(0, 2.5, 0);
    camera.lookAt(lookTarget);

    const ambientLight = new THREE.AmbientLight(0xfff8f0, 1.2);
    scene.add(ambientLight);
    const sun = new THREE.DirectionalLight(0xfff5e8, 1.0);
    sun.position.set(10, 20, 12);
    scene.add(sun);

    // Rain system
    let isRaining = false;
    let rainIntensity = 0;
    const baseBg = new THREE.Color(C.bg);
    const rainBg = new THREE.Color(0xb5c0c7); // Gentle cloudy sky
    const baseAmbient = 1.2;
    const rainAmbient = 0.8; // Slightly dimmer
    const baseSun = 1.0;
    const rainSun = 0.5;

    const RAIN_C = 800;
    const rainGeo = new THREE.BoxGeometry(0.012, 1.2, 0.012); // Shorter, thinner for a gentle shower
    const rainMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.0 });
    const rainMesh = new THREE.InstancedMesh(rainGeo, rainMat, RAIN_C);
    const rDummy = new THREE.Object3D();
    const rPosArr = new Float32Array(RAIN_C * 3);
    const rVel = new Float32Array(RAIN_C);
    for (let i = 0; i < RAIN_C; i++) {
      const x = (Math.random() - 0.5) * 60; // Spread out nicely
      const y = Math.random() * 25;
      const z = (Math.random() - 0.5) * 60; // Keep depth
      rPosArr[i * 3] = x; rPosArr[i * 3 + 1] = y; rPosArr[i * 3 + 2] = z;
      rDummy.position.set(x, y, z);
      rDummy.rotation.z = 0.04; // Gentle wind angle
      rDummy.updateMatrix();
      rainMesh.setMatrixAt(i, rDummy.matrix);
      rVel[i] = 0.3 + Math.random() * 0.3; // Gentle falling speed
    }
    scene.add(rainMesh);

    // Ground
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(200, 200),
      new THREE.MeshBasicMaterial({ color: 0xeae3d4 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.9;
    scene.add(ground);

    // Grass points
    const grassPts = 3000;
    const grassPos = new Float32Array(grassPts * 3);
    for (let i = 0; i < grassPts; i++) {
      grassPos[i * 3] = (Math.random() - 0.5) * 60;
      grassPos[i * 3 + 1] = -0.88;
      grassPos[i * 3 + 2] = (Math.random() - 0.5) * 60;
    }
    const grassGeo = new THREE.BufferGeometry();
    grassGeo.setAttribute("position", new THREE.BufferAttribute(grassPos, 3));
    scene.add(new THREE.Points(grassGeo, new THREE.PointsMaterial({ color: C.stem, size: 0.04, transparent: true, opacity: 0.3, sizeAttenuation: true })));

    // Place flowers
    const allFlowers: THREE.Group[] = [];
    const placed: [number, number][] = [];

    function tryPlace(count: number, minDist: number, fieldSize: number, builder: (s: number) => THREE.Group, scaleRange: [number, number], typeIndex?: number) {
      let remaining = count;
      for (let att = 0; att < count * 10 && remaining > 0; att++) {
        const fx = (Math.random() - 0.5) * fieldSize;
        const fz = (Math.random() - 0.5) * fieldSize;
        if (placed.some(([px, pz]) => Math.sqrt((fx - px) ** 2 + (fz - pz) ** 2) < minDist)) continue;
        placed.push([fx, fz]);
        const s = scaleRange[0] + Math.random() * (scaleRange[1] - scaleRange[0]);
        const flower = builder(s);
        flower.position.set(fx, -0.9, fz);
        flower.userData.phase = Math.random() * Math.PI * 2;
        flower.userData.sway = 0.008 + Math.random() * 0.012;
        flower.userData.swaySpeed = 0.3 + Math.random() * 0.3;
        flower.scale.setScalar(0); // Start with scale 0
        if (typeIndex !== undefined) {
          flower.userData.isMain = true;
          flower.userData.type = typeIndex;
        }
        scene.add(flower);
        allFlowers.push(flower);
        remaining--;
      }
    }

    // 4 main flower types
    for (let t = 0; t < 4; t++) {
      tryPlace(45, 2.8, 70, (s) => builders[t](s), [1.1, 1.5], t);
    }
    // Small fills
    tryPlace(200, 1.0, 80, buildSmall, [1.1, 1.5]);
    // Grass blades
    tryPlace(150, 0.6, 90, buildGrass, [0.9, 1.4]);

    // Floating particles
    const PC = 120;
    const pPos = new Float32Array(PC * 3), pPhase = new Float32Array(PC);
    for (let i = 0; i < PC; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 40;
      pPos[i * 3 + 1] = 0.5 + Math.random() * 6;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 40;
      pPhase[i] = Math.random() * Math.PI * 2;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const particleMat = new THREE.PointsMaterial({ color: 0xe8e0d0, size: 0.04, transparent: true, opacity: 0.3, sizeAttenuation: true });
    scene.add(new THREE.Points(particleGeo, particleMat));

    // Camera controls
    let isDragging = false, prevMouse = { x: 0, y: 0 };
    let camTX = 0, tCX = 0;
    let camTiltX = 0, camTiltY = 0, tTiltX = 0, tTiltY = 0;
    const canvas = renderer.domElement;

    const onMove = (e: PointerEvent) => {
      if (!isDragging) return;
      tCX -= (e.clientX - prevMouse.x) * 0.012;
      tCX = Math.max(-35, Math.min(35, tCX)); // Clamp panning to expanded field edges
      tTiltY = Math.max(-0.15, Math.min(0.15, tTiltY - (e.clientX - prevMouse.x) * 0.0003));
      tTiltX = Math.max(-0.08, Math.min(0.08, tTiltX + (e.clientY - prevMouse.y) * 0.0003));
      prevMouse = { x: e.clientX, y: e.clientY };
    };
    const onUp = () => { isDragging = false; canvas.style.cursor = "grab"; };

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let pointerDownTime = 0;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
      canvas.style.cursor = "grabbing";
      pointerDownTime = performance.now();
    };

    const onClick = (e: MouseEvent) => {
      if (performance.now() - pointerDownTime > 250) return;
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / w) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / h) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      let clickedType = null;
      for (let i = 0; i < intersects.length; i++) {
        let obj: THREE.Object3D | null = intersects[i].object;
        while (obj && obj.parent && !obj.userData.isMain) obj = obj.parent;
        if (obj?.userData?.isMain) { clickedType = obj.userData.type; break; }
      }

      if (clickedType !== null && clickedType < MANIFESTO.length) setSelectedManifesto(clickedType);
      else if (clickedType === null) setSelectedManifesto(null);
    };

    const onDblClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / w) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / h) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      let clickedType = null;
      for (let i = 0; i < intersects.length; i++) {
        let obj: THREE.Object3D | null = intersects[i].object;
        while (obj && obj.parent && !obj.userData.isMain) obj = obj.parent;
        if (obj?.userData?.isMain) { clickedType = obj.userData.type; break; }
      }

      if (clickedType === null) {
        isRaining = !isRaining;
      }
    };

    const onWheel = (e: WheelEvent) => { e.preventDefault(); tCX += e.deltaY * 0.008; };
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointerleave", onUp);
    canvas.addEventListener("click", onClick);
    canvas.addEventListener("dblclick", onDblClick);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    canvas.style.cursor = "grab";

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
      camTX += (tCX - camTX) * 0.04;
      camTiltX += (tTiltX - camTiltX) * 0.03;
      camTiltY += (tTiltY - camTiltY) * 0.03;
      camera.position.set(camTX + camTiltY * 3, 2.5 + camTiltX * 2, 12);
      lookTarget.set(camTX, 2.5, 0);
      camera.lookAt(lookTarget);
      sun.position.set(camTX + 10, 20, 12);

      allFlowers.forEach(f => {
        const dx = camera.position.x - f.position.x;
        const dz = camera.position.z - f.position.z;
        f.rotation.y = Math.atan2(dx, dz);
        const { phase, sway, swaySpeed } = f.userData;
        f.rotation.z = Math.sin(t * swaySpeed + phase) * sway;

        // Dynamic Growth Logic
        const distX = Math.abs(dx);
        // Start growing just outside the screen, finish growing halfway to the center
        const visRadius = camera.right + 1; 
        const fullRadius = camera.right - 5;
        
        let targetScale = 0;
        if (distX <= fullRadius) targetScale = 1;
        else if (distX >= visRadius) targetScale = 0;
        else targetScale = (visRadius - distX) / (visRadius - fullRadius);
        
        // Easing for organic pop-up (ease-out cubic)
        targetScale = 1 - Math.pow(1 - targetScale, 3);
        
        // Slowed down the growing speed as requested (0.1 -> 0.04)
        f.scale.x += (targetScale - f.scale.x) * 0.04;
        f.scale.y += (targetScale - f.scale.y) * 0.04;
        f.scale.z += (targetScale - f.scale.z) * 0.04;
      });

      const pos = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < PC; i++) {
        pos[i * 3 + 1] -= 0.002;
        pos[i * 3] += Math.sin(t * 0.2 + pPhase[i]) * 0.002;
        if (pos[i * 3 + 1] < -0.5) { pos[i * 3 + 1] = 6 + Math.random() * 3; pos[i * 3] = camTX + (Math.random() - 0.5) * 25; pos[i * 3 + 2] = (Math.random() - 0.5) * 25; }
      }
      particleGeo.attributes.position.needsUpdate = true;
      
      // Rain animation and color transition
      rainIntensity += ((isRaining ? 1 : 0) - rainIntensity) * 0.03;
      if (scene.background instanceof THREE.Color) {
        scene.background.copy(baseBg).lerp(rainBg, rainIntensity);
      }
      if (scene.fog && scene.fog instanceof THREE.FogExp2) {
        scene.fog.color.copy(scene.background as THREE.Color);
      }
      ambientLight.intensity = baseAmbient - (baseAmbient - rainAmbient) * rainIntensity;
      sun.intensity = baseSun - (baseSun - rainSun) * rainIntensity;

      const targetRainOpacity = isRaining ? 0.45 : 0.0;
      rainMat.opacity += (targetRainOpacity - rainMat.opacity) * 0.05;

      if (rainMat.opacity > 0.01) {
        for (let i = 0; i < RAIN_C; i++) {
          rPosArr[i * 3 + 1] -= rVel[i];
          rPosArr[i * 3] -= rVel[i] * 0.04; // Horizontal move to match gentle wind
          if (rPosArr[i * 3 + 1] < -2.0) {
            rPosArr[i * 3 + 1] = 10 + Math.random() * 15;
            rPosArr[i * 3] = camTX + (Math.random() - 0.5) * 60; // Spread out
            rPosArr[i * 3 + 2] = (Math.random() - 0.5) * 60;
          }
          rDummy.position.set(rPosArr[i * 3], rPosArr[i * 3 + 1], rPosArr[i * 3 + 2]);
          rDummy.rotation.z = 0.04;
          rDummy.updateMatrix();
          rainMesh.setMatrixAt(i, rDummy.matrix);
        }
        rainMesh.instanceMatrix.needsUpdate = true;
      }
      
      if (indicatorRef.current) {
        let progress = (camTX + 35) / 70; // camTX is now clamped -35 to +35
        progress = Math.max(0, Math.min(1, progress));
        indicatorRef.current.style.transform = `translateX(${progress * 144}px)`;
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointerleave", onUp);
      canvas.removeEventListener("click", onClick);
      canvas.removeEventListener("dblclick", onDblClick);
      canvas.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", onResize);
      scene.traverse(obj => { if (obj instanceof THREE.Mesh) { obj.geometry.dispose(); (Array.isArray(obj.material) ? obj.material : [obj.material]).forEach(m => { if ('dispose' in m) m.dispose(); }); } });
      particleGeo.dispose(); particleMat.dispose(); grassGeo.dispose(); rainGeo.dispose(); rainMat.dispose(); renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <div ref={mountRef} className="absolute inset-0" style={{ background: "#f5f0e6" }} />

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.8, duration: 1.2 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-10">
        <div className="w-48 h-1.5 bg-[#587850]/20 rounded-full overflow-hidden relative">
          <div ref={indicatorRef} className="absolute top-0 left-0 h-full w-12 bg-[#587850] rounded-full shadow-[0_0_8px_rgba(88,120,80,0.4)]" style={{ transform: 'translateX(72px)', transition: 'transform 0.1s ease-out' }} />
        </div>
      </motion.div>
      <div className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none z-10" style={{ background: "linear-gradient(to bottom, transparent, #f5f3ee)" }} />

      <AnimatePresence>
        {selectedManifesto !== null && MANIFESTO[selectedManifesto] && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] max-w-[400px] bg-[#f5f0e6]/95 backdrop-blur-md p-8 rounded-xl shadow-[0_8px_30px_rgba(26,26,26,0.12)] border border-[#587850]/10 z-[100] pointer-events-auto flex flex-col items-center text-center"
          >
            <button
              onClick={() => setSelectedManifesto(null)}
              className="absolute top-4 right-4 text-[#587850]/60 hover:text-[#587850] transition-colors p-1"
              aria-label="Close popup"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {selectedManifesto !== null && builders[selectedManifesto] && (
              <div className="w-40 h-64 flex flex-col items-center justify-center -mt-6 mb-2">
                <MiniFlowerViewer type={selectedManifesto} />
              </div>
            )}

            <div className="flex flex-col gap-1.5 w-full mt-2">
              <h3 className="font-serif text-[#587850] text-xl tracking-wide">{MANIFESTO[selectedManifesto].title}</h3>
              <p className="font-serif italic text-sm text-[#2C3E28] opacity-85 mb-2">{MANIFESTO[selectedManifesto].sub}</p>
              <p className="text-xs text-[#1A1A1A] opacity-75 leading-relaxed break-keep">
                {MANIFESTO[selectedManifesto].desc}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
