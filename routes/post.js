const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController')

router.post('/', postController.seePostController)
router.get('/{postId}',postController.uploadController)
router.delete('/{postId}', postController.deletePostController)
router.put('{postId}/close', postController.closePostController)

module.exports = router;
