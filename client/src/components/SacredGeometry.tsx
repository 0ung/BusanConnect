import React from "react";

interface SacredGeometryProps {
  className?: string;
  opacity?: number;
  size?: number;
}

export function SacredGeometryOverlay({ className = "", opacity = 0.15, size = 600 }: SacredGeometryProps) {
  const r = size / 2;
  const cx = r;
  const cy = r;
  const unitR = r * 0.38;

  // Flower of Life: center + 6 surrounding circles
  const flowerCircles = [
    { x: cx, y: cy },
    { x: cx + unitR, y: cy },
    { x: cx - unitR, y: cy },
    { x: cx + unitR / 2, y: cy - (unitR * Math.sqrt(3)) / 2 },
    { x: cx - unitR / 2, y: cy - (unitR * Math.sqrt(3)) / 2 },
    { x: cx + unitR / 2, y: cy + (unitR * Math.sqrt(3)) / 2 },
    { x: cx - unitR / 2, y: cy + (unitR * Math.sqrt(3)) / 2 },
  ];

  // Spiral approximation points
  const phi = 1.618;
  const spiralPoints = Array.from({ length: 200 }, (_, i) => {
    const angle = (i / 200) * Math.PI * 8;
    const rad = (unitR * 0.15) * Math.pow(phi, angle / (Math.PI * 2));
    return {
      x: cx + rad * Math.cos(angle),
      y: cy + rad * Math.sin(angle),
    };
  });
  const spiralPath = spiralPoints
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
    .join(" ");

  // Metatron's cube lines (connecting 13 points)
  const outerR = unitR * 1.62;
  const metaPoints = [
    { x: cx, y: cy },
    ...Array.from({ length: 6 }, (_, i) => ({
      x: cx + unitR * Math.cos((i * Math.PI) / 3),
      y: cy + unitR * Math.sin((i * Math.PI) / 3),
    })),
    ...Array.from({ length: 6 }, (_, i) => ({
      x: cx + outerR * Math.cos((i * Math.PI) / 3 + Math.PI / 6),
      y: cy + outerR * Math.sin((i * Math.PI) / 3 + Math.PI / 6),
    })),
  ];

  const metaLines: [number, number][] = [];
  for (let i = 0; i < metaPoints.length; i++) {
    for (let j = i + 1; j < metaPoints.length; j++) {
      metaLines.push([i, j]);
    }
  }

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      className={`pointer-events-none select-none ${className}`}
      style={{ opacity }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="sgBlue" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#8ec1ff" />
          <stop offset="60%" stopColor="#4c92ff" />
          <stop offset="100%" stopColor="#0066ff" stopOpacity="0.25" />
        </radialGradient>
      </defs>

      {/* Metatron's cube lines */}
      <g stroke="url(#sgBlue)" strokeWidth="0.4" fill="none" opacity="0.5">
        {metaLines.map(([i, j], idx) => (
          <line
            key={idx}
            x1={metaPoints[i].x}
            y1={metaPoints[i].y}
            x2={metaPoints[j].x}
            y2={metaPoints[j].y}
          />
        ))}
      </g>

      {/* Flower of Life circles */}
      <g stroke="url(#sgBlue)" strokeWidth="0.8" fill="none">
        {flowerCircles.map((c, i) => (
          <circle key={i} cx={c.x} cy={c.y} r={unitR} />
        ))}
        {/* Outer containing circle */}
        <circle cx={cx} cy={cy} r={unitR * 2} strokeWidth="1" opacity="0.6" />
        <circle cx={cx} cy={cy} r={unitR * 2.618} strokeWidth="0.5" opacity="0.4" />
      </g>

      {/* Spiral */}
      <path d={spiralPath} stroke="url(#sgBlue)" strokeWidth="1" fill="none" opacity="0.7" />

      {/* Center dot */}
      <circle cx={cx} cy={cy} r="3" fill="url(#sgBlue)" opacity="0.8" />

      {/* Corner triangles */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const angle = (i * Math.PI) / 3;
        const x1 = cx + outerR * Math.cos(angle);
        const y1 = cy + outerR * Math.sin(angle);
        const x2 = cx + outerR * Math.cos(angle + (Math.PI * 2) / 3);
        const y2 = cy + outerR * Math.sin(angle + (Math.PI * 2) / 3);
        return (
          <line
            key={`tri-${i}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="url(#sgBlue)"
            strokeWidth="0.6"
            opacity="0.5"
          />
        );
      })}
    </svg>
  );
}

export function SacredGeometryBackground({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Large rotating overlay - top right */}
      <div className="absolute -top-32 -right-32 sacred-pulse">
        <SacredGeometryOverlay size={700} opacity={0.12} />
      </div>
      {/* Medium overlay - bottom left */}
      <div className="absolute -bottom-24 -left-24 sacred-rotate" style={{ animationDuration: "180s" }}>
        <SacredGeometryOverlay size={450} opacity={0.08} />
      </div>
      {/* Small accent - center right */}
      <div className="absolute top-1/3 right-1/4 sacred-pulse" style={{ animationDelay: "4s" }}>
        <SacredGeometryOverlay size={200} opacity={0.1} />
      </div>
    </div>
  );
}

export function SacredDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-4 my-8 ${className}`}>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#4c92ff] to-transparent opacity-40" />
      <SacredGeometryOverlay size={40} opacity={0.6} />
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#4c92ff] to-transparent opacity-40" />
    </div>
  );
}
