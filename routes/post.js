const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController')

router.post('', postController.uploadController)
router.get('/:postId',postController.seePostController)
router.delete('/:postId', postController.deletePostController)
router.put('/:postId/close', postController.closePostController)

module.exports = router;
