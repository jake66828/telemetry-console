// src/utils/health.ts

export type HealthLevel = "Good" | "Warning" | "Critical";

export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

/**
 * Very simple, explainable scoring:
 * - Battery is good when high.
 * - Temp is best around 25–35C, degrades outside that.
 * - Speed is "stress" proxy: higher speed -> slightly lower score.
 *
 * Returns score 0–100 and a level label.
 */
export function computeHealthScore(input: {
  battery: number; // 0-100
  tempC: number;   // degrees C
  speed: number;   // m/s
}): { score: number; level: HealthLevel } {
  const battery = clamp(input.battery ?? 0, 0, 100);
  const tempC = Number.isFinite(input.tempC) ? input.tempC : 0;
  const speed = Math.max(0, Number.isFinite(input.speed) ? input.speed : 0);

  // Battery: 0..100 directly contributes
  const batteryScore = battery;

  // Temp: best around 25-35.
  // Penalty grows as you move away from 30.
  // 30C => 100, 40C => 60, 50C => 20 (roughly)
  const tempPenalty = Math.abs(tempC - 30) * 4; // tweakable
  const tempScore = clamp(100 - tempPenalty, 0, 100);

  // Speed: treat >2.0 m/s as higher stress.
  // 0 => 100, 2.0 => 80, 4.0 => 60, ...
  const speedPenalty = speed * 10; // tweakable
  const speedScore = clamp(100 - speedPenalty, 0, 100);

  // Weighted average (battery matters most)
  const score = Math.round(
    0.55 * batteryScore + 0.30 * tempScore + 0.15 * speedScore
  );

  let level: HealthLevel = "Good";
  if (score < 40) level = "Critical";
  else if (score < 70) level = "Warning";

  return { score, level };
}

export function healthBadgeClass(level: HealthLevel) {
  // Tailwind classes; subtle but clear
  if (level === "Good") return "bg-green-50 text-green-700 border-green-200";
  if (level === "Warning") return "bg-yellow-50 text-yellow-800 border-yellow-200";
  return "bg-red-50 text-red-700 border-red-200";
}