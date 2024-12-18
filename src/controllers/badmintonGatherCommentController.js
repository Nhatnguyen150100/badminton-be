import badmintonGatherCommentService from "../services/badmintonGatherCommentService";

const badmintonGatherCommentController = {
  createComment: async (req, res) => {
    try {
      const rs = await badmintonGatherCommentService.createComment(req.body);
      res.status(rs.status).json(rs);
    } catch (error) {
      res.status(error.status).json(error.message);
    }
  },
  getCommentByGatherId: async (req, res) => {
    try {
      const { id } = req.params;
      const rs = await badmintonGatherCommentService.getCommentByGatherId(id);
      res.status(rs.status).json(rs);
    } catch (error) {
      res.status(error.status).json(rs.message);
    }
  },
};

export default badmintonGatherCommentController;
