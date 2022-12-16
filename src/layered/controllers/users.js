const UsersService = require("../services/users");
class UsersController {
  usersService = new UsersService();
  Signup = async (req, res, next) => {
    try {
      const { userId, password } = req.body;
      const Signup = await this.usersService.Signup(userId, password);
      res.status(201).json({ message: "회원가입 성공" });
    } catch (err) {
      if (err.code === -1) return res.status(412).json({ errorMsg: "그 ID 이미 누가 씀 ㅋㅋ" });
      console.log(err);
    }
  };

  Login = async (req, res, next) => {
    try {
      const { userId, password } = req.body;
      const { user, accessToken } = await this.usersService.Login(userId, password);
      return res.status(200).json({
        nickname: user.nickname,
        accessToken: `Bearer ${accessToken}`,
        message: "로그인 되었습니다.",
      });
    } catch (err) {
      if (err.code === -1) {
        res.status(412).json({ errorMsg: "ID 또는 패스워드를 확인해 주세요" });
      } else {
        console.log(err);
        res.status(400).json({ errorMsg: err });
      }
    }
  };
}
module.exports = UsersController;
