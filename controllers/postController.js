/* option 
require("dotenv").config();
*/
const {User} = require('../models/model')
const {Post} = require('../models/model')




module.exports = {


    uploadController:async(req,res)=>{
 

    const newPost= new Post({
        title:req.body.title,
        content:req.body.content,
        image:req.body.image,
        userId:req.body.userId,
        isOpen:req.body.isOpen,
        comment:req.body.comment
    })
    newPost.save().then(()=>{
        console.log("new post saved")
    })
    .then(()=>{
        res.json("새로운 살까말까를 등록했어요!").status(201)
    })
.catch(error=>{console.log(error) 
res.status(500).send("err")})


},



seePostController:async(req,res)=>{
console.log(req.params.postId)
    
        Post.findById(req.params.postId)
        .populate('userId').populate('comment.userId')
        .then((posts)=>  res.json(posts).status(200))
        .catch(()=>res.status(404).json('삭제된 살까말까예요!'))
        .catch(()=>res.status(500).send("err")) 
        

        
},




deletePostController:async(req,res)=>{
    //토큰 라우팅

    console.log(req.params.postId)
    console.log(req.headers.authorization.split(" ")[1])
    try{
        Post.findByIdAndDelete(req.params.postId)
        .then((posts)=> res.json("성공적으로 삭제했습니다.").status(200))
        
    }catch(e){
            res.status(500).json("err")
    }



},



closePostController:async(req,res)=>{
//토큰 라우팅

    console.log(req.params.postId)
    try{
        Post.findByIdAndUpdate(req.params.postId,{isOpen:false},{
            new:true,
            //runValidators:true
        })
        .then((posts)=> res.json("더이상 사라마라를 받지 않아.").status(200))
    }catch(e){
            res.status(401).json("토큰이 만료되었어요.")
    }
    
    //res.status(500).send("err");
    },
}