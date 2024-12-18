import badmintonCourtService from "../services/badmintonCourtService";

const { DEFINE_STATUS } = require("../constants/status");

const badmintonCourtController = {
  getListBadmintonCourt: async (req, res) => {
    try {
      const rs = await badmintonCourtService.getListBadmintonCourt(req.query);
      res.status(rs.status).json(rs);
    } catch (error) {
      res.status(error.status).json(error);
    }
  },
  getListBadmintonCourtAdmin: async (req, res) => {
    try {
      const rs = await badmintonCourtService.getListBadmintonCourtAdmin(
        req.query
      );
      res.status(rs.status).json(rs);
    } catch (error) {
      res.status(error.status).json(error);
    }
  },
  getListBadmintonCourtManager: async (req, res) => {
    try {
      const { id } = req.params;
      const rs = await badmintonCourtService.getListBadmintonCourtManager(
        id,
        req.query
      );
      res.status(rs.status).json(rs);
    } catch (error) {
      res.status(error.status).json(error);
    }
  },
  createBadmintonCourt: async (req, res) => {
    try {
      const { userId, ...resData } = req.body;
      const imageCourt = req.imageCourt;
      const rs = await badmintonCourtService.createBadmintonCourt(userId, {
        ...resData,
        imageCourt,
      });
      res.status(rs.status).json(rs);
    } catch (error) {
      res.status(error.status).json(error);
    }
  },
  getBadmintonCourt: async (req, res) => {
    try {
      const { id } = req.params;
      const rs = await badmintonCourtService.getBadmintonCourt(id);
      res.status(rs.status).json(rs);
    } catch (error) {
      res.status(error.status).json(error);
    }
  },
  updateBadmintonCourt: async (req, res) => {
    try {
      const { id } = req.params;
      const { message } = await badmintonCourtService.updateBadmintonCourt(
        id,
        req.body
      );
      res.status(200).json({ message });
    } catch (error) {
      res.status(error.status).json(error);
    }
  },
  changeStatusBadmintonCourt: async (req, res) => {
    try {
      const { status } = req.body;
      if (!Object.values(DEFINE_STATUS).includes(status)) {
        return res.status(400).json({
          message: `Invalid status, status include ${Object.values(
            DEFINE_STATUS
          ).join(" ,")}`,
        });
      }
      const { id } = req.params;
      const rs = await badmintonCourtService.changeStatusBadmintonCourt(
        id,
        status
      );
      res.status(rs.status).json(rs);
    } catch (error) {
      res.status(error.status).json(error);
    }
  },
  deleteBadmintonCourt: async (req, res) => {
    try {
      const { id } = req.params;
      const { message } = await badmintonCourtService.deleteBadmintonCourt(id);
      res.status(200).json({ message });
    } catch (error) {
      res.status(error.status).json(error);
    }
  },
};

export default badmintonCourtController;
