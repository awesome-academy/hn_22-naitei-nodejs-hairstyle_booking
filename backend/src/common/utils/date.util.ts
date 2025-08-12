import { addMinutes } from "date-fns";

/**
 * Sinh danh sách khung giờ cho 1 ca làm việc
 */
export function generateTimeSlotsForShift(
  date: Date,
  start: { hour: number; minute: number },
  end: { hour: number; minute: number },
  slotMinutes: number,
) {
  const slots: { startTime: Date; endTime: Date }[] = [];

  let startTime = new Date(date);
  startTime.setHours(start.hour, start.minute, 0, 0);

  const endTime = new Date(date);
  endTime.setHours(end.hour, end.minute, 0, 0);

  while (startTime < endTime) {
    const slotEnd = addMinutes(startTime, slotMinutes);
    if (slotEnd <= endTime) {
      slots.push({
        startTime: new Date(startTime), // clone để tránh tham chiếu chung
        endTime: new Date(slotEnd),
      });
    }
    startTime = slotEnd;
  }

  return slots;
}

export function setTime(date: Date, time: { hour: number; minute: number }) {
  const newDate = new Date(date);
  newDate.setHours(time.hour, time.minute, 0, 0);
  return newDate;
}
