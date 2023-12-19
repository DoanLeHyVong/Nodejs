import userService from "../services/userService";

let handleLogin = async (req, res) => {
  try {
    let email = req.body.email;
    let password = req.body.password;
    console.log(email);
    console.log(password);
    if (!email || !password) {
      return res.status(500).json({
        errCode: 1,
        message: "Missing inputs parameter",
      });
    }

    let userData = await userService.handeUserLogin(email, password);

    if (userData.errCode === 0) {
      // Đăng nhập thành công
      return res.status(200).json({
        message: "Login successful",
        errCode: 0,
        user: userData.user,
      });
    } else {
      // Đăng nhập không thành công, trả về thông báo lỗi
      return res.status(401).json({
        errCode: userData.errCode,
        message: userData.message,
      });
    }
  } catch (e) {
    // Xử lý lỗi nếu có
    return res.status(500).json({
      errCode: 2,
      message: e.message,
    });
  }
};
let handleGetAllUsers = async (req, res) => {
  let id = req.query.id;

  if (!id) {
    return res.status(400).json({
      errCode: 1,
      errMessage: "Missing required parameter!",
      users: [],
    });
  }

  let users = await userService.getAllUsers(id);
  return res.status(200).json({
    errCode: 0,
    errMessage: "OK",
    users,
  });
};
let handleCreateNewUser = async (req, res) => {
  let message = await userService.dbCreateUser(req.body);
  console.log(message);
  return res.status(200).json(message);
};
let handleDeleteUser = async (req, res) => {
  if (!req.body.id) {
    return res.status(400).json({
      errCode: 1,
      errMessage: "Missing required parameters",
    });
  }
  let message = await userService.deleteUser(req.body.id);
  return res.status(200).json(message);
};
let handleEditUser = async (req, res) => {
  const data = req.body;
  let message = await userService.updateUserData(data);
  return res.status(200).json(message);
};
let getAllCode = async (req, res) => {
  try {
    let data = await userService.getAllCodeService(req.query.type);
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({
      errCode: -1,
      errMessage: e.message,
    });
  }
};

module.exports = {
  handleLogin: handleLogin,
  handleGetAllUsers: handleGetAllUsers,
  handleCreateNewUser: handleCreateNewUser,
  handleEditUser: handleEditUser,
  handleDeleteUser: handleDeleteUser,
  getAllCode: getAllCode,
};
