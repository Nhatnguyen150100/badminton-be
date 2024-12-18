"use strict";

import { BaseErrorResponse, BaseResponseList } from "../config/baseReponse";
import { DEFINE_STATUS_RESPONSE } from "../config/statusResponse";
import logger from "../config/winston";
import db from "../models";
import onRemoveParams from "../utils/remove-params";

const transactionHistoryService = {
  getAllTransactions: (data) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { page, limit, transactionType } = data;
        let offset = page && limit ? (page - 1) * limit : undefined;
        let query = {
          transactionType,
        };
        const option = onRemoveParams(
          {
            where: onRemoveParams(query, [0]),
            limit: Number(limit),
            offset,
            order: [["createdAt", "DESC"]],
            raw: true,
            nest: true,
            distinct: true,
          },
          [0]
        );
        const result = await db.TransactionHistory.findAndCountAll({
          include: [
            {
              model: db.User,
              as: "transactionUser",
            },
            {
              model: db.User,
              as: "receiveUser",
            },
          ],
          ...option,
        });
        const list = result.rows;
        const totalCount = result.count;
        return resolve(
          new BaseResponseList({
            list,
            status: DEFINE_STATUS_RESPONSE.SUCCESS,
            totalCount,
            message: "Lấy danh sách lịch sử giao dịch thành công",
          })
        );
      } catch (error) {
        logger.error(error.message);
        reject(
          new BaseErrorResponse({
            message: error.message,
          })
        );
      }
    });
  },
};

export default transactionHistoryService;
