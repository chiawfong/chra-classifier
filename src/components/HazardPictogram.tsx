"use client";

import Image from "next/image";

const PICTOGRAM_FILES: Record<string, string> = {
  "skull-crossbones": "/pictograms/skull-crossbones.jpg",
  "exclamation-mark": "/pictograms/exclamation-mark.jpg",
  "health-hazard": "/pictograms/health-hazard.jpg",
  corrosion: "/pictograms/corrosion.jpg",
  flame: "/pictograms/flame.jpg",
  "flame-over-circle": "/pictograms/flame-over-circle.jpg",
  "exploding-bomb": "/pictograms/exploding-bomb.jpg",
  "gas-cylinder": "/pictograms/gas-cylinder.jpg",
  environment: "/pictograms/environment.jpg",
};

interface HazardPictogramProps {
  type: string;
  size?: number;
  className?: string;
}

export function HazardPictogram({
  type,
  size = 48,
  className = "",
}: HazardPictogramProps) {
  const src = PICTOGRAM_FILES[type];

  if (!src) {
    return (
      <div
        className={`inline-flex items-center justify-center border border-red-500 bg-white ${className}`}
        style={{ width: size, height: size }}
      >
        <span className="text-xs text-red-500">?</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={`GHS pictogram: ${type}`}
      width={size}
      height={size}
      className={className}
      unoptimized
    />
  );
}
