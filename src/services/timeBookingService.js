import { Op, where } from "sequelize";
import {
  BaseErrorResponse,
  BaseResponseList,
  BaseSuccessResponse,
} from "../config/baseReponse";
import { DEFINE_STATUS_RESPONSE } from "../config/statusResponse";
import db from "../models";
import onRemoveParams from "../utils/remove-params";
import logger from "../config/winston";

const timeBookingService = {
  getListTimeBookings: (badmintonCourtId, data) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { page, limit } = data;
        let offset = page && limit ? (page - 1) * limit : undefined;
        let query = {
          badmintonCourtId,
        };
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
        const result = await db.TimeBooking.findAndCountAll(option);
        const timeBookings = result.rows;
        const totalCount = result.count;
        return resolve(
          new BaseResponseList({
            list: timeBookings,
            status: DEFINE_STATUS_RESPONSE.SUCCESS,
            totalCount,
            message: "List of time bookings retrieved successfully",
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
  createTimeBooking: (badmintonCourtId, startTime, endTime) => {
    return new Promise(async (resolve, reject) => {
      try {
        const timeBookingData = { badmintonCourtId, startTime, endTime };
        const timeBooking = await db.TimeBooking.create(timeBookingData);
        return resolve(
          new BaseSuccessResponse({
            data: timeBooking,
            message: "Thêm thời gian mới thành công",
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
  updateTimeBooking: (timeBookingId, startTime, endTime) => {
    return new Promise(async (resolve, reject) => {
      try {
        const data = { startTime, endTime };
        const timeBooking = await db.TimeBooking.findByPk(timeBookingId, {
          raw: true,
        });
        if (!timeBooking) {
          reject(
            new BaseErrorResponse({
              message: "Time booking not found",
            })
          );
        }
        const updated = await db.TimeBooking.update(data, {
          where: {
            id: timeBookingId,
          },
        });
        if (updated) {
          return resolve(
            new BaseSuccessResponse({
              message: "Cập nhật thời gian thành công",
            })
          );
        }
        return reject(
          new BaseErrorResponse({
            message: "Cập nhật thời gian thất bại",
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
  deleteTimeBooking: (timeBookingId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const timeBooking = await db.TimeBooking.findByPk(timeBookingId);
        if (!timeBooking) {
          return resolve(
            new BaseErrorResponse({
              message: "Không tìm thấy thời gian phù hợp",
            })
          );
        }
        await db.TimeBooking.destroy({
          where: {
            id: timeBookingId,
          },
        });
        return resolve(
          new BaseSuccessResponse({
            message: "Xóa thời gian thành công",
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

export default timeBookingService;
