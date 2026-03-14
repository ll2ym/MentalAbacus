export function parseEquation(input: string): number | null {
  try {
    // Remove whitespace and equals signs
    let equation = input.replace(/\s+/g, "").replace(/=$/, "");

    // Check if it's a valid equation
    if (!equation || !/^[\d+\-*/()]+$/.test(equation)) {
      return null;
    }

    // Evaluate the expression safely
    // Using Function constructor instead of eval for slightly better security
    const result = Function('"use strict"; return (' + equation + ")")();

    if (typeof result === "number" && isFinite(result) && result >= 0) {
      return Math.floor(result);
    }

    return null;
  } catch {
    return null;
  }
}

export function validateEquationInput(input: string): boolean {
  // Allow digits, operators, parentheses, equals signs
  return /^[\d+\-*/()=\s]*$/.test(input);
}

export function formatEquationDisplay(input: string): string {
  return input.replace(/\s+/g, "");
}
