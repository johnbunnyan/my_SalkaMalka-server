require("dotenv").config();

const { generateAccessToken, 
  generateRefreshToken,
  isAuthorized, 
  checkRefreshToken,
} = require('./tokenMethod');

const { User } = require('../models/model');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_AUTH_CODE);
const axios = require('axios');

module.exports = {
  signInController: async (req, res) => {
    console.log(req.body)
    const query = { email: req.body.email, password: req.body.password, provider: 'local' };
    console.log(query);
    const userInfo = await User.findOne(query);
    // { _id: _id, email: email, password: password, provider: provider }
    console.log(userInfo);

    if (!userInfo) {
      res.status(404).send('이메일 및 비밀번호를 확인해 주세요.');
    } else if (userInfo) {
      const { email, provider } = userInfo;
      const userId = userInfo._id;
      const accessToken = generateAccessToken({ userId, email, provider });
      const refreshToken = generateRefreshToken({ userId, email, provider });
      const issueDate = new Date();
      const accessTokenExpiry = new Date((Date.parse(issueDate) + 1209600000)); // +3h
      const refreshTokenExpiry = new Date((Date.parse(issueDate) + 10800000)); // +14d
      
      res
      .cookie('refreshToken', refreshToken, { httpOnly: true })
      .status(200)
      .send({ userId, email, accessToken, accessTokenExpiry, refreshTokenExpiry, issueDate });
    } else {
      res.status(500).send('err');
    }
  },

  signOutController: async (req, res) => {
    const accessTokenData = isAuthorized(req,res);
    console.log(accessTokenData);
    if (!accessTokenData) {
      res.status(401).send('토큰이 유효하지 않아요.');
    } else if (accessTokenData) {
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
      const insertMe = await new User(newUser)
      .save()
     

      if (!insertMe) {
        console.log('insert err');
        res.status(500).send('err');
      } else {
        console.log(insertMe);
        res.status(201).send('살까말까에 오신 것을 환영합니다.');
      }
    }
  },
  
  refreshTokenController: async (req, res) => {
    const refreshTokenData = checkRefreshToken(req);

    if (!refreshTokenData) {
      res.status(401).send('토큰이 유효하지 않아요.');
    } else if (refreshTokenData) {
      const { userId, provider } = refreshTokenData;
      const userInfo = await User.findOne({ _id: userId, provider });
      
      if (!userInfo) {
        res.status(500).send('err');
      } else {
        const { email, provider } = userInfo;
        const userId = userInfo._id;
        const accessToken = generateAccessToken({ userId, email, provider });
        const refreshToken = generateRefreshToken({ userId, email, provider });
        const issueDate = new Date();
        const accessTokenExpiry = new Date((Date.parse(issueDate) + 1209600000)); // +3h
        const refreshTokenExpiry = new Date((Date.parse(issueDate) + 10800000)); // +14d

        const tokenInfo = {
          accessToken,
          accessTokenExpiry,
          refreshTokenExpiry,
          issueDate
        }
        
        res
        .cookie('refreshToken', refreshToken, { httpOnly: true })
        .status(200)
        .send(tokenInfo);
      }
    }
  },

  googleSignInController: async (req, res) => {
    const authorization = req.headers["Authorization"] || req.headers["authorization"] || req.body.headers.Authorization;

    if (!authorization) {
      res.status(401).send('토큰이 유효하지 않아요.');
    } else {
      const token = authorization.split(" ")[1];
      let email = ''
      try {
        const ticket = await client.verifyIdToken({
          idToken: token,
          audience: process.env.GOOGLE_AUTH_CODE
        })
    
        email = ticket.getPayload().email;
      } catch (err) {
        console.log(err);
        res.status(401).send('토큰이 유효하지 않아요.');
      }
      console.log('email', email);
      const query = { email: email, provider: 'google' };
      const googleUserInfo = await User.findOne(query);

      // 동일 유저를 찾을 수 없어 새로운 유저 생성
      if (!googleUserInfo) {
        console.log('you are new')
        const newUser = { email: query.email, password: 'defaultgooglepassword', provider: 'google' };
        const insertMe = await new User(newUser)
        .save()
        .then(res => res)
        .catch((err) => {
          console.log(err);
          res.status(500).send('err');
        });

        console.log(insertMe);
        const { email, provider } = insertMe;
        const userId = insertMe._id;
        const accessToken = generateAccessToken({ userId, email, provider });
        const refreshToken = generateRefreshToken({ userId, email, provider });
        const issueDate = new Date();
        const accessTokenExpiry = new Date((Date.parse(issueDate) + 1209600000)); // +3h
        const refreshTokenExpiry = new Date((Date.parse(issueDate) + 10800000)); // +14d
        res
        .cookie('refreshToken', refreshToken, { httpOnly: true })
        .status(201)
        .send({ userId, email, accessToken, accessTokenExpiry, refreshTokenExpiry, issueDate });
      }

      // 동일 유저를 찾을 수 있어 해당 유저로 로그인 진행
      else if (googleUserInfo) {
        console.log('you exist')
        const { email, provider } = googleUserInfo;
        const userId = googleUserInfo._id;
        const accessToken = generateAccessToken({ userId, email, provider });
        const refreshToken = generateRefreshToken({ userId, email, provider });
        const issueDate = new Date();
        const accessTokenExpiry = new Date((Date.parse(issueDate) + 1209600000)); // +3h
        const refreshTokenExpiry = new Date((Date.parse(issueDate) + 10800000)); // +14d

        res
        .cookie('refreshToken', refreshToken, { httpOnly: true })
        .status(200)
        .send({ userId, email, accessToken, accessTokenExpiry, refreshTokenExpiry, issueDate });
      }
      
      else {
        res.status(500).send('err');
      }
    }
  },

  kakaoSignInController: async (req, res) => {
    const authorization = req.headers["Authorization"] || req.headers["authorization"] || req.body.headers.Authorization;

    console.log(authorization)

    if (!authorization) {
      res.status(401).send('토큰이 유효하지 않아요.');
    } else {
      const token = authorization.split(" ")[1];
      const email = await axios
      .post('https://kapi.kakao.com/v2/user/me',
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        }
      })
      .then(res => res.data.id + '@SalkaMalka.com')
      .catch(err => console.log(err));

      const query = { email: email, provider: 'kakao' };
      const kakaoUserInfo = await User.findOne(query);

      // 동일 유저를 찾을 수 없어 새로운 유저 생성
      if (!kakaoUserInfo) {
        console.log('you are new')
        const newUser = { email: query.email, password: 'defaultkakaopassword', provider: 'kakao' };
        const insertMe = await new User(newUser)
        .save()
        .then(res => res)
        .catch((err) => {
          console.log(err);
          res.status(500).send('err');
        });

        console.log(insertMe)
        const { email, provider } = insertMe;
        const userId = insertMe._id;
        const accessToken = generateAccessToken({ userId, email, provider });
        const refreshToken = generateRefreshToken({ userId, email, provider });
        const issueDate = new Date();
        const accessTokenExpiry = new Date((Date.parse(issueDate) + 1209600000)); // +3h
        const refreshTokenExpiry = new Date((Date.parse(issueDate) + 10800000)); // +14d

        console.log('email', email, 'userId', userId)
        res
        .cookie('refreshToken', refreshToken, { httpOnly: true })
        .status(201)
        .send({ userId, email, accessToken, accessTokenExpiry, refreshTokenExpiry, issueDate });
      }

      // 동일 유저를 찾을 수 있어 해당 유저로 로그인 진행
      else if (kakaoUserInfo) {
        console.log('you exist')
        const { email, provider } = kakaoUserInfo;
        const userId = kakaoUserInfo._id;
        const accessToken = generateAccessToken({ userId, email, provider });
        const refreshToken = generateRefreshToken({ userId, email, provider });
        const issueDate = new Date();
        const accessTokenExpiry = new Date((Date.parse(issueDate) + 1209600000)); // +3h
        const refreshTokenExpiry = new Date((Date.parse(issueDate) + 10800000)); // +14d
        
        console.log('user', kakaoUserInfo)
        res
        .cookie('refreshToken', refreshToken, { httpOnly: true })
        .status(200)
        .send({ userId, email, accessToken, accessTokenExpiry, refreshTokenExpiry, issueDate });
      }
      
      else {
        res.status(500).send('err');
      }
    }
  },
}