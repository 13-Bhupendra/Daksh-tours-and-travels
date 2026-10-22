# Pickup scene 3D assets

The homepage pickup scene lazy-loads these GLB assets only when the section enters the viewport. Textures are embedded in each GLB; no separate texture files are needed.

- `graphite-four-door-sedan.glb` — CC0 graphite four-door sedan model from [Innerscene](https://www.innerscene.com/tools/library/3d-parts/graphite-four-door-sedan-eed96d12). This is a generic detailed sedan, not a Hyundai Aura-specific model.
- `passenger/rp_posed_00178_29.glb` — scanned posed human from [Renderpeople's free 3D people library](https://renderpeople.com/free-3d-people/); Renderpeople lists its free samples for commercial use.
- `passenger/harper-walk.glb` — CC0 rigged person with an embedded relaxed-walk cycle from [Innerscene](https://www.innerscene.com/tools/library/3d-parts/relaxed-walk-harper-3d-person-animated-b504cbac).

The GLBs are served as static optimized runtime assets and are not modified at build time. Blender is not installed in the current development environment, so no `.blend` source project is included.
