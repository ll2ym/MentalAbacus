import { useState, useRef, useEffect } from "react";

interface Bead {
  id: string;
  rod: number;
  section: "upper" | "lower"; // upper = 2 beads (worth 5 each), lower = 5 beads (worth 1 each)
  beadIndex: number;
  positionY: number;
}

interface AbacusProps {
  targetValue?: number;
  onValueChange?: (value: number) => void;
}

const RODS = 10;
const UPPER_BEADS = 2;
const LOWER_BEADS = 5;
const BEAD_RADIUS = 10;
const ROD_WIDTH = 30;
const ROD_SPACING = 40;
const DIVIDER_Y = 90;
const UPPER_RAIL_HEIGHT = 50;
const LOWER_RAIL_HEIGHT = 100;
const BEAD_SIZE = 20;

export function Abacus({ targetValue, onValueChange }: AbacusProps) {
  const [beads, setBeads] = useState<Bead[]>([]);
  const [draggingBead, setDraggingBead] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);

  // Initialize beads
  useEffect(() => {
    const initialBeads: Bead[] = [];
    for (let rod = 0; rod < RODS; rod++) {
      // Upper section - 2 beads (worth 5 each)
      for (let i = 0; i < UPPER_BEADS; i++) {
        initialBeads.push({
          id: `${rod}-upper-${i}`,
          rod,
          section: "upper",
          beadIndex: i,
          positionY: 10 + i * BEAD_SIZE,
        });
      }

      // Lower section - 5 beads (worth 1 each)
      for (let i = 0; i < LOWER_BEADS; i++) {
        initialBeads.push({
          id: `${rod}-lower-${i}`,
          rod,
          section: "lower",
          beadIndex: i,
          positionY: DIVIDER_Y + 10 + i * BEAD_SIZE,
        });
      }
    }
    setBeads(initialBeads);
  }, []);

  // Calculate current value from bead positions
  useEffect(() => {
    const values = Array(RODS).fill(0);

    beads.forEach((bead) => {
      if (bead.section === "upper") {
        // Upper beads are active when they touch the divider (positionY > 65)
        if (bead.positionY > 65) {
          values[bead.rod] += 5;
        }
      } else {
        // Lower beads are active when they touch the divider (positionY < 100)
        if (bead.positionY < 100) {
          values[bead.rod] += 1;
        }
      }
    });

    const value = values.reduce(
      (sum, digit, idx) => sum + digit * Math.pow(10, RODS - 1 - idx),
      0
    );

    onValueChange?.(value);
  }, [beads]);

  // Animate beads to target value
  useEffect(() => {
    if (targetValue !== undefined && targetValue >= 0) {
      const valueStr = targetValue.toString().padStart(RODS, "0");
      const newBeads = beads.map((bead) => {
        const digit = parseInt(valueStr[bead.rod]);

        if (bead.section === "upper") {
          // Upper beads: 2 beads worth 5 each
          const upperValue = Math.min(2, Math.floor(digit / 5));
          const isActive = bead.beadIndex < upperValue;
          return {
            ...bead,
            positionY: isActive ? 70 : 10 + bead.beadIndex * BEAD_SIZE,
          };
        } else {
          // Lower beads: 5 beads worth 1 each
          const lowerValue = digit % 5;
          const isActive = bead.beadIndex < lowerValue;
          return {
            ...bead,
            positionY: isActive ? 90 : DIVIDER_Y + 10 + bead.beadIndex * BEAD_SIZE,
          };
        }
      });
      setBeads(newBeads);
    }
  }, [targetValue]);

  const handleMouseDown = (
    beadId: string,
    clientY: number,
    currentY: number
  ) => {
    setDraggingBead(beadId);
    setDragOffset(clientY - currentY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingBead || !svgRef.current) return;

    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;

    setBeads((prevBeads) =>
      prevBeads.map((bead) => {
        if (bead.id === draggingBead) {
          let minY, maxY;

          if (bead.section === "upper") {
            minY = 10;
            maxY = 75;
          } else {
            minY = DIVIDER_Y + 10;
            maxY = DIVIDER_Y + 10 + LOWER_BEADS * BEAD_SIZE - BEAD_SIZE;
          }

          const newPosition = Math.max(minY, Math.min(maxY, mouseY - dragOffset));
          return { ...bead, positionY: newPosition };
        }
        return bead;
      })
    );
  };

  const handleMouseUp = () => {
    setDraggingBead(null);
  };

  const getRodX = (rodIndex: number) => {
    return 30 + rodIndex * ROD_SPACING;
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <svg
        ref={svgRef}
        width={30 + RODS * ROD_SPACING + 30}
        height={250}
        className="border-4 border-amber-800 rounded-lg bg-gradient-to-b from-amber-100 to-amber-200 shadow-2xl"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"40\" height=\"40\"><rect fill=\"%23d97706\" opacity=\"0.05\" width=\"40\" height=\"40\"/><line x1=\"0\" y1=\"0\" x2=\"40\" y2=\"0\" stroke=\"%23d97706\" opacity=\"0.1\"/></svg>')" }}
      >
        {/* Frame decorations - left and right edges */}
        <rect x="10" y="10" width="6" height="230" fill="#92400e" rx="3" />
        <rect
          x={30 + RODS * ROD_SPACING + 14}
          y="10"
          width="6"
          height="230"
          fill="#92400e"
          rx="3"
        />

        {/* Upper rail */}
        <rect x="15" y="20" width={RODS * ROD_SPACING - 10} height="6" fill="#92400e" rx="2" />

        {/* Divider bar */}
        <rect x="15" y={DIVIDER_Y - 2} width={RODS * ROD_SPACING - 10} height="8" fill="#92400e" rx="2" />

        {/* Lower rail */}
        <rect x="15" y="215" width={RODS * ROD_SPACING - 10} height="6" fill="#92400e" rx="2" />

        {/* Draw rods and beads */}
        {Array.from({ length: RODS }).map((_, rodIndex) => {
          const rodX = getRodX(rodIndex);

          return (
            <g key={rodIndex}>
              {/* Rod */}
              <line
                x1={rodX}
                y1="20"
                x2={rodX}
                y2="220"
                stroke="#92400e"
                strokeWidth="1.5"
              />

              {/* Upper beads */}
              {beads
                .filter((bead) => bead.rod === rodIndex && bead.section === "upper")
                .map((bead) => (
                  <rect
                    key={bead.id}
                    x={rodX - BEAD_RADIUS}
                    y={bead.positionY}
                    width={BEAD_SIZE}
                    height={BEAD_SIZE}
                    rx="4"
                    fill={`hsl(${20 + (rodIndex * 35) % 340}, 85%, 55%)`}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    style={{
                      cursor:
                        draggingBead === bead.id ? "grabbing" : "grab",
                      transition:
                        draggingBead === bead.id
                          ? "none"
                          : "all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
                      filter:
                        draggingBead === bead.id
                          ? "drop-shadow(0 4px 12px rgba(0,0,0,0.3))"
                          : "drop-shadow(0 2px 4px rgba(0,0,0,0.15))",
                    }}
                    onMouseDown={(e) =>
                      handleMouseDown(bead.id, e.clientY, bead.positionY)
                    }
                  />
                ))}

              {/* Lower beads */}
              {beads
                .filter((bead) => bead.rod === rodIndex && bead.section === "lower")
                .map((bead) => (
                  <rect
                    key={bead.id}
                    x={rodX - BEAD_RADIUS}
                    y={bead.positionY}
                    width={BEAD_SIZE}
                    height={BEAD_SIZE}
                    rx="4"
                    fill={`hsl(${20 + (rodIndex * 35) % 340}, 90%, 45%)`}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    style={{
                      cursor:
                        draggingBead === bead.id ? "grabbing" : "grab",
                      transition:
                        draggingBead === bead.id
                          ? "none"
                          : "all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
                      filter:
                        draggingBead === bead.id
                          ? "drop-shadow(0 4px 12px rgba(0,0,0,0.3))"
                          : "drop-shadow(0 2px 4px rgba(0,0,0,0.15))",
                    }}
                    onMouseDown={(e) =>
                      handleMouseDown(bead.id, e.clientY, bead.positionY)
                    }
                  />
                ))}
            </g>
          );
        })}
      </svg>

      {/* Value display */}
      <div className="text-center">
        <p className="text-sm text-slate-600 mb-2">Current Value</p>
        <p className="text-4xl font-bold text-indigo-600">
          {(() => {
            const values = Array(RODS).fill(0);

            beads.forEach((bead) => {
              if (bead.section === "upper") {
                if (bead.positionY > 65) {
                  values[bead.rod] += 5;
                }
              } else {
                if (bead.positionY < 100) {
                  values[bead.rod] += 1;
                }
              }
            });

            return values.reduce(
              (sum, digit, idx) => sum + digit * Math.pow(10, RODS - 1 - idx),
              0
            );
          })()}
        </p>
      </div>
    </div>
  );
}
