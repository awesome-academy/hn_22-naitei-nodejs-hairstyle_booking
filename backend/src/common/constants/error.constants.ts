export const ERROR_MESSAGES = {
  AUTH: {
    EMAIL_NOT_FOUND: "Email is not registered",
    PASSWORD_INCORRECT: "Incorrect password",
    USER_INACTIVE: "User is inactive",
    NOT_STYLIST_ROLE: "User is not a stylist",
    NOT_MANAGER_ROLE: "User is not a manager",
    NOT_ADMIN_ROLE: "User is not an admin",
    NOT_CUSTOMER_ROLE: "User is not a customer",
    UNSUPPORTED_ROLE: "Unsupported user role",
    USER_NOT_FOUND: "User not found",
    STYLIST_NOT_FOUND: "Stylist not found",
    MANAGER_NOT_FOUND: "Manager not found",
    CUSTOMER_NOT_FOUND: "Customer not found",
    FORBIDDEN_VIEWER_ROLE: "You do not have permission to view this resource",
  },
  USER: {
    EMAIL_ALREADY_EXISTS: "Email already exists",
    PHONE_ALREADY_EXISTS: "Phone number already exists",
    UN_AUTH: "INVALID_CREDENTIALS",
    NOT_FOUND: "User not found",
  },
  SALON: {
    NOT_FOUND: "Salon not found",
    ALREADY_EXISTS: "Salon with this information already exists",
    HAS_ACTIVE_BOOKINGS: "Cannot delete salon with active bookings",
  },
  SERVICE: {
    NOT_FOUND: "Service not found",
    ALREADY_EXISTS: "Service with this name already exists",
    HAS_ACTIVE_BOOKINGS: "Cannot delete service with active bookings",
  },
  ROLE: {
    NOT_FOUND: "ROLE NOT FOUND",
    NOT_ALLOWED_FOR_MANAGER: "Role not allowed for manager",
    NOT_ALLOWED_FOR_STYLIST: "Role not allowed for stylist",
    NOT_ALLOWED_FOR_CUSTOMER: "Role not allowed for customer",
    YOU_ARE_NOT_ADMIN: "You are not an admin",
  },
  OTP: {
    INVALID_OR_EXPIRED: "OTP is invalid or expired",
    EMAIL_SEND_FAILED: "Unable to send OTP email",
  },
  MANAGER: {
    NOT_FOUND: "Manager not found",
    SALON_NOT_FOUND: "Salon not found for the manager",
  },
  CUSTOMER: {
    NOT_FOUND: "Customer not found",
  },
  STYLIST: {
    NOT_FOUND: "Stylist not found",
    SALON_NOT_ASSIGNED: "Stylist is not assigned to any salon",
    ALREADY_EXISTS: "Stylist already exists",
  },
  NOTIFICATION: {
    NOT_FOUND: "Notification not found.",
    NOT_OWNER: "You do not have permission to access this notification.",
  },
  BOOKING: {
    TIME_SLOT_ALREADY_BOOKED:
      "One or more time slots have already been booked. Please select different slots.",
    NOT_FOUND: "Booking not found",
    NOT_OWNER: "You do not have permission to operate on this booking",
    FORBIDDEN_VIEW: "You do not have permission to view this list of bookings",
    NO_TIMESLOT: "Booking has no timeslot",
    ONLY_PENDING_CAN_CANCEL: "Only pending bookings can be cancelled",
    INVALID_STATUS_FOR_STYLIST: "Invalid status for stylist",
    ROLE_NOT_ALLOWED_UPDATE_STATUS:
      "This role is not allowed to update booking status",
    NOT_CONSECUTIVE_TIMESLOTS: "The timeslots must be consecutive",
  },
  DAY_OFF: {
    NOT_FOUND: "Day off request not found.",
    NOT_OWNER: "You do not have permission to access this day off request.",
    NOT_STYLIST: "Only stylists can manage day off requests.",
    ALREADY_APPROVED_OR_REJECTED:
      "Cannot cancel a day off request that is already approved or rejected.",
    CANCELLATION_FAILED: "Failed to cancel day off request.",
    DATE_CONFLICT: "Day off request conflicts with existing day off.",
    NOT_MANAGER_FOR_STYLIST:
      "You do not have permission to approve/reject this stylist's day off request.",
    INVALID_STATUS_UPDATE: "Invalid status update. Request must be pending.",
    PAST_DATE_NOT_ALLOWED: "Cannot request day off for past dates.", // mới, thay cho hardcode ở createDayOffRequest
    CANCEL_SUCCESS: "Day off request cancelled successfully.", // mới, thay cho message trả về ở cancelDayOffRequest
  },
  FAVORITE: {
    STYLIST_NOT_FOUND: "Stylist not found.",
    ALREADY_FAVORITED: "Stylist is already in your favorites.",
    NOT_FAVORITED: "Stylist is not in your favorites.",
  },
};
