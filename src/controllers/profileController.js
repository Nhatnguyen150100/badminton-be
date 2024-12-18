import logger from "../config/winston";
import profileService from "../services/profileService";

const profileController = {
  updateProfile: async (req, res) => {
    try {
      const avatar = req.avatar;
      const { id } = req.params;
      const { fullName, gender, phoneNumber, accountBalance } = req.body;
      const rs = await profileService.updateProfile(
        id,
        fullName,
        gender,
        avatar,
        phoneNumber,
        accountBalance
      );
      res.status(rs.status).json(rs);
    } catch (error) {
      logger.error(error.message);
      res.status(error.status).json(rs.message);
    }
  },
  getProfile: async (req, res) => {
    try {
      const { id } = req.params;
      const rs = await profileService.getProfile(id);
      res.status(rs.status).json(rs);
    } catch (error) {
      logger.error(error.message);
      res.status(error.status).json(rs.message);
    }
  },
};

export default profileController;
