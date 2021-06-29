const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')


//이따 이미지 처리를 위해 multer 가져올 때 여기서 사용!


router.delete('/:userId', userController.deleteMeController);
router.get('/:userId/posts', userController.myPostsController);
router.get('/:userId/comments', userController.myCommentsController);
router.get('/:userId/bookmarks', userController.myBookmarksController);
router.post('/:userId/bookmarks', userController.addBookmarkController);
router.delete('/:userId/bookmarks/:postId', userController.deleteBookmarkController);


module.exports = router;
