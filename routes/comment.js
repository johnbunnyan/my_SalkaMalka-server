const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController')


router.post('/', commentController.newCommentController)
router.put('/:commentId/like', commentController.likeCommentController)
router.patch('/:commentId', commentController.deleteCommentController)

module.exports = router;
