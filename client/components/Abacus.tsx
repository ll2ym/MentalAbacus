import { useState, useEffect } from "react";

interface Bead {
  id: string;
  rod: number;
  section: "upper" | "lower";
  beadIndex: number;
  isActive: boolean; // true = on/at divider, false = off/at resting position
}

interface AbacusProps {
  targetValue?: number;
  onValueChange?: (value: number) => void;
  rods?: number;
}

const DEFAULT_RODS = 10;
const UPPER_BEADS = 1;
const LOWER_BEADS = 4;
const BEAD_SIZE = 20;
const WOOD_COLOR = "#8B6F47";

const POSITIONS = {
  UPPER_OFF: 10,
  UPPER_ON: 130, // Maximum vertical travel is 120 pixels (10 + 120 = 130)
  LOWER_OFF_BASE: 190,
  LOWER_ON_BASE: 65, // First bead at Y = 65
  BEAD_SIZE: 20,
  DIVIDER_Y: 72, // Visual divider position
};

export function Abacus({ targetValue, onValueChange, rods = DEFAULT_RODS }: AbacusProps) {
  const [beads, setBeads] = useState<Bead[]>([]);

  // Initialize beads
  useEffect(() => {
    const initialBeads: Bead[] = [];
    for (let rod = 0; rod < rods; rod++) {
      // Upper bead
      initialBeads.push({
        id: `${rod}-upper-0`,
        rod,
        section: "upper",
        beadIndex: 0,
        isActive: false,
      });

      // Lower beads
      for (let i = 0; i < LOWER_BEADS; i++) {
        initialBeads.push({
          id: `${rod}-lower-${i}`,
          rod,
          section: "lower",
          beadIndex: i,
          isActive: false,
        });
      }
    }
    setBeads(initialBeads);
  }, [rods]);

  // Calculate current value
  useEffect(() => {
    const values = Array(rods).fill(0);

    for (let rod = 0; rod < rods; rod++) {
      // Upper bead
      const upperBead = beads.find((b) => b.rod === rod && b.section === "upper");
      if (upperBead?.isActive) {
        values[rod] += 5;
      }

      // Lower beads - count active ones
      const lowerBeads = beads.filter((b) => b.rod === rod && b.section === "lower");
      const activeCount = lowerBeads.filter((b) => b.isActive).length;
      values[rod] += activeCount;
    }

    const value = values.reduce(
      (sum, digit, idx) => sum + digit * Math.pow(10, rods - 1 - idx),
      0
    );

    onValueChange?.(value);
  }, [beads, rods, onValueChange]);

  // Animate beads to target value
  useEffect(() => {
    if (targetValue !== undefined && targetValue >= 0) {
      setBeads((prevBeads) => {
        const valueStr = targetValue.toString().padStart(rods, "0");
        return prevBeads.map((bead) => {
          const digit = parseInt(valueStr[bead.rod]);

          if (bead.section === "upper") {
            // Upper bead: active if digit >= 5
            return { ...bead, isActive: digit >= 5 };
          } else {
            // Lower beads: activate first N beads where N = digit % 5
            const lowerValue = digit % 5;
            return { ...bead, isActive: bead.beadIndex < lowerValue };
          }
        });
      });
    }
  }, [targetValue, rods]);

  const handleBeadClick = (beadId: string) => {
    setBeads((prevBeads) =>
      prevBeads.map((bead) => {
        if (bead.id === beadId) {
          // Toggle active state
          return { ...bead, isActive: !bead.isActive };
        }
        return bead;
      })
    );
  };

  const getBeadPositionY = (bead: Bead): number => {
    if (bead.section === "upper") {
      return bead.isActive ? POSITIONS.UPPER_ON : POSITIONS.UPPER_OFF;
    } else {
      // Lower beads - each has a fixed active position
      const activePositions = {
        0: 129, // Bead 1 active position
        1: 109, // Bead 2 active position
        2: 89, // Bead 3 active position
        3: 69, // Bead 4 active position
      };

      if (bead.isActive) {
        // Use the fixed active position for this bead
        return activePositions[bead.beadIndex as keyof typeof activePositions] || 190;
      }
      // Inactive position - resting at bottom
      return POSITIONS.LOWER_OFF_BASE - bead.beadIndex * BEAD_SIZE;
    }
  };

  const getRodX = (rodIndex: number): number => {
    return 30 + rodIndex * 40;
  };

  const svgWidth = 30 + rods * 40 + 30;

  return (
    <div className="flex flex-col items-center gap-6">
      <svg
        width={svgWidth}
        height={250}
        className="border-4 border-amber-800 rounded-lg bg-gradient-to-b from-amber-100 to-amber-200 shadow-2xl cursor-pointer"
      >
        {/* Background */}
        <defs>
          <linearGradient id="frameGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fef3c7" />
            <stop offset="100%" stopColor="#fed7aa" />
          </linearGradient>
        </defs>
        <rect width={svgWidth} height={250} fill="url(#frameGradient)" />

        {/* Frame edges */}
        <rect x="10" y="10" width="6" height="230" fill="#92400e" rx="3" />
        <rect x={svgWidth - 16} y="10" width="6" height="230" fill="#92400e" rx="3" />

        {/* Upper rail */}
        <rect x="15" y="20" width={svgWidth - 40} height="6" fill="#92400e" rx="2" />

        {/* Divider bar */}
        <rect x="15" y="68" width={svgWidth - 40} height="8" fill="#92400e" rx="2" />

        {/* Lower rail */}
        <rect x="15" y="215" width={svgWidth - 40} height="6" fill="#92400e" rx="2" />

        {/* Divider lines (visual guides) */}
        {Array.from({ length: 5 }).map((_, i) => (
          <line
            key={`guide-${i}`}
            x1="15"
            y1={22 + i * 47}
            x2={svgWidth - 15}
            y2={22 + i * 47}
            stroke="#d97706"
            strokeWidth="1"
            opacity="0.3"
          />
        ))}

        {/* Draw rods and beads */}
        {Array.from({ length: rods }).map((_, rodIndex) => {
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

              {/* Lower beads FIRST (render behind) */}
              {beads
                .filter((bead) => bead.rod === rodIndex && bead.section === "lower")
                .sort((a, b) => b.beadIndex - a.beadIndex)
                .map((bead) => {
                  const posY = getBeadPositionY(bead);
                  return (
                    <rect
                      key={bead.id}
                      x={rodX - 10}
                      y={posY}
                      width={BEAD_SIZE}
                      height={BEAD_SIZE}
                      rx="4"
                      fill={WOOD_COLOR}
                      stroke="#ffffff"
                      strokeWidth="1.5"
                      style={{
                        cursor: "pointer",
                        transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                        opacity: bead.isActive ? 1 : 0.9,
                      }}
                      onClick={() => handleBeadClick(bead.id)}
                    />
                  );
                })}

              {/* Upper bead LAST (render on top) */}
              {beads
                .filter((bead) => bead.rod === rodIndex && bead.section === "upper")
                .map((bead) => {
                  const posY = getBeadPositionY(bead);
                  return (
                    <rect
                      key={bead.id}
                      x={rodX - 10}
                      y={posY}
                      width={BEAD_SIZE}
                      height={BEAD_SIZE}
                      rx="4"
                      fill={WOOD_COLOR}
                      stroke="#ffffff"
                      strokeWidth="1.5"
                      style={{
                        cursor: "pointer",
                        transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                        opacity: bead.isActive ? 1 : 0.9,
                      }}
                      onClick={() => handleBeadClick(bead.id)}
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
        <p className="text-4xl font-bold text-indigo-600">
          {(() => {
            const values = Array(rods).fill(0);
            for (let rod = 0; rod < rods; rod++) {
              const upperBead = beads.find(
                (b) => b.rod === rod && b.section === "upper"
              );
              if (upperBead?.isActive) {
                values[rod] += 5;
              }
              const lowerBeads = beads.filter(
                (b) => b.rod === rod && b.section === "lower"
              );
              const activeCount = lowerBeads.filter((b) => b.isActive).length;
              values[rod] += activeCount;
            }
            return values.reduce(
              (sum, digit, idx) => sum + digit * Math.pow(10, rods - 1 - idx),
              0
            );
          })()}
        </p>
      </div>
    </div>
  );
}
