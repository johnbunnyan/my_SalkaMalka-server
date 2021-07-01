require("dotenv").config();
const { sign, verify } = require("jsonwebtoken");

module.exports = {
    generateAccessToken: (data) => {
      return sign(data, process.env.ACCESS_SECRET, { expiresIn: "3h" });
    },
    generateRefreshToken: (data) => {
      return sign(data, process.env.REFRESH_SECRET, { expiresIn: "14d" });
    },
    isAuthorized: (req) => {
      const authorization = req.headers["Authorization"] || req.headers["authorization"] || req.body.headers.Authorization;

      if (!authorization) {
        return null;
      }

      const token = authorization.split(" ")[1]; // `Bearer ${Authorization}`
      try {
        return verify(token, process.env.ACCESS_SECRET);
      } catch (err) {
        return null;
      }
    },
    checkRefreshToken: (req) => {
      // const refreshToken = req.cookies.refreshToken;
      const refreshToken = req.headers.cookie.split('=')[2];
      console.log(req.headers)
      console.log(req.cookies)
      console.log(refreshToken)

      if (!refreshToken) {
        return null;
      }

      try {
        return verify(refreshToken, process.env.REFRESH_SECRET);
      } catch (err) {
        return null;
      }
    }
  };
  