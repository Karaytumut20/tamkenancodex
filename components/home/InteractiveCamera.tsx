"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Cpu, RefreshCw, Shield, Target, Radio, Maximize2, AlertTriangle } from "lucide-react";

export function InteractiveCamera() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [angle, setAngle] = useState(0);
  const [distance, setDistance] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  const [threatLevel, setThreatLevel] = useState("SECURE");
  const [systemStatus, setSystemStatus] = useState("SYSTEM: ACTIVE");

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;

    // --- 1. Three.js Setup ---
    const scene = new THREE.Scene();
    
    // Perspective Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 16);

    // WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // --- 2. Lighting ---
    const ambientLight = new THREE.AmbientLight(0x0e1726, 1.2);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 2.5);
    mainLight.position.set(5, 8, 10);
    scene.add(mainLight);

    const blueFillLight = new THREE.DirectionalLight(0x0ea5e9, 1.8);
    blueFillLight.position.set(-8, -4, 5);
    scene.add(blueFillLight);

    const neonPointLight = new THREE.PointLight(0x06b6d4, 1.5, 10);
    neonPointLight.position.set(0, 0, 2);
    scene.add(neonPointLight);

    // --- 3. Construct 3D Camera Model ---
    const cameraGroup = new THREE.Group();
    scene.add(cameraGroup);

    // Materials
    const metalMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.15,
      metalness: 0.85,
    });

    const darkPlasticMat = new THREE.MeshStandardMaterial({
      color: 0x090d16,
      roughness: 0.4,
      metalness: 0.2,
    });

    const lensGlassMat = new THREE.MeshStandardMaterial({
      color: 0x0b0f19,
      roughness: 0.05,
      metalness: 0.95,
    });

    const neonAccentMat = new THREE.MeshStandardMaterial({
      color: 0x0ea5e9,
      emissive: 0x0ea5e9,
      emissiveIntensity: 1.5,
    });

    const redLedMat = new THREE.MeshBasicMaterial({
      color: 0xef4444,
    });

    // 3a. Static Bracket / Base (Ceiling/Wall Plate)
    const baseGroup = new THREE.Group();
    scene.add(baseGroup);

    // Wall mounting plate
    const plateGeom = new THREE.BoxGeometry(4.5, 4.5, 0.4);
    const plateMesh = new THREE.Mesh(plateGeom, metalMat);
    plateMesh.position.set(0, 3.8, -2.5);
    plateMesh.rotation.x = Math.PI / 2; // Lie flat on top (ceiling style)
    baseGroup.add(plateMesh);

    // Mount arm/bracket stem
    const armGeom = new THREE.CylinderGeometry(0.35, 0.35, 3.5, 16);
    const armMesh = new THREE.Mesh(armGeom, metalMat);
    armMesh.position.set(0, 2.2, -1.8);
    armMesh.rotation.x = -Math.PI / 4; // Angle down towards center
    baseGroup.add(armMesh);

    // 3b. Rotating Camera Assembly (Turret Core)
    const rotatingAnchor = new THREE.Group();
    rotatingAnchor.position.set(0, 0.8, -0.8);
    scene.add(rotatingAnchor);

    // Hinge ball joint
    const jointGeom = new THREE.SphereGeometry(0.7, 32, 32);
    const jointMesh = new THREE.Mesh(jointGeom, darkPlasticMat);
    rotatingAnchor.add(jointMesh);

    // Camera housing main body (cylinder aligned horizontally to point along Z)
    const bodyGeom = new THREE.CylinderGeometry(1.3, 1.3, 4.2, 32);
    bodyGeom.rotateX(Math.PI / 2); // Rotate to align cylinder along Z-axis
    const bodyMesh = new THREE.Mesh(bodyGeom, metalMat);
    bodyMesh.position.set(0, 0, 1.2);
    rotatingAnchor.add(bodyMesh);

    // Sun shield / visor (a curved half-cylinder on top)
    const shieldGeom = new THREE.CylinderGeometry(1.42, 1.42, 4.4, 32, 1, false, 0, Math.PI);
    shieldGeom.rotateX(Math.PI / 2);
    shieldGeom.rotateZ(Math.PI); // Flip to top
    const shieldMesh = new THREE.Mesh(shieldGeom, metalMat);
    shieldMesh.position.set(0, 0.1, 1.3);
    rotatingAnchor.add(shieldMesh);

    // Visor border trim (neon glow stripe)
    const trimGeom = new THREE.CylinderGeometry(1.44, 1.44, 0.1, 32, 1, false, 0, Math.PI);
    trimGeom.rotateX(Math.PI / 2);
    trimGeom.rotateZ(Math.PI);
    const trimMesh = new THREE.Mesh(trimGeom, neonAccentMat);
    trimMesh.position.set(0, 0.1, 3.5);
    rotatingAnchor.add(trimMesh);

    // Front lens casing ring
    const lensRingGeom = new THREE.CylinderGeometry(1.2, 1.2, 0.4, 32);
    lensRingGeom.rotateX(Math.PI / 2);
    const lensRingMesh = new THREE.Mesh(lensRingGeom, darkPlasticMat);
    lensRingMesh.position.set(0, 0, 3.4);
    rotatingAnchor.add(lensRingMesh);

    // Optical Lens glass face
    const lensGeom = new THREE.SphereGeometry(1.0, 32, 16, 0, Math.PI * 2, 0, Math.PI / 3);
    lensGeom.rotateX(Math.PI / 2);
    const lensMesh = new THREE.Mesh(lensGeom, lensGlassMat);
    lensMesh.position.set(0, 0, 3.4);
    rotatingAnchor.add(lensMesh);

    // Emissive red LED (REC indicator)
    const ledGeom = new THREE.SphereGeometry(0.12, 16, 16);
    const ledMesh = new THREE.Mesh(ledGeom, redLedMat);
    ledMesh.position.set(0.6, 0.6, 3.4);
    rotatingAnchor.add(ledMesh);

    // 3c. VOLUMETRIC SCANNERS (Laser Cone projecting outwards from lens)
    const coneGeom = new THREE.ConeGeometry(3.5, 18, 32, 1, true); // Open base
    coneGeom.rotateX(-Math.PI / 2); // Point along positive Z
    coneGeom.translate(0, 0, 9); // Shift base offset so tip starts at lens
    const coneMat = new THREE.MeshBasicMaterial({
      color: 0x0ea5e9,
      transparent: true,
      opacity: 0.1,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const laserCone = new THREE.Mesh(coneGeom, coneMat);
    rotatingAnchor.add(laserCone);

    // Helper targets for tracking
    const mouseTarget = new THREE.Vector3(0, 0, 10);
    const currentTarget = new THREE.Vector3(0, 0, 10);

    // --- 4. Interactive Events ---
    let lastWidth = container.clientWidth;
    let lastHeight = container.clientHeight;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const relX = e.clientX - rect.left;
      const relY = e.clientY - rect.top;

      setCoords({ x: Math.round(relX), y: Math.round(relY) });

      // Convert coordinates to 3D space targets
      const ndcX = (relX / rect.width) * 2 - 1;
      const ndcY = -(relY / rect.height) * 2 + 1;

      // Project target point slightly in front of camera
      mouseTarget.set(ndcX * 8.5, ndcY * 6.0, 10);

      // Distances
      const camCenter = new THREE.Vector3(rect.left + rect.width / 2, rect.top + rect.height / 2, 0);
      const mDist = Math.hypot(e.clientX - camCenter.x, e.clientY - camCenter.y);
      setDistance(Math.round(mDist));
      
      const computedAngle = Math.atan2(e.clientY - camCenter.y, e.clientX - camCenter.x) * (180 / Math.PI);
      setAngle(Math.round(computedAngle));
      setIsTracking(true);
    };

    const handleMouseLeave = () => {
      setIsTracking(false);
      // Return slowly to center looking forward
      mouseTarget.set(0, 0, 10);
    };

    window.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    // Handle Window Resize
    const resizeObserver = new ResizeObserver(() => {
      if (container.clientWidth !== lastWidth || container.clientHeight !== lastHeight) {
        lastWidth = container.clientWidth;
        lastHeight = container.clientHeight;
        camera.aspect = lastWidth / lastHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(lastWidth, lastHeight);
      }
    });
    resizeObserver.observe(container);

    // --- 5. Animation Loop ---
    let animationId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smoothly interpolate look-at target with damping (motor physical lag)
      currentTarget.lerp(mouseTarget, 0.08);
      rotatingAnchor.lookAt(currentTarget);

      // Pulsing status LED
      if (ledMesh.material) {
        const ledMatInst = ledMesh.material as THREE.MeshBasicMaterial;
        ledMatInst.color.setHex(Math.sin(elapsedTime * 8) > 0 ? 0xef4444 : 0x450a0a);
      }

      // Scanner cone glow pulse
      if (laserCone.material) {
        const coneMatInst = laserCone.material as THREE.MeshBasicMaterial;
        coneMatInst.opacity = 0.06 + Math.sin(elapsedTime * 4) * 0.04;
      }

      // Static bracket reacts slightly to movement for mechanical strain effect
      baseGroup.rotation.y = currentTarget.x * 0.02;

      renderer.render(scene, camera);
    };

    animate();

    // --- 6. Cleanup on Unmount ---
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      resizeObserver.disconnect();
      
      // Dispose Geometries
      plateGeom.dispose();
      armGeom.dispose();
      jointGeom.dispose();
      bodyGeom.dispose();
      shieldGeom.dispose();
      trimGeom.dispose();
      lensRingGeom.dispose();
      lensGeom.dispose();
      ledGeom.dispose();
      coneGeom.dispose();

      // Dispose Materials
      metalMat.dispose();
      darkPlasticMat.dispose();
      lensGlassMat.dispose();
      neonAccentMat.dispose();
      redLedMat.dispose();
      coneMat.dispose();

      renderer.dispose();
    };
  }, []);

  // Proximity details
  useEffect(() => {
    const timer = setInterval(() => {
      if (isTracking) {
        if (distance < 180) {
          setThreatLevel("WARNING: PROXIMITY CRITICAL");
          setSystemStatus("TARGET LOCKED");
        } else if (distance < 350) {
          setThreatLevel("ALERT: SENSOR TRIGGERED");
          setSystemStatus("TRACKING VEHICLE/PERSON");
        } else {
          setThreatLevel("MONITORING ZONE");
          setSystemStatus("SYS STATE: ACTIVE");
        }
      } else {
        setThreatLevel("SYSTEM SECURE / SCANNING");
        setSystemStatus("STANDBY FEED ACTIVE");
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isTracking, distance]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[280px] xs:h-[340px] sm:h-[400px] lg:h-[500px] bg-slate-950 border border-slate-800 rounded-2xl sm:rounded-3xl overflow-hidden flex items-center justify-center select-none group"
    >
      {/* Sci-Fi Hologram grid overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-45 mix-blend-screen z-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 50%, transparent 40%, rgba(2, 6, 23, 0.95) 100%),
            linear-gradient(rgba(14, 165, 233, 0.08) 1.5px, transparent 1.5px),
            linear-gradient(90deg, rgba(14, 165, 233, 0.08) 1.5px, transparent 1.5px)
          `,
          backgroundSize: "100% 100%, 30px 30px, 30px 30px",
          backgroundPosition: "center"
        }}
      />

      {/* Futuristic Scanlines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,191,255,0.95)_50%,transparent_50%)] bg-[length:100%_4px] z-0" />

      {/* Cyber Laser Scan Bar */}
      <div 
        className="absolute left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/80 to-transparent pointer-events-none z-10"
        style={{
          animation: "three-scan 8s linear infinite"
        }}
      />

      {/* THREE JS WEBGL CANVAS */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full z-10 cursor-crosshair"
      />

      {/* HUD 1: Telemetry Data (Bottom Left) */}
      <div className="absolute bottom-3 left-3 sm:bottom-6 sm:left-6 z-20 font-mono text-[8px] sm:text-[9px] lg:text-[10px] text-cyan-400 bg-slate-950/80 border border-slate-800 px-2 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl backdrop-blur-md flex flex-col gap-1">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-1 mb-1">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-bold text-cyan-300">REALTIME 3D FEED</span>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
          <span className="text-slate-500">BEARING:</span>
          <span className="text-white font-semibold">{angle}°</span>
          <span className="text-slate-500">VECTOR:</span>
          <span className="text-white font-semibold">{isTracking ? `Z:${(distance/15).toFixed(1)}` : "STANDBY"}</span>
          <span className="text-slate-500">PAN:</span>
          <span className="text-white font-semibold">{(coords.x / 10).toFixed(1)}°</span>
          <span className="text-slate-500">TILT:</span>
          <span className="text-white font-semibold">{(-(coords.y / 10)).toFixed(1)}°</span>
        </div>
      </div>

      {/* HUD 2: System Feeds (Top Left) */}
      <div className="absolute top-3 left-3 sm:top-6 sm:left-6 z-20 font-mono text-[8px] sm:text-[10px] text-cyan-400 bg-slate-950/80 border border-slate-800 px-2 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl backdrop-blur-md flex flex-col gap-1">
        <div className="flex items-center gap-2 font-bold text-red-500">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
          </span>
          <span>PRIMESEC 3D_CAM_01</span>
        </div>
        <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1 flex items-center gap-1.5">
          <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-500" />
          <span>{threatLevel}</span>
        </div>
      </div>

      {/* HUD 3: Proximity and Radar Status (Top Right) */}
      <div className="absolute top-3 right-3 sm:top-6 sm:right-6 z-20 font-mono text-[8px] sm:text-[10px] text-right text-cyan-400 bg-slate-950/80 border border-slate-800 px-2 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl backdrop-blur-md flex flex-col gap-1">
        <div className="flex items-center gap-2 justify-end font-bold">
          <span className="text-cyan-300 uppercase">{systemStatus}</span>
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
        </div>
        <div className="text-[9px] text-slate-400 mt-1">
          RANGE VALUE: <span className="text-white font-bold">{isTracking ? `${distance}px` : "AUTO_SCAN"}</span>
        </div>
        <div className="text-[9px] text-slate-500">
          AUTO-TARGET: LOCK_ON
        </div>
      </div>

      {/* HUD 4: Floating targeting reticle (Tracks cursor in React) */}
      {isTracking && (
        <div
          className="absolute pointer-events-none z-30 hidden md:block"
          style={{
            left: `${coords.x}px`,
            top: `${coords.y}px`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className="relative w-12 h-12 flex items-center justify-center">
            <Target className="w-6 h-6 text-red-500 animate-pulse" />
            <div className="absolute -top-1 -left-1 w-3 h-3 border-t border-l border-cyan-400" />
            <div className="absolute -top-1 -right-1 w-3 h-3 border-t border-r border-cyan-400" />
            <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b border-l border-cyan-400" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b border-r border-cyan-400" />
          </div>
        </div>
      )}

      {/* Proximity Warning (Bottom Center) */}
      {isTracking && distance < 180 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[10px] text-red-400 bg-red-950/90 border border-red-500/30 px-4 py-2 rounded-full backdrop-blur-md flex items-center gap-2 select-none z-20 animate-bounce">
          <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
          <span>PROXIMITY WARNING: SUBJECT TOO CLOSE</span>
        </div>
      )}

      {/* Inline styles for custom animations */}
      <style>{`
        @keyframes three-scan {
          0% {
            top: 0%;
          }
          50% {
            top: 100%;
          }
          100% {
            top: 0%;
          }
        }
      `}</style>
    </div>
  );
}
