import * as THREE from 'three';

// Colors matched precisely to the provided Dandelion and Anemone references
export const COLORS = {
  stem: 0x8db059,       // Light yellow-green (Anemone stems)
  cream: 0xfdfdfd,      // Pure white for petals
  yellow: 0xe8c547,     // Warm yellow for centers
  green: 0x849e5d,      // Olive green (leaves)
  darkLeaf: 0x4d6a35,   // Darker green (leaves)
  tealLeaf: 0x2a4b4c,   // Deep teal (Dandelion leaves)
  paleWhite: 0xeaeaea,  // Slightly shaded white for depth
  bg: 0xf5f3ee
};

const mat = (color: number, opacity: number = 0.98) => new THREE.MeshBasicMaterial({ 
  color, 
  side: THREE.DoubleSide,
  transparent: true,
  opacity
});

const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

function stemCurve(pts: THREE.Vector3[], color: number, tapered: boolean, scale: number) {
  const curve = new THREE.CatmullRomCurve3(pts);
  const geo = new THREE.TubeGeometry(curve, 32, 0.015 * scale, 8, false);
  if (tapered) {
    const pos = geo.attributes.position.array as Float32Array;
    for (let i = 0; i < pos.length; i += 3) {
      const y = pos[i + 1];
      const t = Math.max(0, Math.min(1, y / pts[pts.length - 1].y));
      pos[i] *= (1 - t * 0.6);
      pos[i + 2] *= (1 - t * 0.6);
    }
    geo.computeVertexNormals();
  }
  return new THREE.Mesh(geo, mat(color));
}

// Standard elegant teardrop leaf (Calla style)
export function buildGroundLeaf(s: number, color: number, rotY: number, rotZ: number): THREE.Group {
  const g = new THREE.Group();
  const leaf = new THREE.Shape();
  leaf.moveTo(0, 0);
  leaf.bezierCurveTo(0.1*s, 0.2*s, 0.15*s, 0.6*s, 0, 0.8*s);
  leaf.bezierCurveTo(-0.15*s, 0.6*s, -0.1*s, 0.2*s, 0, 0);
  const m = new THREE.Mesh(new THREE.ShapeGeometry(leaf, 24), mat(color));
  m.rotation.y = rotY;
  m.rotation.z = rotZ;
  g.add(m);
  return g;
}

// Long sweeping blade leaf (Grass style)
export function buildBladeLeaf(s: number, color: number, rotY: number, rotZ: number): THREE.Group {
  const g = new THREE.Group();
  const leaf = new THREE.Shape();
  leaf.moveTo(0, 0);
  leaf.bezierCurveTo(0.08*s, 0.4*s, 0.05*s, 0.8*s, 0, 1.2*s);
  leaf.bezierCurveTo(-0.02*s, 0.8*s, -0.04*s, 0.4*s, 0, 0);
  const m = new THREE.Mesh(new THREE.ShapeGeometry(leaf, 24), mat(color));
  m.rotation.y = rotY;
  m.rotation.z = rotZ;
  g.add(m);
  return g;
}

// Small round heart leaf
export function buildHeartLeaf(s: number, color: number, rotY: number, rotZ: number): THREE.Group {
  const g = new THREE.Group();
  const leaf = new THREE.Shape();
  leaf.moveTo(0, 0);
  leaf.bezierCurveTo(0.15*s, 0.05*s, 0.2*s, 0.3*s, 0, 0.4*s);
  leaf.bezierCurveTo(-0.2*s, 0.3*s, -0.15*s, 0.05*s, 0, 0);
  const m = new THREE.Mesh(new THREE.ShapeGeometry(leaf, 24), mat(color));
  m.rotation.y = rotY;
  m.rotation.z = rotZ;
  g.add(m);
  return g;
}

// Organic 3-lobed leaf (Anemone style)
export function buildOrganicLeaf(s: number, color: number, rotY: number, rotZ: number): THREE.Group {
  const g = new THREE.Group();
  const leaf = new THREE.Shape();
  leaf.moveTo(0, 0);
  // Right lobe
  leaf.bezierCurveTo(0.15*s, 0.05*s, 0.3*s, 0.15*s, 0.2*s, 0.25*s);
  // Top lobe
  leaf.bezierCurveTo(0.15*s, 0.3*s, 0.1*s, 0.45*s, 0, 0.4*s);
  // Left lobe
  leaf.bezierCurveTo(-0.1*s, 0.45*s, -0.15*s, 0.3*s, -0.2*s, 0.25*s);
  leaf.bezierCurveTo(-0.3*s, 0.15*s, -0.15*s, 0.05*s, 0, 0);
  
  const m = new THREE.Mesh(new THREE.ShapeGeometry(leaf, 32), mat(color));
  m.rotation.y = rotY;
  m.rotation.z = rotZ;
  g.add(m);
  return g;
}



