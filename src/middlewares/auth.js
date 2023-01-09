const jwt = require("jsonwebtoken");
const { Users } = require("../models");
require("dotenv").config();

module.exports = async (req, res, next) => {
  try {
    console.log(req.headers);
    const accessToken = req.headers.Authorization;
    console.log(req.headers.Authorization);
    console.log({ accessToken: accessToken });
    // if (!accessToken) {
    //   return res.status(401).json({ errorMsg: "다시 로그인 해주세요." });
    // }

    // const [tokenType, tokenValue] = accessToken.split(" ");
    // if (
    //   tokenType !== "Bearer" ||
    //   tokenValue === "null" ||
    //   tokenValue === "undefined" ||
    //   !tokenValue
    // ) {
    //   return res.status(401).send({ errorMsg: "로그인 후 이용 가능한 기능입니다." });
    // }

    // const myToken = verifyToken(tokenValue);
    // a;
    // console.log({ myToken: myToken });
    // if (myToken === "jwt expired") {
    //   // access token 만료
    //   return res.status(401).json("다시 로그인 해주세요");
    // } else {
    //   const { userId } = verifyToken(tokenValue);
    //   const user = await Users.findOne({ where: { userId } });
    //   res.locals.user = user;
    next();
    // }
  } catch (err) {
    return res.status(412).json({ errorMsg: err + " : 로그인이 필요합니다." });
  }
};

function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.SECRET_KEY);
  } catch (error) {
    return error.message;
  }
}
