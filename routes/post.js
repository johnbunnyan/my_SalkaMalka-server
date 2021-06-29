const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController')
const commentController = require('../controllers/commentController')

// router.post('', postController.uploadController)
// router.get('/:postId',postController.seePostController)
// router.delete('/:postId', postController.deletePostController)
// router.put('/:postId/close', postController.closePostController)
//🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥



//이미지 관련 모듈 
const multer = require("multer");
 
//아래 storage 보관장소에 대한 세팅(자동으로 보관폴더 만들어줌)
var _storage = multer.diskStorage({
   
   //이미지 어디로 넣을거냐
    destination:function (req,file,cb){
                   //전역상태
        cb(null, 'uploads/')
    },
    //넣을 파일 이름을 어떻게 할거냐(file.~~)
    filename:function(req,file,cb){
        //cb(null,`${Date.now()}-bezkoder-${file.originalname}`)
        cb(null,`${file.originalname}`)
    }
})

//이미지를 필터링하는 기능(화살표도 물론 가능하다...!)
var imageFilter=(req,file,cb)=>{
    //이미지 파일인지 아닌지 확장자로 판별
if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)){
   return cb(new Error("적합한 이미지 파일 형식이 아닙니다"))
}
cb(null, true)
}

//upload 이게 찐 미들웨어 애가 다해먹고 위에 함수는 이 미들웨어를 위한 세팅역할
const upload = multer({storage:_storage, fileFilter:imageFilter})
const fs = require('fs')
//일단 포스트 새로 올릴때만 이미지 들어옴






router.post('/', upload.single('image'), postController.uploadController)
router.get('/:postId',postController.seePostController)
router.delete('/:postId', postController.deletePostController)
router.patch('/:postId', postController.closePostController)
router.post('/:postId/comments', commentController.newCommentController)
router.patch('/:postId/comments/:commentId', commentController.likeCommentController)
router.delete('/:postId/comments/:commentId', commentController.deleteCommentController)


 
module.exports = router;
