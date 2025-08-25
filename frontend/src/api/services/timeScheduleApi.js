import axiosClient from "../axiosClient";

export const timeScheduleApi = {
  getAvailableTimeSlots: (stylistId, date) => {
    return axiosClient.get(
      `/time-schedules/stylist/${stylistId}/available-slots`,
      {
        params: { date },
      }
    );
  },

  getStylistSchedule: (stylistId, params = {}) => {
    return axiosClient.get(`/time-schedules/stylist/${stylistId}`, { params });
  },
};

export default timeScheduleApi;
