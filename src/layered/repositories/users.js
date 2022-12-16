const { Users } = require("../../models");
class UsersRepository {
  Signup = async (userId, password, gender) => {
    const signup = Users.create({ userId, password });
    return signup;
  };

  CheckUser = async (userId) => {
    const checkUser = Users.findOne({ where: { userId } });
    return checkUser;
  };
}
module.exports = UsersRepository;
