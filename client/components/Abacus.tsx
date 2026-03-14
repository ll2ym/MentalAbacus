import { useState, useRef, useEffect } from "react";

interface Bead {
  id: string;
  row: number;
  section: "upper" | "lower"; // upper = 1 bead (worth 5), lower = 4 beads (worth 1 each)
  position: number;
}

interface AbacusProps {
  targetValue?: number;
  onValueChange?: (value: number) => void;
}

const ROWS = 10;
const BEAD_RADIUS = 14;
const RAIL_HEIGHT = 50;
const ROD_GAP = 60;
const SECTION_HEIGHT = 80;
const DIVIDER_Y = 120;

export function Abacus({ targetValue, onValueChange }: AbacusProps) {
  const [beads, setBeads] = useState<Bead[]>([]);
  const [draggingBead, setDraggingBead] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);

  // Initialize beads
  useEffect(() => {
    const initialBeads: Bead[] = [];
    for (let row = 0; row < ROWS; row++) {
      // Upper section - 1 bead (worth 5)
      initialBeads.push({
        id: `${row}-upper-0`,
        row,
        section: "upper",
        position: 0,
      });

      // Lower section - 4 beads (worth 1 each)
      for (let bead = 0; bead < 4; bead++) {
        initialBeads.push({
          id: `${row}-lower-${bead}`,
          row,
          section: "lower",
          position: bead * 35,
        });
      }
    }
    setBeads(initialBeads);
  }, []);

  // Calculate current value from bead positions
  useEffect(() => {
    const value = beads.reduce((sum, bead) => {
      const rowValue = Math.pow(10, ROWS - 1 - bead.row);
      let beadValue = 0;

      if (bead.section === "upper") {
        // Upper bead: worth 5 when moved down (position > 20)
        beadValue = bead.position > 20 ? 5 : 0;
      } else {
        // Lower beads: each worth 1 when moved up (position < 100)
        beadValue = bead.position < 100 ? 1 : 0;
      }

      return sum + beadValue * rowValue;
    }, 0);

    onValueChange?.(value);
  }, [beads, onValueChange]);

  // Animate beads to target value
  useEffect(() => {
    if (targetValue !== undefined && targetValue >= 0) {
      const valueStr = targetValue.toString().padStart(ROWS, "0");
      const newBeads = beads.map((bead) => {
        const digit = parseInt(valueStr[bead.row]);

        if (bead.section === "upper") {
          // Upper bead: position 0 = not used, 30 = used (worth 5)
          const upperValue = Math.floor(digit / 5);
          return { ...bead, position: upperValue > 0 ? 30 : 0 };
        } else {
          // Lower beads: calculate which ones are used (worth 1 each)
          const lowerValue = digit % 5;
          const beadIndex = parseInt(bead.id.split("-")[2]);
          const newPosition =
            beadIndex < lowerValue ? 90 : 0;
          return { ...bead, position: newPosition };
        }
      });
      setBeads(newBeads);
    }
  }, [targetValue]);

  const handleMouseDown = (beadId: string, clientY: number, currentY: number) => {
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
            minY = 20;
            maxY = 70;
          } else {
            minY = DIVIDER_Y + 10;
            maxY = DIVIDER_Y + 60;
          }

          const newPosition = Math.max(
            minY,
            Math.min(maxY, mouseY - dragOffset)
          );
          return { ...bead, position: newPosition - (bead.section === "upper" ? 20 : DIVIDER_Y + 10) };
        }
        return bead;
      })
    );
  };

  const handleMouseUp = () => {
    setDraggingBead(null);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <svg
        ref={svgRef}
        width={200}
        height={ROWS * ROD_GAP + 60}
        className="border-2 border-slate-300 rounded-lg bg-white shadow-md"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Background */}
        <rect width={200} height={ROWS * ROD_GAP + 60} fill="white" />

        {/* Draw rods and beads */}
        {Array.from({ length: ROWS }).map((_, rowIndex) => {
          const rodY = 30 + rowIndex * ROD_GAP;
          const upperCenterY = rodY + 20;
          const lowerCenterY = rodY + DIVIDER_Y + 30;

          return (
            <g key={rowIndex}>
              {/* Divider line separating upper and lower sections */}
              {rowIndex === 0 && (
                <line
                  x1={20}
                  y1={DIVIDER_Y}
                  x2={180}
                  y2={DIVIDER_Y}
                  stroke="#94a3b8"
                  strokeWidth={2}
                />
              )}

              {/* Upper rod */}
              <line
                x1={20}
                y1={upperCenterY}
                x2={180}
                y2={upperCenterY}
                stroke="#cbd5e1"
                strokeWidth={2}
              />

              {/* Lower rod */}
              <line
                x1={20}
                y1={lowerCenterY}
                x2={180}
                y2={lowerCenterY}
                stroke="#cbd5e1"
                strokeWidth={2}
              />

              {/* Upper bead (1 bead worth 5) */}
              {beads
                .filter(
                  (bead) =>
                    bead.row === rowIndex && bead.section === "upper"
                )
                .map((bead) => (
                  <circle
                    key={bead.id}
                    cx={100}
                    cy={20 + bead.position}
                    r={BEAD_RADIUS}
                    fill={`hsl(${(rowIndex * 36) % 360}, 75%, 55%)`}
                    stroke="#fff"
                    strokeWidth={2.5}
                    style={{
                      cursor:
                        draggingBead === bead.id ? "grabbing" : "grab",
                      transition:
                        draggingBead === bead.id
                          ? "none"
                          : "all 0.15s ease-out",
                      filter:
                        draggingBead === bead.id
                          ? "drop-shadow(0 2px 8px rgba(0,0,0,0.2))"
                          : "drop-shadow(0 1px 3px rgba(0,0,0,0.1))",
                    }}
                    onMouseDown={(e) =>
                      handleMouseDown(bead.id, e.clientY, 20 + bead.position)
                    }
                  />
                ))}

              {/* Lower beads (4 beads worth 1 each) */}
              {beads
                .filter(
                  (bead) =>
                    bead.row === rowIndex && bead.section === "lower"
                )
                .map((bead) => (
                  <circle
                    key={bead.id}
                    cx={100}
                    cy={DIVIDER_Y + 10 + bead.position}
                    r={BEAD_RADIUS}
                    fill={`hsl(${(rowIndex * 36) % 360}, 70%, 45%)`}
                    stroke="#fff"
                    strokeWidth={2.5}
                    style={{
                      cursor:
                        draggingBead === bead.id ? "grabbing" : "grab",
                      transition:
                        draggingBead === bead.id
                          ? "none"
                          : "all 0.15s ease-out",
                      filter:
                        draggingBead === bead.id
                          ? "drop-shadow(0 2px 8px rgba(0,0,0,0.2))"
                          : "drop-shadow(0 1px 3px rgba(0,0,0,0.1))",
                    }}
                    onMouseDown={(e) =>
                      handleMouseDown(
                        bead.id,
                        e.clientY,
                        DIVIDER_Y + 10 + bead.position
                      )
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
        <p className="text-3xl font-bold text-indigo-600">
          {beads.reduce((sum, bead) => {
            const rowValue = Math.pow(10, ROWS - 1 - bead.row);
            let beadValue = 0;

            if (bead.section === "upper") {
              beadValue = bead.position > 20 ? 5 : 0;
            } else {
              beadValue = bead.position < 100 ? 1 : 0;
            }

            return sum + beadValue * rowValue;
          }, 0)}
        </p>
      </div>
    </div>
  );
}
