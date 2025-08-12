import { BookingStatus } from "../../common/enums/booking-status.enum";

export function getCancelStatus(firstSlotStartTime: Date, thresholdHours = 3) {
  const now = new Date();

  const diffMs = firstSlotStartTime.getTime() - now.getTime();
  const diffMinutes = diffMs / (1000 * 60);
  const diffHours = diffMinutes / 60;

  const isEarly = diffHours >= thresholdHours;

  return isEarly ? BookingStatus.CANCELLED_EARLY : BookingStatus.CANCELLED;
}
