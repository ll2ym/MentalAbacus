import { useState, useRef, useEffect } from "react";

interface Bead {
  id: string;
  row: number;
  section: "upper" | "lower"; // upper = 2 beads (worth 5 each), lower = 5 beads (worth 1 each)
  position: number;
}

interface AbacusProps {
  targetValue?: number;
  onValueChange?: (value: number) => void;
}

const ROWS = 10;
const BEAD_RADIUS = 12;
const ROD_GAP = 60;
const UPPER_BEADS = 2;
const LOWER_BEADS = 5;

export function Abacus({ targetValue, onValueChange }: AbacusProps) {
  const [beads, setBeads] = useState<Bead[]>([]);
  const [draggingBead, setDraggingBead] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);

  // Initialize beads
  useEffect(() => {
    const initialBeads: Bead[] = [];
    for (let row = 0; row < ROWS; row++) {
      // Upper section - 2 beads (worth 5 each)
      for (let bead = 0; bead < UPPER_BEADS; bead++) {
        initialBeads.push({
          id: `${row}-upper-${bead}`,
          row,
          section: "upper",
          position: bead * 28,
        });
      }

      // Lower section - 5 beads (worth 1 each)
      for (let bead = 0; bead < LOWER_BEADS; bead++) {
        initialBeads.push({
          id: `${row}-lower-${bead}`,
          row,
          section: "lower",
          position: bead * 28,
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
        // Upper beads: each worth 5 when moved down (position > 15)
        beadValue = bead.position > 15 ? 5 : 0;
      } else {
        // Lower beads: each worth 1 when moved up (position < 70)
        beadValue = bead.position < 70 ? 1 : 0;
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
          // Upper beads: 2 beads worth 5 each, so can represent 0, 5, or 10
          // Count how many upper beads should be "active" (position > 15)
          const upperValue = Math.min(2, Math.floor(digit / 5));
          const beadIndex = parseInt(bead.id.split("-")[2]);
          return { ...bead, position: beadIndex < upperValue ? 28 : 0 };
        } else {
          // Lower beads: 5 beads worth 1 each
          const lowerValue = digit % 5;
          const beadIndex = parseInt(bead.id.split("-")[2]);
          return { ...bead, position: beadIndex < lowerValue ? 112 : 0 };
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
            maxY = 50;
          } else {
            minY = 90;
            maxY = 140;
          }

          const newPosition = Math.max(
            minY,
            Math.min(maxY, mouseY - dragOffset)
          );
          return { ...bead, position: newPosition - (bead.section === "upper" ? 20 : 90) };
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
        width={240}
        height={ROWS * ROD_GAP + 40}
        className="border-2 border-slate-400 rounded-lg bg-gradient-to-b from-amber-50 to-amber-100 shadow-lg"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Background */}
        <defs>
          <linearGradient id="frameGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fef3c7" />
            <stop offset="100%" stopColor="#fed7aa" />
          </linearGradient>
        </defs>
        <rect width={240} height={ROWS * ROD_GAP + 40} fill="url(#frameGradient)" />

        {/* Frame */}
        <rect x={10} y={10} width={220} height={ROWS * ROD_GAP + 20} fill="none" stroke="#a16207" strokeWidth={2} rx={4} />

        {/* Draw rods and beads */}
        {Array.from({ length: ROWS }).map((_, rowIndex) => {
          const rodY = 30 + rowIndex * ROD_GAP;
          const upperRodY = rodY;
          const lowerRodY = rodY + 60;
          const dividerY = rodY + 30;

          return (
            <g key={rowIndex}>
              {/* Divider line separating upper and lower sections */}
              <line
                x1={20}
                y1={dividerY}
                x2={220}
                y2={dividerY}
                stroke="#d97706"
                strokeWidth={1.5}
                opacity={0.5}
              />

              {/* Upper rod */}
              <line
                x1={20}
                y1={upperRodY}
                x2={220}
                y2={upperRodY}
                stroke="#92400e"
                strokeWidth={1.5}
              />

              {/* Lower rod */}
              <line
                x1={20}
                y1={lowerRodY}
                x2={220}
                y2={lowerRodY}
                stroke="#92400e"
                strokeWidth={1.5}
              />

              {/* Upper beads (2 beads worth 5 each) */}
              {beads
                .filter(
                  (bead) =>
                    bead.row === rowIndex && bead.section === "upper"
                )
                .map((bead, idx) => {
                  const spacingX = 30 + idx * 45;
                  return (
                    <circle
                      key={bead.id}
                      cx={spacingX + bead.position}
                      cy={upperRodY}
                      r={BEAD_RADIUS}
                      fill={`hsl(${20 + (rowIndex * 18) % 340}, 85%, 55%)`}
                      stroke="#fff"
                      strokeWidth={2}
                      style={{
                        cursor:
                          draggingBead === bead.id ? "grabbing" : "grab",
                        transition:
                          draggingBead === bead.id
                            ? "none"
                            : "all 0.2s ease-out",
                        filter:
                          draggingBead === bead.id
                            ? "drop-shadow(0 3px 10px rgba(0,0,0,0.3))"
                            : "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
                      }}
                      onMouseDown={(e) =>
                        handleMouseDown(
                          bead.id,
                          e.clientY,
                          upperRodY
                        )
                      }
                    />
                  );
                })}

              {/* Lower beads (5 beads worth 1 each) */}
              {beads
                .filter(
                  (bead) =>
                    bead.row === rowIndex && bead.section === "lower"
                )
                .map((bead, idx) => {
                  const spacingX = 20 + idx * 40;
                  return (
                    <circle
                      key={bead.id}
                      cx={spacingX + bead.position}
                      cy={lowerRodY}
                      r={BEAD_RADIUS}
                      fill={`hsl(${20 + (rowIndex * 18) % 340}, 90%, 45%)`}
                      stroke="#fff"
                      strokeWidth={2}
                      style={{
                        cursor:
                          draggingBead === bead.id ? "grabbing" : "grab",
                        transition:
                          draggingBead === bead.id
                            ? "none"
                            : "all 0.2s ease-out",
                        filter:
                          draggingBead === bead.id
                            ? "drop-shadow(0 3px 10px rgba(0,0,0,0.3))"
                            : "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
                      }}
                      onMouseDown={(e) =>
                        handleMouseDown(
                          bead.id,
                          e.clientY,
                          lowerRodY
                        )
                      }
                    />
                  );
                })}
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
              beadValue = bead.position > 15 ? 5 : 0;
            } else {
              beadValue = bead.position < 70 ? 1 : 0;
            }

            return sum + beadValue * rowValue;
          }, 0)}
        </p>
      </div>
    </div>
  );
}