// Organic round petal shape
function getOrganicPetal(s: number, hs: number): THREE.Shape {
  const petal = new THREE.Shape();
  petal.moveTo(0, 0);
  petal.bezierCurveTo(0.15*s*hs, 0.05*s*hs, 0.2*s*hs, 0.25*s*hs, 0.1*s*hs, 0.35*s*hs);
  petal.bezierCurveTo(0.05*s*hs, 0.4*s*hs, -0.05*s*hs, 0.4*s*hs, -0.1*s*hs, 0.35*s*hs);
  petal.bezierCurveTo(-0.2*s*hs, 0.25*s*hs, -0.15*s*hs, 0.05*s*hs, 0, 0);
  return petal;
}

// T0: The Anemone (Image 2 style - Organic white flowers, yellow centers)
export function buildT0(s: number): THREE.Group {
  const g = new THREE.Group();
  const h = (2.0 + Math.random() * 0.4) * s;
  g.add(stemCurve([v(0,0,0), v(0.1*s, h*0.4, 0), v(0.05*s, h, 0)], COLORS.stem, false, s));
  
  const hd = new THREE.Group(); hd.position.set(0.05*s, h, 0);
  const hs = 1.0;
  
  const petalGeo = new THREE.ShapeGeometry(getOrganicPetal(s, hs), 32);
  
  // 5 overlapping organic petals
  for(let i=0; i<5; i++){
    const p = new THREE.Mesh(petalGeo, mat(i % 2 === 0 ? COLORS.cream : COLORS.paleWhite));
    p.rotation.z = (i / 5) * Math.PI * 2;
    p.position.z = i * 0.001;
    hd.add(p);
  }

  // Center: Yellow with tiny green dot
  const centerYellow = new THREE.Mesh(new THREE.CircleGeometry(0.06 * s * hs, 32), mat(COLORS.yellow));
  centerYellow.position.z = 0.02;
  hd.add(centerYellow);
  
  const centerGreen = new THREE.Mesh(new THREE.CircleGeometry(0.02 * s * hs, 16), mat(COLORS.green));
  centerGreen.position.z = 0.03;
  hd.add(centerGreen);

  g.add(hd);

  // Add smooth teardrop leaves (T0 style)
  const l1 = buildGroundLeaf(s * 0.8, COLORS.green, 0, -Math.PI / 4);
  l1.position.set(0.05*s, h*0.3, -0.01);
  g.add(l1);

  const l2 = buildGroundLeaf(s * 0.7, COLORS.darkLeaf, 0, Math.PI / 4);
  l2.position.set(0.08*s, h*0.6, -0.01);
  g.add(l2);

  return g;
}

// T1: The Dandelion Sunburst (Image 1 style)
export function buildT1(s: number): THREE.Group {
  const g = new THREE.Group();
  const h = (2.2 + Math.random() * 0.4) * s;
  g.add(stemCurve([v(0,0,0), v(-0.1*s, h*0.5, 0), v(0, h, 0)], COLORS.stem, false, s));
  
  // Long blade leaves (T1 style)
  if (Math.random() > 0.3) {
    const l1 = buildBladeLeaf(s * 0.9, COLORS.tealLeaf, 0, -Math.PI / 4);
    l1.position.set(0, h * 0.2, -0.01);
    g.add(l1);
  }
  if (Math.random() > 0.3) {
    const l2 = buildBladeLeaf(s * 0.7, COLORS.green, 0, Math.PI / 5);
    l2.position.set(-0.05*s, h * 0.4, 0.01);
    g.add(l2);
  }

  const hd = new THREE.Group(); hd.position.set(0, h, 0);
  const hs = 1.0;

  // Faint puff background
  const puff = new THREE.Mesh(new THREE.CircleGeometry(0.3 * s * hs, 32), mat(0xffffff, 0.15));
  puff.position.z = -0.01;
  hd.add(puff);

  // Radiating yellow lines
  const lineGeo = new THREE.PlaneGeometry(0.01 * s * hs, 0.25 * s * hs);
  lineGeo.translate(0, 0.15 * s * hs, 0); // shift pivot
  for(let i=0; i<24; i++){
    const ray = new THREE.Mesh(lineGeo, mat(COLORS.yellow));
    ray.rotation.z = (i / 24) * Math.PI * 2;
    ray.position.z = 0;
    hd.add(ray);
  }

  // Glowing center
  const center1 = new THREE.Mesh(new THREE.CircleGeometry(0.08 * s * hs, 32), mat(COLORS.cream));
  center1.position.z = 0.01;
  hd.add(center1);

  const center2 = new THREE.Mesh(new THREE.CircleGeometry(0.04 * s * hs, 32), mat(COLORS.yellow));
  center2.position.z = 0.02;
  hd.add(center2);

  g.add(hd);
  return g;
}

