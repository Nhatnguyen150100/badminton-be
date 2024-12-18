import { BaseErrorResponse, BaseSuccessResponse } from "../config/baseReponse";
import logger from "../config/winston";
import db from "../models";

const badmintonGatherCommentService = {
  createComment: (data) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { userId, badmintonGatherId, comment } = data;
        const created = await db.BadmintonGatherComment.create({
          userId,
          badmintonGatherId,
          comment,
        });
        if (created) {
          return resolve(
            new BaseSuccessResponse({
              data: created,
              message: "Thêm bình luận thành công",
            })
          );
        }
        return reject(
          new BaseErrorResponse({
            message: "Thêm bình luận thất bại",
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
  getCommentByGatherId: (badmintonGatherId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const comments = await db.BadmintonGatherComment.findAll({
          include: [
            {
              model: db.User,
              as: "user",
              required: false,
            },
          ],
          where: { badmintonGatherId },
        });
        if (comments) {
          return resolve(
            new BaseSuccessResponse({
              data: comments,
              message: "Lấy bình luận thành công",
            })
          );
        }
        return reject(
          new BaseErrorResponse({
            message: "Lấy bình luận thất bại",
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

export default badmintonGatherCommentService;
