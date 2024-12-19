"use strict";

import paymentService from "../services/paymentService";

const paymentController = {
  createPayment: async (req, res) => {
    try {
      const { id, amount } = req.body;
      const rs = await paymentService.createPayment(id, amount);
      res.status(rs.status).json(rs);
    } catch (error) {
      res.status(error.status).json(error.message);
    }
  },
  updateUserAmount: async (req, res) => {
    try {
      const { id } = req.params;
      const { amount } = req.query;
      const rs = await paymentService.updateUserAmount(id, amount);
      res.status(rs.status).json(rs);
    } catch (error) {
      res.status(error.status).json(error.message);
    }
  }
};

export default paymentController;
