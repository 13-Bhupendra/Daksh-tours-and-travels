import { useEffect, useRef } from "react";

export function PickupScene() {
  const hostRef = useRef(null);
  const playedRef = useRef(false);
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let disposed = false;
    let frame = 0;
    let renderer;
    let observer;
    let resizeObserver;
    let inView = false;
    let resumeLoop;
    let scene;
    let environmentMap;
    let pmrem;
    let room;
    const disposeTree = (root) => root?.traverse((o) => {
      o.geometry?.dispose();
      if (Array.isArray(o.material)) o.material.forEach((m) => m.dispose());
      else o.material?.dispose();
    });
    const start = async () => {
      if (playedRef.current || disposed) return;
      playedRef.current = true;
      const [THREE, { RoomEnvironment }, { GLTFLoader }] = await Promise.all([
        import("three"),
        import("three/addons/environments/RoomEnvironment.js"),
        import("three/addons/loaders/GLTFLoader.js"),
      ]);
      if (disposed) return;
      scene = new THREE.Scene();
      scene.background = new THREE.Color("#101b2d");
      scene.fog = new THREE.Fog("#101b2d", 24, 54);
      const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
      camera.position.set(0, 6.6, 17.6);
      camera.lookAt(0, 1.05, -0.15);
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "low-power" });
      renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.35));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.12;
      renderer.domElement.setAttribute("aria-hidden", "true");
      host.appendChild(renderer.domElement);
      pmrem = new THREE.PMREMGenerator(renderer);
      room = new RoomEnvironment();
      environmentMap = pmrem.fromScene(room, 0.04).texture;
      scene.environment = environmentMap;
      scene.add(new THREE.HemisphereLight("#e7edf5", "#35445a", 2.15));
      const sun = new THREE.DirectionalLight("#f2dfbb", 3.2);
      sun.position.set(-5, 10, 6);
      sun.castShadow = true;
      sun.shadow.mapSize.set(1024, 1024);
      sun.shadow.camera.left = -12; sun.shadow.camera.right = 12;
      sun.shadow.camera.top = 10; sun.shadow.camera.bottom = -8;
      sun.shadow.bias = -0.0002;
      scene.add(sun);
      const fill = new THREE.DirectionalLight("#9eacc0", 1.4);
      fill.position.set(4, 5, 4); scene.add(fill);
      const rim = new THREE.PointLight("#d6ad67", 16, 25);
      rim.position.set(4, 4.5, -4); scene.add(rim);
      const mat = (color, roughness = 0.8, metalness = 0) => new THREE.MeshStandardMaterial({ color, roughness, metalness });
      const ground = new THREE.Mesh(new THREE.PlaneGeometry(70, 28), mat("#667184", 0.92));
      ground.rotation.x = -Math.PI / 2; ground.position.y = -0.035; ground.receiveShadow = true; scene.add(ground);
      const road = new THREE.Mesh(new THREE.PlaneGeometry(70, 6.6), mat("#283548"));
      road.rotation.x = -Math.PI / 2; road.position.set(0, 0.012, -1.35); road.receiveShadow = true; scene.add(road);
      const curb = new THREE.Mesh(new THREE.BoxGeometry(70, 0.14, 0.34), mat("#98835e", 0.65));
      curb.position.set(0, 0.055, 2.02); curb.castShadow = true; curb.receiveShadow = true; scene.add(curb);
      for (let i = -7; i <= 7; i++) {
        const dash = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.014, 0.075), mat("#f5f7fa"));
        dash.position.set(i * 4.6, 0.022, -1.35); scene.add(dash);
      }
      // Layered foliage, warm roadside lamps and a broad road establish a cinematic pickup setting.
      for (const [x, scale] of [[-13, 1], [-8, 0.82], [8, 0.92], [13, 1.08]]) {
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.2, 2.5, 12), mat("#55483f"));
        trunk.position.set(x, 1.22, -6.2); trunk.castShadow = true; scene.add(trunk);
        for (const [y, r] of [[2.35, 1.25], [3.12, 0.94], [3.7, 0.63]]) {
          const crown = new THREE.Mesh(new THREE.IcosahedronGeometry(r, 3), mat("#4d594c", 0.95));
          crown.position.set(x, y * scale, -6.2); crown.scale.set(1.1 * scale, scale, 0.9 * scale); crown.castShadow = true; scene.add(crown);
        }
      }
      for (const x of [-11, 11]) {
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.055, 4.5, 12), mat("#758298", 0.32, 0.55));
        pole.position.set(x, 2.2, -4.7); pole.castShadow = true; scene.add(pole);
        const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.95, 10), mat("#758298", 0.32, 0.55));
        arm.rotation.z = Math.PI / 2; arm.position.set(x + (x < 0 ? 0.37 : -0.37), 4.35, -4.7); scene.add(arm);
        const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.13, 18, 14), new THREE.MeshStandardMaterial({ color: "#f5e3bd", emissive: "#d6ad67", emissiveIntensity: 0.75 }));
        lamp.position.set(x + (x < 0 ? 0.75 : -0.75), 4.28, -4.7); scene.add(lamp);
        const pool = new THREE.PointLight("#d6ad67", 2.5, 8); pool.position.copy(lamp.position); scene.add(pool);
      }
      const loader = new GLTFLoader();
      const [carAsset, passengerAsset, secondPassengerAsset] = await Promise.all([
        loader.loadAsync("/models/graphite-four-door-sedan.glb"),
        loader.loadAsync("/models/passenger/rp_posed_00178_29.glb"),
        loader.loadAsync("/models/passenger/harper-walk.glb"),
      ]);
      if (disposed) return;
      const car = new THREE.Group();
      const model = carAsset.scene;
      model.traverse((o) => {
        if (!o.isMesh) return;
        o.castShadow = true; o.receiveShadow = true;
        const materials = Array.isArray(o.material) ? o.material : [o.material];
        materials.forEach((m) => { if ("envMapIntensity" in m) m.envMapIntensity = Math.max(m.envMapIntensity || 0, 1.25); });
      });
      const bounds = new THREE.Box3().setFromObject(model);
      const dims = bounds.getSize(new THREE.Vector3());
      const center = bounds.getCenter(new THREE.Vector3());
      const scale = 4.9 / dims.x;
      model.scale.setScalar(scale);
      model.position.set(-center.x * scale, -bounds.min.y * scale, -center.z * scale);
      car.add(model); car.rotation.y = Math.PI; car.position.set(-13, 0, -1.35); scene.add(car);
      // These GLB wheel meshes have baked-in positions and no node transforms. Give each
      // tyre and its matching rim a pivot at the axle center before animating rotation.
      model.updateWorldMatrix(true, true);
      const tyres = [];
      const rims = [];
      model.traverse((o) => {
        if (!o.isMesh) return;
        if (/Sculpted_tyre/i.test(o.name)) tyres.push(o);
        else if (/Alloy_five_spoke_rim/i.test(o.name)) rims.push(o);
      });
      const wheels = tyres.map((tyre) => {
        const center = new THREE.Box3().setFromObject(tyre).getCenter(new THREE.Vector3());
        const localCenter = model.worldToLocal(center.clone());
        const pivot = new THREE.Group();
        pivot.position.copy(localCenter);
        model.add(pivot);
        const parts = [tyre];
        let nearestRim;
        let nearestDistance = Infinity;
        rims.forEach((rim) => {
          if (rim.userData.wheelAssigned) return;
          const rimCenter = new THREE.Box3().setFromObject(rim).getCenter(new THREE.Vector3());
          const distance = rimCenter.distanceTo(center);
          if (distance < nearestDistance) { nearestDistance = distance; nearestRim = rim; }
        });
        if (nearestRim && nearestDistance < 0.12) {
          nearestRim.userData.wheelAssigned = true;
          parts.push(nearestRim);
        }
        parts.forEach((part) => {
          const partCenter = model.worldToLocal(new THREE.Box3().setFromObject(part).getCenter(new THREE.Vector3()));
          part.geometry = part.geometry.clone();
          part.geometry.translate(-partCenter.x, -partCenter.y, -partCenter.z);
          part.position.set(0, 0, 0);
          part.rotation.set(0, 0, 0);
          part.scale.set(1, 1, 1);
          pivot.add(part);
        });
        return pivot;
      });
      const people = [];
      const travelers = [passengerAsset.scene, secondPassengerAsset.scene];
      for (let i = 0; i < travelers.length; i++) {
        const person = travelers[i];
        const humanBounds = new THREE.Box3().setFromObject(person);
        const humanScale = 1.68 / Math.max(humanBounds.getSize(new THREE.Vector3()).y, 0.01);
        person.scale.setScalar(humanScale);
        person.position.y = -humanBounds.min.y * humanScale;
        const personMaterials = [];
        person.traverse((o) => {
          if (!o.isMesh) return;
          o.castShadow = true; o.receiveShadow = true;
          if (o.material) o.material = Array.isArray(o.material) ? o.material.map((m) => m.clone()) : o.material.clone();
          personMaterials.push(...(Array.isArray(o.material) ? o.material : [o.material]));
        });
        person.position.set(-0.5 + i * 1.1, 0, 3.42 + i * 0.22);
        person.rotation.y = Math.PI; scene.add(person);
        let mixer;
        let walkAction;
        if (i === 1 && secondPassengerAsset.animations.length) {
          mixer = new THREE.AnimationMixer(person);
          walkAction = mixer.clipAction(secondPassengerAsset.animations[0]);
          walkAction.play();
          walkAction.paused = true;
        }
        people.push({ root: person, materials: personMaterials, mixer, walkAction });
      }
      const resize = () => {
        if (!renderer || disposed) return;
        const w = Math.max(host.clientWidth, 1), h = Math.max(host.clientHeight, 1);
        renderer.setSize(w, h, false); camera.aspect = w / h; camera.fov = w < 640 ? 42 : 34; camera.updateProjectionMatrix();
      };
      resizeObserver = new ResizeObserver(resize); resizeObserver.observe(host); resize();
      host.classList.add("is-ready");
      const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
      const startAt = performance.now(), duration = 9400;
      const offscreenX = Math.max(13, (host.clientWidth / Math.max(host.clientHeight, 1)) * 5.8 + 3);
      const smooth = (a, b, t) => { const x = Math.min(1, Math.max(0, (t - a) / (b - a))); return x * x * (3 - 2 * x); };
      let previousAt = startAt;
      let previousCarX = car.position.x;
      const draw = (now) => {
        frame = 0;
        if (disposed || !inView) return;
        const delta = Math.min((now - previousAt) / 1000, 0.05);
        previousAt = now;
        const t = reduced ? 0.4 : ((now - startAt) % duration) / duration;
        car.position.x = -offscreenX + smooth(0, 0.35, t) * offscreenX + smooth(0.72, 1, t) * offscreenX;
        const travel = car.position.x - previousCarX;
        previousCarX = car.position.x;
        wheels.forEach((wheel) => { wheel.rotation.z -= travel / 0.34; });
        const boarding = smooth(0.43, 0.65, t), fade = smooth(0.64, 0.73, t);
        const appear = reduced ? 1 : smooth(0.015, 0.11, t);
        people.forEach(({ root: person, materials, mixer, walkAction }, i) => {
          if (walkAction) {
            const walking = t >= 0.43 && t <= 0.68;
            walkAction.paused = !walking;
            if (walking) mixer.setTime((t - 0.43) * duration / 1000);
          }
          const visibility = appear * (1 - fade);
          const walk = boarding * (0.72 + i * 0.13);
          person.position.x = -0.5 + i * 1.1 - walk * 0.9;
          person.position.z = 3.42 + i * 0.22 - walk * 2.75;
          person.position.y = Math.sin(t * 2.4 + i * 0.7) * 0.012;
          person.rotation.y = Math.PI - boarding * 0.12;
          materials.forEach((material) => {
            material.transparent = true;
            material.opacity = visibility;
            material.depthWrite = visibility > 0.98;
          });
        });
        renderer.render(scene, camera);
        if (!reduced && inView) frame = requestAnimationFrame(draw);
      };
      resumeLoop = () => {
        if (inView && !disposed && frame === 0) frame = requestAnimationFrame(draw);
      };
      resumeLoop();
    };
    observer = new IntersectionObserver((entries) => {
      inView = entries.some((e) => e.isIntersecting);
      if (!inView) {
        cancelAnimationFrame(frame);
        frame = 0;
      } else if (!playedRef.current) {
        start().catch(() => { if (!disposed) host.classList.add("pickup-scene-fallback"); });
      } else {
        resumeLoop?.();
      }
    }, { threshold: 0.25 });
    observer.observe(host);
    return () => {
      disposed = true; observer?.disconnect(); resizeObserver?.disconnect(); cancelAnimationFrame(frame);
      disposeTree(scene); disposeTree(room); environmentMap?.dispose(); pmrem?.dispose(); renderer?.dispose(); renderer?.domElement.remove();
    };
  }, []);
  return (
    <section className="pickup-section py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 md:mb-10 md:flex-row md:items-end">
          <div><p className="eyebrow">A smoother arrival</p><h2 className="mt-4 max-w-2xl text-4xl leading-tight text-on-dark md:text-5xl">From the roadside to the open road.</h2></div>
          <p className="max-w-sm text-sm leading-relaxed text-on-dark-muted">A glimpse of the care behind every pickup, from the moment your ride arrives to the moment your journey begins.</p>
        </div>
        <div ref={hostRef} className="pickup-scene relative h-[260px] overflow-hidden rounded-3xl border border-line-dark bg-navy-deep sm:h-[340px] md:h-[440px]" role="img" aria-label="A graphite sedan arrives beside two waiting passengers, who board before it drives away">
          <div className="pickup-loading skeleton absolute inset-0" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-between bg-gradient-to-t from-[#101B2D]/95 via-[#101B2D]/65 to-transparent px-5 pb-4 pt-12 text-[0.68rem] font-extrabold uppercase tracking-[0.2em] text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.8)] sm:px-8 sm:text-xs"><span>Pickup requested</span><span>On the way</span><span>Journey begins</span></div>
        </div>
      </div>
    </section>
  );
}
