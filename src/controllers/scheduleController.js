import scheduleService from "../services/scheduleService";

const scheduleController = {
  getListSchedule: async (req, res) => {
    try {
      const { id } = req.params;
      const rs = await scheduleService.getListSchedule(id, req.query);
      res.status(rs.status).json(rs);
    } catch (error) {
      res.status(error.status).json(error);
    }
  },
  createSchedule: async (req, res) => {
    try {
      const {
        badmintonCourtId,
        courtNumberId,
        timeBookingId,
        appointmentDate,
        constBooking,
      } = req.body;
      if (!badmintonCourtId) {
        return res
          .status(400)
          .json({ message: "badminton courtId is required" });
      }
      if (!courtNumberId) {
        return res.status(400).json({ message: "courtNumberId is required" });
      }
      if (!timeBookingId) {
        return res.status(400).json({ message: "timeBookingId is required" });
      }
      if (!appointmentDate) {
        return res.status(400).json({ message: "appointmentDate is required" });
      }
      if (!constBooking) {
        return res.status(400).json({ message: "constBooking is required" });
      }
      const rs = await scheduleService.createSchedule(
        badmintonCourtId,
        courtNumberId,
        timeBookingId,
        appointmentDate,
        constBooking
      );
      res.status(rs.status).json(rs);
    } catch (error) {
      res.status(error.status).json(error);
    }
  },
  updatedSchedule: async (req, res) => {
    try {
      const { id } = req.params;
      const { courtNumberId, timeBookingId, appointmentDate, constBooking } =
        req.body;
      const rs = await scheduleService.updatedSchedule(
        id,
        courtNumberId,
        timeBookingId,
        appointmentDate,
        constBooking
      );
      res.status(rs.status).json(rs);
    } catch (error) {
      res.status(error?.status ?? 500).json({ message: error.message });
    }
  },
  deleteSchedule: async (req, res) => {
    try {
      const { id } = req.params;
      const rs = await scheduleService.deleteSchedule(id);
      res.status(rs.status).json(rs);
    } catch (error) {
      res.status(error.status).json(error);
    }
  },
};

export default scheduleController;
