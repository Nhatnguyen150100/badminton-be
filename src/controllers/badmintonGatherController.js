import badmintonGatherService from "../services/badmintonGatherService";

const badmintonGatherController = {
  createBadmintonGather: async (req, res) => {
    try {
      const {
        userId,
        nameClub,
        description,
        badmintonCourtName,
        courtNumber,
        startTime,
        endTime,
        appointmentDate,
        totalMale,
        lang,
        lat,
        totalFemale,
        constPerMale,
        constPerFemale,
        district,
        ward,
        address,
        level,
        imgCourt: imgCourtReq
      } = req.body;
      const imgCourt = imgCourtReq ?? req.imgCourt;
      const rs = await badmintonGatherService.createBadmintonGather({
        userId,
        nameClub,
        description,
        badmintonCourtName,
        courtNumber,
        startTime,
        endTime,
        appointmentDate,
        totalMale,
        lang,
        lat,
        totalFemale,
        constPerMale,
        constPerFemale,
        district,
        ward,
        address,
        level,
        imgCourt,
      });
      res.status(rs.status).json(rs);
    } catch (error) {
      res.status(error.status).json(error.message);
    }
  },
  updateBadmintonGather: async (req, res) => {
    try {
      const { id } = req.params;
      const {
        nameClub,
        description,
        badmintonCourtName,
        courtNumber,
        startTime,
        endTime,
        appointmentDate,
        totalMale,
        lang,
        lat,
        totalFemale,
        constPerMale,
        constPerFemale,
        district,
        ward,
        address,
        level,
        imgCourt: imgCourtReq
      } = req.body;
      const imgCourt = imgCourtReq ?? req.imgCourt;
      const rs = await badmintonGatherService.updateBadmintonGather(id, {
        nameClub,
        description,
        badmintonCourtName,
        courtNumber,
        startTime,
        endTime,
        appointmentDate,
        totalMale,
        lang,
        lat,
        totalFemale,
        constPerMale,
        constPerFemale,
        level,
        district,
        ward,
        address,
        imgCourt,
      });
      res.status(rs.status).json(rs);
    } catch (error) {
      res.status(error.status).json(error.message);
    }
  },
  deleteBadmintonGather: async (req, res) => {
    try {
      const { id } = req.params;
      const rs = await badmintonGatherService.deleteBadmintonGather(id);
      res.status(rs.status).json(rs);
    } catch (error) {
      res.status(error.status).json(error.message);
    }
  },
  getListBadmintonGathersByUserId: async (req, res) => {
    try {
      const { id } = req.params;
      const rs = await badmintonGatherService.getListBadmintonGathersByUserId(
        id,
        req.query
      );
      res.status(rs.status).json(rs);
    } catch (error) {
      res.status(error.status).json(error.message);
    }
  },
  getBadmintonGatherDetail: async (req, res) => {
    try {
      const { id } = req.params;
      const rs = await badmintonGatherService.getBadmintonGatherDetail(id);
      res.status(rs.status).json(rs);
    } catch (error) {
      res.status(error.status).json(error.message);
    }
  },
  getListBadmintonGather: async (req, res) => {
    try {
      const rs = await badmintonGatherService.getListBadmintonGather(req.query);
      res.status(rs.status).json(rs);
    } catch (error) {
      res.status(error.status).json(error.message);
    }
  },
};

export default badmintonGatherController;
