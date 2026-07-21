export interface JadwalPraktikSlot {
  text: string;
  startMinutes: number;
  endMinutes: number;
}

const TIME_RANGE_PATTERN = /(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})/;

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);

  return hours * 60 + minutes;
}

export function getCurrentMinutes(): number {
  const now = new Date();

  return now.getHours() * 60 + now.getMinutes();
}

export function parseJadwalPraktikText(text: string): JadwalPraktikSlot | null {
  const normalized = text.replace(/\s+/g, " ").trim();
  const match = normalized.match(TIME_RANGE_PATTERN);

  if (!match) {
    return null;
  }

  return {
    text: normalized,
    startMinutes: timeToMinutes(match[1]),
    endMinutes: timeToMinutes(match[2]),
  };
}

export function isCurrentTimeWithinSlot(
  slot: JadwalPraktikSlot,
  currentMinutes: number,
): boolean {
  return currentMinutes >= slot.startMinutes && currentMinutes <= slot.endMinutes;
}

export function pickBestJadwalPraktikIndex(
  slots: JadwalPraktikSlot[],
  currentMinutes: number = getCurrentMinutes(),
): number {
  if (slots.length === 0) {
    throw new Error("Tidak ada opsi Jadwal Praktik yang tersedia.");
  }

  const activeSlot = slots.findIndex((slot) => isCurrentTimeWithinSlot(slot, currentMinutes));

  if (activeSlot >= 0) {
    return activeSlot;
  }

  const upcomingSlot = slots
    .map((slot, index) => ({ slot, index }))
    .filter(({ slot }) => slot.startMinutes > currentMinutes)
    .sort((left, right) => left.slot.startMinutes - right.slot.startMinutes)[0]?.index;

  if (upcomingSlot !== undefined) {
    return upcomingSlot;
  }

  const latestStartedSlot = slots
    .map((slot, index) => ({ slot, index }))
    .filter(({ slot }) => slot.startMinutes <= currentMinutes)
    .sort((left, right) => right.slot.endMinutes - left.slot.endMinutes)[0]?.index;

  if (latestStartedSlot !== undefined) {
    return latestStartedSlot;
  }

  return 0;
}
