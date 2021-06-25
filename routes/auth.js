const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/signin', authController.signInController);
router.post('/signout', authController.signOutController);
router.post('/signup', authController.signUpController);
router.post('/refreshtoken', authController.refreshTokenController);
router.post('/signin/google', authController.googleSignInController);
router.post('/signin/kakao', authController.kakaoSignInController);

module.exports = router;