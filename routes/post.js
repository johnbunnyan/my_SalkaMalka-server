const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController')
const commentController = require('../controllers/commentController')

router.post('/', postController.seePostController)
router.get('/{postId}',postController.uploadController)
router.delete('/{postId}', postController.deletePostController)
router.patch('/{postId}', postController.closePostController)
router.post('/{postId}/comments', commentController.newCommentController)
router.patch('/{postId}/comments/{commentId}', commentController.likeCommentController)
router.delete('/{postId}/comments/{commentId}', commentController.deleteCommentController)

module.exports = router;
