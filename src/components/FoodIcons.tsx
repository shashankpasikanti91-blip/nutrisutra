/**
 * Clean SVG food category icons — replacing emojis throughout the app.
 * Each icon is a simple, consistent line-art style at 24x24 viewBox.
 */
import React from "react";

interface IconProps {
  className?: string;
  size?: number;
}

const svgBase = (size: number, className: string) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className,
});

/** Biryani / rice pot icon */
export const BiryaniIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg {...svgBase(size, className)}>
    <ellipse cx="12" cy="8" rx="9" ry="4" />
    <path d="M3 8v5c0 2.2 4 4 9 4s9-1.8 9-4V8" />
    <path d="M3 13v4c0 2.2 4 4 9 4s9-1.8 9-4v-4" />
    <path d="M12 4V2" />
    <path d="M9 3.5c1-1.5 2-1 3-1.5" />
  </svg>
);

/** Dosa / crepe icon */
export const DosaIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg {...svgBase(size, className)}>
    <path d="M3 16c0-2 3-8 9-8s9 6 9 8" />
    <ellipse cx="12" cy="16" rx="9" ry="3" />
    <circle cx="8" cy="14" r="1" fill="currentColor" opacity="0.3" />
    <circle cx="14" cy="13" r="0.8" fill="currentColor" opacity="0.3" />
  </svg>
);

/** Curry bowl icon */
export const CurryIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg {...svgBase(size, className)}>
    <path d="M3 12h18" />
    <path d="M5 12c0 4.4 3.1 8 7 8s7-3.6 7-8" />
    <path d="M8 8c.5-1 1.5-2 4-2s3.5 1 4 2" />
    <path d="M10 8c0-1.5.5-3 2-4" />
  </svg>
);

/** Roti / bread icon */
export const RotiIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg {...svgBase(size, className)}>
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="12" r="5" strokeDasharray="2 2" opacity="0.5" />
    <circle cx="10" cy="10" r="0.8" fill="currentColor" opacity="0.3" />
    <circle cx="14" cy="13" r="0.6" fill="currentColor" opacity="0.3" />
  </svg>
);

/** Samosa / snack triangle icon */
export const SamosaIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg {...svgBase(size, className)}>
    <path d="M12 4L3 19h18L12 4z" />
    <path d="M8 14h8" opacity="0.5" />
    <path d="M9 16h6" opacity="0.3" />
  </svg>
);

/** Sweet / dessert icon */
export const SweetIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg {...svgBase(size, className)}>
    <circle cx="12" cy="14" r="6" />
    <path d="M9 14c0-1.7 1.3-3 3-3s3 1.3 3 3" fill="currentColor" opacity="0.15" />
    <path d="M12 8V6" />
    <path d="M10 7l2-2 2 2" />
  </svg>
);

/** Thali / plate icon */
export const ThaliIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg {...svgBase(size, className)}>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="7" opacity="0.4" />
    <circle cx="8" cy="10" r="2" />
    <circle cx="16" cy="10" r="2" />
    <circle cx="12" cy="15" r="2.5" />
  </svg>
);

/** Street food / cart icon */
export const StreetFoodIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg {...svgBase(size, className)}>
    <rect x="3" y="8" width="18" height="8" rx="2" />
    <path d="M6 16v3" />
    <path d="M18 16v3" />
    <circle cx="7" cy="19" r="1.5" />
    <circle cx="17" cy="19" r="1.5" />
    <path d="M7 8V5c0-1 1-2 2-2h6c1 0 2 1 2 2v3" />
    <path d="M8 11h8" opacity="0.5" />
  </svg>
);

/** Breakfast / morning icon */
export const BreakfastIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg {...svgBase(size, className)}>
    <path d="M3 14h18" />
    <path d="M5 14c0 3 3 6 7 6s7-3 7-6" />
    <path d="M17 10c2 0 3 1 3 3" />
    <path d="M8 10c-1-3 0-5 2-6" />
    <path d="M12 10c0-3 1-5 2-6" />
  </svg>
);

