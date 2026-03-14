import { useState, useRef, useEffect } from "react";

interface Bead {
  id: string;
  row: number;
  position: number;
}

interface AbacusProps {
  targetValue?: number;
  onValueChange?: (value: number) => void;
}

const ROWS = 10;
const BEADS_PER_ROW = 10;
const BEAD_RADIUS = 12;
const RAIL_WIDTH = 400;
const RAIL_HEIGHT = 35;
const ROD_GAP = 50;

export function Abacus({ targetValue, onValueChange }: AbacusProps) {
  const [beads, setBeads] = useState<Bead[]>([]);
  const [draggingBead, setDraggingBead] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);

  // Initialize beads
  useEffect(() => {
    const initialBeads: Bead[] = [];
    for (let row = 0; row < ROWS; row++) {
      for (let bead = 0; bead < BEADS_PER_ROW; bead++) {
        initialBeads.push({
          id: `${row}-${bead}`,
          row,
          position: bead * (RAIL_WIDTH / BEADS_PER_ROW),
        });
      }
    }
    setBeads(initialBeads);
  }, []);

  // Calculate current value from bead positions
  useEffect(() => {
    const value = beads.reduce((sum, bead) => {
      // Each position represents a power of 10 from right to left
      const rowValue = Math.pow(10, ROWS - 1 - bead.row);
      const beadValue = Math.floor(
        (bead.position / RAIL_WIDTH) * BEADS_PER_ROW
      );
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
        const newPosition = (digit / BEADS_PER_ROW) * RAIL_WIDTH;
        return { ...bead, position: newPosition };
      });
      setBeads(newBeads);
    }
  }, [targetValue]);

  const handleMouseDown = (beadId: string, clientX: number, currentX: number) => {
    setDraggingBead(beadId);
    setDragOffset(clientX - currentX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingBead || !svgRef.current) return;

    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;

    setBeads((prevBeads) =>
      prevBeads.map((bead) => {
        if (bead.id === draggingBead) {
          const newPosition = Math.max(
            0,
            Math.min(RAIL_WIDTH, mouseX - dragOffset - BEAD_RADIUS)
          );
          return { ...bead, position: newPosition };
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
        width={RAIL_WIDTH + 80}
        height={ROWS * ROD_GAP + 40}
        className="border border-slate-300 rounded-lg bg-white"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Background */}
        <rect width={RAIL_WIDTH + 80} height={ROWS * ROD_GAP + 40} fill="white" />

        {/* Draw rods and beads */}
        {Array.from({ length: ROWS }).map((_, rowIndex) => {
          const y = 20 + rowIndex * ROD_GAP + RAIL_HEIGHT / 2;

          return (
            <g key={rowIndex}>
              {/* Rod */}
              <line
                x1={40}
                y1={y}
                x2={RAIL_WIDTH + 40}
                y2={y}
                stroke="#d1d5db"
                strokeWidth={2}
              />

              {/* Rail markers */}
              {Array.from({ length: 11 }).map((_, i) => (
                <circle
                  key={`marker-${rowIndex}-${i}`}
                  cx={40 + (i / 10) * RAIL_WIDTH}
                  cy={y}
                  r={2}
                  fill="#e5e7eb"
                />
              ))}

              {/* Beads on this rod */}
              {beads
                .filter((bead) => bead.row === rowIndex)
                .map((bead) => (
                  <circle
                    key={bead.id}
                    cx={40 + bead.position + BEAD_RADIUS}
                    cy={y}
                    r={BEAD_RADIUS}
                    fill={`hsl(${(rowIndex * 36) % 360}, 70%, 50%)`}
                    stroke="#fff"
                    strokeWidth={2}
                    style={{
                      cursor: draggingBead === bead.id ? "grabbing" : "grab",
                      transition:
                        draggingBead === bead.id
                          ? "none"
                          : "all 0.1s ease-out",
                    }}
                    onMouseDown={(e) =>
                      handleMouseDown(
                        bead.id,
                        e.clientX,
                        40 + bead.position + BEAD_RADIUS
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
            const beadValue = Math.floor(
              (bead.position / RAIL_WIDTH) * BEADS_PER_ROW
            );
            return sum + beadValue * rowValue;
          }, 0)}
        </p>
      </div>
    </div>
  );
}
