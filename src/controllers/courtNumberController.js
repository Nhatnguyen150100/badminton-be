import courtNumberService from "../services/courtNumberService";

const courtNumberController = {
  getListCourtNumbers: async (req, res) => {
    try {
      const { id } = req.params;
      const rs = await courtNumberService.getListCourtNumber(id, req.query);
      res.status(rs.status).json(rs);
    } catch (error) {
      res.status(error.status).json(error);
    }
  },
  createCourtNumber: async (req, res) => {
    try {
      const { badmintonCourtId, name } = req.body;
      const rs = await courtNumberService.createCourtNumber(
        badmintonCourtId,
        name
      );
      res.status(rs.status).json(rs);
    } catch (error) {
      res.status(error.status).json(error);
    }
  },
  updateCourtNumber: async (req, res) => {
    try {
      const { id } = req.params;
      const { name } = req.body;
      const rs = await courtNumberService.updateCourtNumber(id, name);
      res.status(rs.status).json(rs);
    } catch (error) {
      res.status(error.status).json(error);
    }
  },
  deleteCourtNumber: async (req, res) => {
    try {
      const { id } = req.params;
      const rs = await courtNumberService.deleteCourtNumber(id);
      res.status(rs.status).json(rs);
    } catch (error) {
      res.status(error.status).json(error);
    }
  },
};

export default courtNumberController;