/** Healthy / diet icon */
export const HealthyIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg {...svgBase(size, className)}>
    <path d="M12 22c-4-2-8-6-8-11 0-3 2-6 5-7 2-.7 3.5 0 3 2-1 0-3 1-3 3 0 3 3 4 3 4s3-1 3-4c0-2-2-3-3-3-.5-2 1-2.7 3-2 3 1 5 4 5 7 0 5-4 9-8 11z" />
  </svg>
);

/** Fish / seafood icon */
export const FishIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg {...svgBase(size, className)}>
    <path d="M2 12c3-4 7-6 12-6 2 3 4 4 6 6-2 2-4 3-6 6-5 0-9-2-12-6z" />
    <circle cx="16" cy="12" r="1" fill="currentColor" />
    <path d="M22 12l-2-3v6l2-3" />
  </svg>
);

/** Idli / steamed icon */
export const IdliIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg {...svgBase(size, className)}>
    <ellipse cx="8" cy="14" rx="5" ry="3" />
    <ellipse cx="16" cy="14" rx="5" ry="3" />
    <path d="M6 11c.5-1.5 1.5-2 2-2s1.5.5 2 2" opacity="0.5" />
    <path d="M14 11c.5-1.5 1.5-2 2-2s1.5.5 2 2" opacity="0.5" />
  </svg>
);

/** Chicken / non-veg icon */
export const ChickenIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg {...svgBase(size, className)}>
    <path d="M15 3c2 1 4 3 4 6 0 2-1 4-3 5l1 7H7l1-7C6 13 5 11 5 9c0-3 2-5 4-6" />
    <path d="M9 3c1 .5 2 1.5 3 1.5S14 3.5 15 3" />
    <path d="M10 21h4" />
  </svg>
);

/** Veg leaf icon used for veg indicator */
export const VegIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg {...svgBase(size, className)}>
    <path d="M12 2C7 2 3 6 3 11c0 4 3 7 6 9l3 2 3-2c3-2 6-5 6-9 0-5-4-9-9-9z" />
    <path d="M12 22V12" />
    <path d="M8 14c2-2 4-4 4-8" />
    <path d="M16 14c-2-2-4-4-4-8" />
  </svg>
);

/** Heart / health condition icon */
export const HealthHeartIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg {...svgBase(size, className)}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    <path d="M8 12h3l1-3 2 6 1-3h2" />
  </svg>
);

/** Blood sugar / diabetes icon */
export const DiabetesIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg {...svgBase(size, className)}>
    <path d="M12 2C8 6 4 10 4 14a8 8 0 0 0 16 0c0-4-4-8-8-12z" />
    <path d="M9 14h6" />
    <path d="M12 11v6" />
  </svg>
);

/** Blood pressure up icon */
export const BPHighIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg {...svgBase(size, className)}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    <path d="M12 15V9" />
    <path d="M9 12l3-3 3 3" />
  </svg>
);

/** Blood pressure down icon */
export const BPLowIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg {...svgBase(size, className)}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    <path d="M12 9v6" />
    <path d="M9 12l3 3 3-3" />
  </svg>
);

/** Night / moon icon */
export const NightIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg {...svgBase(size, className)}>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

/** Camera icon for snap feature */
export const FoodCameraIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg {...svgBase(size, className)}>
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

/** Barcode scan icon */
export const FoodBarcodeIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg {...svgBase(size, className)}>
    <rect x="2" y="4" width="4" height="16" rx="0.5" />
    <rect x="8" y="4" width="2" height="16" rx="0.5" />
    <rect x="12" y="4" width="4" height="16" rx="0.5" />
    <rect x="18" y="4" width="4" height="16" rx="0.5" />
  </svg>
);

/** Keyboard / type icon */
export const TypeIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg {...svgBase(size, className)}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01" />
    <path d="M6 12h.01M10 12h.01M14 12h.01M18 12h.01" />
    <path d="M8 16h8" />
  </svg>
);
