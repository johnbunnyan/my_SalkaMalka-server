const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')


//이따 이미지 처리를 위해 multe 가져올 때 여기서 사용!


router.get('/{userId}/posts',userController.myPostsController)
router.get('/{userId}/comments', userController.myPostsController)
router.delete('/{userId}',userController.deleteMeController)


module.exports = router;
