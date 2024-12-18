"use strict";

import transactionHistoryService from "../services/transactionHistoryService";

const transactionHistoryController = {
  getAllTransactions: async (req, res) => {
    try {
      const rs = await transactionHistoryService.getAllTransactions(req.query);
      res.status(rs.status).json(rs);
    } catch (error) {
      res.status(error.status).json(error);
    }
  },
};

export default transactionHistoryController;
