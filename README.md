# Ylli’s Frutiger Aero portfolio

A six-chapter portfolio on a continuous lake. Scrolling changes the position and orientation of a perspective camera as it passes a glass core, pavilion, orbital lab, exhibition, conservatory and skyline. The portfolio uses React, TypeScript, Vite, Three.js, React Three Fiber, Drei and GSAP ScrollTrigger.

## Run locally

Use Node.js 22.12 or newer and npm. Node 22 was used for development.

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. Native wheel, touch and keyboard scrolling all drive the route. Use the chapter links to jump directly to a landmark. Use Static view to switch off rendering at any point.

```sh
npm run lint
npm run build
npm run preview
```

The build checks TypeScript and then produces `dist/`. The preview server serves that production output for local review.

## Architecture

- `src/config/portfolio.ts` defines the editable personal copy, skills, projects and contacts. `src/config/chapters.ts` defines the chapter IDs and camera stops.
- `src/components/` contains the semantic portfolio, carousel, navigation and fallback error boundary. The interface remains mounted independently of the canvas.
- `src/animations/useJourney.ts` measures the chapter starts and maps native page scroll onto the route. The animation does not pin pages or intercept scrolling.
- `src/experience/camera/` interpolates position and look targets along separate Catmull–Rom splines. The render loop smooths motion and adjusts for narrow screens and mouse parallax.
- `src/experience/objects/` contains the landmarks, instanced bubbles, vertex-colored terrain and the lake’s planar reflection. The sky and thin-film glass use procedural shaders. Drei light shapes provide reflections for opaque metallic objects.
- `src/styles/site.css` contains the typography, palette, responsive composition, static landscape and reduced-motion styles. All artwork is original and local. The PNG project previews are illustrations of placeholder concepts.

The 3D scene loads separately from the interface. DPR is capped at 1.5 on desktop and 1 on handheld devices. Lite mode reduces terrain and sphere detail, bubble count and reflection resolution. Sustained slow hardware can also trigger lite mode. Reduced-motion users receive a still rendering and instant section navigation. Without WebGL 2, after renderer initialization errors or after context loss, the portfolio uses the CSS landscape.

## Edit the portfolio

Edit `src/config/portfolio.ts` for your biography, student details, skills and interests. Update the browser title and metadata in `index.html` if the site identity changes.

Replace the three sample project objects with real entries and remove their `placeholder` flags. Put local previews in `public/images/`, use paths such as `images/my-project.png` and provide descriptive `imageAlt` text. Add a `repository` GitHub URL and optional `demo` URL to show those links. The gallery supports any number of entries.

Fill in the empty `contact` URLs and use a `mailto:` URL for email. To add another platform, append a `{ label, url }` entry. Blank contact URLs are hidden.

## Deploy

Run `npm ci` and `npm run build`, then upload or configure your static host to serve `dist/`. Relative asset URLs support deployment either at the domain root or under a project subpath. The six chapters use hash links, so the host needs no routing rewrites. No backend, API keys or runtime environment variables are required.