// T2: Closed / Side Anemone (Image 2 side-view style)
export function buildT2(s: number): THREE.Group {
  const g = new THREE.Group();
  const h = (1.6 + Math.random() * 0.4) * s;
  g.add(stemCurve([v(0,0,0), v(0.05*s, h*0.5, 0), v(0, h, 0)], COLORS.stem, false, s));
  
  const hd = new THREE.Group(); hd.position.set(0, h, 0);
  const hs = 0.9;
  
  const petalGeo = new THREE.ShapeGeometry(getOrganicPetal(s, hs), 32);
  
  // 3 petals folding upwards
  const p1 = new THREE.Mesh(petalGeo, mat(COLORS.paleWhite));
  p1.rotation.z = Math.PI / 4;
  p1.position.set(-0.05*s, 0, -0.01);
  hd.add(p1);

  const p2 = new THREE.Mesh(petalGeo, mat(COLORS.cream));
  p2.rotation.z = -Math.PI / 4;
  p2.position.set(0.05*s, 0, 0);
  hd.add(p2);

  const p3 = new THREE.Mesh(petalGeo, mat(COLORS.cream));
  p3.position.set(0, -0.02*s, 0.01);
  hd.add(p3);

  // Tiny base receptacle
  const rec = new THREE.Mesh(new THREE.CircleGeometry(0.04*s, 16), mat(COLORS.green));
  rec.position.set(0, -0.05*s, 0.02);
  hd.add(rec);

  g.add(hd);

  // Organic leaves
  const l1 = buildOrganicLeaf(s * 0.6, COLORS.green, 0, Math.PI / 3);
  l1.position.set(0.02*s, h*0.5, -0.01);
  g.add(l1);

  return g;
}

// T3: Dandelion Bud / Tiny Sprout (Image 1 bud style)
export function buildT3(s: number): THREE.Group {
  const g = new THREE.Group();
  const h = (1.2 + Math.random() * 0.3) * s;
  
  // Winding elegant stem
  g.add(stemCurve([v(0,0,0), v(-0.1*s, h*0.3, 0), v(0.05*s, h*0.7, 0), v(0, h, 0)], COLORS.stem, false, s));
  
  const hd = new THREE.Group(); 
  hd.position.set(0, h, 0);
  const hs = 0.8;

  // The Bud (Green base, yellow top)
  const baseShape = new THREE.Shape();
  baseShape.moveTo(-0.04*s*hs, 0);
  baseShape.bezierCurveTo(-0.05*s*hs, 0.08*s*hs, -0.03*s*hs, 0.15*s*hs, 0, 0.15*s*hs);
  baseShape.bezierCurveTo(0.03*s*hs, 0.15*s*hs, 0.05*s*hs, 0.08*s*hs, 0.04*s*hs, 0);
  const base = new THREE.Mesh(new THREE.ShapeGeometry(baseShape, 16), mat(COLORS.tealLeaf));
  hd.add(base);

  const topShape = new THREE.Shape();
  topShape.moveTo(-0.03*s*hs, 0.15*s*hs);
  topShape.lineTo(0.03*s*hs, 0.15*s*hs);
  topShape.lineTo(0.02*s*hs, 0.2*s*hs);
  topShape.lineTo(-0.02*s*hs, 0.2*s*hs);
  const top = new THREE.Mesh(new THREE.ShapeGeometry(topShape, 16), mat(COLORS.yellow));
  hd.add(top);

  g.add(hd);

  // One low tiny heart leaf (T3 style)
  const lf = buildHeartLeaf(s * 0.6, COLORS.darkLeaf, 0, -Math.PI / 3);
  lf.position.set(0, h * 0.2, 0);
  g.add(lf);

  return g;
}

export const builders = [buildT0, buildT1, buildT2, buildT3];

export function buildSmall(s: number): THREE.Group {
  const g = new THREE.Group();
  const h = (0.5 + Math.random() * 0.5) * s;
  g.add(stemCurve([v(0,0,0), v(0, h, 0)], COLORS.stem, false, s));
  
  const hd = new THREE.Group();
  hd.position.set(0, h, 0);
  for(let i=0; i<5; i++){
    const p = new THREE.Mesh(new THREE.CircleGeometry(0.06 * s, 16), mat(COLORS.cream));
    const angle = (i / 5) * Math.PI * 2;
    p.position.set(Math.cos(angle)*0.04*s, Math.sin(angle)*0.04*s, 0);
    hd.add(p);
  }
  const c = new THREE.Mesh(new THREE.CircleGeometry(0.03 * s, 8), mat(COLORS.yellow));
  c.position.z = 0.01;
  hd.add(c);
  g.add(hd);
  return g;
}

export function buildGrass(s: number): THREE.Group {
  const g = new THREE.Group();
  const h = (0.2 + Math.random() * 0.3) * s;
  g.add(stemCurve([v(0,0,0), v(0.02*s, h*0.5, 0), v(0, h, 0)], COLORS.stem, true, s * 0.5));
  return g;
}
