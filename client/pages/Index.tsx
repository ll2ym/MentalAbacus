import { useState, useRef } from "react";
import { Abacus } from "@/components/Abacus";
import { parseEquation, validateEquationInput } from "@/lib/equation-parser";

export default function Index() {
  const [equation, setEquation] = useState("");
  const [abacusValue, setAbacusValue] = useState(0);
  const [solvedValue, setSolvedValue] = useState<number | null>(null);
  const [error, setError] = useState("");
  const abacusRef = useRef<HTMLDivElement>(null);

  const handleEquationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (validateEquationInput(value)) {
      setEquation(value);
      setError("");
    }
  };

  const handleSolveEquation = () => {
    const result = parseEquation(equation);
    if (result !== null) {
      setSolvedValue(result);
      setError("");
    } else {
      setError("Invalid equation. Please check your input.");
      setSolvedValue(null);
    }
  };

  const handleClear = () => {
    setEquation("");
    setSolvedValue(null);
    setAbacusValue(0);
    setError("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSolveEquation();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header - Hidden on mobile */}
      <header className="hidden md:block bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold mb-2">Mental Abacus</h1>
          <p className="text-purple-100 text-lg">
            Solve equations visually with an interactive abacus
          </p>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-4 md:py-8">
        {/* Desktop: 2-column grid */}
        <div className="hidden md:grid grid-cols-2 gap-8 h-screen max-h-[calc(100vh-140px)]">
          {/* Left side - Equation Input */}
          <div className="flex flex-col justify-center">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100 h-full overflow-y-auto">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Input Equation
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Enter your equation
                  </label>
                  <input
                    type="text"
                    value={equation}
                    onChange={handleEquationChange}
                    onKeyDown={handleKeyDown}
                    placeholder="e.g., 1+13+46-41"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none text-lg font-mono transition-colors"
                  />
                  <p className="text-xs text-slate-500 mt-2">
                    Use +, -, *, /, and () for operations
                  </p>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
                    {error}
                  </div>
                )}

                {solvedValue !== null && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm text-green-700 mb-2">Result:</p>
                    <p className="text-3xl font-bold text-green-600">
                      {solvedValue}
                    </p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={handleSolveEquation}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Solve
                  </button>
                  <button
                    onClick={handleClear}
                    className="flex-1 bg-slate-200 text-slate-700 font-semibold py-3 rounded-lg hover:bg-slate-300 transition-all duration-200"
                  >
                    Clear
                  </button>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-200">
                  <h3 className="font-semibold text-slate-900 mb-3">
                    How it works:
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold">1.</span>
                      <span>Enter an equation and click Solve</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold">2.</span>
                      <span>Watch the abacus beads move to show the result</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold">3.</span>
                      <span>Or drag beads manually to see the value</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Abacus */}
          <div className="flex flex-col justify-center">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100 h-full flex flex-col">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Visual Abacus
              </h2>
              <div
                ref={abacusRef}
                className="flex justify-center flex-1 overflow-x-auto"
              >
                <Abacus
                  targetValue={solvedValue ?? undefined}
                  onValueChange={setAbacusValue}
                />
              </div>

              {solvedValue === null && (
                <div className="text-center py-4 text-slate-500 text-sm">
                  <p>Drag beads on the rods to calculate values</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile: Stacked layout */}
        <div className="md:hidden flex flex-col gap-4">
          {/* Top - Abacus */}
          <div className="bg-white rounded-2xl shadow-lg p-4 border border-slate-100">
            <div
              ref={abacusRef}
              className="flex justify-center overflow-x-auto mb-4"
            >
              <Abacus
                targetValue={solvedValue ?? undefined}
                onValueChange={setAbacusValue}
              />
            </div>
          </div>

          {/* Bottom - Input */}
          <div className="bg-white rounded-2xl shadow-lg p-4 border border-slate-100">
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Enter equation
                </label>
                <input
                  type="text"
                  value={equation}
                  onChange={handleEquationChange}
                  onKeyDown={handleKeyDown}
                  placeholder="e.g., 1+13+46-41"
                  className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none text-base font-mono transition-colors"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-2 text-red-700 text-xs">
                  {error}
                </div>
              )}

              {solvedValue !== null && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-xs text-green-700 mb-1">Result:</p>
                  <p className="text-2xl font-bold text-green-600">
                    {solvedValue}
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={handleSolveEquation}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-2 text-sm rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
                >
                  Solve
                </button>
                <button
                  onClick={handleClear}
                  className="flex-1 bg-slate-200 text-slate-700 font-semibold py-2 text-sm rounded-lg hover:bg-slate-300 transition-all duration-200"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
