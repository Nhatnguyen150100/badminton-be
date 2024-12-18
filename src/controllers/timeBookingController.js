import timeBookingService from "../services/timeBookingService";

const timeBookingController = {
  getListTimeBookings: async (req, res) => {
    try {
      const { id } = req.params;
      const rs = await timeBookingService.getListTimeBookings(id, req.query);
      res.status(rs.status).json(rs);
    } catch (error) {
      res.status(error.status).json(error);
    }
  },
  createTimeBooking: async (req, res) => {
    try {
      const { badmintonCourtId, startTime, endTime } = req.body;
      const rs = await timeBookingService.createTimeBooking(
        badmintonCourtId,
        startTime,
        endTime
      );
      res.status(rs.status).json(rs);
    } catch (error) {
      res.status(error.status).json(error);
    }
  },
  updateTimeBooking: async (req, res) => {
    try {
      const { id } = req.params;
      const { startTime, endTime } = req.body;
      const rs = await timeBookingService.updateTimeBooking(
        id,
        startTime,
        endTime
      );
      res.status(rs.status).json(rs);
    } catch (error) {
      res.status(error.status).json(error);
    }
  },
  deleteTimeBooking: async (req, res) => {
    try {
      const { id } = req.params;
      const { message } = await timeBookingService.deleteTimeBooking(id);
      res.status(200).json({ message });
    } catch (error) {
      res.status(error.status).json(error);
    }
  },
};

export default timeBookingController;
