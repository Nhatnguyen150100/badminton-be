const { default: logger } = require("../config/winston");
const {
  default: badmintonCourtService,
} = require("../services/BadmintonCourtService");

const badmintonCourtMiddleware = {
  checkCourtOwner: async (req, res, next) => {
    try {
      const { id: userId } = req.user;
      const { id } = req.params;
      const { data } = await badmintonCourtService.getBadmintonCourt(id);
      req.imageCourt = data.imageCourt;
      if (data.userId === userId) next();
      else {
        return res
          .status(403)
          .json({ message: "You are not authorized to access this court" });
      }
    } catch (error) {
      logger.error(error.message);
      res.status(500).json({ message: "Server error" });
    }
  },
};

export default badmintonCourtMiddleware;
