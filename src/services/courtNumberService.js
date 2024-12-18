import { Op } from "sequelize";
import onRemoveParams from "../utils/remove-params";
import {
  BaseErrorResponse,
  BaseResponseList,
  BaseSuccessResponse,
} from "../config/baseReponse";
import { DEFINE_STATUS_RESPONSE } from "../config/statusResponse";

const { default: logger } = require("../config/winston");
const { default: db } = require("../models");

const courtNumberService = {
  getListCourtNumber: (badmintonCourtId, data) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { page, limit, nameLike } = data;
        let offset = page && limit ? (page - 1) * limit : undefined;
        let query = {
          badmintonCourtId,
        };
        if (nameLike) {
          query = {
            ...query,
            name: {
              [Op.like]: `%${nameLike}%`,
            },
          };
        }
        const option = onRemoveParams(
          {
            where: query,
            limit: Number(limit),
            offset,
            order: [["createdAt", "DESC"]],
            raw: true,
            nest: true,
            distinct: true,
          },
          [0]
        );
        const result = await db.CourtNumber.findAndCountAll(option);
        const courtNumbers = result.rows;
        const totalCount = result.count;
        return resolve(
          new BaseResponseList({
            list: courtNumbers,
            status: DEFINE_STATUS_RESPONSE.SUCCESS,
            totalCount,
            message: "List of courts retrieved successfully",
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
  createCourtNumber: (badmintonCourtId, name) => {
    return new Promise(async (resolve, reject) => {
      try {
        const courtNumberData = { badmintonCourtId, name };
        const newCourtNumber = await db.CourtNumber.create(courtNumberData);
        return resolve(
          new BaseSuccessResponse({
            data: newCourtNumber,
            message: "Thêm sân cầu mới thành công",
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
  updateCourtNumber: (courtNumberId, name) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await courtNumberService.getCourtNumber(courtNumberId);
        if (!data) {
          reject(
            new BaseErrorResponse({
              message: "Court number not found",
            })
          );
        }
        const updatedCourtNumber = await db.CourtNumber.update(
          { name },
          { where: { id: courtNumberId } }
        );
        if (updatedCourtNumber) {
          return resolve(
            new BaseSuccessResponse({
              message: "Cập nhật sân cầu thành công",
            })
          );
        } else {
          reject(
            new BaseErrorResponse({
              message: "Cập nhật sân cầu thất bại",
            })
          );
        }
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
  getCourtNumber: (courtNumberId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const courtNumber = await db.CourtNumber.findByPk(courtNumberId, {
          raw: true,
        });
        if (courtNumber) {
          resolve({
            data: courtNumber,
            message: "Court number found successfully",
          });
        } else {
          reject({
            data: null,
            message: "Court number not found",
          });
        }
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
  deleteCourtNumber: (courtNumberId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await courtNumberService.getCourtNumber(courtNumberId);
        if (!data) {
          return resolve(
            new BaseErrorResponse({
              message: "Không tìm thấy sân cầu",
            })
          );
        }
        const deletedCourtNumber = await db.CourtNumber.destroy({
          where: { id: courtNumberId },
        });
        if (deletedCourtNumber) {
          return resolve(
            new BaseSuccessResponse({
              message: "Xóa sân cầu thành công",
            })
          );
        } else {
          return resolve(
            new BaseErrorResponse({
              message: "Xóa sân cầu thất bại",
            })
          );
        }
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

export default courtNumberService;
