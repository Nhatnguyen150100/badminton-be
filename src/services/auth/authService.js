"use strict";
import bcrypt from "bcrypt";
import logger from "../../config/winston";
import db from "../../models";
import ROLE_DEFINE from "../../constants/role";
import {
  BaseErrorResponse,
  BaseSuccessResponse,
} from "../../config/baseReponse";
import generateRandomPassword from '../../utils/generate-password'

const authService = {
  login: (email, password) => {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await db.User.findOne({
          where: { email: email },
          raw: true,
        });
        if (!user || Object.keys(user).length === 0) {
          return resolve(
            new BaseErrorResponse({
              message: "Không tìm thấy tài khoản phù hợp. Hãy thử lại!",
            })
          );
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
          return resolve(
            new BaseErrorResponse({
              message: "Sai mật khẩu. Hãy thử lại!",
            })
          );
        } else {
          delete user.password;
          return resolve(
            new BaseSuccessResponse({
              data: user,
              message: "Đăng nhập thành công",
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
  loginByGoogle: (email, name, avatar) => {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await db.User.findOne({
          where: { email: email },
          raw: true,
        });
        if (!user || Object.keys(user).length === 0) {
          const hashedPassword = await bcrypt.hash(generateRandomPassword(8), 10);
          const newUser = await db.User.create({
            email,
            fullName: name,
            avatar,
            password: hashedPassword,
            role: ROLE_DEFINE.USER,
          });
          delete newUser.dataValues.password;
          return resolve(
            new BaseSuccessResponse({
              data: newUser.dataValues,
              message: "Đăng nhập thành công",
            })
          );
        }
        delete user.password;
        return resolve(
          new BaseSuccessResponse({
            data: user,
            message: "Đăng nhập thành công",
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
  register: (email, password) => {
    return new Promise(async (resolve, reject) => {
      try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await db.User.create({
          email: email,
          password: hashedPassword,
          role: ROLE_DEFINE.USER,
        });
        delete newUser.dataValues.password;
        return resolve(
          new BaseSuccessResponse({
            data: newUser,
            message: "Đăng kí thành công",
          })
        );
      } catch (error) {
        logger.error(error.parent);
        reject(
          new BaseErrorResponse({
            message: error.message,
          })
        );
      }
    });
  },
  checkUserExists: (email) => {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await db.User.findOne({
          where: { email: email },
        });
        if (user) {
          return resolve(
            new BaseSuccessResponse({
              data: true,
              message: "Email đã tồn tại",
            })
          );
        } else {
          return resolve(
            new BaseSuccessResponse({
              data: false,
              message: "Email chưa tồn tại",
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

export default authService;
