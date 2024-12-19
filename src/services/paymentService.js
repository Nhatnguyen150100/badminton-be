"use strict";
import db from "../models";
import * as crypto from "crypto";
import * as queryString from "qs";
import { BaseErrorResponse, BaseSuccessResponse } from "../config/baseReponse";
import logger from "../config/winston";
import bcrypt from "bcrypt";
import { Sequelize } from "sequelize";
import dayjs from "dayjs";

function generateSignature(queryString, hashSecret) {
  const hmac = crypto.createHmac("sha512", hashSecret);
  hmac.update(Buffer.from(queryString, "utf-8"));
  const hashCode = hmac.digest("hex");
  return hashCode;
}

function sortObject(obj) {
  const sorted = {};
  const str = [];

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }

  str.sort();
  for (const key of str) {
    sorted[key] = encodeURIComponent(obj[key]).replace(/%20/g, "+");
  }

  return sorted;
}

const paymentService = {
  createPayment: (userId, amount) => {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await db.User.findOne({
          where: { id: userId },
        });
        const secretToken = bcrypt.hash(process.env.VN_PAY_HASH_KEY, 10);
        const merchantId = process.env.VN_PAY_MERCHANT_ID;
        const hashSecret = process.env.VN_PAY_HASH_SECRET;
        const vnPayUrl = process.env.VN_PAY_URL;
        const date = new Date();
        const createDate = dayjs(date).format("YYYYMMDDHHmmss");

        const vnpParams = {
          vnp_Version: "2.1.0",
          vnp_Command: "pay",
          vnp_TmnCode: merchantId,
          vnp_Amount: amount * 100,
          vnp_CreateDate: createDate,
          vnp_CurrCode: "VND",
          vnp_IpAddr: "127.0.0.1",
          vnp_Locale: "vn",
          vnp_OrderInfo: user.email,
          vnp_OrderType: "billpayment",
          vnp_ReturnUrl: `${process.env.BASE_URL_SERVER}/v1/payment/update-user-amount/${userId}?amount=${amount}&secretToken=${secretToken}`,
          vnp_TxnRef: dayjs(date).format("DDHHmmss"),
        };

        const sortedKeys = sortObject(vnpParams);
        let signData = queryString.stringify(sortedKeys, { encode: false });
        const signature = generateSignature(signData, hashSecret);
        const paymentUrl = `${vnPayUrl}?${queryString.stringify(sortedKeys, {
          encode: false,
        })}&vnp_SecureHash=${signature}`;

        return resolve(
          new BaseSuccessResponse({
            data: paymentUrl,
            message: "Tạo thông tin thanh toán thành công",
          })
        );
      } catch (error) {
        logger.error(error.message);
        return reject(
          new BaseErrorResponse({
            message: error.message,
          })
        );
      }
    });
  },
  updateUserAmount: (userId, amount, secretToken) => {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await db.User.findOne({
          where: { id: userId },
        });
        if (!user) {
          return reject(
            new BaseErrorResponse({
              message: "Không tìm thấy người dùng",
            })
          );
        }
        const validHashKey = bcrypt.compare(
          secretToken,
          process.env.VN_PAY_HASH_KEY
        );
        if (!validHashKey) {
          return reject(
            new BaseErrorResponse({
              message: "Mã xác thực không chính xác",
            })
          );
        }
        await db.User.update(
          {
            accountBalance: Sequelize.literal(`accountBalance + ${amount}`),
          },
          {
            where: {
              id: userId,
            },
          }
        );
        return resolve(
          new BaseSuccessResponse({
            message: "Cập nhật tài khoản người dùng thành công",
          })
        );
      } catch (error) {
        logger.error(error.message);
        return reject(
          new BaseErrorResponse({
            message: error.message,
          })
        );
      }
    });
  },
};

export default paymentService;
