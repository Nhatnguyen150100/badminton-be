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
      const { vnp_OrderInfo, vnp_TransactionStatus, vnp_Amount, secretToken } =
        req.query;
      if (vnp_TransactionStatus === "00") {
        await paymentService.updateUserAmount(
          vnp_OrderInfo,
          vnp_Amount / 100,
          secretToken
        );
        res.redirect(`${process.env.BASE_URL_CLIENT}/payment-success`);
      } else {
        res.redirect(`${process.env.BASE_URL_CLIENT}/payment-error`);
      }
    } catch (error) {
      res.status(error.status).json(error.message);
    }
  },
};

export default paymentController;
