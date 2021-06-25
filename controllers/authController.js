/* option 
require("dotenv").config();
*/

const { generateAccessToken, 
  generateRefreshToken,
  isAuthorized, 
  checkRefreshToken 
} = require('./tokenMethod');

const User = require('../models/model');

module.exports = {
  signInController: async (req, res) => {
    const query = { email: req.body.email, password: req.body.password, provider: 'local' };
    const userInfo = await User.findOne(query);
    // { _id: _id, email: email, password: password, provider: provider }

    if (!userInfo) {
      res.status(404).send('이메일 및 비밀번호를 확인해 주세요.');
    } else if (userInfo) {
      const { email, provider } = userInfo;
      const userId = userInfo._id;
      const accessToken = generateAccessToken({ userId, email, provider });
      const refreshToken = generateRefreshToken({ userId, email, provider });

      res
      .cookie('refreshToken', refreshToken, { httpOnly: true })
      .status(200)
      .json({
        userId: userId,
        email: email,
        accessToken: accessToken
      });
    } else {
      res.status(500).send('err');
    }
  },

  signOutController: async (req, res) => {
    const accessTokenData = isAuthorized(req);

    if (!accessTokenData) {
      res.status(401).send('토큰이 유효하지 않아요.');
    } else if (accessTokenData) {
      req.headers.authorization = ''; // 필요한가?
      res.clearCookie('refreshToken');
      res.status(200).send('다음에 또 찾아주세요.');
    } else {
      res.status(500).send('err');
    }
  },

  signUpController: async (req, res) => {
    const query = { email: req.body.email, provider: 'local' };
    const userInfo = await User.findOne(query);

    if (userInfo) {
      res.status(409).send('이미 가입된 이메일이에요.');
    } else if (!userInfo) {
      const newUser = { email: req.body.email, password: req.body.password, provider: 'local' };
      const insertMe = await User.insertOne(newUser);

      if (insertMe.insertedCount === 0) {
        console.log('insert err');
        res.status(500).send('err');
      } else {
        console.log(`Insert count: ${insertMe.insertedCount}, _id: ${insertMe.insertedId}`);
        res.status(201).send('살까말까에 오신 것을 환영합니다.');
      }
    }
  },
  
  refreshTokenController: async (req, res) => {
    const refreshTokenData = checkRefreshToken(req);
    if (!refreshTokenData) {
      res.status(401).send('토큰이 유효하지 않아요.');
    } else if (refreshTokenData) {
      const { userId } = refreshTokenData;
      const userInfo = await User.findOne({ userId });
      
      if (!userInfo) {
        res.status(404).send();
      } else {
        const { email, provider } = userInfo;
        const userId = userInfo._id;
        const accessToken = generateAccessToken({ userId, email, provider });
        const refreshToken = generateRefreshToken({ userId, email, provider });

        res
        .cookie('refreshToken', refreshToken, { httpOnly: true })
        .status(200)
        .json({
          userId: userId,
          email: email,
          accessToken: accessToken
        });
      }
    }
  },

  googleSignInController: async (req, res) => {
    const query = { email: req.body.email, provider: 'google' };
    const googleUserInfo = await User.findOne(query);

    // 동일 유저를 찾을 수 없어 새로운 유저 생성
    if (!googleUserInfo) {
      const newUser = { email: req.body.email, password: '', provider: 'google' };
      const insertMe = await User.insertOne(newUser);

      if (insertMe.insertedCount === 0) {
        console.log('insert err');
        res.status(500).send('err');
      } else {
        console.log(`Insert count: ${insertMe.insertedCount}, _id: ${insertMe.insertedId}`);
        res.status(201).send('살까말까에 오신 것을 환영합니다.');
      }
    }

    // 동일 유저를 찾을 수 있어 해당 유저로 로그인 진행
    else if (googleUserInfo) {
      const googleToken = isAuthorized(req);

      if (!googleToken) {
        res.status(401).send('토큰이 유효하지 않아요.');
      } else if (googleToken) {
        const { email, provider } = userInfo;
        const userId = userInfo._id;
        const accessToken = generateAccessToken({ userId, email, provider });
        const refreshToken = generateRefreshToken({ userId, email, provider });

        res
        .cookie('refreshToken', refreshToken, { httpOnly: true })
        .status(200)
        .json({
          userId: userId,
          email: email,
          accessToken: accessToken
        });
      }
    }

    else {
        res.status(500).send('err')
    }
  },

  kakaoSignInController: async (req, res) => {
    const query = { email: req.body.email, provider: 'kakao' };
    const kakaoUserInfo = await User.findOne(query);

    // 동일 유저를 찾을 수 없어 새로운 유저 생성
    if (!kakaoUserInfo) {
      const newUser = { email: req.body.email, password: '', provider: 'kakao' };
      const insertMe = await User.insertOne(newUser);

      if (insertMe.insertedCount === 0) {
        console.log('insert err');
        res.status(500).send('err');
      } else {
        console.log(`Insert count: ${insertMe.insertedCount}, _id: ${insertMe.insertedId}`);
        res.status(201).send('살까말까에 오신 것을 환영합니다.');
      }
    }

    // 동일 유저를 찾을 수 있어 해당 유저로 로그인 진행
    else if (kakaoUserInfo) {
      const kakaoToken = isAuthorized(req);

      if (!kakaoToken) {
        res.status(401).send('토큰이 유효하지 않아요.');
      } else if (kakaoToken) {
        const { email, provider } = userInfo;
        const userId = userInfo._id;
        const accessToken = generateAccessToken({ userId, email, provider });
        const refreshToken = generateRefreshToken({ userId, email, provider });

        res
        .cookie('refreshToken', refreshToken, { httpOnly: true })
        .status(200)
        .json({
          userId: userId,
          email: email,
          accessToken: accessToken
        });
      }
    }

    else {
        res.status(500).send('err')
    }
  }
}