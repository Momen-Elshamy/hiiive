/*
 * Germany for scene 5: outline, cities and a honeycomb dot lattice, all in
 * "map offsets" (world units, x east / z south) measured from Berlin.
 * Outline: Natural Earth (public domain), via johan/world.geo.json.
 */

const GERMANY = [
  [9.92, 54.98], [9.94, 54.6], [10.95, 54.36], [10.94, 54.01], [11.96, 54.2], [12.52, 54.47], [13.65, 54.08],
  [14.12, 53.76], [14.35, 53.25], [14.07, 52.98], [14.44, 52.62], [14.69, 52.09], [14.61, 51.75], [15.02, 51.11],
  [14.57, 51.0], [14.31, 51.12], [14.06, 50.93], [13.34, 50.73], [12.97, 50.48], [12.24, 50.27], [12.42, 49.97],
  [12.52, 49.55], [13.03, 49.31], [13.6, 48.88], [13.24, 48.42], [12.88, 48.29], [13.03, 47.64], [12.93, 47.47],
  [12.62, 47.67], [12.14, 47.7], [11.43, 47.52], [10.54, 47.57], [10.4, 47.3], [9.9, 47.58], [9.59, 47.53],
  [8.52, 47.83], [8.32, 47.61], [7.47, 47.62], [7.59, 48.33], [8.1, 49.02], [6.66, 49.2], [6.19, 49.46],
  [6.24, 49.9], [6.04, 50.13], [6.16, 50.8], [5.99, 51.85], [6.59, 51.85], [6.84, 52.23], [7.09, 53.14],
  [6.91, 53.48], [7.1, 53.69], [7.94, 53.75], [8.12, 53.53], [8.8, 54.02], [8.57, 54.4], [8.53, 54.96],
  [9.28, 54.83], [9.92, 54.98],
];

const BERLIN = [13.4, 52.52];

const CITIES = [
  { name: "Hamburg", lonlat: [9.99, 53.55] },
  { name: "Bremen", lonlat: [8.8, 53.08] },
  { name: "Hannover", lonlat: [9.73, 52.37] },
  { name: "Leipzig", lonlat: [12.37, 51.34] },
  { name: "Dresden", lonlat: [13.74, 51.05] },
  { name: "Cologne", lonlat: [6.96, 50.94] },
  { name: "Frankfurt", lonlat: [8.68, 50.11] },
  { name: "Nuremberg", lonlat: [11.08, 49.45] },
  { name: "Stuttgart", lonlat: [9.18, 48.78] },
  { name: "Munich", lonlat: [11.58, 48.14] },
];

const SCALE = 1.15;
const COS_LAT = Math.cos((51.2 * Math.PI) / 180);

/** lon/lat → [x, z] offset from Berlin, in world units. */
function project([lon, lat]) {
  return [(lon - BERLIN[0]) * COS_LAT * SCALE, (BERLIN[1] - lat) * SCALE];
}

function inside(x, z, poly) {
  let hit = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, zi] = poly[i];
    const [xj, zj] = poly[j];
    if (zi > z !== zj > z && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) hit = !hit;
  }
  return hit;
}

/** Honeycomb lattice of dots covering Germany, as [x, z] offsets from Berlin. */
export function germanyDots(spacing) {
  const poly = GERMANY.map(project);
  const xs = poly.map((p) => p[0]);
  const zs = poly.map((p) => p[1]);
  const [minX, maxX, minZ, maxZ] = [Math.min(...xs), Math.max(...xs), Math.min(...zs), Math.max(...zs)];
  const rowStep = spacing * 0.866;
  const dots = [];
  for (let row = 0, z = minZ; z <= maxZ; row++, z += rowStep) {
    for (let x = minX + (row % 2) * spacing * 0.5; x <= maxX; x += spacing) {
      if (inside(x, z, poly)) dots.push([x, z]);
    }
  }
  return dots;
}

/** Cities (nearest to Berlin first) with their [x, z] offsets. */
export function germanyCities() {
  return CITIES.map((city) => ({ name: city.name, offset: project(city.lonlat) })).sort(
    (a, b) => Math.hypot(...a.offset) - Math.hypot(...b.offset),
  );
}

/** Centre of the map's bounding box, as an [x, z] offset from Berlin. */
export function germanyCentre() {
  const poly = GERMANY.map(project);
  const xs = poly.map((p) => p[0]);
  const zs = poly.map((p) => p[1]);
  return [(Math.min(...xs) + Math.max(...xs)) / 2, (Math.min(...zs) + Math.max(...zs)) / 2];
}
