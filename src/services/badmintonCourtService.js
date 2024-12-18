import { Op, where } from "sequelize";
import logger from "../config/winston";
import onRemoveParams from "../utils/remove-params";
import { DEFINE_STATUS } from "../constants/status";
import {
  BaseErrorResponse,
  BaseResponse,
  BaseResponseList,
  BaseSuccessResponse,
} from "../config/baseReponse";
import { DEFINE_STATUS_RESPONSE } from "../config/statusResponse";
import groupAndMerge from "../utils/group-item";

const { default: db } = require("../models");

const badmintonCourtService = {
  getListBadmintonCourt: (data) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { page, limit, nameLike, district, ward } = data;
        let offset = page && limit ? (page - 1) * limit : undefined;
        let query = {
          status: DEFINE_STATUS.ACCEPTED,
        };
        if (nameLike) {
          query = {
            name: {
              [Op.like]: `%${nameLike}%`,
            },
          };
        }
        if (district) {
          query = {
            ...query,
            district,
          };
        }
        if (ward) {
          query = {
            ...query,
            ward,
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
        const result = await db.BadmintonCourt.findAndCountAll(option);
        const court = result.rows;
        const totalCount = result.count;
        return resolve(
          new BaseResponseList({
            list: court,
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
  getListBadmintonCourtAdmin: (data) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { page, limit, nameLike, status } = data;
        if (status && !Object.values(DEFINE_STATUS).includes(status)) {
          return reject(
            new BaseErrorResponse({
              message:
                "Invalid status. Please choose from accepted, pending, or rejected.",
            })
          );
        }
        let offset = page && limit ? (page - 1) * limit : undefined;
        let query = {};
        if (status) {
          query = {
            status,
          };
        }
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
        const result = await db.BadmintonCourt.findAndCountAll(option);
        const court = result.rows;
        const totalCount = result.count;
        return resolve(
          new BaseResponseList({
            list: court,
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
  getListBadmintonCourtManager: (userId, data) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { page, limit, nameLike, district, ward } = data;
        let offset = page && limit ? (page - 1) * limit : undefined;
        let query = {
          userId,
        };
        if (nameLike) {
          query = {
            ...query,
            name: {
              [Op.like]: `%${nameLike}%`,
            },
          };
        }
        if (district) {
          query = {
            ...query,
            district,
          };
        }
        if (ward) {
          query = {
            ...query,
            ward,
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
        const result = await db.BadmintonCourt.findAndCountAll(option);
        const court = result.rows;
        const totalCount = result.count;
        resolve(
          new BaseResponseList({
            list: court,
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
  getBadmintonCourt: (courtId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const courts = await db.BadmintonCourt.findAll({
          include: [
            {
              model: db.User,
              as: "user",
              required: false,
            },
          ],
          where: {
            id: courtId,
          },
          raw: true,
          nest: true,
        });
        const totalCourtNumber = await db.CourtNumber.count({where: {
          badmintonCourtId: courtId,
        }})
        if (courts[0]) {
          return resolve(
            new BaseSuccessResponse({
              data: {...courts[0], totalCourtNumber},
              message: "Badminton court found successfully",
            })
          );
        }
        return reject(
          new BaseErrorResponse({
            message: "Badminton court not found",
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
  createBadmintonCourt: (userId, data) => {
    return new Promise(async (resolve, reject) => {
      try {
        const {
          name,
          address,
          lang,
          lat,
          imageCourt,
          description,
          ward,
          district,
        } = data;
        const newCourt = await db.BadmintonCourt.create({
          userId,
          name,
          address,
          lang,
          lat,
          imageCourt,
          description,
          district,
          ward,
        });
        if (newCourt) {
          return resolve(
            new BaseSuccessResponse({
              data: newCourt,
              message: "Tạo thông tin sân cầu mới thành công",
            })
          );
        }
        return reject(
          new BaseErrorResponse({
            message: "Tạo thông tin sân cầu mới thất bại",
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
  updateBadmintonCourt: (courtId, data) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { name, address, lang, lat, imageCourt, description } = data;
        const updatedCourt = await db.BadmintonCourt.update(
          { name, address, lang, lat, imageCourt, description },
          { where: { id: courtId } }
        );
        if (updatedCourt) {
          return resolve(
            new BaseSuccessResponse({
              message: "Cập nhật thông tin sân cầu thành công",
            })
          );
        }
        return reject(
          new BaseErrorResponse({
            message: "Cập nhật thông tin sân cầu thất bại",
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
  changeStatusBadmintonCourt: (courtId, status) => {
    return new Promise(async (resolve, reject) => {
      try {
        const updatedStatus = await db.BadmintonCourt.update(
          { status },
          { where: { id: courtId } }
        );
        if (updatedStatus) {
          return resolve(
            new BaseSuccessResponse({
              message: "Thay đổi trạng thái thông tin sân thành công",
            })
          );
        }
        return reject(
          new BaseErrorResponse({
            message: "Failed to change status of badminton courts",
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
  deleteBadmintonCourt: (courtId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const deletedCourt = await db.BadmintonCourt.destroy({
          where: { id: courtId },
        });
        if (deletedCourt) {
          return resolve(
            new BaseSuccessResponse({
              data: deletedCourt,
              message: "Badminton court deleted successfully",
            })
          );
        }
        return reject(
          new BaseErrorResponse({
            message: "Failed to delete badminton court",
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

export default badmintonCourtService;
