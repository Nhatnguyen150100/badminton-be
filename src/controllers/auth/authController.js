"use strict";
import logger from "../../config/winston";
import authService from "../../services/auth/authService";
import tokenService from "../../services/token/tokenService";

const authController = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const rs = await authService.login(email, password);
      if (!rs.data) {
        return res.status(rs.status).json({ message: rs.message });
      }
      const accessToken = tokenService.generateToken(rs.data);
      res.status(rs.status).json({
        message: rs.message,
        data: { ...rs.data, accessToken: accessToken },
      });
    } catch (error) {
      logger.error(error.message);
      res.status(error.status).json(error);
    }
  },
  register: async (req, res) => {
    try {
      const { email, password } = req.body;
      const rs = await authService.register(email, password);
      res.status(rs.status).json(rs);
    } catch (error) {
      logger.error(error.message);
      res.status(error.status).json(error);
    }
  },
};

export default authController;
