// The backdrop art is laid out in the portrait's own units — 1000 wide by 1640
// tall, the aspect ratio of /akash_profile.jpeg — so the arrows can be placed
// against the subject (head ≈ x 490–770, y 130–500; shoulders from y ≈ 500)
// and keep that relationship at every breakpoint.
const ART_W = 1000;
const ART_H = 1640;

// Outline of the subject in portrait units, traced on a brightness-stretched
// copy of the photo (the jacket is nearly as dark as the backdrop). The arrows
// are masked with it so they pass behind the figure instead of showing through
// the faded photo. It runs past the bottom edge of the portrait.
const SILHOUETTE_PATH =
  "M611 140 L677 146 L712 164 L742 207 L753 251 L748 295 L737 328 L751 371 L731 406 " +
  "L715 459 L710 497 L786 513 L862 546 L917 568 L941 611 L952 710 L961 873 L966 1037 " +
  "L959 1146 L939 1201 L922 1288 L906 1419 L901 1800 L257 1800 L224 1528 L205 1408 " +
  "L213 1343 L262 1266 L338 1190 L347 1092 L349 983 L360 873 L380 764 L391 677 L402 611 " +
  "L426 579 L480 557 L568 535 L579 513 L562 459 L540 415 L535 328 L513 284 L503 251 " +
  "L505 218 L520 191 L560 150 Z";

// Everything below the right shoulder line, extended on past the arm. The
// jacket barely shows in the faded photo, so without this the arrow's lower
// arm would reappear beside the right arm as a stray sliver; with it, the arm
// simply disappears behind the shoulder.
const RIGHT_SHOULDER_BLOCK = "M786 513 L917 568 L2600 1914 L2600 3000 L786 3000 Z";

// Region the arrow mask covers: generously past the portrait on every side.
const MASK_AREA = { x: -1500, y: -1500, width: 4000, height: 5000 };

// A double gold "<" chevron in the gap between the head and the right edge,
// level with the neck and pointing in at the subject; the lower arms pass
// behind the right shoulder. Arms run at 45° from each tip; REACH is long
// enough for them to fade out before they end.
const TIP_Y = 440;
const REACH = 900;

const ARROW = {
  /** Nested bands: each tip's x and the band's horizontal thickness. */
  bands: [
    { tipX: 730, depth: 100 },
    { tipX: 930, depth: 100 },
  ],
  /** Peak opacity of the band fill. */
  fill: 0.4,
  /** Center and radius of the falloff that fades the arms toward their ends. */
  fade: { cx: 880, cy: 420, r: 560 },
};

// A lighter tint of the theme's antique gold (--primary, the color of the °
// after the headline), so the bands read as soft gold rather than bronze.
const GOLD = "color-mix(in srgb, hsl(var(--primary)) 80%, white)";

// Closed "<" band: from the tip, 45° arms out to the right, with a parallel
// back edge `depth` behind it.
const chevronBand = (tipX: number, depth: number) => {
  const backX = tipX + depth;
  return (
    `M${tipX + REACH} ${TIP_Y - REACH} L${tipX} ${TIP_Y} L${tipX + REACH} ${TIP_Y + REACH} ` +
    `L${backX + REACH} ${TIP_Y + REACH} L${backX} ${TIP_Y} L${backX + REACH} ${TIP_Y - REACH} Z`
  );
};

// The arrow: soft, borderless gold bands that fade out along the arms. Drawn
// in the portrait's own viewBox and allowed to overflow it, so it stays
// aligned with the photo; the subject's outline is cut out with a hard edge
// so it passes cleanly behind the figure.
const HeroArrow = () => {
  const { bands, fill, fade } = ARROW;

  return (
    <svg
      viewBox={`0 0 ${ART_W} ${ART_H}`}
      className="absolute inset-0 h-full w-full overflow-visible"
    >
      <defs>
        <radialGradient
          id="hero-arrow-fill"
          gradientUnits="userSpaceOnUse"
          cx={fade.cx}
          cy={fade.cy}
          r={fade.r}
        >
          <stop offset="0" style={{ stopColor: GOLD, stopOpacity: fill }} />
          <stop offset="1" style={{ stopColor: GOLD, stopOpacity: 0 }} />
        </radialGradient>
        <mask id="hero-arrow-cutout" maskUnits="userSpaceOnUse" {...MASK_AREA}>
          <rect {...MASK_AREA} fill="white" />
          <path d={SILHOUETTE_PATH} fill="black" />
          <path d={RIGHT_SHOULDER_BLOCK} fill="black" />
        </mask>
      </defs>

      <g mask="url(#hero-arrow-cutout)">
        {bands.map(({ tipX, depth }) => (
          <path key={tipX} d={chevronBand(tipX, depth)} fill="url(#hero-arrow-fill)" />
        ))}
      </g>
    </svg>
  );
};

export default HeroArrow;
