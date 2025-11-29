export const formatTime = (decimalTime: number): string => {
  const hours = Math.floor(decimalTime);
  const minutes = Math.round((decimalTime - hours) * 60);
  const h = hours.toString().padStart(2, '0');
  const m = minutes.toString().padStart(2, '0');
  return `${h}:${m}`;
};

export const timeToAngle = (time: number): number => {
  // Map 0-24 to 0-2PI
  // 00:00 is at top (0 radians in D3 arc default if we adjust rotation or use standard clock)
  // D3 arc 0 is 12 o'clock.
  return (time / 24) * 2 * Math.PI;
};

export const angleToTime = (angle: number): number => {
  // Normalize angle to 0-2PI
  let normalized = angle % (2 * Math.PI);
  if (normalized < 0) normalized += 2 * Math.PI;
  return (normalized / (2 * Math.PI)) * 24;
};

export const getDurationString = (start: number, end: number): string => {
  let duration = end - start;
  if (duration < 0) duration += 24; // Handle overnight
  const hours = Math.floor(duration);
  const minutes = Math.round((duration - hours) * 60);
  if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h`;
  return `${minutes}m`;
};
