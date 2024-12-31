import { Op, Sequelize } from "sequelize";
import {
  BaseErrorResponse,
  BaseResponseList,
  BaseSuccessResponse,
} from "../config/baseReponse";
import { DEFINE_STATUS_RESPONSE } from "../config/statusResponse";
import logger from "../config/winston";
import { DEFINE_STATUS, TRANSACTION_TYPE } from "../constants/status";
import db from "../models";
import onRemoveParams from "../utils/remove-params";
import dayjs from "dayjs";

const convertTime = (time) => {
  return dayjs(time, "HH:mm").minute() + dayjs(time, "HH:mm").hour() * 60;
};

const badmintonGatherBookingService = {
  createGatherBooking: (badmintonGatherId, data) => {
    return new Promise(async (resolve, reject) => {
      try {
        const badmintonGather = await db.BadmintonGather.findByPk(
          badmintonGatherId
        );
        if (dayjs(badmintonGather.appointmentDate).isBefore(dayjs(), "day")) {
          return reject(
            new BaseErrorResponse({
              message: "Ngày đặt lịch đã qua",
            })
          );
        }
        const { userId, numberMale, numberFemale, note } = data;
        if (
          numberMale > badmintonGather.totalMale ||
          numberFemale > badmintonGather.totalFemale
        ) {
          return reject(
            new BaseErrorResponse({
              message: "Số người tham gia vượt quá số người đã đăng ký",
            })
          );
        }
        const checkIsBooking = await db.BadmintonGatherBooking.findOne({
          where: {
            userId,
            badmintonGatherId,
          },
        });
        if (checkIsBooking) {
          return reject(
            new BaseErrorResponse({
              message: "Bạn đã đặt lịch này",
            })
          );
        }
        const checkSchedule = await db.BadmintonGatherBooking.findAll({
          include: [
            {
              model: db.BadmintonGather,
              as: "badmintonGather",
              attributes: ["startTime", "endTime", "appointmentDate"],
              required: true,
            },
          ],
          attributes: [],
          raw: true,
          nest: true,
          where: {
            badmintonGatherId,
            status: {
              [Op.ne]: "CANCELLED",
            },
          },
        });
        checkSchedule
          .map((_item) => _item.badmintonGather)
          .map((_item) => {
            const { startTime, endTime, appointmentDate } = _item;
            if (
              dayjs(badmintonGather).isSame(dayjs(appointmentDate)) &&
              convertTime(startTime) <= convertTime(badmintonGather.endTime) &&
              convertTime(endTime) >= convertTime(badmintonGather.startTime)
            ) {
              return reject(
                new BaseErrorResponse({
                  message: "Bạn đã đặt 1 lịch tại khung giờ này trước đó",
                })
              );
            }
          });
        const created = await db.BadmintonGatherBooking.create({
          badmintonGatherId,
          userId,
          numberMale,
          numberFemale,
          note,
        });
        if (created) {
          return resolve(
            new BaseSuccessResponse({
              data: created,
              message: "Gửi thông tin tham gia thành công",
            })
          );
        }
        return reject(
          new BaseErrorResponse({
            message: "Gửi thông tin tham gia thất bại",
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
  acceptGatherBooking: (gatherBookingId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const badmintonGather = await db.BadmintonGatherBooking.findOne({
          where: { id: gatherBookingId },
          raw: true,
          nest: true,
          include: [
            {
              model: db.BadmintonGather,
              as: "badmintonGather",
            },
          ],
        });
        if (
          badmintonGather.numberMale > badmintonGather.badmintonGather.totalMale
        ) {
          return reject(
            new BaseErrorResponse({
              message:
                "Số người nam đã đăng ký vượt quá số người tối đa cho phép",
            })
          );
        }
        if (
          badmintonGather.numberFemale >
          badmintonGather.badmintonGather.totalFemale
        ) {
          return reject(
            new BaseErrorResponse({
              message:
                "Số người nữ đã đăng ký vượt quá số người tối đa cho phép",
            })
          );
        }
        const status = DEFINE_STATUS.ACCEPTED;
        const updated = await db.BadmintonGatherBooking.update(
          { status },
          {
            where: { id: gatherBookingId },
          }
        );
        const updatedGather = await db.BadmintonGather.update(
          {
            totalMale:
              badmintonGather.badmintonGather.totalMale -
              badmintonGather.numberMale,
            totalFemale:
              badmintonGather.badmintonGather.totalFemale -
              badmintonGather.numberFemale,
          },
          {
            where: { id: badmintonGather.badmintonGather.id },
          }
        );
        const userOwnerId = badmintonGather.badmintonGather.userId;
        const userBookingId = badmintonGather.userId;
        const constPerMale = badmintonGather.badmintonGather.constPerMale;
        const constPerFemale = badmintonGather.badmintonGather.constPerFemale;
        const numberMale = badmintonGather.numberMale;
        const numberFemale = badmintonGather.numberFemale;

        const totalMoneyHavePay =
          (numberFemale ?? 0) * (constPerFemale ?? 0) +
          (numberMale ?? 0) * (constPerMale ?? 0);
        const userBookingInfo = await db.User.findByPk(userBookingId);
        if (userBookingInfo.accountBalance < totalMoneyHavePay) {
          return reject(
            new BaseErrorResponse({
              message: "Tài khoản của người đặt không đủ tiền để đăng ký",
            })
          );
        }
        await db.User.update(
          {
            accountBalance: Sequelize.literal(
              `accountBalance -${totalMoneyHavePay}`
            ),
          },
          {
            where: {
              id: userBookingId,
            },
          }
        );
        await db.User.update(
          {
            accountBalance: Sequelize.literal(
              `accountBalance + ${totalMoneyHavePay * 0.9}`
            ),
          },
          {
            where: {
              id: userOwnerId,
            },
          }
        );
        await db.User.update(
          {
            accountBalance: Sequelize.literal(
              `accountBalance + ${totalMoneyHavePay * 0.1}`
            ),
          },
          {
            where: {
              id: "d511aeab-f46d-248c-a29d-55ad1855651a",
            },
          }
        );
        await db.TransactionHistory.create({
          transactionUserId: userBookingId,
          receiveUserId: userOwnerId,
          transactionType: TRANSACTION_TYPE.GATHER_BOOKING,
          transactionAmount: totalMoneyHavePay,
          discountedAdmin: totalMoneyHavePay * 0.1,
        });
        if (updated[0] > 0 && updatedGather[0] > 0) {
          return resolve(
            new BaseSuccessResponse({
              message: `Chấp nhận người đặt lịch thành công. Bạn đã nhận được ${(
                totalMoneyHavePay * 0.9
              ).toLocaleString()} VND từ người đặt tương ứng 90% giá trị. (Hệ thống nhận chiết khấu 10%)`,
            })
          );
        }
        return reject(
          new BaseErrorResponse({
            message: "Chấp nhận thông tin tham gia thất bại",
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
  deniedGatherBooking: (gatherBookingId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const status = DEFINE_STATUS.DENIED;
        const deleted = await db.BadmintonGatherBooking.update(
          { status },
          {
            where: { id: gatherBookingId },
          }
        );
        if (deleted > 0) {
          return resolve(
            new BaseSuccessResponse({
              message: "Từ chối thông tin tham gia thành công",
            })
          );
        }
        return reject(
          new BaseErrorResponse({
            message: "Từ chối thông tin tham gia thất bại",
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
  getGatherBookingByUserId: (userId, data) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { page, limit } = data;
        let offset = page && limit ? (page - 1) * limit : undefined;
        let query = {
          userId,
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
        const result = await db.BadmintonGatherBooking.findAndCountAll({
          include: [
            {
              model: db.BadmintonGather,
              as: "badmintonGather",
              required: true,
              include: [
                {
                  model: db.User,
                  as: "user",
                  attributes: ["fullName", "email", "phoneNumber"],
                },
              ],
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
            message: "List of booking retrieved successfully",
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
  getGatherBookingByOwner: (badmintonGatherId, data) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { page, limit } = data;
        let offset = page && limit ? (page - 1) * limit : undefined;
        let query = {
          badmintonGatherId,
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
        const result = await db.BadmintonGatherBooking.findAndCountAll({
          ...option,
          include: [
            {
              model: db.User,
              as: "user",
              required: true,
            },
          ],
        });
        const list = result.rows;
        const totalCount = result.count;
        return resolve(
          new BaseResponseList({
            list,
            status: DEFINE_STATUS_RESPONSE.SUCCESS,
            totalCount,
            message: "List of booking retrieved successfully",
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

export default badmintonGatherBookingService;
