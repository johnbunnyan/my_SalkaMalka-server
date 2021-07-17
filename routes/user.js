const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')

router.delete('/:userId', userController.deleteMeController);
router.get('/:userId/posts', userController.myPostsController);
router.get('/:userId/comments', userController.myCommentsController);
router.get('/:userId/bookmarks', userController.myBookmarksController);
router.post('/:userId/bookmarks', userController.addBookmarkController);
router.delete('/:userId/bookmarks/:postId', userController.deleteBookmarkController);


module.exports = router;
