const UsersRepository = require("../repositories/users");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

class UsersService {
  usersRepository = new UsersRepository();
  Signup = async (userId, password) => {
    const checkUser = await this.usersRepository.CheckUser(userId);
    if (checkUser) throw { code: -1 };
    const salt = await bcrypt.genSalt(10);
    const enpryptedPW = bcrypt.hashSync(password, salt);
    password = enpryptedPW;
    const signupUser = await this.usersRepository.Signup(userId, password);
    return signupUser;
  };

  Login = async (userId, password) => {
    const user = await this.usersRepository.CheckUser(userId);
    if (!user) {
      throw { code: -1 };
    }
    const chekPass = await bcrypt.compare(password, user.password);
    if (!chekPass) {
      throw { code: -1 };
    }
    const accessToken = jwt.sign({ userId: user.userId }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });
    return {
      user: user,
      accessToken: accessToken,
    };
  };
}

module.exports = UsersService;
