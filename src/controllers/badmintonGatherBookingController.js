import badmintonGatherBookingService from "../services/badmintonGatherBookingService";

const badmintonGatherBookingController = {
  createGatherBooking: async (req, res) => {
    try {
      const { badmintonGatherId, ...data } = req.body;
      const rs = await badmintonGatherBookingService.createGatherBooking(
        badmintonGatherId,
        data
      );
      res.status(rs.status).json(rs);
    } catch (error) {
      res.status(error.status).json(error.message);
    }
  },
  acceptGatherBooking: async (req, res) => {
    try {
      const { id } = req.params;
      const rs = await badmintonGatherBookingService.acceptGatherBooking(id);
      res.status(rs.status).json(rs);
    } catch (error) {
      res.status(error.status).json(error.message);
    }
  },
  deniedGatherBooking: async (req, res) => {
    try {
      const { id } = req.params;
      const rs = await badmintonGatherBookingService.deniedGatherBooking(id);
      res.status(rs.status).json(rs);
    } catch (error) {
      res.status(error.status).json(error.message);
    }
  },
  getGatherBookingByOwner: async (req, res) => {
    try {
      const { id } = req.params;
      const rs = await badmintonGatherBookingService.getGatherBookingByOwner(
        id,
        req.query
      );
      res.status(rs.status).json(rs);
    } catch (error) {
      res.status(error.status).json(error.message);
    }
  },
  getGatherBookingByUserId: async (req, res) => {
    try {
      const { id } = req.params;
      const rs = await badmintonGatherBookingService.getGatherBookingByUserId(
        id,
        req.query
      );
      res.status(rs.status).json(rs);
    } catch (error) {
      res.status(error.status).json(error.message);
    }
  },
};

export default badmintonGatherBookingController;
