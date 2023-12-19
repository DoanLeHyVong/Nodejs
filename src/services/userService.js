import db from "../models/index";
import bcrypt from "bcryptjs";

let handeUserLogin = (email, password) => {
  return new Promise(async (resovle, reject) => {
    try {
      let userData = {};
      let isExist = await checkUserEmail(email);
      if (isExist) {
        let user = await db.User.findOne({
          attributes: [
            "id",
            "email",
            "password",
            "roleId",
            "firstName",
            "lastName",
          ],
          where: { email: email },
        });

        if (user) {
          let check = await bcrypt.compareSync(password, user.password);
          if (check) {
            userData.errCode = 0;
            userData.message = "Oke";
            userData.user = user;
          } else {
            userData.errCode = 1;
            userData.message = "Wrong password";
          }
        } else {
          userData.errCode = 3;
          userData.message = "User not found";
        }
      } else {
        userData.errCode = 2;
        userData.message = "Your's Email isn't exist in your system ";
      }
      resovle(userData);
    } catch (e) {
      reject(e);
    }
  });
};
let checkUserEmail = (userEmail) => {
  return new Promise(async (resovle, reject) => {
    try {
      let user = await db.User.findOne({
        where: { email: userEmail },
      });
      if (user) {
        resovle(true);
      } else {
        resovle(false);
      }
    } catch (e) {
      reject(e);
    }
  });
};
let getAllUsers = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = "";
      if (userId === "ALL") {
        users = await db.User.findAll({
          attributes: {
            exclude: ["password"],
          },
        });
      }
      if (userId && userId !== "ALL") {
        users = await db.User.findOne({
          where: { id: userId },
          attributes: {
            exclude: ["password"],
          },
        });
      }
      resolve(users);
    } catch (e) {
      reject(e);
    }
  });
};
const dbCreateUser = async (data) => {
  try {
    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        if (data[key] === "" || data[key] === null) {
          return {
            errorCode: 1,
            message: `${
              key.charAt(0).toUpperCase() + key.slice(1)
            } không được để trống.`,
          };
        }
      }
    }
    const existingUser = await db.User.findOne({
      where: { email: data.email },
    });

    if (existingUser) {
      return { errorCode: 1, message: "Email đã tồn tại" };
    }

    bcrypt.genSalt(10, function (err, salt) {
      if (err) throw err;

      bcrypt.hash(data.password, salt, async function (err, hash) {
        if (err) throw err;

        console.log("data", data);
        console.log("hash", hash);

        await db.User.create({
          email: data.email,
          password: hash,
          firstName: data.firstName,
          lastName: data.lastName,
          address: data.address,
          phonenumber: data.phonenumber,
          gender: data.gender,
          roleId: data.role,
          positionId: data.position,
          image: data.avatar,
        });
      });
    });
    return { errorCode: 0, message: "Bạn đã tạo tài khoản thành công" };
  } catch (error) {
    // Handle any errors here
    console.error(error);
    return { errorCode: 2, message: "Lỗi trong quá trình tạo tài khoản" };
  }
};
let deleteUser = async (userId) => {
  try {
    const user = await db.User.findOne({
      where: { id: userId },
    });
    if (!user) {
      return {
        errorCode: 2,
        errorMessage: "Người dùng không tồn tại",
      };
    }
    await db.User.destroy({
      where: { id: userId },
    });
    return {
      errorCode: 0,
      message: "Người dùng đã bị xóa",
    };
  } catch (error) {
    console.error(error);
    return {
      errorCode: 1,
      message: "Lỗi trong quá trình xóa người dùng",
    };
  }
};
const updateUserData = async (data) => {
  try {
    if (!data.id) {
      return {
        errorCode: 2,
        errorMessage: "Missing sequired parameter",
      };
    }
    const user = await db.User.findOne({
      where: { id: data.id },
      raw: false,
    });
    if (user) {
      user.firstName = data.firstName;
      user.lastName = data.lastName;
      user.address = data.address;
      await user.save();
      return {
        errorCode: 0,
        message: "Cập nhật thông tin người dùng thành công",
      };
    } else {
      return {
        errorCode: 1,
        message: "Không tìm thấy người dùng",
      };
    }
  } catch (error) {
    console.error("Lỗi trong quá trình cập nhật thông tin người dùng:", error);
    return {
      errorCode: 3,
      errorMessage: "Lỗi trong quá trình cập nhật thông tin người dùng",
    };
  }
};
let getAllCodeService = (typeInput) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!typeInput) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters!",
        });
      } else {
        let res = {};
        let allcode = await db.Allcode.findAll({
          where: { type: typeInput },
        });
        res.errCode = 0;
        res.data = allcode;
        resolve(res);
      }
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = {
  handeUserLogin: handeUserLogin,
  getAllUsers: getAllUsers,
  dbCreateUser: dbCreateUser,
  deleteUser: deleteUser,
  updateUserData: updateUserData,
  getAllCodeService: getAllCodeService,
};
