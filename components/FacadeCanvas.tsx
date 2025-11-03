"use client";
import { Suspense, useRef, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { AccumulativeShadows, ContactShadows, Environment, OrbitControls, Sky, StatsGl } from '@react-three/drei';
import { ACESFilmicToneMapping, Color } from 'three';
import FacadeScene from './FacadeScene';

function CaptureUI() {
  const { gl, scene, camera, size } = useThree();
  const [res, setRes] = useState<'2k'|'4k'|'8k'>('4k');
  const [busy, setBusy] = useState(false);

  const download = async () => {
    if (busy) return;
    setBusy(true);
    const map: Record<typeof res, [number, number]> = {
      '2k': [2560, 1440],
      '4k': [3840, 2160],
      '8k': [7680, 4320]
    };
    const [w, h] = map[res];
    const prevPixelRatio = gl.getPixelRatio();
    const prevSize = { w: size.width, h: size.height };
    const prevTone = gl.toneMapping;

    try {
      // Increase resolution and pixel ratio for crisp output
      gl.setPixelRatio(Math.min(2, window.devicePixelRatio));
      gl.setSize(w, h, false);
      gl.toneMapping = ACESFilmicToneMapping;
      gl.render(scene, camera);
      const dataUrl = gl.domElement.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `facade_render_${w}x${h}.png`;
      a.click();
    } finally {
      gl.setPixelRatio(prevPixelRatio);
      gl.setSize(prevSize.w, prevSize.h, false);
      gl.toneMapping = prevTone;
      setBusy(false);
    }
  };

  return (
    <div className="ui">
      <span style={{ alignSelf: 'center', fontSize: 12, opacity: 0.8 }}>Render:</span>
      <select value={res} onChange={(e) => setRes(e.target.value as any)}>
        <option value="2k">2K</option>
        <option value="4k">4K</option>
        <option value="8k">8K</option>
      </select>
      <button onClick={download} disabled={busy}>{busy ? 'Rendering...' : 'Download PNG'}</button>
    </div>
  );
}

export default function FacadeCanvas() {
  return (
    <div className="canvasWrap">
      <div className="badge">Drag to orbit ? Scroll to zoom</div>
      <Canvas
        shadows
        gl={{
          antialias: true,
          alpha: false,
        }}
        camera={{ position: [8, 4, 10], fov: 45, near: 0.1, far: 200 }}
      >
        <color attach="background" args={[new Color('#0b0d0f')]} />
        <Suspense fallback={null}>
          <Environment preset="sunset" background={false} />
          <Sky sunPosition={[30, 25, -15]} mieCoefficient={0.005} mieDirectionalG={0.9} turbidity={6} rayleigh={3} />
          <FacadeScene />
          <AccumulativeShadows temporal frames={60} scale={14} position={[0, 0.001, 0]} color="#191c20" opacity={0.6} />
        </Suspense>
        <ContactShadows opacity={0.35} blur={2.4} scale={20} far={12} resolution={1024} />
        <OrbitControls target={[0, 2.2, 0]} maxPolarAngle={Math.PI/2.1} minDistance={4} maxDistance={22} enableDamping dampingFactor={0.08} />
        <CaptureUI />
        {/* <StatsGl /> */}
      </Canvas>
      <p className="footerNote">Tip: 8K requires a capable GPU and may take time.</p>
    </div>
  );
}
