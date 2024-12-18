import { Op } from "sequelize";
import logger from "../config/winston";
import db from "../models";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import onRemoveParams from "../utils/remove-params";
import {
  BaseErrorResponse,
  BaseResponseList,
  BaseSuccessResponse,
} from "../config/baseReponse";
import { DEFINE_STATUS_RESPONSE } from "../config/statusResponse";
dayjs.extend(customParseFormat);

const scheduleService = {
  checkScheduleExist: (courtNumberId, timeBookingId, appointmentDate) => {
    return new Promise(async (resolve, reject) => {
      try {
        const exitsSchedule = await db.Schedule.findOne({
          where: {
            courtNumberId,
            timeBookingId,
            appointmentDate
          },
        });
        if (exitsSchedule) {
          resolve(true);
          return;
        }
        resolve(false);
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
  createSchedule: (
    badmintonCourtId,
    courtNumberId,
    timeBookingId,
    appointmentDate,
    constBooking
  ) => {
    return new Promise(async (resolve, reject) => {
      try {
        const isExist = await scheduleService.checkScheduleExist(
          courtNumberId,
          timeBookingId,
          appointmentDate
        );
        if (isExist) {
          return reject(
            new BaseErrorResponse({
              message: "Sân cầu này đã được tạo trước đó tại cùng 1 thời gian",
            })
          );
        }
        const data = {
          badmintonCourtId,
          courtNumberId,
          timeBookingId,
          appointmentDate: dayjs(appointmentDate).toDate(),
          constBooking,
        };
        const createdSchedule = await db.Schedule.create(data);
        if (createdSchedule) {
          return resolve(
            new BaseSuccessResponse({
              data: createdSchedule,
              message: "Tạo lịch thành công",
            })
          );
        }
        return reject(
          new BaseErrorResponse({
            message: "Tạo lịch thất bại",
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
  updatedSchedule: (
    scheduleId,
    courtNumberId,
    timeBookingId,
    appointmentDate,
    constBooking
  ) => {
    return new Promise(async (resolve, reject) => {
      try {
        const isExist = await scheduleService.checkScheduleExist(
          courtNumberId,
          timeBookingId,
          appointmentDate
        );
        if (!isExist) {
          return reject(
            new BaseErrorResponse({
              message: "Sân cầu này đã được tạo trước đó tại cùng 1 thời gian",
            })
          );
        }
        const updatedSchedule = await db.Schedule.update(
          {
            courtNumberId,
            timeBookingId,
            appointmentDate,
            constBooking,
          },
          {
            where: { id: scheduleId },
          }
        );
        if (updatedSchedule[0]) {
          return resolve(
            new BaseSuccessResponse({
              message: "Cập nhật lịch thành công",
            })
          );
        }
        return reject(
          new BaseErrorResponse({
            message: "Cập nhật lịch thất bại",
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
  deleteSchedule: (scheduleId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const deletedSchedule = await db.Schedule.destroy({
          where: { id: scheduleId },
        });
        if (deletedSchedule) {
          return resolve(
            new BaseSuccessResponse({
              data: deletedSchedule,
              message: "Xóa lịch thành công",
            })
          );
        }
        return reject(
          new BaseErrorResponse({
            message: "Xóa lịch thất bại",
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
  getListSchedule: (badmintonCourtId, data) => {
    return new Promise(async (resolve, reject) => {
      try {
        const {
          page,
          limit,
          nameLike,
          courtNumberId,
          timeBookingId,
          status,
          appointmentDate,
        } = data;
        let offset = page && limit ? (page - 1) * limit : undefined;
        let query = {
          badmintonCourtId,
        };
        if (status) {
          query = {
            ...query,
            status,
          };
        }
        if (appointmentDate) {
          query = {
            ...query,
            appointmentDate: dayjs(appointmentDate).toDate(),
          };
        }
        let queryCourtNumber = {};
        let queryTimeBooking = {};
        if (nameLike) {
          queryCourtNumber = {
            name: {
              [Op.like]: `%${nameLike}%`,
            },
          };
        }
        if (courtNumberId) {
          queryCourtNumber = {
            ...queryCourtNumber,
            id: courtNumberId,
          };
        }
        if (timeBookingId) {
          queryTimeBooking = {
            id: timeBookingId,
          };
        }
        const option = onRemoveParams(
          {
            include: [
              {
                model: db.CourtNumber,
                as: "courtNumber",
                attributes: ["name"],
                where: queryCourtNumber,
              },
              {
                model: db.TimeBooking,
                as: "timeBooking",
                attributes: ["startTime", "endTime"],
                where: queryTimeBooking,
              },
            ],
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
        const result = await db.Schedule.findAndCountAll(option);
        const schedules = result.rows;
        const totalCount = result.count;
        return resolve(
          new BaseResponseList({
            list: schedules,
            status: DEFINE_STATUS_RESPONSE.SUCCESS,
            totalCount,
            message: "List of schedule retrieved successfully",
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

export default scheduleService;
